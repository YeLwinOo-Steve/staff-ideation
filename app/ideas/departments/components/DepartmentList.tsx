import { motion } from "framer-motion";
import { Department, User } from "@/api/models";
import { DepartmentCard } from "./DepartmentCard";
import { Building2, Users } from "lucide-react";

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
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (departments.length === 0) {
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
            <Building2 className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -right-2 -top-2 bg-base-100 rounded-full p-2">
            <Users className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-center m-2">
          No Departments Yet
        </h3>
        <p className="text-base-content/60 text-center max-w-sm">
          {hasAdminPermissions 
            ? "Start by adding your first department. Click the 'Add Department' button above to get started."
            : "No departments have been created yet. Check back later for updates."}
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
              (u) => u.name === department.qa_coordinator_name,
            )}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
