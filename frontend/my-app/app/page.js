import './globals.css';
import Herosection from '@/components/Herosection';
import FeaturesSection from "@/components/FeaturesSection"
import HowItWorks from "@/components/HowItWorks";
import Newsletter from "@/components/Newsletter"
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Herosection/>
      <FeaturesSection/>
      <HowItWorks/>
      <Newsletter/>
      
    </div>
  );s
}
