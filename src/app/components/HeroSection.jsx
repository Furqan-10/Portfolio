// HeroSection.jsx
"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection = () => {
  const name = "Furqan Asif";

  // Framer Motion variants for the name animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Time delay between each letter
      },
    },
  };

  // Framer Motion variants for each letter
  const letterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <section className="lg:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-8 place-self-center text-center sm:text-left justify-self-start"
        >
          <h1 className="text-white mb-4 text-4xl sm:text-5xl lg:text-8xl lg:leading-normal font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600">
              Hello, I'm{" "}
            </span>
            <br />
            {/* Animated Name */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              aria-label={name}
              className="inline-block"
            >
              {name.split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block" // Required for transform animations
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.div>
          </h1>
<p className="text-slate-600 dark:text-[#ADB7BE] text-base sm:text-lg mb-6 lg:text-xl">
  I’m a Computer Scientist and Developer passionate about turning complex problems into clean, efficient code.
  Whether it's building intelligent systems or crafting seamless user experiences — I’m driven by impact, performance, and innovation.
</p>
          <div>
            <Link
              href="/#contact"
              className="px-6 inline-block py-3 w-full sm:w-fit rounded-full mr-4 bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-200 text-white"
            >
              Hire Me
            </Link>
            <Link
              href="/"
              className="px-1 inline-block py-1 w-full sm:w-fit rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-800 text-white mt-3"
            >
              <span className="block bg-[#121212] hover:bg-slate-800 rounded-full px-5 py-2">
                Download CV
              </span>
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-4 place-self-center mt-4 lg:mt-0"
        >
          {/* Animated Gradient Border Container (Now thicker due to CSS change) */}
          <div className="rounded-full animated-gradient-border w-[250px] h-[250px] lg:w-[400px] lg:h-[400px]">
            {/* THIS IS THE UPDATED LINE. We added a border to this div. */}
            <div className="w-full h-full bg-[#181818] rounded-full relative overflow-hidden border-2 border-[#27272A]">
                <Image
                  src="/images/hero-image.jpg"
                  alt="hero image"
                  className="object-cover"
                  fill={true}
                />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;