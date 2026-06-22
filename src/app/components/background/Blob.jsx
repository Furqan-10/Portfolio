"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "../scroll/scrollStore";

const smoothstep = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

const vertex = `
  uniform float uTime; uniform float uScroll; uniform vec2 uMouse;
  varying float vDisp; varying vec3 vNormal;
  // 3D simplex-ish noise (Ashima)
  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
    vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  void main(){
    vNormal=normal;
    float amp=0.35+uScroll*0.5;
    float n=snoise(normal*1.4+uTime*0.25);
    float mouse=0.25*snoise(normal*2.0+vec3(uMouse*2.0,0.));
    vDisp=n;
    vec3 pos=position+normal*(n*amp+mouse);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0);
  }
`;

const fragment = `
  varying float vDisp; varying vec3 vNormal;
  uniform float uScroll; uniform float uOpacity;
  void main(){
    vec3 violet=vec3(0.545,0.361,0.965);
    vec3 magenta=vec3(0.925,0.282,0.6);
    vec3 col=mix(violet,magenta,smoothstep(-0.5,1.0,vDisp)+uScroll*0.3);
    float fres=pow(1.0-abs(dot(normalize(vNormal),vec3(0.,0.,1.))),2.0);
    gl_FragColor=vec4(col + fres*0.6, 0.9 * uOpacity);
  }
`;

export default function Blob() {
  const mesh = useRef();
  const mat = useRef();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uScroll: { value: 0 }, uMouse: { value: new THREE.Vector2() },
    uOpacity: { value: 1 },
  }), []);

  useFrame((_, delta) => {
    if (!mat.current || !mesh.current) return;
    const u = mat.current.uniforms;
    u.uTime.value += delta;
    u.uScroll.value += (scrollStore.progress - u.uScroll.value) * 0.06;
    u.uMouse.value.x += (scrollStore.mouseX - u.uMouse.value.x) * 0.04;
    u.uMouse.value.y += (scrollStore.mouseY - u.uMouse.value.y) * 0.04;

    // Hero-only: fade + drift away as the first viewport scrolls past, then hide.
    const hp = scrollStore.heroProgress;
    const fade = 1 - smoothstep(0.05, 0.55, hp);
    u.uOpacity.value += (fade - u.uOpacity.value) * 0.12;
    mesh.current.visible = u.uOpacity.value > 0.01;

    mesh.current.rotation.y += delta * 0.15;
    mesh.current.rotation.x = scrollStore.mouseY * 0.3;
    // drift right + up and shrink as the hero leaves
    mesh.current.position.x = 1.6 + hp * 1.8;
    mesh.current.position.y = hp * 1.2;
    mesh.current.scale.setScalar(1.3 - hp * 0.5);
  });

  return (
    <mesh ref={mesh} position={[1.6, 0, 0]}>
      <icosahedronGeometry args={[1, 24]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent />
    </mesh>
  );
}
