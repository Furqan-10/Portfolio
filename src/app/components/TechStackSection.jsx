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
