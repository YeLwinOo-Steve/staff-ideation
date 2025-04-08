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
    <div className="flex justify-between flex-wrap items-center gap-4 mb-8">
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3"
      >
        <Building2 className="w-8 h-8 text-primary" />
        <h2 className="text-3xl font-bold">Departments</h2>
      </motion.div>
      <motion.button
        variants={itemVariants}
        className="btn btn-primary ml-auto"
        onClick={onAddClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <PlusIcon className="w-5 h-5" />
        Add Department
      </motion.button>
    </div>
  );
}
