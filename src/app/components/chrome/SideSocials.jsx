"use client";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

const SOCIALS = [
  { Icon: FaGithub, url: "https://github.com/Furqan-10" },
  { Icon: FaLinkedinIn, url: "https://www.linkedin.com/in/furqan-asif-9438252a6" },
];

export default function SideSocials() {
  return (
    <div className="fixed left-5 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-5 lg:flex">
      {SOCIALS.map(({ Icon, url }, i) => (
        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
           className="text-white/50 transition hover:scale-125 hover:text-primary-400">
          <Icon size={18} />
        </a>
      ))}
      <span className="mt-2 h-16 w-px bg-white/20" />
    </div>
  );
}
