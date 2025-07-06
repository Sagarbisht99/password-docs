"use client";

import Home from "./Component/Home";
import ServicesSection from "./Component/Services";
import Footer from "./Component/Footer";
import { HeroScrollDemo } from "./Component/HeroScrollDemo";

export default function HomePage() {
  return (
    <div className="font-sans h-full w-full">
      <Home />
      <HeroScrollDemo />
      <ServicesSection />
      <Footer />
    </div>
  );
}
