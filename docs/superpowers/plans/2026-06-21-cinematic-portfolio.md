# Cinematic Portfolio Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Furqan Asif's Next.js portfolio into a dark, violet/magenta, scroll-driven experience with a WebGL shader background, a cursor-reactive 3D blob, smooth scroll, a pinned horizontal work gallery, and rich interactive sections — keeping his real GitHub-accurate content.

**Architecture:** One persistent fixed `@react-three/fiber` `<Canvas>` lives behind the whole page (Architecture A). A full-screen shader plane + a distortion blob read global scroll progress (Lenis) and cursor position via uniforms. GSAP ScrollTrigger pins/animates sections; Framer Motion handles component reveals. The canvas and GSAP pinning are disabled on mobile / `prefers-reduced-motion`, replaced by a static gradient + simple fades.

**Tech Stack:** Next.js 13 (App Router, JS), Tailwind CSS, `three` + `@react-three/fiber` + `@react-three/drei`, `gsap` (+ ScrollTrigger), `lenis`, `framer-motion`, `react-icons`.

**Spec:** `docs/superpowers/specs/2026-06-21-portfolio-redesign-design.md`

**Branch:** `redesign/cinematic-portfolio` (already created).

---

## Verification model (read first)

This is a visual project with no test runner configured. Each task's verification is:

1. **Build gate:** `npm run build` exits 0 with no errors. (Run from `d:/work/fuqi portfolio`.)
2. **Visual gate (when there's something to see):** start dev server, then screenshot with the gstack browse binary:
   - Start dev: `npm run dev` (serves on http://localhost:3000).
   - `B="$HOME/.claude/skills/gstack/browse/dist/browse"`
   - `"$B" goto http://localhost:3000` → `"$B" wait --networkidle` → `"$B" screenshot --viewport /tmp/check.png`
   - Read the PNG to confirm the result, and `"$B" console --errors` to confirm no runtime errors.
3. **Commit** after each task.

Do not add a test framework; visual verification is the gate.

---

## File structure (created/modified across the plan)

```
package.json                         # + deps (Task 1)
tailwind.config.js                   # violet/pink palette, keyframes (Task 2)
src/app/globals.css                  # dark base, gradient-text, glow utils (Task 2)
src/app/layout.js                    # providers + smooth scroll + bg canvas (Tasks 7, 18)
src/app/page.js                      # section composition (Task 18)
src/app/data/projects.js             # work gallery data (Task 3)
src/app/data/skills.js               # tech-stack data (Task 3)
src/app/data/timeline.js             # journey data (Task 3)
src/app/components/scroll/SmoothScrollProvider.jsx   # Lenis (Task 4)
src/app/components/scroll/scrollStore.js             # shared scroll progress (Task 4)
src/app/components/background/BackgroundCanvas.jsx    # dynamic ssr:false wrapper (Task 5)
src/app/components/background/Scene.jsx               # <Canvas> contents (Tasks 5,6)
src/app/components/background/ShaderBackground.jsx    # full-screen shader plane (Task 5)
src/app/components/background/Blob.jsx                # distortion sphere (Task 6)
src/app/components/Loader.jsx                         # intro loader (Task 8)
src/app/components/chrome/TopBar.jsx                  # logo+email+nav (Task 9)
src/app/components/chrome/SideSocials.jsx             # fixed left socials (Task 9)
src/app/components/chrome/ResumeCorner.jsx            # bottom-right CV (Task 9)
src/app/components/HeroSection.jsx                    # rebuilt (Task 10)
src/app/components/AboutSection.jsx                   # rebuilt (Task 11)
src/app/components/WhatIDoSection.jsx                 # new (Task 12)
src/app/components/TimelineSection.jsx               # new (Task 13)
src/app/components/WorkSection.jsx                   # new, pinned horizontal (Task 14)
src/app/components/TechStackSection.jsx              # new (Task 15)
src/app/components/EmailSection.jsx                  # restyled (Task 16)
src/app/components/Footer.jsx                        # restyled (Task 17)
src/app/hooks/useIsMobile.js                         # md breakpoint + reduced-motion (Task 4)
```

Old components removed in Task 18: `Navbar.jsx`, `MenuOverlay.jsx`, `NavLink.jsx`, `TabButton.jsx`, `ProjectCard.jsx`, `ProjectTag.jsx`, `ThemeSwitcher.jsx` (functionality absorbed by new chrome/sections). `api/send/route.js` and `providers.js` are kept.

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install runtime deps**

Run from `d:/work/fuqi portfolio`:
```bash
npm install three @react-three/fiber@^8 @react-three/drei@^9 gsap lenis react-icons
```
Note: pin R3F v8 / drei v9 for React 18 + Next 13 compatibility.

- [ ] **Step 2: Verify install + build**

Run: `npm run build`
Expected: exits 0, no module-resolution errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add three, r3f, drei, gsap, lenis, react-icons"
```

---

## Task 2: Theme — palette, globals, utilities

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Recolor Tailwind + add keyframes**

Replace `tailwind.config.js` with:
```js
/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
      animation: {
        marquee: "marquee 18s linear infinite",
        floaty: "floaty 2.4s ease-in-out infinite",
      },
    },
    colors: {
      ...colors,
      primary: colors.violet,
      secondary: colors.pink,
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Replace globals.css base + utilities**

Replace `src/app/globals.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: dark; }

html, body { background-color: #0a0a0a; }

body {
  color: #ECECEC;
  overflow-x: hidden;
}

/* Lenis */
html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-stopped { overflow: hidden; }

@layer utilities {
  .text-gradient {
    @apply text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-500;
  }
  .glow-violet { box-shadow: 0 0 40px -10px rgba(139, 92, 246, 0.6); }
  .glow-text { text-shadow: 0 0 28px rgba(139, 92, 246, 0.45); }
  .panel { @apply bg-white/[0.03] border border-white/10 backdrop-blur-sm; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}
```

- [ ] **Step 3: Build gate**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js src/app/globals.css
git commit -m "style: violet/magenta dark theme + utilities"
```

---

## Task 3: Content data files

**Files:**
- Create: `src/app/data/projects.js`
- Create: `src/app/data/skills.js`
- Create: `src/app/data/timeline.js`

- [ ] **Step 1: Create `src/app/data/projects.js`**

```js
export const projects = [
  { n: "01", title: "AFC — Food Ordering App", category: "Mobile / Android",
    desc: "A food-ordering Android app inspired by the KFC mobile experience: menu browsing, cart, and ordering flow.",
    tools: ["Kotlin", "Android SDK", "XML UI"], url: "https://github.com/Furqan-10/AFC-MAD" },
  { n: "02", title: "AI-Based Fire Detection System", category: "AI / IoT",
    desc: "IoT fire detection combining sensor data, Arduino–ESP32 communication, and a cloud-hosted AI model.",
    tools: ["C++", "ESP32", "Arduino", "ML", "Hugging Face"], url: "https://github.com/Furqan-10/AI-Based-Fire-Detection-System" },
  { n: "03", title: "AI Face Mask Detection", category: "AI / Computer Vision",
    desc: "Real-time mask recognition using a fine-tuned MobileNetV2 and OpenCV Haar Cascade, ~99% accuracy.",
    tools: ["Python", "MobileNetV2", "OpenCV", "CNN"], url: "https://github.com/Furqan-10/AI-Face-Mask-Detection" },
  { n: "04", title: "Custom DNS Server", category: "Networking / Security",
    desc: "A Python DNS server using dnslib and UDP sockets to block domains by returning controlled responses.",
    tools: ["Python", "dnslib", "Sockets", "UDP"], url: "https://github.com/Furqan-10/CustomDNS" },
  { n: "05", title: "Contacts App", category: "Mobile / Android",
    desc: "A feature-rich Android contacts application built natively in Kotlin.",
    tools: ["Kotlin", "Android SDK"], url: "https://github.com/Furqan-10/Contacts-MAD-88" },
  { n: "06", title: "OS Project", category: "Systems",
    desc: "An operating-systems project exploring core OS concepts and process-level programming in Python.",
    tools: ["Python", "OS Concepts"], url: "https://github.com/Furqan-10/OS-project" },
  { n: "07", title: "KarweDB — Custom NoSQL DB", category: "Database / Software",
    desc: "A non-relational DBMS storing JSON-like documents with SQL-style querying — schemaless flexibility, relational syntax.",
    tools: ["C#", "NoSQL", "JSON Storage", "Query Engine"], url: "https://github.com/Ahmad-17R/DBMS" },
  { n: "08", title: "UET Campus Navigation", category: "Software",
    desc: "A Windows Forms app for interactive, map-based navigation across the university campus.",
    tools: ["C#", "WinForms", "Data Structures"], url: "https://github.com/Hannanm10/UET-Navigation-System" },
  { n: "09", title: "Portfolio Website", category: "Web",
    desc: "This site — a scroll-driven WebGL portfolio built with Next.js, Tailwind, Framer Motion, and react-three-fiber.",
    tools: ["Next.js", "Tailwind", "Framer Motion", "R3F"], url: "https://github.com/Furqan-10/Portfolio" },
];
```

- [ ] **Step 2: Create `src/app/data/skills.js`**

```js
import {
  SiPython, SiJavascript, SiCplusplus, SiSharp, SiC, SiKotlin, SiHtml5, SiCss3,
  SiReact, SiNextdotjs, SiNodedotjs, SiTailwindcss, SiTensorflow, SiPytorch,
  SiOpencv, SiMysql, SiGit, SiGithub, SiAndroid, SiVercel,
} from "react-icons/si";

export const skills = [
  { name: "Python", icon: SiPython }, { name: "JavaScript", icon: SiJavascript },
  { name: "C++", icon: SiCplusplus }, { name: "C#", icon: SiSharp },
  { name: "C", icon: SiC }, { name: "Kotlin", icon: SiKotlin },
  { name: "HTML", icon: SiHtml5 }, { name: "CSS", icon: SiCss3 },
  { name: "React", icon: SiReact }, { name: "Next.js", icon: SiNextdotjs },
  { name: "Node.js", icon: SiNodedotjs }, { name: "Tailwind", icon: SiTailwindcss },
  { name: "TensorFlow", icon: SiTensorflow }, { name: "PyTorch", icon: SiPytorch },
  { name: "OpenCV", icon: SiOpencv }, { name: "SQL", icon: SiMysql },
  { name: "Git", icon: SiGit }, { name: "GitHub", icon: SiGithub },
  { name: "Android", icon: SiAndroid }, { name: "Vercel", icon: SiVercel },
];

export const whatIDo = [
  { title: "AI & Machine Learning",
    blurb: "Intelligent systems, computer vision, and deep learning — from real-time detection models to applied ML.",
    chips: ["Python", "TensorFlow", "PyTorch", "OpenCV", "CNNs", "Hugging Face"] },
  { title: "Cybersecurity & Networks",
    blurb: "Secure systems and low-level networking — DNS, sockets, and security-minded engineering.",
    chips: ["Web Security", "Network Security", "Sockets", "DNS", "C/C++"] },
  { title: "Software, Web & Mobile",
    blurb: "Full-stack web apps and native Android — building polished, responsive products end to end.",
    chips: ["React", "Next.js", "Node.js", "C#", "Kotlin", "Tailwind"] },
];
```
Note: if any `Si*` icon name fails to resolve at build (icon set changes), swap to the nearest available icon; do not block on a single icon.

- [ ] **Step 3: Create `src/app/data/timeline.js`**

```js
export const timeline = [
  { when: "NOW", title: "Building & Shipping", org: "AI · Security · Mobile",
    desc: "Developing AI, cybersecurity, and Android projects while completing my CS degree (CS '27)." },
  { when: "2023–Now", title: "B.S. Computer Science", org: "UET, Lahore",
    desc: "Core CS — data structures, databases, networks, operating systems, and applied AI." },
  { when: "HSSC", title: "Pre-Engineering", org: "PGC, Lahore",
    desc: "Higher Secondary (Pre-Engineering) — the foundation for an engineering path." },
  { when: "Matric", title: "Science Group", org: "Laurelbank Public School",
    desc: "Where the curiosity for computers and problem-solving started." },
];
```

- [ ] **Step 4: Build gate + commit**

Run: `npm run build` → expect exit 0.
```bash
git add src/app/data
git commit -m "feat: add projects, skills, and timeline data"
```

---

## Task 4: Smooth scroll provider + scroll store + mobile hook

**Files:**
- Create: `src/app/components/scroll/scrollStore.js`
- Create: `src/app/components/scroll/SmoothScrollProvider.jsx`
- Create: `src/app/hooks/useIsMobile.js`

- [ ] **Step 1: Create `src/app/components/scroll/scrollStore.js`**

A tiny module singleton holding live scroll progress (0..1) + cursor, read by the R3F render loop without React re-renders.
```js
export const scrollStore = {
  progress: 0,   // 0..1 over full page
  velocity: 0,
  mouseX: 0,     // -1..1
  mouseY: 0,     // -1..1
};

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e) => {
    scrollStore.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    scrollStore.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
  });
}
```

- [ ] **Step 2: Create `src/app/hooks/useIsMobile.js`**

```js
"use client";
import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const check = () => setMobile(window.innerWidth < breakpoint || reduce);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return mobile;
}
```

- [ ] **Step 3: Create `src/app/components/scroll/SmoothScrollProvider.jsx`**

```jsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { scrollStore } from "./scrollStore";

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // native scroll for reduced-motion users

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollStore.progress = max > 0 ? window.scrollY / max : 0;
      scrollStore.velocity = lenis.velocity || 0;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.__lenis = lenis; // used by nav links to scrollTo
    return () => { cancelAnimationFrame(raf); lenis.destroy(); delete window.__lenis; };
  }, []);

  return children;
}
```

- [ ] **Step 4: Build gate + commit**

Run: `npm run build` → expect exit 0.
```bash
git add src/app/components/scroll src/app/hooks/useIsMobile.js
git commit -m "feat: lenis smooth scroll provider + scroll store + mobile hook"
```

---

## Task 5: Background canvas + shader background plane

**Files:**
- Create: `src/app/components/background/ShaderBackground.jsx`
- Create: `src/app/components/background/Scene.jsx`
- Create: `src/app/components/background/BackgroundCanvas.jsx`

- [ ] **Step 1: Create `src/app/components/background/ShaderBackground.jsx`**

Full-screen plane with an animated violet→magenta aurora noise. Reads time + scroll + mouse uniforms.
```jsx
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
```

- [ ] **Step 2: Create `src/app/components/background/Scene.jsx`** (Blob added in Task 6)

```jsx
"use client";
import ShaderBackground from "./ShaderBackground";

export default function Scene() {
  return (
    <>
      <ShaderBackground />
    </>
  );
}
```

- [ ] **Step 3: Create `src/app/components/background/BackgroundCanvas.jsx`**

Fixed, behind everything, dynamically imported with `ssr:false`. Skips WebGL on mobile/reduced-motion.
```jsx
"use client";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { useIsMobile } from "../../hooks/useIsMobile";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function BackgroundCanvas() {
  const mobile = useIsMobile();

  if (mobile) {
    // static fallback gradient
    return (
      <div
        className="fixed inset-0 -z-10"
        style={{ background: "radial-gradient(60% 50% at 50% 30%, rgba(139,92,246,0.22), transparent 70%), radial-gradient(50% 50% at 70% 80%, rgba(236,72,153,0.18), transparent 70%), #0a0a0a" }}
      />
    );
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: false }}>
        <Scene />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 4: Temporarily mount to verify** (will move to layout in Task 7)

Temporarily edit `src/app/page.js`: add `import BackgroundCanvas from "./components/background/BackgroundCanvas";` and render `<BackgroundCanvas />` as the first child of `<main>`. (This is reverted/relocated in Task 18.)

- [ ] **Step 5: Build + visual gate**

Run: `npm run build` → exit 0.
Run dev + screenshot per the Verification model. Read `/tmp/check.png`: expect a dark background with faint violet/magenta aurora. `"$B" console --errors`: expect none.

- [ ] **Step 6: Commit**

```bash
git add src/app/components/background src/app/page.js
git commit -m "feat: fixed r3f canvas with aurora shader background + mobile fallback"
```

---

## Task 6: Interactive distortion blob

**Files:**
- Create: `src/app/components/background/Blob.jsx`
- Modify: `src/app/components/background/Scene.jsx`

- [ ] **Step 1: Create `src/app/components/background/Blob.jsx`**

An icosphere with GLSL vertex displacement (noise), distorting toward the cursor and morphing with scroll.
```jsx
"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "../scroll/scrollStore";

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
  uniform float uScroll;
  void main(){
    vec3 violet=vec3(0.545,0.361,0.965);
    vec3 magenta=vec3(0.925,0.282,0.6);
    vec3 col=mix(violet,magenta,smoothstep(-0.5,1.0,vDisp)+uScroll*0.3);
    float fres=pow(1.0-abs(dot(normalize(vNormal),vec3(0.,0.,1.))),2.0);
    gl_FragColor=vec4(col + fres*0.6, 0.9);
  }
`;

export default function Blob() {
  const mesh = useRef();
  const mat = useRef();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uScroll: { value: 0 }, uMouse: { value: new THREE.Vector2() },
  }), []);

  useFrame((_, delta) => {
    if (!mat.current || !mesh.current) return;
    const u = mat.current.uniforms;
    u.uTime.value += delta;
    u.uScroll.value += (scrollStore.progress - u.uScroll.value) * 0.06;
    u.uMouse.value.x += (scrollStore.mouseX - u.uMouse.value.x) * 0.04;
    u.uMouse.value.y += (scrollStore.mouseY - u.uMouse.value.y) * 0.04;
    mesh.current.rotation.y += delta * 0.15;
    mesh.current.rotation.x = scrollStore.mouseY * 0.3;
    // drift right + shrink as user scrolls past hero
    mesh.current.position.x = 1.6 + scrollStore.progress * 1.5;
    const s = 1.3 - scrollStore.progress * 0.4;
    mesh.current.scale.setScalar(s);
  });

  return (
    <mesh ref={mesh} position={[1.6, 0, 0]}>
      <icosahedronGeometry args={[1, 64]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent />
    </mesh>
  );
}
```

- [ ] **Step 2: Add Blob to `src/app/components/background/Scene.jsx`**

```jsx
"use client";
import ShaderBackground from "./ShaderBackground";
import Blob from "./Blob";

export default function Scene() {
  return (
    <>
      <ShaderBackground />
      <Blob />
    </>
  );
}
```

- [ ] **Step 3: Build + visual gate**

Run: `npm run build` → exit 0.
Dev + screenshot: expect a glowing violet/magenta blob on the right over the aurora. Move-mouse effect can't be screenshotted, but confirm no `console --errors`.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/background
git commit -m "feat: cursor-reactive distortion blob driven by scroll"
```

---

## Task 7: Mount canvas + smooth scroll in layout

**Files:**
- Modify: `src/app/layout.js`
- Modify: `src/app/page.js` (remove the temp BackgroundCanvas import from Task 5)

- [ ] **Step 1: Update `src/app/layout.js`**

```jsx
import "./globals.css";
import { Inter } from "next/font/google";
import SmoothScrollProvider from "./components/scroll/SmoothScrollProvider";
import BackgroundCanvas from "./components/background/BackgroundCanvas";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Furqan Asif — Computer Scientist & Developer",
  description: "Portfolio of Furqan Asif: AI, cybersecurity, full-stack, and mobile development. CS '27, UET Lahore.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        <BackgroundCanvas />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Remove temp mount from `src/app/page.js`**

Remove the `import BackgroundCanvas ...` line and the `<BackgroundCanvas />` element added in Task 5 Step 4. (page.js is fully rewritten in Task 18; this just prevents a double canvas in the meantime.)

- [ ] **Step 3: Build + visual gate**

Run: `npm run build` → exit 0. Dev + screenshot: canvas still visible behind the existing content; only one canvas. `console --errors`: none.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.js src/app/page.js
git commit -m "feat: mount background canvas + smooth scroll globally"
```

---

## Task 8: Intro loader

**Files:**
- Create: `src/app/components/Loader.jsx`

- [ ] **Step 1: Create `src/app/components/Loader.jsx`**

```jsx
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROLES = ["COMPUTER SCIENTIST", "DEVELOPER", "AI ENGINEER", "CYBERSECURITY", "MOBILE DEV"];

export default function Loader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setDone(true); return; }
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(100, v + Math.random() * 12);
      setPct(Math.floor(v));
      if (v >= 100) { clearInterval(id); setTimeout(() => setDone(true), 700); }
    }, 130);
    return () => clearInterval(id);
  }, []);

  const marquee = [...ROLES, ...ROLES];

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#e9e6ee] text-black"
          initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          <div className="absolute inset-0 flex items-center overflow-hidden opacity-90">
            <div className="flex whitespace-nowrap animate-marquee text-[12vw] font-extrabold tracking-tight text-black/80">
              {marquee.map((r, i) => (<span key={i} className="mx-8">{r} •</span>))}
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-6 rounded-full bg-black px-10 py-5 text-white shadow-2xl glow-violet">
            <span className="font-semibold tracking-widest">{pct >= 100 ? "WELCOME" : "LOADING"}</span>
            <span className="tabular-nums text-white/60">{pct}%</span>
            <span className="h-3 w-24 overflow-hidden rounded-full bg-white/15">
              <span className="block h-full bg-gradient-to-r from-primary-400 to-secondary-500" style={{ width: `${pct}%` }} />
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Temporarily render** in `src/app/page.js` as first child of `<main>` (`import Loader` + `<Loader />`). Relocated in Task 18.

- [ ] **Step 3: Build + visual gate**

Run: `npm run build` → exit 0. Dev + screenshot quickly (within ~1.5s of load): expect the light loader with marquee + LOADING pill. After ~2s, screenshot again: loader gone. `console --errors`: none.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Loader.jsx src/app/page.js
git commit -m "feat: intro loader with role marquee + progress pill"
```

---

## Task 9: Fixed chrome — top bar, side socials, resume corner

**Files:**
- Create: `src/app/components/chrome/TopBar.jsx`
- Create: `src/app/components/chrome/SideSocials.jsx`
- Create: `src/app/components/chrome/ResumeCorner.jsx`

- [ ] **Step 1: Create `src/app/components/chrome/TopBar.jsx`**

Uses Lenis `scrollTo` when present, falls back to anchor scroll.
```jsx
"use client";
import { useState } from "react";

const LINKS = [
  { label: "ABOUT", target: "#about" },
  { label: "WORK", target: "#work" },
  { label: "CONTACT", target: "#contact" },
];

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const go = (sel) => (e) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(sel);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -20 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#top" onClick={go("#top")} className="text-lg font-extrabold tracking-tight glow-text">FA</a>
        <a href="mailto:Furqan4243@gmail.com" className="hidden text-sm text-white/70 hover:text-white sm:block">Furqan4243@gmail.com</a>
        <nav className="hidden gap-8 text-sm font-semibold md:flex">
          {LINKS.map((l) => (
            <a key={l.label} href={l.target} onClick={go(l.target)} className="text-white/70 transition hover:text-white">{l.label}</a>
          ))}
        </nav>
        <button className="md:hidden" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          <span className="block h-0.5 w-6 bg-white" /><span className="mt-1.5 block h-0.5 w-6 bg-white" />
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-4 bg-black/90 px-6 py-4 text-sm font-semibold backdrop-blur md:hidden">
          {LINKS.map((l) => (<a key={l.label} href={l.target} onClick={go(l.target)} className="text-white/80">{l.label}</a>))}
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Create `src/app/components/chrome/SideSocials.jsx`**

```jsx
"use client";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

const SOCIALS = [
  { Icon: FaGithub, url: "https://github.com/Furqan-10" },
  { Icon: FaLinkedinIn, url: "https://www.linkedin.com/in/furqan-asif-9438252a6" },
];

export default function SideSocials() {
  return (
    <div className="fixed left-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-5 lg:flex">
      {SOCIALS.map(({ Icon, url }, i) => (
        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
           className="text-white/50 transition hover:scale-125 hover:text-primary-400">
          <Icon size={18} />
        </a>
      ))}
      <span className="mt-2 h-16 w-px bg-white/20" />
    </div>
  );
}
```

- [ ] **Step 3: Create `src/app/components/chrome/ResumeCorner.jsx`**

```jsx
"use client";
import { HiOutlineDocumentText } from "react-icons/hi";

export default function ResumeCorner() {
  return (
    <a href="/Furqan-Asif-CV.pdf" target="_blank" rel="noopener noreferrer" download
       className="fixed bottom-5 right-6 z-50 hidden items-center gap-2 text-xs font-semibold tracking-widest text-white/60 transition hover:text-white lg:flex">
      RESUME <HiOutlineDocumentText size={16} />
    </a>
  );
}
```

- [ ] **Step 4: Temporarily render** all three in `page.js` (relocated in Task 18). Build + visual gate: screenshot shows FA logo, email, nav, left socials, RESUME corner. `console --errors`: none.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/chrome src/app/page.js
git commit -m "feat: fixed chrome — top bar, side socials, resume corner"
```

---

## Task 10: Hero section

**Files:**
- Create (overwrite): `src/app/components/HeroSection.jsx`

- [ ] **Step 1: Overwrite `src/app/components/HeroSection.jsx`**

```jsx
"use client";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

const name = "Furqan Asif";
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const letter = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } };

export default function HeroSection() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-center px-6 sm:px-10">
      <div className="max-w-3xl">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-primary-400">Hello, I am</motion.p>

        <motion.h1 variants={container} initial="hidden" animate="visible"
          className="text-5xl font-extrabold leading-tight sm:text-7xl lg:text-8xl">
          {name.split("").map((c, i) => (
            <motion.span key={i} variants={letter} className="inline-block text-gradient">
              {c === " " ? " " : c}
            </motion.span>
          ))}
        </motion.h1>

        <div className="mt-5 text-2xl font-semibold text-white/80 sm:text-3xl">
          <TypeAnimation
            sequence={["Computer Scientist", 1600, "AI Engineer", 1600, "Full-Stack Developer", 1600, "Cybersecurity Enthusiast", 1600, "Mobile App Developer", 1600]}
            wrapper="span" speed={45} repeat={Infinity} />
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-6 max-w-xl text-base text-white/60 sm:text-lg">
          I turn complex problems into clean, efficient code — building intelligent systems, secure
          networks, and seamless web & mobile experiences. CS &apos;27 @ UET Lahore.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
          className="mt-8 flex flex-wrap gap-4">
          <a href="#contact" className="rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 px-7 py-3 font-semibold text-white transition hover:opacity-90 glow-violet">Hire Me</a>
          <a href="/Furqan-Asif-CV.pdf" download target="_blank" rel="noopener noreferrer"
             className="rounded-full border border-white/20 px-7 py-3 font-semibold text-white/90 transition hover:bg-white/10">Download CV</a>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-white/40 animate-floaty">Scroll ↓</div>
    </section>
  );
}
```

- [ ] **Step 2: Render in page.js temporarily** (or rely on existing import). Build + visual gate: hero name in gradient, typed roles cycling, buttons, scroll cue, blob to the right. `console --errors`: none.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/HeroSection.jsx
git commit -m "feat: rebuilt hero with gradient name, typed roles, scroll cue"
```

---

## Task 11: About section (rebuilt)

**Files:**
- Create (overwrite): `src/app/components/AboutSection.jsx`

- [ ] **Step 1: Overwrite `src/app/components/AboutSection.jsx`**

```jsx
"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const Hi = ({ children }) => <span className="text-gradient font-semibold">{children}</span>;

export default function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28 sm:px-10">
      <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="mb-12 text-center text-4xl font-extrabold sm:text-5xl">
        About <span className="text-gradient">Me</span>
      </motion.h2>
      <div className="grid items-center gap-12 md:grid-cols-5">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="md:col-span-2">
          <div className="relative mx-auto aspect-square w-64 overflow-hidden rounded-2xl border border-white/10 glow-violet sm:w-72">
            <Image src="/images/hero-image.jpg" alt="Furqan Asif" fill className="object-cover" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="space-y-5 text-lg leading-relaxed text-white/70 md:col-span-3">
          <p>
            I&apos;m a <Hi>Computer Science</Hi> student at UET Lahore, blending academic depth with
            hands-on building. I love applying core CS principles to real-world problems.
          </p>
          <p>
            My focus sits at the convergence of <Hi>Artificial Intelligence</Hi>,{" "}
            <Hi>Cybersecurity</Hi>, <Hi>Full-Stack Development</Hi>, and{" "}
            <Hi>Android / Mobile</Hi> — from intelligent systems to responsive interfaces and native apps.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build + visual gate + commit**

Run: `npm run build` → exit 0. Screenshot shows photo + highlighted paragraph.
```bash
git add src/app/components/AboutSection.jsx
git commit -m "feat: rebuilt about section with highlighted keywords + photo"
```

---

## Task 12: What I Do section

**Files:**
- Create: `src/app/components/WhatIDoSection.jsx`

- [ ] **Step 1: Create `src/app/components/WhatIDoSection.jsx`**

```jsx
"use client";
import { motion } from "framer-motion";
import { whatIDo } from "../data/skills";

export default function WhatIDoSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28 sm:px-10">
      <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="mb-14 text-center text-4xl font-extrabold sm:text-5xl">
        What I <span className="text-gradient">Do</span>
      </motion.h2>
      <div className="grid gap-6 md:grid-cols-3">
        {whatIDo.map((card, i) => (
          <motion.div key={card.title}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="panel group rounded-2xl p-7 transition hover:-translate-y-2 hover:border-primary-400/40">
            <div className="mb-4 h-1 w-10 rounded bg-gradient-to-r from-primary-400 to-secondary-500 transition-all group-hover:w-16" />
            <h3 className="mb-3 text-xl font-bold text-white">{card.title}</h3>
            <p className="mb-5 text-sm leading-relaxed text-white/60">{card.blurb}</p>
            <div className="flex flex-wrap gap-2">
              {card.chips.map((c) => (
                <span key={c} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">{c}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build + visual gate + commit**

Run: `npm run build` → exit 0. Screenshot shows 3 cards.
```bash
git add src/app/components/WhatIDoSection.jsx
git commit -m "feat: what-i-do cards (AI, security, software/mobile)"
```

---

## Task 13: Timeline section

**Files:**
- Create: `src/app/components/TimelineSection.jsx`

- [ ] **Step 1: Create `src/app/components/TimelineSection.jsx`**

A vertical line whose fill height tracks scroll within the section (via Framer `useScroll`).
```jsx
"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { timeline } from "../data/timeline";

export default function TimelineSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const height = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  return (
    <section className="mx-auto max-w-4xl px-6 py-28 sm:px-10">
      <h2 className="mb-16 text-center text-4xl font-extrabold sm:text-5xl">
        My career &amp; <span className="text-gradient">experience</span>
      </h2>
      <div ref={ref} className="relative ml-3 border-l border-white/10 pl-8">
        <motion.span style={{ scaleY: height }}
          className="absolute left-[-1px] top-0 h-full w-[2px] origin-top bg-gradient-to-b from-primary-400 to-secondary-500" />
        {timeline.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative mb-14">
            <span className="absolute -left-[42px] top-1 h-3 w-3 rounded-full bg-primary-400 glow-violet" />
            <span className="text-sm font-bold uppercase tracking-widest text-secondary-400">{t.when}</span>
            <h3 className="mt-1 text-xl font-bold text-white">{t.title}</h3>
            <p className="text-sm text-primary-300">{t.org}</p>
            <p className="mt-2 max-w-xl text-sm text-white/60">{t.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build + visual gate + commit**

Run: `npm run build` → exit 0. Screenshot shows the timeline with glowing nodes.
```bash
git add src/app/components/TimelineSection.jsx
git commit -m "feat: scroll-tracked career timeline"
```

---

## Task 14: Work section — pinned horizontal gallery

**Files:**
- Create: `src/app/components/WorkSection.jsx`

- [ ] **Step 1: Create `src/app/components/WorkSection.jsx`**

Desktop: GSAP ScrollTrigger pins the section and translates the track horizontally. Mobile/reduced-motion: a vertical stacked list (no pinning).
```jsx
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowUpRight } from "react-icons/fi";
import { projects } from "../data/projects";
import { useIsMobile } from "../hooks/useIsMobile";

function Card({ p }) {
  return (
    <a href={p.url} target="_blank" rel="noopener noreferrer"
       className="group panel flex h-[60vh] w-[85vw] shrink-0 flex-col justify-between rounded-3xl p-8 transition hover:border-primary-400/40 md:w-[40vw]">
      <div className="flex items-start justify-between">
        <span className="text-5xl font-extrabold text-white/10">{p.n}</span>
        <FiArrowUpRight className="text-white/40 transition group-hover:text-primary-400" size={26} />
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-secondary-400">{p.category}</p>
        <h3 className="mb-3 text-2xl font-bold text-white">{p.title}</h3>
        <p className="mb-5 text-sm leading-relaxed text-white/60">{p.desc}</p>
        <div className="flex flex-wrap gap-2">
          {p.tools.map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">{t}</span>
          ))}
        </div>
      </div>
    </a>
  );
}

export default function WorkSection() {
  const mobile = useIsMobile();
  const section = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    if (mobile || !section.current || !track.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const distance = track.current.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: -distance, ease: "none",
        scrollTrigger: {
          trigger: section.current, start: "top top",
          end: () => "+=" + distance, scrub: 1, pin: true, invalidateOnRefresh: true,
        },
      });
    }, section);
    return () => ctx.revert();
  }, [mobile]);

  if (mobile) {
    return (
      <section id="work" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-10 text-4xl font-extrabold">My <span className="text-gradient">Work</span></h2>
        <div className="flex flex-col gap-6">{projects.map((p) => <Card key={p.n} p={p} />)}</div>
      </section>
    );
  }

  return (
    <section id="work" ref={section} className="relative h-screen overflow-hidden">
      <div className="absolute left-6 top-10 z-10 sm:left-10">
        <h2 className="text-4xl font-extrabold sm:text-5xl">My <span className="text-gradient">Work</span></h2>
      </div>
      <div ref={track} className="flex h-full items-center gap-8 pl-6 pr-[10vw] pt-24 sm:pl-10">
        {projects.map((p) => <Card key={p.n} p={p} />)}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build + visual gate**

Run: `npm run build` → exit 0. Dev + screenshot at desktop viewport: "My Work" heading + first project cards in a row. Scroll a bit (`"$B" js "window.scrollTo(0, document.querySelector('#work').offsetTop + 800)"`), screenshot again, expect cards translated horizontally. `console --errors`: none.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/WorkSection.jsx
git commit -m "feat: pinned horizontal work gallery with mobile fallback"
```

---

## Task 15: Tech stack grid

**Files:**
- Create: `src/app/components/TechStackSection.jsx`

- [ ] **Step 1: Create `src/app/components/TechStackSection.jsx`**

```jsx
"use client";
import { motion } from "framer-motion";
import { skills } from "../data/skills";

export default function TechStackSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-28 sm:px-10">
      <h2 className="mb-14 text-center text-4xl font-extrabold sm:text-5xl">
        Tech <span className="text-gradient">Stack</span>
      </h2>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
        {skills.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.name}
              initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: (i % 10) * 0.04 }}
              className="panel group flex flex-col items-center gap-2 rounded-xl py-6 transition hover:-translate-y-1 hover:border-primary-400/40">
              <Icon className="text-3xl text-white/70 transition group-hover:text-primary-400 group-hover:drop-shadow-[0_0_10px_rgba(139,92,246,0.7)]" />
              <span className="text-xs text-white/50">{s.name}</span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build + visual gate + commit**

Run: `npm run build` → exit 0. Screenshot shows the icon grid.
```bash
git add src/app/components/TechStackSection.jsx
git commit -m "feat: glowing tech-stack icon grid"
```

---

## Task 16: Contact section (restyle, keep API)

**Files:**
- Create (overwrite): `src/app/components/EmailSection.jsx`

- [ ] **Step 1: Overwrite `src/app/components/EmailSection.jsx`** (keeps the `/api/send` POST contract)

```jsx
"use client";
import { useState } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

export default function EmailSection() {
  const [sent, setSent] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email: e.target.email.value, subject: e.target.subject.value, message: e.target.message.value };
    const res = await fetch("/api/send", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    if (res.status === 200) setSent(true);
  };

  return (
    <section id="contact" className="mx-auto grid max-w-6xl gap-12 px-6 py-28 sm:px-10 md:grid-cols-2">
      <div>
        <h2 className="mb-4 text-4xl font-extrabold sm:text-5xl">Let&apos;s <span className="text-gradient">Connect</span></h2>
        <p className="mb-8 max-w-md text-white/60">
          I&apos;m open to new opportunities and collaborations. Whether it&apos;s a question or just a hello, my inbox is always open.
        </p>
        <div className="space-y-4 text-white/80">
          <a href="tel:+923244372754" className="flex items-center gap-3 hover:text-primary-400"><HiOutlinePhone className="text-primary-400" size={20} />+92 324 4372754</a>
          <a href="mailto:Furqan4243@gmail.com" className="flex items-center gap-3 hover:text-primary-400"><HiOutlineMail className="text-primary-400" size={20} />Furqan4243@gmail.com</a>
          <span className="flex items-center gap-3"><HiOutlineLocationMarker className="text-primary-400" size={20} />Lahore, Pakistan</span>
        </div>
        <div className="mt-6 flex gap-4">
          <a href="https://github.com/Furqan-10" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary-400"><FaGithub size={22} /></a>
          <a href="https://www.linkedin.com/in/furqan-asif-9438252a6" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary-400"><FaLinkedinIn size={22} /></a>
        </div>
      </div>
      <div>
        {sent ? (
          <p className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-400">Message sent successfully!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input name="email" type="email" required placeholder="your@email.com"
              className="rounded-lg border border-white/10 bg-white/5 p-3 text-white placeholder-white/40 outline-none focus:border-primary-400" />
            <input name="subject" type="text" required placeholder="Subject"
              className="rounded-lg border border-white/10 bg-white/5 p-3 text-white placeholder-white/40 outline-none focus:border-primary-400" />
            <textarea name="message" rows={5} required placeholder="Let's talk about..."
              className="rounded-lg border border-white/10 bg-white/5 p-3 text-white placeholder-white/40 outline-none focus:border-primary-400" />
            <button type="submit" className="rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 py-3 font-semibold text-white transition hover:opacity-90 glow-violet">Send Message</button>
          </form>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build + visual gate + commit**

Run: `npm run build` → exit 0. Screenshot shows restyled contact + form.
```bash
git add src/app/components/EmailSection.jsx
git commit -m "feat: restyled contact section, same /api/send contract"
```

---

## Task 17: Footer (restyle)

**Files:**
- Create (overwrite): `src/app/components/Footer.jsx`

- [ ] **Step 1: Overwrite `src/app/components/Footer.jsx`**

```jsx
export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 text-center text-sm text-white/40">
      <p>Designed &amp; built by <span className="text-gradient font-semibold">Furqan Asif</span> · {new Date().getFullYear()}</p>
    </footer>
  );
}
```

- [ ] **Step 2: Build gate + commit**

Run: `npm run build` → exit 0.
```bash
git add src/app/components/Footer.jsx
git commit -m "style: restyle footer"
```

---

## Task 18: Compose page + remove old components

**Files:**
- Create (overwrite): `src/app/page.js`
- Delete: `src/app/components/Navbar.jsx`, `MenuOverlay.jsx`, `NavLink.jsx`, `TabButton.jsx`, `ProjectCard.jsx`, `ProjectTag.jsx`, `ThemeSwitcher.jsx`

- [ ] **Step 1: Overwrite `src/app/page.js`**

```jsx
import Loader from "./components/Loader";
import TopBar from "./components/chrome/TopBar";
import SideSocials from "./components/chrome/SideSocials";
import ResumeCorner from "./components/chrome/ResumeCorner";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import WhatIDoSection from "./components/WhatIDoSection";
import TimelineSection from "./components/TimelineSection";
import WorkSection from "./components/WorkSection";
import TechStackSection from "./components/TechStackSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Loader />
      <TopBar />
      <SideSocials />
      <ResumeCorner />
      <HeroSection />
      <AboutSection />
      <WhatIDoSection />
      <TimelineSection />
      <WorkSection />
      <TechStackSection />
      <EmailSection />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Delete obsolete components**

```bash
git rm src/app/components/Navbar.jsx src/app/components/MenuOverlay.jsx src/app/components/NavLink.jsx src/app/components/TabButton.jsx src/app/components/ProjectCard.jsx src/app/components/ProjectTag.jsx src/app/components/ThemeSwitcher.jsx
```
If any of these were already deleted/renamed, skip the missing ones.

- [ ] **Step 3: Grep for stale imports**

Run: `grep -rn "Navbar\|MenuOverlay\|ProjectCard\|ProjectTag\|TabButton\|ThemeSwitcher\|NavLink" src/`
Expected: no remaining import references. Fix any that appear.

- [ ] **Step 4: Full build + visual gate**

Run: `npm run build` → exit 0.
Dev + full scroll screenshots (top, mid, work, bottom). Confirm: loader → hero+blob → about → what-i-do → timeline → pinned work → tech grid → contact → footer. `console --errors`: none.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.js src/app/components
git commit -m "feat: compose full redesigned page, remove obsolete components"
```

---

## Task 19: Final QA pass — mobile, reduced-motion, polish

**Files:**
- Modify: any component needing a fix found during QA.

- [ ] **Step 1: Desktop QA**

Dev server. With browse at 1440x900: scroll top→bottom in steps; screenshot each section; confirm blob drifts/shrinks with scroll, timeline fill animates, work pins + scrolls horizontally, no overlap with fixed chrome. `console --errors`: none.

- [ ] **Step 2: Mobile QA**

`"$B" viewport 390x844` then reload `http://localhost:3000`; screenshot top→bottom. Confirm: static gradient (no WebGL), no horizontal overflow, work gallery is a vertical list, chrome collapses to the hamburger, tap targets reachable. `console --errors`: none.

- [ ] **Step 3: Reduced-motion QA**

In `useIsMobile`/providers this is already handled (loader auto-completes, Lenis disabled, canvas off). Verify by emulating: `"$B" js "matchMedia('(prefers-reduced-motion: reduce)')"` is informational; manually confirm the loader doesn't block and the page is usable. Fix anything that traps the user.

- [ ] **Step 4: Production build sanity**

Run: `npm run build` → exit 0. Then `npm run start` and screenshot `http://localhost:3000` once to confirm the prod bundle renders. `console --errors`: none.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "fix: final QA polish — mobile, reduced-motion, layout"
```

---

## Self-review notes (author)

- **Spec coverage:** loader (T8), fixed chrome (T9), hero shader+blob (T5/T6/T10), about (T11), what-i-do (T12), timeline (T13), pinned work (T14), tech grid (T15), contact w/ kept API (T16), footer (T17), palette (T2), data from GitHub (T3), mobile/reduced-motion fallbacks (T4/T5/T14/T19). All spec sections mapped.
- **Known follow-ups for the implementer:** (1) `Furqan-Asif-CV.pdf` must exist in `public/` for the CV link — if missing, leave the link (404) or remove until provided; flag to user. (2) `react-icons` `Si*` names occasionally change between versions — if one fails to build, substitute the nearest icon (noted in T3). (3) Stadium/Store/Solitaire projects intentionally omitted per spec.
- **Type/name consistency:** `scrollStore.{progress,velocity,mouseX,mouseY}` defined in T4, consumed identically in T5/T6. `window.__lenis` set in T4, used in T9. `projects`/`skills`/`whatIDo`/`timeline` exports in T3 match imports in T10–T16.
