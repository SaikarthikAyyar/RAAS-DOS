import * as THREE from 'three'
import type { LocalPosition, OrientationTelemetry, TrajectoryPoint } from './types'

/** All basin measurements are metres. Telemetry XY is centered on this basin. */
export const BASIN_CONFIG = {
  halfX: 5, halfZ: 3, depth: 3, wallHeight: 3, floorY: 0,
  waterLevelY: 2.5, wallThickness: 0.24, railHeight: 0.75,
  // Rendering fallback only. Never copied into telemetry or displayed as a reading.
  fallbackDepth: 1.65,
} as const

export const MAX_TRAIL_POINTS = 200
export const ROBOT_DIMS = { length: 1.211, width: 0.679, height: 0.549505 } as const
export const MODEL_FORWARD_ROTATION = Math.PI / 2 // GLB +X forward → world −Z (North).
export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

export function hasPosition(position: LocalPosition): boolean {
  return isFiniteNumber(position?.xMetres) && isFiniteNumber(position?.yMetres)
}

/** X → X, horizontal Y → Z, depth positive DOWN from water → waterLevel − depth.
 * Depth locates the robot's physical center, not its track-ground origin.
 * No clamping: invalid/out-of-basin telemetry must not look like an in-basin reading.
 */
export function telemetryToWorldPosition(x?: number, y?: number, depth?: number): THREE.Vector3 {
  return new THREE.Vector3(
    isFiniteNumber(x) ? x : 0,
    BASIN_CONFIG.waterLevelY - (isFiniteNumber(depth) ? depth : BASIN_CONFIG.fallbackDepth),
    isFiniteNumber(y) ? y : 0,
  )
}

export function resolveOrientation(orientation: OrientationTelemetry | undefined, position: LocalPosition) {
  // These position aliases are already normalized by the existing telemetry provider.
  return {
    pitchDegrees: isFiniteNumber(orientation?.pitchDegrees) ? orientation.pitchDegrees : position.pitchDegrees,
    rollDegrees: isFiniteNumber(orientation?.rollDegrees) ? orientation.rollDegrees : position.rollDegrees,
    yawDegrees: isFiniteNumber(orientation?.yawDegrees) ? orientation.yawDegrees
      : isFiniteNumber(position.yawDegrees) ? position.yawDegrees : position.headingDegrees,
  }
}

/** Heading: clockwise from North (−Z). Pitch positive = nose up, roll positive = right down.
 * A level model faces −Z after MODEL_FORWARD_ROTATION. Intrinsic YXZ applies local
 * roll about −Z, pitch about +X, then heading about −Y. Convert degrees exactly once.
 * Absolute quaternions avoid Euler wrapping and compound-angle interpolation artifacts.
 */
export function imuToRobotOrientation(pitch?: number, roll?: number, yaw?: number): THREE.Quaternion {
  const rad = (v?: number) => THREE.MathUtils.degToRad(isFiniteNumber(v) ? v : 0)
  return new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(pitch), -rad(yaw), -rad(roll), 'YXZ'))
}

export function smoothFactor(timeConstant: number, delta: number): number {
  return 1 - Math.exp(-Math.min(Math.max(delta, 0), 0.1) / Math.max(timeConstant, 0.001))
}

export function isInsideBasin(p: THREE.Vector3): boolean {
  return Math.abs(p.x) <= BASIN_CONFIG.halfX && Math.abs(p.z) <= BASIN_CONFIG.halfZ
    && p.y >= BASIN_CONFIG.floorY && p.y <= BASIN_CONFIG.floorY + BASIN_CONFIG.wallHeight
}

/** Split at missing/out-of-bounds samples; never connect across a missing path section. */
export function trajectorySegments(trajectory: TrajectoryPoint[]): [number, number, number][][] {
  const segments: [number, number, number][][] = []
  let current: [number, number, number][] = []
  for (const point of trajectory.slice(-MAX_TRAIL_POINTS)) {
    const valid = isFiniteNumber(point.xMetres) && isFiniteNumber(point.yMetres)
      && isFiniteNumber(point.depthMetres)
    const world = valid ? telemetryToWorldPosition(point.xMetres, point.yMetres, point.depthMetres) : null
    if (!world || !isInsideBasin(world)) {
      if (current.length > 1) segments.push(current)
      current = []
    } else current.push(world.toArray())
  }
  if (current.length > 1) segments.push(current)
  return segments
}

/** Dolly around the same target, never through it (the old subtraction reversed the camera). */
export function dollyPosition(position: THREE.Vector3, target: THREE.Vector3, factor: number) {
  const offset = position.clone().sub(target)
  const distance = THREE.MathUtils.clamp(offset.length() * factor, 1.2, 32)
  return target.clone().add(offset.normalize().multiplyScalar(distance))
}
