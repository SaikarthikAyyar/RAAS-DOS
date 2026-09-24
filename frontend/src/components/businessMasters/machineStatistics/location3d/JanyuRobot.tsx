import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { MODEL_FORWARD_ROTATION } from './machineLocationUtils'
import { applyUnderwaterToModel } from './underwaterOptics'

export const JANYU_ROBOT_GLB_PATH = '/models/janyu-tech-bot.glb'

/** The supplied GLB is metres, +Y up, +X forward. Preserve its scale and materials.
 * Center the clone from actual bounds so full IMU orientation pivots around the body.
 * Only the instance changes; the loader's cached asset is never mutated/disposed —
 * the underwater patch runs on cloned materials for that reason.
 */
export function JanyuRobot({ visible = true }: { visible?: boolean }) {
  const { scene } = useGLTF(JANYU_ROBOT_GLB_PATH)
  const { clone, offset, materials } = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    const materials = applyUnderwaterToModel(clone)
    const center = new THREE.Box3().setFromObject(clone).getCenter(new THREE.Vector3())
    return { clone, offset: center.negate(), materials }
  }, [scene])
  useEffect(() => () => { materials.forEach((material) => material.dispose()) }, [materials])
  return <group rotation={[0, MODEL_FORWARD_ROTATION, 0]} visible={visible} dispose={null}>
    <primitive object={clone} position={offset} />
  </group>
}
useGLTF.preload(JANYU_ROBOT_GLB_PATH)
