import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, GizmoHelper, GizmoViewport, Html, Lightformer, Line, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { LocalPosition, OrientationTelemetry, TrajectoryPoint } from './types'
import { formatAge, type DataFreshness } from './freshness'
import { JanyuRobot, JANYU_ROBOT_GLB_PATH } from './JanyuRobot'
import { IndustrialBasin } from './IndustrialBasin'
import { MovementTrail } from './MovementTrail'
import { MachineLocationCamera, DEFAULT_CAMERA, type CameraCommand, type ViewMode } from './MachineLocationCamera'
import { BASIN_CONFIG, hasPosition, imuToRobotOrientation, isFiniteNumber, isInsideBasin, resolveOrientation, smoothFactor, telemetryToWorldPosition } from './machineLocationUtils'
import './MachineLocation3D.css'

interface MachineLocation3DProps {
  position:LocalPosition;trajectory?:TrajectoryPoint[];distanceTravelledMetres?:number
  orientation?:OrientationTelemetry;deviceId?:string;freshness?:DataFreshness;className?:string
}
const CONTROL_LABELS = {bot:'Bot Model',orientation:'Orientation',trail:'Movement Path',grid:'Grid',boundary:'Basin Boundary',water:'Water Surface',depth:'Depth View'} as const
type ToggleKey=keyof typeof CONTROL_LABELS
const fmt=(value:number|undefined,decimals=2)=>isFiniteNumber(value)?value.toFixed(decimals):'—'

class SceneBoundary extends Component<{children:ReactNode;onRetry:()=>void},{failed:boolean}> {
  state={failed:false}
  static getDerivedStateFromError(){return {failed:true}}
  render(){return this.state.failed?<div className="ml-error" role="alert"><strong>3D view unavailable</strong><span>The model or graphics context could not load.</span><button onClick={this.props.onRetry}>Retry 3D view</button></div>:this.props.children}
}

function RobotController({position,orientation,showBot,showOrientation,worldPosition,reducedMotion}:{
  position:LocalPosition;orientation?:OrientationTelemetry;showBot:boolean;showOrientation:boolean;worldPosition:THREE.Vector3;reducedMotion:boolean
}) {
  const robot=useRef<THREE.Group>(null)
  const targetPosition=useMemo(()=>telemetryToWorldPosition(position.xMetres,position.yMetres,position.depthMetres),[position.xMetres,position.yMetres,position.depthMetres])
  const angles=resolveOrientation(orientation,position)
  const quaternion=useMemo(()=>imuToRobotOrientation(angles.pitchDegrees,angles.rollDegrees,angles.yawDegrees),[angles.pitchDegrees,angles.rollDegrees,angles.yawDegrees])
  const initialized=useRef(false)
  const previouslyLocated=useRef(false)
  const located=hasPosition(position)
  useFrame((_,delta)=>{
    if(!robot.current)return
    const snap=!initialized.current||located!==previouslyLocated.current
    const alpha=snap||reducedMotion?1:smoothFactor(.10,delta)
    worldPosition.lerp(targetPosition,alpha)
    robot.current.position.copy(worldPosition)
    robot.current.quaternion.slerp(quaternion,alpha)
    initialized.current=true;previouslyLocated.current=located
  })
  const hasAngles=Object.values(angles).some(isFiniteNumber)
  return <group ref={robot} position={targetPosition} name="TelemetryRobotPose">
    <Suspense fallback={<Html center><span className="ml-model-loading">Loading robot…</span></Html>}>
      <JanyuRobot visible={showBot}/>
    </Suspense>
    {showOrientation&&hasAngles&&<group name="OrientationHelper">
      <Line points={[[0,.39,.20],[0,.39,-.9],[-.1,.39,-.73],[0,.39,-.9],[.1,.39,-.73]]} color="#83e7e4" lineWidth={1.5} transparent opacity={.8}/>
      <Line points={[[-.5,0,0],[.5,0,0]]} color="#78be9e" lineWidth={1} transparent opacity={.6}/>
    </group>}
    <pointLight position={[0,.85,.45]} color="#d8f3f6" intensity={9} distance={3} decay={2}/>
  </group>
}

function SceneLighting(){return <>
  <ambientLight intensity={.6} color="#bfdae4"/>
  <hemisphereLight args={['#b8d6e4','#173f48',1.5]}/>
  <directionalLight position={[-4,9,4]} intensity={3.1} color="#f0f4ef" castShadow shadow-mapSize={[1024,1024]} shadow-bias={-.00025} shadow-normalBias={.025}>
    <orthographicCamera attach="shadow-camera" args={[-7,7,5,-5,.1,22]}/>
  </directionalLight>
  <directionalLight position={[5,4,-4]} intensity={1.8} color="#85c8df"/>
  <Environment resolution={128} frames={1}>
    <Lightformer intensity={3} position={[0,7,0]} rotation={[Math.PI/2,0,0]} scale={[12,12,1]}/>
    <Lightformer intensity={2} color="#bde6f2" position={[4,3,1]} rotation={[0,-Math.PI/2,0]} scale={[4,6,1]}/>
  </Environment>
</>}

function FullscreenIcon({expanded}:{expanded:boolean}){return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={expanded?'M2 7h5V2M13 2v5h5M18 13h-5v5M7 18v-5H2':'M7 2H2v5M13 2h5v5M18 13v5h-5M7 18H2v-5'}/></svg>}
function Reading({label,value,unit,decimals=2}:{label:string;value?:number;unit?:string;decimals?:number}){
  const gap=unit&&unit!=='°'&&unit!=='%'?' ':''
  return <div><dt>{label}</dt><dd>{isFiniteNumber(value)?`${value.toFixed(decimals)}${gap}${unit??''}`:'—'}</dd></div>
}
function Metric({label,value,unit,color}:{label:string;value:number|undefined;unit?:string;color?:string}){return <div className="ml-metric"><span>{color&&<i style={{background:color}}/>}{label}</span><strong>{fmt(value)}{isFiniteNumber(value)&&unit&&<small>{unit}</small>}</strong></div>}

export function MachineLocation3D({position,trajectory=[],distanceTravelledMetres,orientation,deviceId,freshness,className=''}:MachineLocation3DProps){
  const panel=useRef<HTMLElement>(null)
  const launchButton=useRef<HTMLButtonElement>(null)
  const returnFocus=useRef<HTMLElement|null>(null)
  const nativeFullscreen=useRef(false)
  const [expanded,setExpanded]=useState(false)
  const [view,setView]=useState<ViewMode>('3d')
  const [zoom,setZoom]=useState(1)
  const [command,setCommand]=useState<CameraCommand>({id:0,type:'3d'})
  const [toggles,setToggles]=useState<Record<ToggleKey,boolean>>({bot:true,orientation:true,trail:true,grid:true,boundary:true,water:true,depth:true})
  const [retry,setRetry]=useState(0)
  const [contextLost,setContextLost]=useState(false)
  const [visible,setVisible]=useState(true)
  const [documentVisible,setDocumentVisible]=useState(!document.hidden)
  const [reducedMotion,setReducedMotion]=useState(false)
  const worldPosition=useMemo(()=>telemetryToWorldPosition(undefined,undefined,undefined),[])
  const located=hasPosition(position)
  const angles=resolveOrientation(orientation,position)
  const hasImu=Object.values(angles).some(isFiniteNumber)
  const outOfBounds=located&&!isInsideBasin(telemetryToWorldPosition(position.xMetres,position.yMetres,position.depthMetres))
  const status=freshness?.state==='recent'&&(located||hasImu)?'live':freshness?.state==='stale'?'stale':'offline'
  const send=useCallback((type:CameraCommand['type'])=>setCommand(previous=>({id:previous.id+1,type})),[])
  const chooseView=(next:ViewMode)=>{setView(next);send(next)}
  const reset=()=>{setView('3d');send('reset')}
  const close=useCallback(()=>{
    if(document.fullscreenElement===panel.current)void document.exitFullscreen().catch(()=>{})
    nativeFullscreen.current=false;setExpanded(false)
    requestAnimationFrame(()=>returnFocus.current?.focus())
  },[])
  const open=()=>{
    returnFocus.current=document.activeElement as HTMLElement;setExpanded(true)
    if(panel.current?.requestFullscreen)void panel.current.requestFullscreen().then(()=>{nativeFullscreen.current=true}).catch(()=>{/* CSS expanded view remains available. */})
  }
  useEffect(()=>{
    const change=()=>{if(nativeFullscreen.current&&!document.fullscreenElement){nativeFullscreen.current=false;setExpanded(false);returnFocus.current?.focus()}}
    document.addEventListener('fullscreenchange',change);return()=>document.removeEventListener('fullscreenchange',change)
  },[])
  useEffect(()=>{
    if(!expanded)return
    const previous=document.body.style.overflow;document.body.style.overflow='hidden'
    const escape=(e:KeyboardEvent)=>{if(e.key==='Escape')close()}
    document.addEventListener('keydown',escape);launchButton.current?.focus()
    return()=>{document.body.style.overflow=previous;document.removeEventListener('keydown',escape)}
  },[expanded,close])
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReducedMotion(media.matches);update();media.addEventListener('change',update)
    const visibility=()=>setDocumentVisible(!document.hidden);document.addEventListener('visibilitychange',visibility)
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting));if(panel.current)observer.observe(panel.current)
    return()=>{media.removeEventListener('change',update);document.removeEventListener('visibilitychange',visibility);observer.disconnect()}
  },[])
  const active=documentVisible&&(visible||expanded)
  const retryScene=()=>{useGLTF.clear(JANYU_ROBOT_GLB_PATH);setContextLost(false);setRetry(n=>n+1)}
  return <section ref={panel} className={`ml-panel ${expanded?'ml-expanded':''} ${className}`} aria-label="Machine Location" role={expanded?'dialog':undefined} aria-modal={expanded?true:undefined}
    onKeyDown={event=>{
      if(!expanded||event.key!=='Tab')return
      const focusable=Array.from(panel.current!.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), [tabindex="0"]'))
      const first=focusable[0],last=focusable.at(-1)
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
    }}>
    <header className="ml-header">
      <div className="ml-heading"><svg className="ml-pin" viewBox="0 0 24 30" fill="currentColor" aria-hidden="true"><path d="M12 1C5.8 1 1 5.7 1 11.5 1 19 12 29 12 29s11-10 11-17.5C23 5.7 18.2 1 12 1Zm0 15a4.6 4.6 0 1 1 0-9.2A4.6 4.6 0 0 1 12 16Z"/></svg>
        <div><div className="ml-title-line"><h2>Machine Location</h2><span className={`ml-status ml-status-${status}`}>{status}</span></div><p>RAAS <span>|</span> Robotic Sludge Cleaning Machine</p></div>
      </div>
      <div className="ml-bot-badge"><strong>BOT: {deviceId||'—'}</strong><span><i className={`ml-dot ml-dot-${status}`}/>{freshness?.state==='recent'?'Telemetry connected':freshness?.state==='stale'?'Telemetry stale':'Awaiting telemetry'}</span></div>
      <nav className="ml-toolbar" aria-label="3D camera controls">
        <div className="ml-view-buttons">{(['3d','top','front','side'] as ViewMode[]).map(v=><button key={v} type="button" aria-pressed={view===v} onClick={()=>chooseView(v)}>{v==='3d'?'3D View':v[0].toUpperCase()+v.slice(1)}</button>)}</div>
        <div className="ml-zoom-buttons"><button type="button" aria-label="Zoom out" onClick={()=>send('out')}>−</button><output aria-label="Camera zoom">{zoom.toFixed(1)}×</output><button type="button" aria-label="Zoom in" onClick={()=>send('in')}>+</button></div>
        <button type="button" className="ml-reset" onClick={reset}>Reset</button>
        <button ref={launchButton} type="button" className="ml-expand-button" aria-label={expanded?'Exit fullscreen':'Open fullscreen'} title={expanded?'Exit fullscreen (Esc)':'Fullscreen telemetry'} onClick={expanded?close:open}><FullscreenIcon expanded={expanded}/></button>
      </nav>
    </header>
    <div className="ml-body">
      <div className="ml-viewport">
        <SceneBoundary key={retry} onRetry={retryScene}>
          {contextLost?<div className="ml-error" role="alert"><strong>Graphics context interrupted</strong><button onClick={retryScene}>Restore 3D view</button></div>:<Canvas shadows dpr={[1,1.5]} frameloop={active?'always':'never'} camera={{position:DEFAULT_CAMERA,fov:40,near:.035,far:80}}
            gl={{antialias:true,toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.2,powerPreference:'high-performance'}}
            fallback={<div className="ml-error">WebGL is unavailable in this browser.</div>}
            onCreated={({gl})=>{gl.setClearColor('#060d12');gl.domElement.setAttribute('aria-label','Interactive 3D view of the robot in an industrial tank');gl.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();setContextLost(true)},{once:true})}}>
            <SceneLighting/>
            <IndustrialBasin showGrid={toggles.grid} showBoundary={toggles.boundary} showWater={toggles.water} showDepthView={toggles.depth} robotPosition={worldPosition} animated={!reducedMotion}/>
            <RobotController key={deviceId||'robot'} position={position} orientation={orientation} showBot={toggles.bot} showOrientation={toggles.orientation} worldPosition={worldPosition} reducedMotion={reducedMotion}/>
            <MovementTrail trajectory={trajectory} visible={toggles.trail}/>
            <MachineLocationCamera command={command} robotPosition={worldPosition} onZoom={setZoom} reducedMotion={reducedMotion}/>
            <GizmoHelper alignment="top-left" margin={[54,64]}><GizmoViewport axisColors={['#f65855','#24d889','#00bbdf']} labelColor="#f0f7fa" axisHeadScale={.7} hideNegativeAxes/></GizmoHelper>
          </Canvas>}
        </SceneBoundary>
        <div className="ml-axis-caption">WORLD AXES · Y UP</div>
        <button type="button" className="ml-focus" onClick={()=>send('focus')} title="Move camera closer to the bot">◎ <span>Focus bot</span></button>
        <div className="ml-scene-state"><i/>{outOfBounds?'POSITION OUTSIDE CONFIGURED TANK':!located?'POSITION: NO DATA · INSPECTION POSE':!isFiniteNumber(position.depthMetres)?'DEPTH: NO DATA · INSPECTION LEVEL':freshness?.state==='recent'?'LIVE POSITION':freshness?.state==='stale'?'LAST POSITION · STALE':'LAST POSITION · OFFLINE'}</div>
        {expanded&&<div className="ml-position-card" aria-label="Position telemetry"><h3>Position <span>(m)</span></h3><Metric label="X" value={position.xMetres}/><Metric label="Y" value={position.yMetres}/><Metric label="Z · Depth" value={position.depthMetres}/><p>Depth below water surface</p></div>}
        <div className="ml-tank-card"><div><span>Water level</span><strong>{BASIN_CONFIG.waterLevelY.toFixed(2)} m</strong></div><div><span>Tank size</span><strong>{BASIN_CONFIG.halfX*2} × {BASIN_CONFIG.halfZ*2} × {BASIN_CONFIG.wallHeight} m</strong></div><small>Configured dimensions</small></div>
        <div className="ml-gesture-hint">Drag to orbit · Scroll to zoom · Right-drag to pan</div>
      </div>
      <aside className="ml-sidebar" aria-label="Machine Location controls">
        <div className="ml-controls"><h3>Controls</h3>{(Object.entries(CONTROL_LABELS) as [ToggleKey,string][]).map(([key,label])=><label className="ml-checkbox" key={key}><span>{label}</span><input type="checkbox" checked={toggles[key]} onChange={()=>setToggles(current=>({...current,[key]:!current[key]}))}/><span className="ml-check-box" aria-hidden="true">✓</span></label>)}</div>
        {expanded?<>
          <div className="ml-readings" aria-label="Orientation telemetry"><h3>Orientation <span>(°)</span></h3><Metric label="Pitch" value={angles.pitchDegrees} unit="°" color="#fa4c47"/><Metric label="Roll" value={angles.rollDegrees} unit="°" color="#00d678"/><Metric label="Yaw" value={angles.yawDegrees} unit="°" color="#00bed8"/>{!hasImu&&<p className="ml-muted">Waiting for IMU telemetry</p>}</div>
          <div className="ml-readings" aria-label="Acceleration telemetry"><h3>Acceleration <span>(g)</span></h3><Metric label="Accel X" value={position.accelerationX} color="#fa4c47"/><Metric label="Accel Y" value={position.accelerationY} color="#00d678"/><Metric label="Accel Z" value={position.accelerationZ} color="#00bed8"/></div>
          <div className="ml-readings" aria-label="Machine status and link"><h3>Machine status</h3>
            <dl className="ml-kv">
              <div><dt>Link</dt><dd className={`ml-link-${status}`}>{freshness?.label||'—'}</dd></div>
              <div><dt>Last update</dt><dd>{freshness?formatAge(freshness.ageMs):'—'}</dd></div>
              <Reading label="Depth" value={position.depthMetres} unit="m"/>
              <Reading label="Speed" value={position.speedMps} unit="m/s"/>
              <Reading label="Heading" value={position.headingDegrees} unit="°" decimals={1}/>
              <Reading label="Distance" value={distanceTravelledMetres} unit="m" decimals={1}/>
              <Reading label="Confidence" value={position.confidencePercent} unit="%" decimals={0}/>
            </dl>
          </div>
          <div className="ml-inspection-note"><i/>Submerged inspection<span>{toggles.depth?'Near walls are transparent to expose depth and tilt.':'Enable Depth View for a clear view through near walls.'}</span></div>
        </>:<div className="ml-expand-note"><FullscreenIcon expanded={false}/><span>Open fullscreen for coordinates and tilt angles.</span></div>}
      </aside>
    </div>
    {expanded&&<footer className="ml-footer"><span>Varaha IoT <i>|</i> RAAS Dashboard</span><span>Industrial 3D inspection <i>|</i> Esc to close</span></footer>}
  </section>
}
