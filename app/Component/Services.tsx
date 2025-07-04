"use client";
import React from "react";
import { FaShieldAlt, FaKey, FaCloudUploadAlt } from "react-icons/fa";
import Background from "./Background";
import { useTheme } from "../Contexts/ThemeContext";

const services = [
  {
    title: "Strong Password Generator",
    description: "Create complex and secure passwords instantly for all your accounts.",
    icon: <FaKey className="text-3xl text-emerald-500 dark:text-emerald-400" />,
  },
  {
    title: "Encrypted Vault Storage",
    description: "Store all your credentials in a zero-knowledge encrypted vault.",
    icon: <FaShieldAlt className="text-3xl text-cyan-500 dark:text-cyan-400" />,
  },
  {
    title: "Document Vault",
    description: "Upload and manage secure files like PAN, Aadhar, and licenses.",
    icon: <FaCloudUploadAlt className="text-3xl text-teal-500 dark:text-teal-400" />,
  },
];

export default function ServicesSection() {
  const { theme } = useTheme();

  return (
    <section className="relative py-20 px-6 md:px-16 text-center overflow-hidden">
      <Background />

      {/* Header */}
      <div className="mb-14 z-10 relative">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Power Features for Digital Safety
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mt-3 text-base sm:text-lg">
          Your all-in-one toolkit to generate, store, and secure everything — from passwords to documents.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto z-10 relative">
        {services.map((service, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl flex items-center justify-center flex-col border transition-all duration-300 
              shadow-sm hover:shadow-lg hover:-translate-y-1
              ${
                theme === "dark"
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-white border-zinc-200 text-gray-800"
              }`}
          >
            <div className="mb-5 text-center">{service.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
            <p className="text-sm leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      <div className="mt-10 flex justify-center gap-2 z-10 relative">
        {[0, 1, 2].map((dot) => (
          <div
            key={dot}
            className={`h-2 w-2 rounded-full transition duration-200
              ${theme === "dark" ? "bg-gray-600" : "bg-gray-400"} 
              hover:bg-emerald-500`}
          />
        ))}
      </div>
    </section>
  );
}
