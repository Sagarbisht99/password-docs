"use client";

import React from "react";
import Link from "next/link";
import InfiniteCarousel from "./InfiniteCarousel";
import { useTheme } from "../Contexts/ThemeContext";
import { Button } from "../Component/ui/moving-border";
import { AnimatedTooltipPreview } from "./AnimatedTooltipPreview";

const Home = () => {
  const { theme } = useTheme();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 text-center gap-10 py-12">
      {/* Content Wrapper */}
      <div className="flex flex-col items-center justify-center gap-6 w-full max-w-6xl z-10">
        <AnimatedTooltipPreview />
        {/* Main Heading */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight lg:leading-[1.1] tracking-tight text-center">
          You {"Weren't"} Born to Remember Passwords
        </h1>

        {/* Subheading */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-blue-600 font-sans">
          Secure Your Digital Life with Effortless Password Management
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg max-w-2xl  text-center">
          Generate strong, unique passwords, store them securely, and access
          them seamlessly across all your devices. Simplify your online
          experience while enhancing your security.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <Button
            as={Link}
            href="/form"
            borderRadius="1.75rem"
            className={`px-6 py-3 text-sm font-medium tracking-wide shadow-lg hover:scale-105 transition`}
          >
            Save Password
          </Button>
          <Button
            as={Link}
            href="/upload"
            borderRadius="1.75rem"
            className={`px-6 py-3 text-sm font-medium tracking-wide transition hover:scale-105`}
          >
            Save Documents
          </Button>
        </div>

        {/* <Button
        borderRadius="1.75rem"
        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
      >
        Borders are cool
      </Button> */}

        {/* Carousel */}
        <div className="w-full mt-6 overflow-hidden">
          <InfiniteCarousel />
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-8 px-2">
          {[
            "Trusted by 1000+ Businesses",
            "100% Accuracy Guaranteed",
            "Expert Team",
            "Trusted by 1000+ Users ⚡",
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-colors duration-300 ease-in-out text-sm ${
                theme === "dark"
                  ? "bg-blue-900/20 text-blue-300"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              <svg
                className={`w-4 h-4 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
