"use client";

import { motion, useAnimationFrame } from "framer-motion";
import { useRef } from "react";
import {
  FaGoogle,
  FaGithub,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaApple,
  FaDropbox,
  FaAmazon,
} from "react-icons/fa";
import { useTheme } from "../Contexts/ThemeContext";

const services = [
  { icon: FaGoogle, name: "Google" },
  { icon: FaGithub, name: "GitHub" },
  { icon: FaFacebook, name: "Facebook" },
  { icon: FaTwitter, name: "Twitter" },
  { icon: FaLinkedin, name: "LinkedIn" },
  { icon: FaApple, name: "Apple" },
  { icon: FaDropbox, name: "Dropbox" },
  { icon: FaAmazon, name: "Amazon" },
];

export default function InfiniteCarousel() {
  const {theme} = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useRef(0);

  useAnimationFrame((t, delta) => {
    if (containerRef.current) {
      x.current -= 0.1 * delta;

      const totalWidth = containerRef.current.scrollWidth / 2;
      if (-x.current >= totalWidth) {
        x.current = 0;
      }

      containerRef.current.style.transform = `translateX(${x.current}px)`;
    }
  });

  const loopingList = [...services, ...services];

  return (
    <div className="overflow-hidden w-full py-6">
      <div
        ref={containerRef}
        className="flex gap-24 will-change-transform items-center"
        style={{ whiteSpace: "nowrap" }}
      >
        {loopingList.map(({ icon: Icon }, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
          >
            <Icon color={theme === "dark" ? "white" : "black"} size={50} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
