import { motion } from "framer-motion";
import { Department, User } from "@/api/models";
import { DepartmentCard } from "./DepartmentCard";

interface DepartmentListProps {
  departments: Department[];
  onEditClick: (department: Department) => void;
  onDeleteClick: (department: Department) => void;
  hasAdminPermissions?: boolean;
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

export function DepartmentList({
  departments,
  onEditClick,
  onDeleteClick,
  hasAdminPermissions,
  allUsers,
  isLoading,
}: DepartmentListProps) {
  if (isLoading) {
    return (
      <motion.div className="flex justify-center items-center h-64">
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
        <motion.div
          key={department.id}
          variants={itemVariants}
          className="h-full"
          layout
        >
          <DepartmentCard
            department={department}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            showActions={hasAdminPermissions}
            qaCoordinator={allUsers.find(
              (u) => u.id === department.QACoordinatorID,
            )}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
