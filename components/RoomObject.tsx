"use client";
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  label: string;
  ariaLabel: string;
  onClick: () => void;
  className?: string;
  bob?: number;
  pressed?: boolean;
  children: React.ReactNode;
};

export default function RoomObject({
  label,
  ariaLabel,
  onClick,
  className = "",
  bob = 0,
  pressed,
  children,
}: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      className={`group absolute cursor-pointer outline-none ${className}`}
      initial={false}
      animate={reduce || !bob ? {} : { y: [0, -bob, 0] }}
      transition={{ duration: 4 + bob, repeat: Infinity, ease: "easeInOut" }}
      whileHover={reduce ? {} : { scale: 1.06, y: -6 }}
      whileFocus={reduce ? {} : { scale: 1.06, y: -6 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="block h-full w-full drop-shadow-[0_10px_20px_rgba(38,38,43,0.10)]">
        {children}
      </span>
      <span
        className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap
          rounded-full border border-line bg-paper-bright px-3 py-1 font-accent text-[0.95rem]
          uppercase tracking-[0.08em] text-ink opacity-100 shadow-soft transition duration-200
          group-hover:-translate-y-1 group-focus-visible:-translate-y-1"
      >
        {label}
      </span>
    </motion.button>
  );
}
