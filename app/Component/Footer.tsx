"use client";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-zinc-800 h-full text-gray-300 px-6 md:px-20 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div>
          <h3 className="text-xl font-bold text-white mb-2">🔐 SecurePass</h3>
          <p className="text-sm">
            Simplify your digital life with our secure and seamless password
            management solution.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/form">Save Password</Link>
            </li>
            <li>
              <Link href="/upload">Save Documents</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold text-white mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="/faq">FAQs</Link>
            </li>
            <li>
              <Link href="/support">Support</Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-semibold text-white mb-3">Connect with us</h4>
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/Sagarbisht99"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="text-xl hover:text-white transition" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/sagar-bisht-b13840316/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="text-xl hover:text-white transition" />
            </Link>
            <Link
              href="https://x.com/LegasPole"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="text-xl hover:text-white transition" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-10 text-center text-xs text-gray-400 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} SecurePass. All rights reserved.
      </div>
    </footer>
  );
}
