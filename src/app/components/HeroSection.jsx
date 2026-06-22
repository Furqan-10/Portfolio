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
          networks, and seamless web &amp; mobile experiences. CS &apos;27 @ UET Lahore.
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
