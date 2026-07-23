"use client";

import { AnimatePresence, motion } from "framer-motion";
import Aurora from "@/components/Aurora";
import { useAurora } from "@/stores/aurora-store";

export function AuroraProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const visible = useAurora((state) => state.visible);

  return (
    <>
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 1.15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.1,
            }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
            }}
            className="pointer-events-none absolute mix-blend-lighten inset-0 z-[9999] overflow-hidden"
          >
            <Aurora
              colorStops={["#7cff67", "#B497CF", "#5227FF"]}
              amplitude={1.2}
              blend={0.6}
              speed={0.8}
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,.75)_80%,black)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}