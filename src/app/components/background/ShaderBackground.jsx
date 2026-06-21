"use client";
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "../scroll/scrollStore";

const vertex = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

const fragment = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2  uMouse;
  uniform vec2  uRes;

  // simple value noise
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
    vec2 u=f*f*(3.-2.*f);
    return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
  }
  float fbm(vec2 p){ float v=0.,a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.; a*=.5;} return v; }

  void main(){
    vec2 uv = vUv;
    vec2 p = uv * 3.0;
    p += uMouse * 0.3;
    float t = uTime * 0.05;
    float n = fbm(p + vec2(t, t*0.7) + uScroll*1.5);
    n += 0.5*fbm(p*2.0 - t);

    vec3 base    = vec3(0.039, 0.039, 0.043);          // #0a0a0b
    vec3 violet  = vec3(0.545, 0.361, 0.965);          // #8b5cf6
    vec3 magenta = vec3(0.925, 0.282, 0.6);            // #ec489a
    vec3 col = mix(violet, magenta, smoothstep(0.2, 0.9, uScroll));

    float glow = smoothstep(0.55, 1.0, n);
    float vignette = smoothstep(1.2, 0.2, length(uv - 0.5) * 1.6);
    vec3 outc = base + col * glow * 0.45 * vignette;
    gl_FragColor = vec4(outc, 1.0);
  }
`;

export default function ShaderBackground() {
  const mat = useRef();
  const { size } = useThree();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uRes: { value: new THREE.Vector2(1, 1) },
  }), []);

  useFrame((_, delta) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uTime.value += delta;
    u.uScroll.value += (scrollStore.progress - u.uScroll.value) * 0.06;
    u.uMouse.value.x += (scrollStore.mouseX - u.uMouse.value.x) * 0.05;
    u.uMouse.value.y += (scrollStore.mouseY - u.uMouse.value.y) * 0.05;
    u.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}
