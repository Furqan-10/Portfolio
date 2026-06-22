"use client";
import { useState } from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

export default function EmailSection() {
  const [sent, setSent] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email: e.target.email.value, subject: e.target.subject.value, message: e.target.message.value };
    const res = await fetch("/api/send", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
    });
    if (res.status === 200) setSent(true);
  };

  return (
    <section id="contact" className="mx-auto grid max-w-6xl gap-12 px-6 py-28 sm:px-10 md:grid-cols-2">
      <div>
        <h2 className="mb-4 text-4xl font-extrabold sm:text-5xl">Let&apos;s <span className="text-gradient">Connect</span></h2>
        <p className="mb-8 max-w-md text-white/60">
          I&apos;m open to new opportunities and collaborations. Whether it&apos;s a question or just a hello, my inbox is always open.
        </p>
        <div className="space-y-4 text-white/80">
          <a href="tel:+923244372754" className="flex items-center gap-3 hover:text-primary-400"><HiOutlinePhone className="text-primary-400" size={20} />+92 324 4372754</a>
          <a href="mailto:Furqan4243@gmail.com" className="flex items-center gap-3 hover:text-primary-400"><HiOutlineMail className="text-primary-400" size={20} />Furqan4243@gmail.com</a>
          <span className="flex items-center gap-3"><HiOutlineLocationMarker className="text-primary-400" size={20} />Lahore, Pakistan</span>
        </div>
        <div className="mt-6 flex gap-4">
          <a href="https://github.com/Furqan-10" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary-400"><FaGithub size={22} /></a>
          <a href="https://www.linkedin.com/in/furqan-asif-9438252a6" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary-400"><FaLinkedinIn size={22} /></a>
        </div>
      </div>
      <div>
        {sent ? (
          <p className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-400">Message sent successfully!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input name="email" type="email" required placeholder="your@email.com"
              className="rounded-lg border border-white/10 bg-white/5 p-3 text-white placeholder-white/40 outline-none focus:border-primary-400" />
            <input name="subject" type="text" required placeholder="Subject"
              className="rounded-lg border border-white/10 bg-white/5 p-3 text-white placeholder-white/40 outline-none focus:border-primary-400" />
            <textarea name="message" rows={5} required placeholder="Let's talk about..."
              className="rounded-lg border border-white/10 bg-white/5 p-3 text-white placeholder-white/40 outline-none focus:border-primary-400" />
            <button type="submit" className="rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 py-3 font-semibold text-white transition hover:opacity-90 glow-violet">Send Message</button>
          </form>
        )}
      </div>
    </section>
  );
}
