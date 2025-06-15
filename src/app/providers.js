// app/providers.js

"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  // defaultTheme="dark" ensures the site loads in dark mode first
  // attribute="class" is necessary for Tailwind's dark mode
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      {children}
    </ThemeProvider>
  );
}