// ProjectTag.jsx
import React from "react";

const ProjectTag = ({ name, onClick, isSelected }) => {
  const buttonStyles = isSelected
    ? "text-white bg-primary-500 border-primary-500"
    : "text-slate-600 border-slate-400 hover:border-slate-800 dark:text-[#ADB7BE] dark:border-slate-600 dark:hover:border-white";
  return (
    <button
      // Added whitespace-nowrap to prevent tags from breaking into two lines
      className={`${buttonStyles} rounded-full border-2 px-6 py-3 text-xl cursor-pointer whitespace-nowrap`}
      onClick={() => onClick(name)}
    >
      {name}
    </button>
  );
};

export default ProjectTag;