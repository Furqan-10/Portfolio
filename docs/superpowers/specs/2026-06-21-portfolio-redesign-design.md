# Portfolio Redesign — Design Spec

**Date:** 2026-06-21
**Owner:** Furqan Asif (`Furqan-10`)
**Repo:** https://github.com/Furqan-10/Portfolio
**Live:** https://furqan-asif.vercel.app/
**Inspiration:** https://red1-for-hek.vercel.app/

## Goal

Transform the current standard Next.js portfolio into a dark, violet/magenta, scroll-driven
cinematic experience inspired by red1-for-hek — with a WebGL shader hero, an interactive 3D
object, smooth scroll, sticky/pinned scroll sections, and rich interactive animations. Keep
Furqan's real content and add new sections (career timeline, "What I Do" cards, tech-stack grid,
horizontal work gallery), with project data sourced from the actual GitHub profile.

## Approved decisions

- **Scope:** Full redesign in the inspiration's style.
- **Hero centerpiece:** Animated WebGL shader background **+** a lightweight interactive 3D object
  (a distorted noise blob/sphere reacting to the cursor). No human character model.
- **Content:** Keep Furqan's real content; add inspiration-style sections. Project/skill data
  reconciled against the live GitHub profile.
- **Tech budget:** Premium — `@react-three/fiber` + `@react-three/drei`, `gsap` + ScrollTrigger,
  `lenis` smooth scroll, keep `framer-motion`. With mobile / reduced-motion fallbacks.
- **Architecture:** **A — one persistent fixed `<Canvas>` behind the whole page.** Shader
  background + cursor-reactive blob; color/position/morph driven by scroll progress so the scene
  feels continuous as sections scroll over it. Single WebGL context for performance.

## Visual system

- **Base:** near-black `#0a0a0a` (with `#121212` panels).
- **Accents:** violet `#8b5cf6` (primary) + magenta/pink `#ec4899` (secondary), used as the glow
  and gradient pair. Loader screen uses a light lavender `#e9e6ee` background that flips to dark.
- **Tailwind change:** in `tailwind.config.js`, set `primary: colors.violet` and
  `secondary: colors.pink` (replaces `blue`/`red`). All existing `primary-*`/`secondary-*`
  utility usages keep working, just recolored.
- **Typography:** keep Inter; large bold headings; key words wrapped in a violet→pink gradient
  text class. Add a display weight for hero (e.g. Inter tight / extra-bold).
- **Motion language:** word-by-word reveals, magnetic + glow hovers, glowing timeline node,
  pinned horizontal scroll, blob morph on scroll, parallax glows.

## Tech / dependencies to add

- `three`, `@react-three/fiber`, `@react-three/drei` — canvas, shader material, blob geometry.
- `gsap` (+ `ScrollTrigger`) — scroll-linked animation and section pinning.
- `lenis` (`@studio-freight/lenis` or `lenis`) — smooth scroll, feeds scroll progress to GSAP/R3F.
- keep `framer-motion` — component-level reveals.
- The `<Canvas>` and its shader code are **dynamically imported with `ssr: false`** so SSR/build
  is unaffected and the WebGL bundle is split out.

## Architecture / component map

```
src/app/
  layout.js                 # fonts, metadata, <SmoothScrollProvider>, <BackgroundCanvas>
  page.js                   # section composition order
  providers.js              # existing (theme) — kept
  components/
    background/
      BackgroundCanvas.jsx  # fixed R3F <Canvas>, ssr:false dynamic import wrapper
      ShaderBackground.jsx  # full-screen shader plane (gradient/noise aurora)
      Blob.jsx              # distortion sphere; cursor + scroll uniforms
      shaders/              # .glsl or inline GLSL strings (vertex/fragment)
    scroll/
      SmoothScrollProvider.jsx  # Lenis init + raf loop; exposes scroll progress
      useScrollProgress.js      # hook bridging Lenis -> R3F/GSAP
    Loader.jsx              # intro: role marquee + LOADING % pill + "Welcome" reveal
    chrome/
      SideSocials.jsx       # fixed left vertical socials
      TopBar.jsx            # logo FA + email + nav (ABOUT/WORK/CONTACT)
      ResumeCorner.jsx      # fixed bottom-right RESUME link (CV)
    HeroSection.jsx         # name + typed roles over canvas, scroll cue
    AboutSection.jsx        # rebuilt: highlighted-keyword paragraph + photo
    WhatIDoSection.jsx      # 3 cards
    TimelineSection.jsx     # glowing vertical career/education timeline
    WorkSection.jsx         # pinned horizontal-scroll project gallery
    TechStackSection.jsx    # glowing icon grid
    EmailSection.jsx        # restyled; keeps existing /api/send form
    Footer.jsx              # restyled
  data/
    projects.js            # project gallery data (from GitHub)
    skills.js              # tech-stack data + icons
    timeline.js           # journey/education entries
  api/send/route.js        # unchanged
```

Existing small components (`Navbar`, `MenuOverlay`, `NavLink`, `TabButton`, `ProjectCard`,
`ProjectTag`, `ThemeSwitcher`) are replaced/absorbed by the new chrome + sections. The contact
API route is untouched.

## Page flow (top → bottom)

1. **Intro loader** — full-screen; horizontal marquee of roles
   ("Computer Scientist • Developer • AI Engineer • Cybersecurity • Mobile Dev"); a "LOADING %"
   pill that fills 0→100; "Welcome" reveal; fade to hero. Shows once per load.
2. **Fixed chrome** — `FA` logo top-left, email center-top, nav (ABOUT / WORK / CONTACT) top-right,
   vertical socials (GitHub, LinkedIn) on left edge, "RESUME" (CV) bottom-right. Links smooth-scroll.
3. **Hero** — `Furqan Asif` + typed/cycling roles over the shader; cursor-reactive blob; scroll cue.
4. **About** — rebuilt paragraph with gradient-highlighted keywords (AI, Cybersecurity, Full-Stack,
   Mobile), real bio from current site; the existing hero photo relocates here.
5. **What I Do** — 3 cards (see below).
6. **Career & Journey** — glowing vertical timeline (see below).
7. **My Work** — pinned horizontal-scroll gallery of projects (01..N) with title, category, tools,
   GitHub link (see project list below).
8. **Tech Stack** — glowing grid of skills as icons (see list below).
9. **Contact** — real phone/email/location + socials + working form (`/api/send` kept).
10. **Footer.**

## Content

### Identity
- Name: **Furqan Asif** · handle `Furqan-10` · **CS '27**, UET Lahore.
- Roles (loader marquee + hero cycle): Computer Scientist, Developer, AI Engineer,
  Cybersecurity Enthusiast, Mobile App Developer.

### About (kept, lightly edited from current site)
- CS student at UET Lahore; blends academic learning with hands-on building.
- Passionate about the convergence of **AI**, **Cybersecurity**, **Software/Full-Stack
  Development**, **Frontend Engineering**, and now **Android/Mobile (Kotlin)**.

### What I Do (3 cards)
1. **AI & Machine Learning** — intelligent systems, computer vision, deep learning.
   Chips: Python, TensorFlow/PyTorch, OpenCV, CNNs, Transfer Learning, Hugging Face.
2. **Cybersecurity & Networks** — secure systems and low-level networking.
   Chips: Web Security, Network Security, Python, Sockets/DNS, C/C++.
3. **Software, Web & Mobile** — full-stack web and Android apps.
   Chips: React, Next.js, Node.js, C#, Kotlin/Android, Tailwind CSS, SQL.

### Career & Journey timeline
- **NOW** — Building AI, security, and mobile projects; CS '27 at UET.
- **2023–present** — B.S. Computer Science, UET Lahore (current).
- **HSSC (Pre-Engineering)** — PGC, Lahore.
- **Matriculation (Science)** — Laurelbank Public School.
- (Optional project milestones can be folded in; default is the four above.)

### My Work (project gallery — reconciled with live GitHub repos)
Confirmed live on the GitHub profile unless noted. Order = strongest first.

| # | Title | Category | Tools | Repo |
|---|-------|----------|-------|------|
| 01 | AFC — Food Ordering App | Mobile / Android | Kotlin, Android SDK, XML UI | Furqan-10/AFC-MAD |
| 02 | AI-Based Fire Detection System | AI / IoT | C++, ESP32, Arduino, ML, Hugging Face | Furqan-10/AI-Based-Fire-Detection-System |
| 03 | AI Face Mask Detection | AI / CV | Python, MobileNetV2, OpenCV, CNN | Furqan-10/AI-Face-Mask-Detection |
| 04 | Custom DNS Server | Networking / Security | Python, dnslib, Sockets, UDP | Furqan-10/CustomDNS |
| 05 | Contacts App | Mobile / Android | Kotlin, Android SDK | Furqan-10/Contacts-MAD-88 |
| 06 | OS Project | Systems | Python, OS concepts | Furqan-10/OS-project |
| 07 | KarweDB — Custom NoSQL DB | Database / Software | C#, NoSQL, JSON storage, query engine | Ahmad-17R/DBMS (collab) |
| 08 | UET Campus Navigation | Software | C#, WinForms, data structures | Hannanm10/UET-Navigation-System (collab) |
| 09 | Portfolio Website | Web | Next.js, Tailwind, Framer, R3F | Furqan-10/Portfolio |

**Open item:** current site also lists `Stadium-Management-System-1`, `Store-Management-System`,
`Solitare-Game` under `Furqan-10`, but they're not in the current public repo list — links may be
dead. Default plan: **omit** them unless Furqan confirms/restores them.

### Tech Stack (icon grid)
Languages: Python, JavaScript, C++, C#, C, Kotlin, HTML, CSS.
Frameworks/libs: React, Next.js, Node.js, Tailwind CSS, TensorFlow, PyTorch, OpenCV.
Data/DB: SQL/Databases, NoSQL.
Domains/tools: Machine Learning, Deep Learning, Web Security, Network Security, Git & GitHub,
Android SDK, Vercel.
(Icons via `react-icons` / `simple-icons`; any without a brand icon render as a labeled chip.)

### Contact (kept)
- Phone: +92 324 4372754 · Email: Furqan4243@gmail.com · Location: Lahore, Pakistan.
- Socials: GitHub `Furqan-10`, LinkedIn `furqan-asif-9438252a6`.
- Working contact form posts to existing `/api/send`.

## Interactions

- **Smooth scroll** (Lenis) drives a global scroll-progress value.
- **Background blob:** GLSL vertex displacement (simplex/curl noise) animated over time; `uMouse`
  uniform pulls/distorts toward cursor; `uScroll` uniform shifts color (violet→magenta) and
  morph amount per section.
- **Shader background:** full-screen plane, flowing gradient/aurora noise, subtle parallax.
- **Hero:** typed/cycling roles; name reveals word-by-word; scroll cue bobs.
- **Work gallery:** GSAP ScrollTrigger pins the section and translates cards horizontally with
  vertical scroll; progress bar; card hover lifts + glows.
- **Timeline:** glowing node travels down the line as the section scrolls; entries fade/slide in.
- **Tech grid:** staggered reveal; icon hover = glow + scale; subtle magnetic pull.
- **Buttons / nav:** magnetic hover + gradient glow.

## Performance, mobile & accessibility

- Canvas dynamically imported `ssr:false`; `dpr` clamped (e.g. `[1, 1.75]`); frameloop throttled.
- **Mobile (< md) or `prefers-reduced-motion`:** disable the 3D canvas and ScrollTrigger pinning;
  show a static CSS gradient backdrop and simple Framer fades; Work gallery becomes a vertical /
  swipeable list; loader shortens or is skipped on reduced-motion.
- Respect keyboard nav and focus states on all interactive chrome.
- Lazy-load project/section content below the fold.

## Out of scope (YAGNI)

- No human 3D character model or rigged animations.
- No CMS/backend changes beyond keeping the existing contact route.
- No blog, i18n, or light-theme redesign (site is dark-first; theme switch may be dropped).
- No new contact fields or analytics.

## Success criteria

- Loads to an intro loader, then a dark hero with a live shader + cursor-reactive blob.
- Smooth scroll throughout; Work section pins and scrolls horizontally on desktop.
- All sections present with Furqan's real, GitHub-accurate content.
- Contact form still sends via `/api/send`.
- Mobile and reduced-motion users get a clean, fast, non-3D fallback.
- `npm run build` succeeds; no console errors on load.
