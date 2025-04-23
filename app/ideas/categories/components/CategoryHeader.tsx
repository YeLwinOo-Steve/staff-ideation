"use client";

import { Blocks, PlusIcon } from "lucide-react";
import { motion } from "framer-motion";

interface CategoryHeaderProps {
  onAddClick: () => void;
}

export function CategoryHeader({ onAddClick }: CategoryHeaderProps) {
  return (
    <motion.div
      className="flex justify-between flex-wrap items-center gap-4 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <Blocks className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">Categories</h1>
      </div>
      
      <motion.button
        className="btn btn-primary ml-auto"
        onClick={onAddClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <PlusIcon className="w-5 h-5" />
        Add Category
      </motion.button>
    </motion.div>
  );
}
