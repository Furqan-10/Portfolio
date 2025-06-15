
"use client";
import React from "react";
import { ComputerDesktopIcon, ServerStackIcon, CloudIcon } from "@heroicons/react/24/solid";

const expertiseData = [
  {
    icon: <ComputerDesktopIcon className="h-12 w-12 text-white mb-4" />,
    title: "Frontend Development",
    description: "Creating responsive and dynamic user interfaces with modern frameworks like React and Next.js, ensuring a seamless user experience across all devices.",
  },
  {
    icon: <ServerStackIcon className="h-12 w-12 text-white mb-4" />,
    title: "Backend Development",
    description: "Building robust and scalable server-side applications using Node.js and Express, with expertise in designing RESTful APIs and managing databases like PostgreSQL.",
  },
  {
    icon: <CloudIcon className="h-12 w-12 text-white mb-4" />,
    title: "Cloud & DevOps",
    description: "Proficient in deploying and managing applications on cloud platforms like AWS. Familiar with CI/CD pipelines, containerization, and cloud infrastructure best practices.",
  },
];

const ExpertiseSection = () => {
  return (
    <section id="expertise" className="py-12">
      <h2 className="text-center text-4xl font-bold text-white mt-4 mb-8 md:mb-12">
        My Expertise
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 xl:px-16">
        {expertiseData.map((item, index) => (
          <div
            key={index}
            className="bg-[#18191E] p-8 rounded-xl border border-[#33353F] flex flex-col items-center text-center"
          >
            {item.icon}
            <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-[#ADB7BE] text-base">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExpertiseSection;