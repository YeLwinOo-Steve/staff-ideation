"use client";

import { ReportDetail, ReportedIdea } from "@/api/models";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "@/app/components/Avatar";

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: ReportedIdea;
  reportDetails: ReportDetail[];
  isLoading: boolean;
}

export function ReportDetailsModal({
  isOpen,
  onClose,
  idea,
  reportDetails,
  isLoading,
}: ReportDetailsModalProps) {
  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="modal-box bg-base-100 p-0 max-w-xl"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-error/10 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-error" />
            </div>
            <h3 className="font-bold text-xl">Reported Idea Details</h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <span className="loading loading-spinner loading-lg text-error"></span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Idea Summary */}
              <div className="bg-base-200/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-3 mt-2">
                  <Avatar src={idea.photo} alt={idea.user_name} />
                  <div>
                    <h5 className="font-medium">{idea.user_name}</h5>
                    <p className="text-sm text-gray-500">{idea.department}</p>
                  </div>
                </div>
                <h3 className="font-medium mt-3 ml-16">{idea.title}</h3>
                <p className="text-sm opacity-80 ml-16">{idea.content}</p>
              </div>

              {/* Reports List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Reports</h4>
                  <span className="badge badge-error">
                    {reportDetails.length} reports
                  </span>
                </div>
                <div className="space-y-3">
                  {reportDetails.map((report, index) => (
                    <div
                      key={index}
                      className="bg-base-200/50 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={report.user_photo}
                          alt={report.user_name}
                        />
                        <div>
                          <h5 className="font-medium">{report.user_name}</h5>
                          <p className="text-sm text-gray-500">
                            {report.user_department}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm ml-16">{report.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-base-200/30 p-4 flex justify-end gap-2">
          <motion.button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Close
          </motion.button>
        </div>
      </motion.div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
