"use client";

import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { X } from "lucide-react";

interface MobileSliders {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSlider: React.FC<MobileSliders> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 right-0 z-50 h-full w-72 backdrop-blur-lg bg-zinc-900/80 text-white transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl border-l border-zinc-700 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-700">
        <h2 className="text-xl font-semibold tracking-wide">Menu</h2>
        <button
          onClick={onClose}
          className="text-zinc-300 hover:text-red-500 transition"
          aria-label="Close Menu"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-6 pt-6 text-sm font-medium">
        <ul className="flex flex-col gap-5">
          {[
            { label: "Home", href: "/" },
            { label: "Password Generator", href: "/password" },
            { label: "Stored Passwords", href: "/password" },
            { label: "Docs", href: "/Docs" },
            { label: "Pricing", href: "/pricing" },
          ].map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={onClose}
                className="block text-zinc-300 hover:text-blue-400 transition-all duration-200"
              >
                {label}
              </Link>
            </li>
          ))}
          {/* Theme Toggle here as part of nav */}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>

      {/* Divider */}
      <div className="my-5 mx-6 border-t border-zinc-700" />

      {/* Auth Section */}
      <div className="px-6 pb-6 flex flex-col gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="w-full py-2 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium transition-all">
              Login
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="w-full py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </div>
  );
};

export default MobileSlider;
