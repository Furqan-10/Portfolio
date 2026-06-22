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
