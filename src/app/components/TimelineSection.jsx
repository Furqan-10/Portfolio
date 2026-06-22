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
