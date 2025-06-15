// AboutSection.jsx

"use client";
import React, { useTransition, useState } from "react";
import TabButton from "./TabButton";

// --- FIX: DEFINE DATA CONSTANTS OUTSIDE THE COMPONENT ---
// This makes them accessible to the TAB_DATA array below.

const EDUCATION_DATA = {
  Uni: "University Of Engineering & Technology (UET), Lahore",
  degree: "B.S. in Computer Science",
  college: "PGC, Lahore",
  School: "Laurelbank Public School",
};

const SKILLS_DATA = [
  "React", "Next.js", "JavaScript", "C++",
  "Node.js", "Python", "C#", "HTML",
  "Databases", "Tailwind CSS", "Git & GitHub", "Web Security",
  "Machine Learning", "Deep learning", "Network Security"
];

const TAB_DATA = [
  {
    title: "Skills",
    id: "skills",
    content: (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {SKILLS_DATA.map((skill, index) => (
          <div key={index} className="bg-slate-200 dark:bg-[#1e1e24] p-2 rounded text-center text-sm text-slate-700 dark:text-[#ADB7BE]">{skill}</div>
        ))}
      </div>
    ),
  },
  {
    title: "Education",
    id: "education",
    content: (
      <ul className="list-disc pl-2 space-y-2">
        <li>
          <h3 className="font-bold">Bachelor of Science in Computer Science (Current)</h3>
          <p className="text-sm text-slate-600 dark:text-[#ADB7BE]">{EDUCATION_DATA.Uni}</p>
        </li>
        <li>
          <h3 className="font-bold">Higher Secondary School Certificate (Pre-Engineering)</h3>
          <p className="text-sm text-slate-600 dark:text-[#ADB7BE]">{EDUCATION_DATA.college}</p>
        </li>
        <li>
          <h3 className="font-bold">Matriculation (Science Group)</h3>
          <p className="text-sm text-slate-600 dark:text-[#ADB7BE]">{EDUCATION_DATA.School}</p>
        </li>
      </ul>
    ),
  },
];
// --- END OF FIX ---


const AboutSection = () => {
  const [tab, setTab] = useState("skills");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };

  return (
    <section className="text-slate-800 dark:text-white" id="about">
      <div className="md:grid md:grid-cols-2 gap-8 items-start py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
        <div className="mt-4 md:mt-0 text-left flex flex-col h-full">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">About Me</h2>
          <div className="text-base lg:text-lg space-y-4">
            <p>
              I’m a Computer Science student at the University of Engineering and Technology (UET) Lahore, with a deep interest in creating impactful, future-ready technology. My journey so far has blended academic learning with hands-on experimentation — allowing me to apply core computer science principles to real-world problems.
            </p>
            <p>
              I’m especially passionate about the convergence of Artificial Intelligence, Cybersecurity, Software Development, and Frontend Engineering. From developing intelligent systems to designing smooth, responsive user interfaces, I enjoy working across the stack to bring ideas to life in meaningful ways.
            </p>
          </div>
        </div>
        
        <div className="mt-8 md:mt-0">
          <div className="flex flex-row justify-start">
            <TabButton selectTab={() => handleTabChange("skills")} active={tab === "skills"}>Skills</TabButton>
            <TabButton selectTab={() => handleTabChange("education")} active={tab === "education"}>Education</TabButton>
          </div>
          <div className="mt-8 p-6 bg-slate-100 dark:bg-[#18191E] rounded-lg min-h-[200px]">
            {TAB_DATA.find((t) => t.id === tab)?.content}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;