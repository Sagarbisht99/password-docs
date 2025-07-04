"use client";
import React, { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utlis";
import { useTheme } from "../../Contexts/ThemeContext";

// 👇 Generic, type-safe Button props
type ButtonProps<T extends React.ElementType = "button"> = {
  borderRadius?: string;
  children: React.ReactNode;
  as?: T;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
} & React.ComponentPropsWithoutRef<T>;

export function Button<T extends React.ElementType = "button">({
  borderRadius = "1.75rem",
  children,
  as,
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: ButtonProps<T>) {
  const Component = as || "button";
  const { theme } = useTheme();

  // Theme-aware default styling
  const getThemeStyles = () => {
    if (theme === "dark") {
      return "border-slate-700 bg-slate-800/[0.8] text-white hover:bg-slate-700/[0.9]";
    }
    return "border-slate-300 bg-white/[0.9] text-slate-900 hover:bg-slate-50/[0.95]";
  };

  // Theme-aware border styling
  const getBorderStyles = () => {
    if (theme === "dark") {
      return "h-20 w-20 bg-[radial-gradient(#3b82f6_40%,transparent_60%)] opacity-[0.8]";
    }
    return "h-20 w-20 bg-[radial-gradient(#1d4ed8_40%,transparent_60%)] opacity-[0.8]";
  };

  return (
    <Component
      className={cn(
        "relative h-16 w-40 overflow-hidden bg-transparent p-[1px] text-xl",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              getBorderStyles(),
              borderClassName
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border antialiased backdrop-blur-xl transition-colors duration-200",
          getThemeStyles(),
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

// ✅ Type-safe MovingBorder props
type MovingBorderProps = {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
} & React.SVGProps<SVGSVGElement>;

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}: MovingBorderProps) => {
  const pathRef = useRef<SVGRectElement | null>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength?.();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => {
    const point = pathRef.current?.getPointAtLength?.(val);
    return point?.x ?? 0;
  });

  const y = useTransform(progress, (val) => {
    const point = pathRef.current?.getPointAtLength?.(val);
    return point?.y ?? 0;
  });

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
