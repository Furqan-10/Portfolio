// ProjectCard.jsx

import React from "react";
import { CodeBracketIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import GithubIcon from "../../../public/github-icon.svg";
import Image from "next/image";

const ProjectCard = ({ title, description, tools, gitUrl }) => {
  return (
    <div className="h-full rounded-xl bg-slate-100 dark:bg-[#181818] border border-slate-300 dark:border-[#33353F] p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-2">
      <div>
        <div className="flex items-center mb-4">
          <CodeBracketIcon className="h-8 w-8 text-primary-500 mr-3" />
          <h5 className="text-xl font-semibold text-slate-900 dark:text-white">
            {title}
          </h5>
        </div>
        <p className="text-slate-600 dark:text-[#ADB7BE] text-base mb-6">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {tools.map((tool, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-200 dark:bg-[#33353F] text-slate-700 dark:text-slate-300 text-xs rounded-md"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      <Link
        href={gitUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-center text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300"
      >
        <Image src={GithubIcon} alt="Github Icon" width={20} height={20} className="mr-2" />
        View Code
      </Link>
    </div>
  );
};

export default ProjectCard;