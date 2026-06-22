import "./globals.css";
import { Inter } from "next/font/google";
import SmoothScrollProvider from "./components/scroll/SmoothScrollProvider";
import BackgroundCanvas from "./components/background/BackgroundCanvas";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Furqan Asif — Computer Scientist & Developer",
  description: "Portfolio of Furqan Asif: AI, cybersecurity, full-stack, and mobile development. CS '27, UET Lahore.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        <BackgroundCanvas />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
