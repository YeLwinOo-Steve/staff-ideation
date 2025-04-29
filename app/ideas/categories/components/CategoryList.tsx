"use client";

import { motion } from "framer-motion";
import { Category } from "@/api/models";
import { CategoryCard } from "./CategoryCard";
import { Blocks, Tag } from "lucide-react";

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export function CategoryList({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: CategoryListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full" />
          <div className="relative bg-primary/10 p-6 rounded-full">
            <Blocks className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -right-2 -top-2 bg-base-100 rounded-full p-2">
            <Tag className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-center m-2">
          No Categories Yet
        </h3>
        <p className="text-base-content/60 text-center max-w-sm">
          Start organizing ideas by creating categories. Click the 'Add Category' button above to get started.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {categories.map((category) => (
        <motion.div
          key={category.id}
          variants={itemVariants}
          className="h-full"
          layout
        >
          <CategoryCard
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
