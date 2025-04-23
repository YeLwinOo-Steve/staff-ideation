import { Category } from "@/api/models";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const CategoryChip = ({
  category,
  isSelected,
  onClick,
}: {
  category: Category;
  isSelected: boolean;
  onClick: (id: number) => void;
}) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`badge badge-lg gap-4 p-4 cursor-pointer ${
      isSelected ? "badge-primary" : "badge-outline"
    }`}
    onClick={() => onClick(category.id)}
  >
    {category.name}
    {isSelected && <X size={14} />}
  </motion.div>
);

export default CategoryChip;
