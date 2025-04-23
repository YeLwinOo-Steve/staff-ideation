import { Building2, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface DepartmentHeaderProps {
  onAddClick: () => void;
  showAddButton: boolean;
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

export function DepartmentHeader({
  onAddClick,
  showAddButton,
}: DepartmentHeaderProps) {
  return (
    <div className="flex justify-between flex-wrap items-center gap-4 mb-8">
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <Building2 className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">Departments</h1>
      </motion.div>
      {showAddButton && (
        <motion.button
          variants={itemVariants}
          className="btn btn-primary ml-auto"
          onClick={onAddClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Add Department
        </motion.button>
      )}
    </div>
  );
}
