"use client";

import Home from "./Component/Home";
import ServicesSection from "./Component/Services";
import Footer from "./Component/Footer";

export default function HomePage() {
  return (
    <div className="font-sans h-full w-full">
      <Home />
      <ServicesSection />
      <Footer />
    </div>
  );
}