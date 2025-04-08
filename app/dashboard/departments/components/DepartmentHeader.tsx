import { Building2, PlusIcon } from "lucide-react";
import { motion } from "framer-motion";

interface DepartmentHeaderProps {
  onAddClick: () => void;
}

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

export function DepartmentHeader({ onAddClick }: DepartmentHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <motion.div variants={itemVariants} className="flex items-center gap-3" layout>
        <Building2 className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Departments</h1>
      </motion.div>
      <motion.button
        variants={itemVariants}
        className="btn btn-primary"
        onClick={onAddClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        layout
      >
        <PlusIcon className="w-5 h-5" />
        Add Department
      </motion.button>
    </div>
  );
} 