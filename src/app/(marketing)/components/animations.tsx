"use client";

import { motion, useInView } from "framer-motion";
import { type ReactNode, useRef } from "react";

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 12,
  duration = 0.5,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChildren({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative w-full px-6 py-24 md:px-12 lg:px-20 ${className ?? ""}`}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  badge,
  title,
  description,
  className,
}: {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-2xl text-center ${className ?? ""}`}>
      {badge && (
        <FadeIn>
          <span className="mb-4 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-medium tracking-wide text-violet-400">
            {badge}
          </span>
        </FadeIn>
      )}
      <FadeIn delay={0.1}>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>
      </FadeIn>
      {description && (
        <FadeIn delay={0.2}>
          <p className="mt-6 text-lg leading-relaxed text-zinc-400">
            {description}
          </p>
        </FadeIn>
      )}
    </div>
  );
}
