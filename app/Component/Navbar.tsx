"use client";
import React, { useEffect, useState } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import MobileSlider from "./Mobileslider";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { motion } from "framer-motion";
import { useTheme } from "../Contexts/ThemeContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Stored Password", href: "/password" },
  { label: "Docs", href: "/Docs" },
  { label: "Generator", href: "/Generator" },
  { label: "Pricing", href: "/pricing" },
];

const Navbar = () => {
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollY > lastScrollY && currentScrollY > 50) {
            // Scrolling down
            setShowNavbar(false);
          } else if (currentScrollY < lastScrollY) {
            // Scrolling up
            setShowNavbar(true);
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: showNavbar ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`w-full z-50 border-b transition-all duration-300
          ${
            theme === "dark"
              ? "bg-[#0e0e0e]/60 border-neutral-800 backdrop-blur-md"
              : "bg-white/60 border-neutral-200 backdrop-blur-md"
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.2 }}
              className="text-lg font-mono md:text-2xl font-bold tracking-wide"
            >
              🗝️ EncryptoHub
            </motion.div>
          </Link>

          {/* Nav Links */}
          <ul className="hidden lg:flex items-center space-x-8 font-semibold text-sm">
            {navItems.map((item, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href={item.href}
                  className="hover:text-primary cursor-pointer"
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* Auth + ThemeToggle */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />

            <SignedOut>
              <SignInButton>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-5 py-2.5 rounded-full font-semibold shadow-lg transition-all duration-200 border 
          ${
            theme === "dark"
              ? "bg-gradient-to-br from-[#1f1f1f] to-[#333] text-white border-white/20 hover:from-[#2a2a2a] hover:to-[#444]"
              : "bg-white text-black border-black/10 hover:bg-gray-100"
          }`}
                >
                  Login
                </motion.button>
              </SignInButton>

              <SignUpButton>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-2.5 rounded-full font-semibold shadow-lg transition-all duration-200 border 
          ${
            theme === "dark"
              ? "bg-white text-black  border-white/20 hover:from-[#1f1f1f] hover:to-[#2d2d2d]"
              : "bg-black text-white border-black/10 hover:bg-neutral-900"
          }`}
                >
                  Sign Up
                </motion.button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsSliderOpen(true)}
            className="lg:hidden cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </motion.nav>

      <MobileSlider
        isOpen={isSliderOpen}
        onClose={() => setIsSliderOpen(false)}
      />
    </>
  );
};

export default Navbar;
