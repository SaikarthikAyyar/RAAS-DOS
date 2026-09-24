import * as THREE from 'three'
import { BASIN_CONFIG } from './machineLocationUtils'

/** Beer–Lambert absorption per metre of water. Red falls off fastest, which is
 * what turns a lit concrete basin teal with depth instead of merely darker.
 */
const ABSORB = 'vec3(0.235, 0.070, 0.052)'
const WATER_TINT = 'vec3(0.045, 0.300, 0.345)'
const INSCATTER = '0.170'
const WATER_Y = BASIN_CONFIG.waterLevelY.toFixed(4)
const CACHE_KEY = `varaha-underwater-${WATER_Y}`

/** Submerged fragments lose light over the path it travels through water: down
 * from the surface to the fragment, then back out along the view ray. Both legs
 * are derived from the fragment's world position and the built-in cameraPosition
 * uniform, so the patch needs no per-frame updates and works above or below the
 * waterline. Geometry above the surface is left untouched.
 */
const patchShader = (shader: { vertexShader: string; fragmentShader: string }) => {
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', '#include <common>\nvarying vec3 vUwWorldPos;')
    .replace(
      '#include <worldpos_vertex>',
      '#include <worldpos_vertex>\n\tvUwWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;',
    )
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', '#include <common>\nvarying vec3 vUwWorldPos;')
    // Matches where three.js applies its own fog: after tone mapping and the
    // colorspace conversion, so the tint composites in the same space.
    .replace('#include <fog_fragment>', `#include <fog_fragment>
  {
    float uwDepth = ${WATER_Y} - vUwWorldPos.y;
    if (uwDepth > 0.0) {
      float camAbove = cameraPosition.y - ${WATER_Y};
      float submergedFraction = camAbove <= 0.0
        ? 1.0
        : clamp(uwDepth / max(uwDepth + camAbove, 1e-4), 0.0, 1.0);
      float path = length(cameraPosition - vUwWorldPos) * submergedFraction + uwDepth;
      gl_FragColor.rgb = gl_FragColor.rgb * exp(-${ABSORB} * path)
        + ${WATER_TINT} * (1.0 - exp(-${INSCATTER} * path));
    }
  }`)
}

/** Spread onto a JSX material so submerged fragments are absorbed by water.
 * customProgramCacheKey keeps three from reusing an unpatched program.
 */
export const underwaterMaterial = {
  onBeforeCompile: patchShader,
  customProgramCacheKey: () => CACHE_KEY,
} as const

/** Imperative form, for materials not declared in JSX. */
export function applyUnderwaterAbsorption<T extends THREE.Material>(material: T): T {
  material.onBeforeCompile = patchShader
  material.customProgramCacheKey = () => CACHE_KEY
  material.needsUpdate = true
  return material
}

/** The loaded GLB shares its materials with the loader cache, so they are cloned
 * before patching. Returns the clones for disposal by the caller.
 */
export function applyUnderwaterToModel(root: THREE.Object3D): THREE.Material[] {
  const cloned = new Map<THREE.Material, THREE.Material>()
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    const patch = (material: THREE.Material) => {
      const existing = cloned.get(material)
      if (existing) return existing
      const clone = applyUnderwaterAbsorption(material.clone())
      cloned.set(material, clone)
      return clone
    }
    child.material = Array.isArray(child.material)
      ? child.material.map(patch)
      : patch(child.material)
  })
  return [...cloned.values()]
}
