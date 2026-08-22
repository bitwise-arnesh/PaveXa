"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the button after leaving the hero area.
      setVisible(window.scrollY > window.innerHeight * 0.7);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          initial={{
            opacity: 0,
            y: 16,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 16,
            scale: 0.9,
          }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 25,
          }}
          whileHover={{
            y: -3,
          }}
          whileTap={{
            scale: 0.94,
          }}
          className="
            fixed
            bottom-6
            right-6
            z-50
            flex
            h-11
            w-11
            items-center
            justify-center    
            rounded-full
            border
            border-foreground
            bg-foreground
            text-background
            shadow-lg
            shadow-black/10
            transition-colors
            hover:opacity-85
            dark:shadow-black/30
            sm:bottom-8
            sm:right-8
            "
        >
          <motion.span
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2} />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
