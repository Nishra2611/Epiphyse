import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PageTransition({ children, className }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-16", className)}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
