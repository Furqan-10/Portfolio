"use client";
import { useRef } from "react";

// Chunky extruded project label that floats constantly and tilts toward
// the pointer / touch. Pure CSS 3D — no extra WebGL context per card.
export default function Project3DText({ text }) {
  const wrap = useRef(null);
  const tilt = useRef(null);

  const onMove = (e) => {
    if (!wrap.current || !tilt.current) return;
    const r = wrap.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;  // -0.5..0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    tilt.current.style.transform = `rotateY(${px * 32}deg) rotateX(${-py * 28}deg) scale(1.06)`;
  };

  const reset = () => {
    if (tilt.current) tilt.current.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
  };

  const words = String(text).split(" ");

  return (
    <div
      ref={wrap}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className="absolute inset-0 flex items-center justify-center [perspective:700px]"
    >
      <div
        ref={tilt}
        className="transition-transform duration-300 ease-out [transform-style:preserve-3d]"
      >
        <div className="text-3d text-3d-float select-none text-center font-extrabold uppercase leading-[0.92] tracking-tight [transform-style:preserve-3d]">
          {words.map((w, i) => (
            <div key={i} className="text-3xl sm:text-4xl md:text-5xl">{w}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
