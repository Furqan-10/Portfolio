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
