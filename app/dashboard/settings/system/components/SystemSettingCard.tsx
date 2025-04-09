import { motion } from "framer-motion";
import {
  Sliders,
  Calendar,
  PencilIcon,
  Trash2Icon,
  DownloadIcon,
} from "lucide-react";
import { format } from "date-fns";
import { SystemSetting } from "@/api/models";

interface SystemSettingCardProps {
  setting: SystemSetting;
  onUpdate: (e: React.FormEvent, setting: SystemSetting) => void;
  onDelete: (e: React.FormEvent, setting: SystemSetting) => void;
  onDownload: (e: React.FormEvent, setting: SystemSetting) => Promise<void>;
}

const itemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export function SystemSettingCard({
  setting,
  onUpdate,
  onDelete,
  onDownload,
}: SystemSettingCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="card bg-base-200 shadow-sm hover:shadow-sm duration-100"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      layout
    >
      {setting.status === 1 && (
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary border-4 border-base-100" />
      )}
      <div className="card-body p-2 m-2">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Sliders className="w-5 h-5 text-primary" />
              </div>
              <h3 className="card-title text-lg">{setting.academic_year}</h3>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 bg-info/50 px-3 py-2 rounded-xl">
              <div className="bg-info/10 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs opacity-70">Idea Closure Date</span>
                <span className="text-sm font-medium">
                  {format(new Date(setting.idea_closure_date), "PPP")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-warning/50 px-3 py-2 rounded-xl">
              <div className="bg-warning/10 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs opacity-70">Final Closure Date</span>
                <span className="text-sm font-medium">
                  {format(new Date(setting.final_closure_date), "PPP")}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <motion.button
                className="btn btn-circle btn-sm bg-primary/10 hover:bg-primary border-0"
                onClick={(e) => onUpdate(e, setting)}
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
                onClick={(e) => onDelete(e, setting)}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "hsl(var(--er))",
                }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2Icon className="w-4 h-4 text-error group-hover:text-white" />
              </motion.button>
              <motion.button
                className="btn btn-circle btn-sm bg-success/10 hover:bg-success border-0"
                onClick={async (e) => {
                  e.preventDefault();
                  await onDownload(e, setting);
                }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "hsl(var(--su))",
                }}
                whileTap={{ scale: 0.9 }}
              >
                <DownloadIcon className="w-4 h-4 text-success group-hover:text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
