import { motion } from "framer-motion";
import { Category } from "@/api/models";
import { PencilIcon, Trash2Icon, Blocks, Clock } from "lucide-react";
import { format } from "date-fns";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
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

export function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="card bg-base-200 shadow-sm hover:shadow-md duration-300 border border-base-200"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <div className="card-body p-5">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Blocks className="w-5 h-5 text-primary" />
              </div>
              <h3 className="card-title text-lg">{category.name}</h3>
            </div>
            <div className="flex gap-2">
              <motion.button
                className="btn btn-circle btn-sm bg-primary/10 hover:bg-primary border-0"
                onClick={() => onEdit(category)}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "hsl(var(--p))",
                }}
                whileTap={{ scale: 0.9 }}
              >
                <PencilIcon className="w-4 h-4 text-primary group-hover:text-white" />
              </motion.button>
              <motion.button
                className="btn btn-circle btn-sm bg-error/10 hover:bg-error border-0"
                onClick={() => onDelete(category)}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "hsl(var(--er))",
                }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2Icon className="w-4 h-4 text-error group-hover:text-white" />
              </motion.button>
            </div>
          </div>

          <div className="divider divider-primary before:h-[1px] after:h-[1px] my-0"></div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 bg-info/5 p-3 rounded-xl">
              <div className="bg-info/10 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs opacity-70">Created At</span>
                <span className="text-sm font-medium">
                  {format(new Date(category.created_at), "PPp")}
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
                  {format(new Date(category.updated_at), "PPp")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
