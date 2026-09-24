import { memo, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { BASIN_CONFIG } from './machineLocationUtils'
import { BasinWater } from './BasinWater'
import { applyUnderwaterAbsorption, underwaterMaterial } from './underwaterOptics'

/** Deterministic pores, formwork seams and water stains, generated once locally. */
function concreteTexture() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const data = ctx.createImageData(256, 256)
  let seed = 731
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const i = (y * 256 + x) * 4
    const stain = Math.sin(x * .13) * Math.sin(y * .008) * 12
    const value = 164 + random() * 45 + stain + Math.sin(x * .026 + y * .034) * 9
    data.data[i] = value; data.data[i+1] = value + 3; data.data[i+2] = value + 5; data.data[i+3] = 255
  }
  ctx.putImageData(data, 0, 0)
  ctx.fillStyle = 'rgba(20,30,36,.20)'; ctx.fillRect(0,0,2,256);ctx.fillRect(0,0,256,2)
  for (const x of [18, 237]) for (const y of [24, 232]) {
    ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;texture.repeat.set(4,2);texture.colorSpace=THREE.SRGBColorSpace
  return texture
}
function wallLabel() {
  const canvas = document.createElement('canvas');canvas.width=1024;canvas.height=256
  const ctx=canvas.getContext('2d')!;ctx.textAlign='center';ctx.fillStyle='#c7d6db'
  ctx.font='600 155px sans-serif';ctx.fillText('RAAS',512,160)
  ctx.font='22px sans-serif';ctx.fillText('CLEANER WATER. A SAFER TOMORROW.',512,205)
  const texture = new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture
}

function Wall({ axis, sign, texture, cutaway }: { axis: 'x' | 'z'; sign: number; texture: THREE.Texture; cutaway: boolean }) {
  const material = useRef<THREE.MeshStandardMaterial>(null)
  const rails = useRef<THREE.MeshStandardMaterial>(null)
  const { halfX, halfZ, wallHeight: h, wallThickness: t, railHeight } = BASIN_CONFIG
  const span = axis === 'x' ? halfZ*2 : halfX*2+t*2
  const edge = (axis === 'x' ? halfX : halfZ) + t/2
  useFrame(({camera}) => {
    const nearWall = cutaway && camera.position[axis] * sign > .5
    if (material.current) { material.current.opacity = nearWall ? .10 : 1; material.current.depthWrite = !nearWall }
    if (rails.current) rails.current.opacity = nearWall ? .20 : 1
  })
  const railMaterial = useMemo(() => applyUnderwaterAbsorption(new THREE.MeshStandardMaterial({color:'#8b9da4',metalness:.72,roughness:.36,transparent:true})),[])
  useEffect(() => { rails.current=railMaterial;return () => { railMaterial.dispose() } },[railMaterial])
  return <group position={axis==='x' ? [sign*edge,0,0] : [0,0,sign*edge]} rotation={axis==='x' ? [0,Math.PI/2,0] : [0,0,0]}>
    <mesh position={[0,h/2,0]} receiveShadow>
      <boxGeometry args={[span,h,t]} />
      <meshStandardMaterial ref={material} color="#647580" map={texture} bumpMap={texture} bumpScale={.035} roughness={.94} metalness={0} transparent {...underwaterMaterial} />
    </mesh>
    <mesh position={[0,h+.055,0]} material={railMaterial}>
      <boxGeometry args={[span+.05,.11,t+.14]} />
    </mesh>
    {Array.from({length:Math.ceil(span/1.3)+1},(_,i) => -span/2+i*span/Math.ceil(span/1.3)).map((x,i) => <mesh key={i} position={[x,h+railHeight/2+.1,0]} material={railMaterial}>
      <cylinderGeometry args={[.017,.017,railHeight,6]} />
    </mesh>)}
    {[.36,railHeight].map(y => <mesh key={y} position={[0,h+y+.1,0]} rotation={[0,0,Math.PI/2]} material={railMaterial}>
      <cylinderGeometry args={[.013,.013,span,6]} />
    </mesh>)}
  </group>
}

function Ladder() {
  const { halfX,halfZ,wallHeight }=BASIN_CONFIG
  return <group position={[-halfX+1,0,-halfZ+.12]}>
    {[-.24,.24].map(x=><mesh key={x} position={[x,wallHeight/2+.18,0]}>
      <cylinderGeometry args={[.024,.024,wallHeight+.36,8]} /><meshStandardMaterial color="#99a7aa" metalness={.7} roughness={.36} {...underwaterMaterial}/>
    </mesh>)}
    {Array.from({length:10},(_,i)=>.24+i*.29).map(y=><mesh key={y} position={[0,y,0]} rotation={[0,0,Math.PI/2]}>
      <cylinderGeometry args={[.018,.018,.48,8]} /><meshStandardMaterial color="#99a7aa" metalness={.7} roughness={.36} {...underwaterMaterial}/>
    </mesh>)}
  </group>
}

interface IndustrialBasinProps {
  showGrid?: boolean;showBoundary?: boolean;showWater?: boolean;showDepthView?: boolean
  robotPosition: THREE.Vector3; animated: boolean
}
export const IndustrialBasin = memo(function IndustrialBasin({showGrid=true,showBoundary=true,showWater=true,showDepthView=true,robotPosition,animated}:IndustrialBasinProps) {
  const {halfX,halfZ,floorY,wallHeight,waterLevelY}=BASIN_CONFIG
  const texture=useMemo(concreteTexture,[]);const label=useMemo(wallLabel,[])
  useEffect(()=>()=>{texture.dispose();label.dispose()},[texture,label])
  const perimeter=(y:number):[number,number,number][]=>[[-halfX,y,-halfZ],[halfX,y,-halfZ],[halfX,y,halfZ],[-halfX,y,halfZ],[-halfX,y,-halfZ]]
  return <group name="IndustrialBasin">
    <mesh position={[0,floorY-.12,0]} receiveShadow>
      <boxGeometry args={[halfX*2+.5,.24,halfZ*2+.5]}/>
      <meshStandardMaterial color={showWater?'#325761':'#58616a'} map={texture} bumpMap={texture} bumpScale={.025} roughness={.96} {...underwaterMaterial}/>
    </mesh>
    {showBoundary&&<group name="BasinBoundary">
      {(['x','z'] as const).flatMap(axis=>[-1,1].map(sign=><Wall key={`${axis}${sign}`} axis={axis} sign={sign} texture={texture} cutaway={showDepthView}/>))}
      <Ladder/>
      <mesh position={[0,wallHeight-.25,-halfZ+.006]}>
        <planeGeometry args={[2.0,.50]}/><meshBasicMaterial map={label} transparent opacity={.66} depthWrite={false} toneMapped={false}/>
      </mesh>
      <Line points={perimeter(.02)} color="#50a8b4" lineWidth={1} transparent opacity={.5}/>
      <Line points={perimeter(waterLevelY)} color="#55cbd6" lineWidth={1} transparent opacity={.42}/>
      {[-3.5,0,3.5].map(x=><group key={x} position={[x,wallHeight-.12,-halfZ+.08]}>
        <mesh><boxGeometry args={[.26,.085,.06]}/><meshStandardMaterial color="#8a9498" metalness={.6}/></mesh>
        <mesh position={[0,-.044,.014]}><boxGeometry args={[.18,.013,.04]}/><meshBasicMaterial color="#d6f6ff"/></mesh>
      </group>)}
    </group>}
    {showGrid&&<group name="BasinGrid">
      {Array.from({length:11},(_,i)=>i-halfX).map(x=><Line key={`x${x}`} points={[[x,.02,-halfZ],[x,.02,halfZ]]} color="#558b92" lineWidth={.6} transparent opacity={.25}/>)}
      {Array.from({length:7},(_,i)=>i-halfZ).map(z=><Line key={`z${z}`} points={[[-halfX,.02,z],[halfX,.02,z]]} color="#558b92" lineWidth={.6} transparent opacity={.25}/>)}
    </group>}
    {showWater&&<BasinWater robotPosition={robotPosition} animated={animated}/>}
    {showDepthView&&<group name="DepthGuides">
      {[.5,1,1.5,2].filter(d=>waterLevelY-d>floorY).map(d=><Line key={d} points={perimeter(waterLevelY-d)} color="#4f9aa7" lineWidth={.7} transparent opacity={.17} dashed dashSize={.08} gapSize={.12}/>)}
      <Line points={[[halfX-.04,floorY,-halfZ+.04],[halfX-.04,waterLevelY,-halfZ+.04]]} color="#74afbd" lineWidth={1.3}/>
    </group>}
  </group>
})
