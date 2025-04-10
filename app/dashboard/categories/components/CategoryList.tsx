"use client";

import { motion } from "framer-motion";
import { Category } from "@/api/models";
import { CategoryCard } from "./CategoryCard";
import { CategorySkeleton } from "./CategorySkeleton";

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
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 10,
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
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
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {isLoading ? (
        <>
          {[...Array(6)].map((_, index) => (
            <CategorySkeleton key={`skeleton-${index}`} />
          ))}
        </>
      ) : (
        <>
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
        </>
      )}
    </motion.div>
  );
}
