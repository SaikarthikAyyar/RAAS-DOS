import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import type { TrajectoryPoint } from './types'
import { trajectorySegments } from './machineLocationUtils'

export function MovementTrail({ trajectory, visible = true }: { trajectory: TrajectoryPoint[]; visible?: boolean }) {
  const segments = useMemo(() => trajectorySegments(trajectory), [trajectory])
  if (!visible) return null
  return <group name="TelemetryMovementTrail">
    {segments.map((points, i) => <Line key={i} points={points} color="#39c9dd" lineWidth={1.7} transparent opacity={0.65} depthWrite={false} />)}
  </group>
}
