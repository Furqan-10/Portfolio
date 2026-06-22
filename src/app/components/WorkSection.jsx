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
