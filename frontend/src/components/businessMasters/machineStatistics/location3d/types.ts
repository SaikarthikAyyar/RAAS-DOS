// Position / orientation shapes used by the Varaha 3D Machine Location
// view (same field names as their telemetry types, so their component
// code is used unchanged).

export interface LocalPosition {
  xMetres?: number
  yMetres?: number
  depthMetres?: number
  headingDegrees?: number
  speedMps?: number
  distanceMetres?: number
  confidencePercent?: number
  gpsLat?: number
  gpsLng?: number
  gpsAlt?: number
  satellites?: number
  hdop?: number
  pitchDegrees?: number
  rollDegrees?: number
  yawDegrees?: number
  accelerationX?: number
  accelerationY?: number
  accelerationZ?: number
}

export interface OrientationTelemetry {
  rollDegrees?: number
  pitchDegrees?: number
  yawDegrees?: number
}

export interface TrajectoryPoint {
  timestamp: string
  xMetres: number
  yMetres: number
  depthMetres: number
  headingDegrees: number
  speedMps: number
}
