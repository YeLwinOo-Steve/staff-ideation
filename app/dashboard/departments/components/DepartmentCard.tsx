import { motion } from "framer-motion";
import { Building2, PencilIcon, Trash2Icon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Department, User } from "@/api/models";
import { Avatar } from "@/app/components/Avatar";

interface DepartmentCardProps {
  department: Department;
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
  qaCoordinator?: User | null;
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

export function DepartmentCard({
  department,
  onEdit,
  onDelete,
  qaCoordinator,
}: DepartmentCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="card border border-primary shadow-sm hover:shadow-sm duration-100"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <div className="card-body p-5">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="card-title text-lg">
                {department.department_name}
              </h3>
            </div>
            <div className="flex gap-2">
              <motion.button
                className="btn btn-circle btn-sm bg-primary/50 hover:bg-primary border-0"
                onClick={() => onEdit(department)}
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{ scale: 0.9 }}
              >
                <PencilIcon className="w-4 h-4 text-white group-hover:text-white" />
              </motion.button>
              <motion.button
                className="btn btn-circle btn-sm bg-error hover:bg-error border-0"
                onClick={() => onDelete(department)}
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2Icon className="w-4 h-4 text-white group-hover:text-error" />
              </motion.button>
            </div>
          </div>

          <div className="divider divider-primary before:h-[1px] after:h-[1px] my-0"></div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 bg-info/5 p-3 rounded-xl">
              <div className="bg-info/10 p-2 rounded-lg">
                <Avatar
                  src={qaCoordinator?.photo}
                  alt={qaCoordinator?.name}
                  className="w-6 h-6 text-info"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs opacity-70">QA Coordinator</span>
                <span className="text-sm font-medium">
                  {qaCoordinator?.name || "Not assigned"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-info/5 p-3 rounded-xl">
              <div className="bg-info/10 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs opacity-70">Last Updated</span>
                <span className="text-sm font-medium">
                  {format(new Date(department.updated_at), "PPpp")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
