import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BASIN_CONFIG } from './machineLocationUtils'

const vertexShader = /* glsl */ `
uniform float uTime;
varying vec3 vWorld;
varying vec2 vPlane;
void main() {
  vec3 p = position;
  p.z += sin(p.x*3.1 + uTime*.65)*cos(p.y*2.8 - uTime*.45)*.009;
  p.z += sin(p.x*7.2 + p.y*4.6 - uTime*.8)*.004;
  vPlane = p.xy;
  vWorld = (modelMatrix * vec4(p,1.)).xyz;
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld,1.);
}`
const fragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uRobot;
uniform float uFloor;
varying vec3 vWorld;
varying vec2 vPlane;
vec2 hash(vec2 p) { return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453); }
float caustic(vec2 p) {
  vec2 cell=floor(p), f=fract(p); float a=10., b=10.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++) {
    vec2 g=vec2(float(x),float(y));vec2 h=hash(cell+g);
    vec2 r=g+.5+.32*sin(uTime*.24+6.2831*h)-f;
    float d=dot(r,r);if(d<a){b=a;a=d;}else if(d<b){b=d;}
  }
  return pow(1.-smoothstep(.004,.26,b-a),1.6);
}
void main() {
  vec2 p=vPlane;
  vec2 drift=vec2(sin(p.y*1.8+uTime*.25),cos(p.x*1.7-uTime*.2))*.13;
  float cells=caustic(p*3.6+drift);
  if(uFloor>.5){gl_FragColor=vec4(vec3(.09,.66,.71),cells*.17);return;}
  float sx=cos(p.x*3.1+uTime*.65)*cos(p.y*2.8-uTime*.45)*.12 + cos(p.x*13.+p.y*9.-uTime)*.038;
  float sz=-sin(p.x*3.1+uTime*.65)*sin(p.y*2.8-uTime*.45)*.12 + sin(p.y*17.-p.x*8.+uTime*.8)*.03;
  vec3 n=normalize(vec3(sx,1.,sz));vec3 v=normalize(cameraPosition-vWorld);
  float fresnel=pow(1.-max(dot(n,v),0.),3.);
  vec3 light=normalize(vec3(-.4,.9,.3));
  float spec=pow(max(dot(n,normalize(light+v)),0.),150.);
  float streak=pow(max(dot(n,normalize(vec3(.65,.75,-.15)+v)),0.),260.);
  float inspection=1.-smoothstep(.7,1.8,distance(vWorld.xz,uRobot.xz));
  vec3 color=mix(vec3(.012,.18,.24),vec3(.08,.40,.48),fresnel);
  color+=cells*vec3(.025,.16,.18)+spec*vec3(.6,.86,.94)*.65+streak*.4;
  float alpha=mix(.26,.11,inspection)+fresnel*.20+spec*.10;
  gl_FragColor=vec4(color,alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

/** Lightweight animated normal/specular approximation, not fluid simulation.
 * No transmission render pass, CPU vertex updates, or per-frame normal recomputation.
 */
export function BasinWater({ robotPosition, animated }: { robotPosition: THREE.Vector3; animated: boolean }) {
  const surface = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uRobot: { value: new THREE.Vector3() }, uFloor: { value: 0 } },
    vertexShader, fragmentShader, transparent: true, depthWrite: false, side: THREE.DoubleSide,
  }), [])
  const caustics = useMemo(() => {
    const material = surface.clone(); material.uniforms.uFloor.value = 1
    // Caustics are light cast onto the floor, so they add rather than occlude.
    material.blending = THREE.AdditiveBlending; return material
  }, [surface])
  useEffect(() => () => { surface.dispose(); caustics.dispose() }, [surface, caustics])
  useFrame((_, delta) => {
    if (animated) surface.uniforms.uTime.value += Math.min(delta, .05)
    surface.uniforms.uRobot.value.copy(robotPosition)
    caustics.uniforms.uTime.value = surface.uniforms.uTime.value
  })
  return <group name="WaterSurface">
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, BASIN_CONFIG.waterLevelY, 0]} renderOrder={4} material={surface}>
      <planeGeometry args={[BASIN_CONFIG.halfX * 2, BASIN_CONFIG.halfZ * 2, 64, 40]} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, BASIN_CONFIG.floorY + .012, 0]} renderOrder={1} material={caustics}>
      <planeGeometry args={[BASIN_CONFIG.halfX * 2, BASIN_CONFIG.halfZ * 2]} />
    </mesh>
  </group>
}
