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
