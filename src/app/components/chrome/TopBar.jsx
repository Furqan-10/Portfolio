"use client";
import { useState } from "react";

const LINKS = [
  { label: "ABOUT", target: "#about" },
  { label: "WORK", target: "#work" },
  { label: "CONTACT", target: "#contact" },
];

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const go = (sel) => (e) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(sel);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -20 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="#top" onClick={go("#top")} className="text-lg font-extrabold tracking-tight glow-text">FA</a>
        <a href="mailto:Furqan4243@gmail.com" className="hidden text-sm text-white/70 hover:text-white sm:block">Furqan4243@gmail.com</a>
        <nav className="hidden gap-8 text-sm font-semibold md:flex">
          {LINKS.map((l) => (
            <a key={l.label} href={l.target} onClick={go(l.target)} className="text-white/70 transition hover:text-white">{l.label}</a>
          ))}
        </nav>
        <button className="md:hidden" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          <span className="block h-0.5 w-6 bg-white" /><span className="mt-1.5 block h-0.5 w-6 bg-white" />
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-4 bg-black/90 px-6 py-4 text-sm font-semibold backdrop-blur md:hidden">
          {LINKS.map((l) => (<a key={l.label} href={l.target} onClick={go(l.target)} className="text-white/80">{l.label}</a>))}
        </div>
      )}
    </header>
  );
}
