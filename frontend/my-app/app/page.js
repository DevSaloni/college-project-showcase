"use client";
import './globals.css';
import { usePathname } from "next/navigation";

import Herosection from '@/components/Herosection';
import FeaturesSection from "@/components/FeaturesSection"
import HowItWorks from "@/components/HowItWorks";
import RecentProjects from "@/components/RecentProjects";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  const pathname = usePathname();

  const hidelayout = pathname === "/login" || pathname === "/register" || pathname === "/contact";

  return (
    <div>
      <Herosection />
      <FeaturesSection />
      <HowItWorks />
      <RecentProjects />
      <FAQSection />
      {/* <Footer /> */}
    </div>
  );
}
