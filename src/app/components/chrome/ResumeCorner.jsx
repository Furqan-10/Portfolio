"use client";
import { HiOutlineDocumentText } from "react-icons/hi";

export default function ResumeCorner() {
  return (
    <a href="/Furqan-Asif-CV.pdf" target="_blank" rel="noopener noreferrer" download
       className="fixed bottom-5 right-6 z-50 hidden items-center gap-2 text-xs font-semibold tracking-widest text-white/60 transition hover:text-white lg:flex">
      RESUME <HiOutlineDocumentText size={16} />
    </a>
  );
}
