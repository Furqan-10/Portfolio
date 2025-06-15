// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="footer border-t border-slate-300 dark:border-t-[#33353F]">
      <div className="container p-6 md:p-12 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
        <span className="text-slate-800 dark:text-white">© 2025 Furqan Asif</span>
        <p className="text-slate-600 dark:text-slate-600">All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;