import { Building2, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface DepartmentHeaderProps {
  onAddClick: () => void;
  showAddButton: boolean;
}

export function DepartmentHeader({
  onAddClick,
  showAddButton,
}: DepartmentHeaderProps) {
  return (
    <motion.div
      className="flex justify-between flex-wrap items-center gap-4 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <Building2 className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold">Departments</h1>
      </div>

      {showAddButton && (
        <motion.button
          className="btn btn-primary ml-auto"
          onClick={onAddClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          Add Department
        </motion.button>
      )}
    </motion.div>
  );
}
