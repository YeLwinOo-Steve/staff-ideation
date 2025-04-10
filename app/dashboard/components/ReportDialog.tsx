"use client";

import { AlertTriangle, Flag, X } from "lucide-react";
import { motion } from "framer-motion";
import { Idea } from "@/api/models";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/toast";

interface ReportDialogProps {
  idea: Idea;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportDialog({
  idea,
  isOpen,
  onClose,
}: ReportDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();
  const handleReport = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsSubmitting(true);
      await axios.post(`/api/v1/ideas/${idea.id}/report`);
      showSuccessToast("Idea reported successfully");
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showErrorToast(
          error.response?.data?.message || "Failed to report idea",
        );
      } else {
        showErrorToast("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-base-100 rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-base-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-warning/10 p-3 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold">Report Idea</h3>
              <p className="text-sm text-base-content/70">{idea.title}</p>
            </div>
          </div>

          <div className="divider divider-warning before:h-[1px] after:h-[1px] my-2"></div>

          <div className="bg-warning/5 p-4 rounded-xl space-y-1">
            <p className="font-medium">
              Are you sure you want to report this idea?
            </p>
            <p className="text-base-content/70 text-sm">
              By reporting this idea, you are indicating that it contains:
            </p>
            <ul className="text-sm text-base-content/70 list-disc list-inside space-y-1">
              <li>Inappropriate or offensive content</li>
              <li>Violent or harmful material</li>
              <li>Spam or misleading information</li>
              <li>Copyright infringement</li>
            </ul>
            <p className="text-sm text-base-content/70 mt-2">
              QA Coordinator and QA Managers will review this report and take
              appropriate action.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <motion.button
              className="btn btn-ghost btn-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4" />
              Cancel
            </motion.button>
            <motion.button
              className="btn btn-warning btn-sm"
              onClick={handleReport}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              <Flag className="w-4 h-4" />
              {isSubmitting ? "Reporting..." : "Report"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
