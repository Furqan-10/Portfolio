// src/app/components/ThemeSwitcher.jsx

"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // This useEffect hook ensures that the component only renders on the client-side,
  // preventing a hydration mismatch error between the server and client.
  useEffect(() => {
    setMounted(true);
  }, []);

  // If the component is not yet mounted, return a placeholder or null
  // to avoid rendering anything on the server. A placeholder prevents layout shift.
  if (!mounted) {
    return <div className="w-6 h-6" />;
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white transition-colors"
    >
      {theme === "dark" ? (
        <SunIcon className="h-6 w-6" />
      ) : (
        <MoonIcon className="h-6 w-6" />
      )}
    </button>
  );
};

export default ThemeSwitcher;