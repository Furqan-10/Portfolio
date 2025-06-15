// ProjectsSection.jsx

"use client";
import React, { useState, useRef } from "react";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";
import { motion, useInView } from "framer-motion";

const projectsData = [
  {
    id: 1,
    title: "React Portfolio Website",
    description: "A responsive and animated personal portfolio built with Next.js, Tailwind CSS, and Framer Motion.",
    tools: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
    tag: ["All", "Web"],
    gitUrl: "https://github.com/Furqan-10/Portfolio",
  },
  {
    id: 2,
    title: "Custom DNS Server",
    description: "A Python-based DNS server using dnslib, socket, and UDPServer to block specified domains by returning fake IP responses.",
    tools: ["Python", "dnslib", "Socket", "UDPserver"],
    tag: ["All", "Web","Networking"],
    gitUrl: "https://github.com/Furqan-10/CustomDNS",
  },
  {
    id: 3,
    title: "AI-Based Face Mask Detection",
    description: "A real-time face mask recognition system using a fine-tuned MobileNetV2 model and OpenCV Haar Cascade, achieving 99.19% accuracy.",
    tools: ["Python", "MobileNetV2", "OpenCV","CNN","Haar Cascade","Transfer Learning"],
    tag: ["All", "AI"],
    gitUrl: "https://github.com/Furqan-10/AI-Face-Mask-Detection",
  },
  {
    id: 4,
    title: "KarweDB – Custom NoSQL Database",
    description: "A non-relational DBMS storing data in JSON-like documents with SQL-style querying, blending schemaless flexibility with relational syntax.",
    tools: ["C#", "NoSQL", "Custom DBMS", "Json Storage", "SQL-Style Quering Engine"],
    tag: ["All", "Database","Software"],
    gitUrl: "https://github.com/Ahmad-17R/DBMS",
  },
  {
    id: 5,
    title: "UET Campus Navigation System",
    description: "A Windows Forms application that provides interactive, map-based navigation across the university campus using real map visuals.",
    tools: ["C#", "Winforms", "Campus Navigation", "Data Structures", "Map UI"],
    tag: ["All", "Software"],
    gitUrl: "https://github.com/Hannanm10/UET-Navigation-System",
  },
  {
    id: 6,
    title: "Stadium Management System",
    description: "A relational database project in SSMS to manage stadium operations, including seating, bookings, scheduling, and staff records.",
    tools: ["SQL Server", "SSMS", "C#", "Winforms"],
    tag: ["All", "Software","Database"],
    gitUrl: "https://github.com/Furqan-10/Stadium-Management-System-1",
  },
  {
    id: 7,
    title: "Store Management System",
    description: "A multi-layered C# application with a Project Library, a WinForms frontend, and a Console App for CRUD operations on products.",
    tools: ["C#", "Winforms", "Console App", "SQL"],
    tag: ["All", "Software"],
    gitUrl: "https://github.com/Furqan-10/Store-Management-System",
  },
  {
    id: 8,
    title: "Solitaire Game (Data Structures)",
    description: "A CLI-based Solitaire game developed in C# using custom implementations of stacks, queues, and linked lists to manage gameplay logic.",
    tools: ["C#", "Data Structures", "Stack/Queue", "CLI"],
    tag: ["All", "Software"],
    gitUrl: "https://github.com/Furqan-10/Solitare-Game",
  },
  {
    id: 9,
    title: "AI-Based Fire Detection System",
    description: "An IoT-integrated fire detection system combining sensor data, Arduino-ESP32 communication, and a cloud-hosted AI model.",
    tools: ["C", "Esp32", "Arduino", "UART","MQTT Mobile app","Hugging Face"],
    tag: ["All", "AI","Software"],
    gitUrl: "https://github.com/Furqan-10/AI-Based-Fire-Detection-System",
  }
];

const ProjectsSection = () => {
  const [tag, setTag] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleTagChange = (newTag) => {
    setTag(newTag);
  };

  const filteredProjects = projectsData.filter((project) =>
    project.tag.includes(tag)
  );

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <section id="projects" className="py-12 px-4">
      <h2 className="text-center text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-4 mb-8 md:mb-12">
        My Projects
      </h2>
      <div className="flex flex-row justify-start md:justify-center items-center gap-2 py-6 overflow-x-auto">
        <ProjectTag onClick={handleTagChange} name="All" isSelected={tag === "All"} />
        <ProjectTag onClick={handleTagChange} name="Web" isSelected={tag === "Web"} />
        <ProjectTag onClick={handleTagChange} name="AI" isSelected={tag === "AI"} />
        <ProjectTag onClick={handleTagChange} name="Software" isSelected={tag === "Software"} />
        <ProjectTag onClick={handleTagChange} name="Database" isSelected={tag === "Database"} />
        <ProjectTag onClick={handleTagChange} name="Networking" isSelected={tag === "Networking"} />
      </div>
      <ul ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {filteredProjects.map((project, index) => (
          <motion.li
            key={project.id}
            variants={cardVariants}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            transition={{ duration: 0.3, delay: index * 0.2 }}
          >
            <ProjectCard
              title={project.title}
              description={project.description}
              tools={project.tools}
              gitUrl={project.gitUrl}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectsSection;