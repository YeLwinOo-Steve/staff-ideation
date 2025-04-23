import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const AnimatedNumber = ({ value }: { value: number }) => {
  const [prevValue, setPrevValue] = useState(value);
  const isIncreasing = value > prevValue;

  useEffect(() => {
    setPrevValue(value);
  }, [value]);

  return (
    <div className="relative h-6 overflow-hidden min-w-[2rem]">
      <motion.span
        key={value}
        initial={{
          y: isIncreasing ? 20 : -20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        exit={{
          y: isIncreasing ? -20 : 20,
          opacity: 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        className="absolute inset-0 text-md font-bold text-center"
      >
        {value || 0}
      </motion.span>
    </div>
  );
};
