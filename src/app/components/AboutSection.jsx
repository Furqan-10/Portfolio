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
            <Image src="/images/hero-image.jpeg" alt="Furqan Asif" fill sizes="(max-width: 768px) 16rem, 18rem" className="object-cover" />
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
