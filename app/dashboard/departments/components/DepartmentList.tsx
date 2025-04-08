import { motion, AnimatePresence } from "framer-motion";
import { Department, User } from "@/api/models";
import { DepartmentCard } from "./DepartmentCard";

interface DepartmentListProps {
  departments: Department[];
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
  allUsers: User[];
  isLoading: boolean;
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

export function DepartmentList({
  departments,
  onEdit,
  onDelete,
  allUsers,
  isLoading,
}: DepartmentListProps) {
  if (isLoading) {
    return (
      <motion.div
        className="flex justify-center items-center h-64"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <span className="loading loading-spinner loading-lg text-primary"></span>
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
      {departments.map((department) => (
        <DepartmentCard
          department={department}
          onEdit={onEdit}
          onDelete={onDelete}
          qaCoordinator={allUsers.find(
            (u) => u.id === department.QACoordinatorID
          )}
        />
      ))}
    </motion.div>
  );
}
