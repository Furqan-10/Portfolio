import Loader from "./components/Loader";
import TopBar from "./components/chrome/TopBar";
import SideSocials from "./components/chrome/SideSocials";
import ResumeCorner from "./components/chrome/ResumeCorner";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import WhatIDoSection from "./components/WhatIDoSection";
import TimelineSection from "./components/TimelineSection";
import WorkSection from "./components/WorkSection";
import TechStackSection from "./components/TechStackSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="relative z-10">
      <Loader />
      <TopBar />
      <SideSocials />
      <ResumeCorner />
      <HeroSection />
      <AboutSection />
      <WhatIDoSection />
      <TimelineSection />
      <WorkSection />
      <TechStackSection />
      <EmailSection />
      <Footer />
    </main>
  );
}
