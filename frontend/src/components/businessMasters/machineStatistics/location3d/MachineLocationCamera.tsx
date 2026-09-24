import { useEffect, useRef, type ComponentRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { dollyPosition } from './machineLocationUtils'

export type ViewMode = '3d' | 'top' | 'front' | 'side'
export type CameraCommand = { id: number; type: ViewMode | 'in' | 'out' | 'reset' | 'focus' }
const DEFAULT_TARGET = new THREE.Vector3(0, .95, 0)
export const DEFAULT_CAMERA: [number,number,number] = [5.4, 6.4, 7.2]
const BASE_DISTANCE = new THREE.Vector3(...DEFAULT_CAMERA).distanceTo(DEFAULT_TARGET)
const offsets:Record<ViewMode,[number,number,number]>={
  '3d':[5.4,5.45,7.2], top:[0,11,.001], front:[0,.15,-10.5], side:[11,.15,0],
}

export function MachineLocationCamera({ command, robotPosition, onZoom, reducedMotion }: {
  command:CameraCommand;robotPosition:THREE.Vector3;onZoom:(zoom:number)=>void;reducedMotion:boolean
}) {
  const {camera}=useThree()
  const controls=useRef<ComponentRef<typeof OrbitControls>>(null)
  const transition=useRef<{from:THREE.Vector3;to:THREE.Vector3;targetFrom:THREE.Vector3;targetTo:THREE.Vector3;t:number}|null>(null)
  const lastZoom=useRef(0)
  useEffect(()=>{
    const orbit=controls.current;if(!orbit)return
    let target=orbit.target.clone();let destination:THREE.Vector3
    if(command.type==='in'||command.type==='out') {
      destination=dollyPosition(camera.position,target,command.type==='in'?.78:1/.78)
    } else if(command.type==='focus') {
      target=robotPosition.clone()
      destination=target.clone().add(camera.position.clone().sub(orbit.target).normalize().multiplyScalar(2.8))
    } else {
      const view=command.type==='reset'?'3d':command.type
      target=DEFAULT_TARGET.clone()
      destination=target.clone().add(new THREE.Vector3(...offsets[view]))
    }
    transition.current={from:camera.position.clone(),to:destination,targetFrom:orbit.target.clone(),targetTo:target,t:0}
  },[command,camera,robotPosition])
  useFrame((_,delta)=>{
    const orbit=controls.current;if(!orbit)return
    const move=transition.current
    if(move){
      move.t=Math.min(1,move.t+(reducedMotion?1:Math.min(delta,.05)/.32))
      const ease=1-Math.pow(1-move.t,3)
      camera.position.lerpVectors(move.from,move.to,ease);orbit.target.lerpVectors(move.targetFrom,move.targetTo,ease)
      orbit.update();if(move.t===1)transition.current=null
    }
    const zoom=Number((BASE_DISTANCE/camera.position.distanceTo(orbit.target)).toFixed(1))
    if(zoom!==lastZoom.current){lastZoom.current=zoom;onZoom(zoom)}
  })
  return <OrbitControls ref={controls} makeDefault target={DEFAULT_TARGET} enableDamping dampingFactor={.12}
    minDistance={1.2} maxDistance={32} minPolarAngle={.001} maxPolarAngle={Math.PI*.51}
    zoomSpeed={.7} panSpeed={.65} rotateSpeed={.65} onStart={()=>{transition.current=null}}/>
}
