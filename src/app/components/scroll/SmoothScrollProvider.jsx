"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollStore } from "./scrollStore";

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // native scroll for reduced-motion users

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.__lenis = lenis;

    // Keep ScrollTrigger in sync with Lenis, and update scroll progress store.
    lenis.on("scroll", () => {
      ScrollTrigger.update();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollStore.progress = max > 0 ? window.scrollY / max : 0;
      scrollStore.heroProgress = Math.min(1, window.scrollY / window.innerHeight);
      scrollStore.velocity = lenis.velocity || 0;
    });

    // Drive Lenis from GSAP's ticker (single rAF source).
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return children;
}
