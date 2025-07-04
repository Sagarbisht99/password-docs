"use client";

import React from "react";
import { motion } from "framer-motion";

const segments = Array.from({ length: 12 });

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="relative w-20 h-20">
        {segments.map((_, i) => {
          const angle = (360 / segments.length) * i;
          return (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-6 rounded-full bg-blue-600 origin-center"
              style={{
                transform: `rotate(${angle}deg) translate(0, -160%)`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "easeInOut",
                delay: i * 0.08,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
