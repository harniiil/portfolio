"use client";

import { motion, type Variants } from "framer-motion";
import layout from "@/styles/layout.module.css";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function RevealSection({
  id,
  children,
  tight,
}: {
  id?: string;
  children: React.ReactNode;
  tight?: boolean;
}) {
  return (
    <motion.section
      id={id}
      className={tight ? layout.sectionTight : layout.section}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </motion.section>
  );
}

export function RevealItem({ children }: { children: React.ReactNode }) {
  return <motion.div variants={item}>{children}</motion.div>;
}
