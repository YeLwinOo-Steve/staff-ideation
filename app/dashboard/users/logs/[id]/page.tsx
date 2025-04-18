"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useApiStore } from "@/store/apiStore";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Settings,
  FileText,
  FolderKanban,
  Building2,
  User2,
  History,
  ChevronLeft,
  ClipboardList,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";

const containerVariants = {
  hidden: { opacity: 0 },
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
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "system_setting":
      return <Settings className="w-5 h-5" />;
    case "idea":
      return <FileText className="w-5 h-5" />;
    case "category":
      return <FolderKanban className="w-5 h-5" />;
    case "department":
      return <Building2 className="w-5 h-5" />;
    case "user":
      return <User2 className="w-5 h-5" />;
    default:
      return null;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case "create":
      return "bg-success/10 text-success";
    case "update":
      return "bg-info/10 text-info";
    case "delete":
      return "bg-error/10 text-error";
    case "submit":
      return "bg-warning/10 text-warning";
    default:
      return "text-base-content";
  }
};

const LogsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const {
    userLogPagination: { data: logs, currentPage, lastPage, loading, total },
    fetchUserLogs,
  } = useApiStore();

  useEffect(() => {
    if (id) {
      fetchUserLogs(Number(id), 1);
    }
  }, [id, fetchUserLogs]);

  const handlePageChange = (page: number) => {
    if (id) {
      fetchUserLogs(Number(id), page);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 pb-24 min-h-screen relative"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-base-100 z-30 -mx-6 px-6 py-4 sticky top-0">
          <div className="flex justify-between items-center">
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-md"
              onClick={() => router.back()}
            >
              <ChevronLeft size={20} />
              <span className="font-bold">User Logs</span>
            </motion.button>
            <motion.div
              variants={itemVariants}
              className="badge badge-info badge-sm gap-2 px-8 py-4"
            >
              <History className="w-4 h-4" />
              {total} Activities
            </motion.div>
          </div>
        </div>

        <motion.div variants={containerVariants} className="space-y-6 mt-8">
          {logs.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center py-16 px-4"
            >
              <div className="relative mb-6">
                <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full" />
                <div className="relative bg-primary/10 p-6 rounded-full">
                  <ClipboardList className="w-12 h-12 text-primary" />
                </div>
                <div className="absolute -right-2 -top-2 bg-base-100 rounded-full p-2">
                  <Clock className="w-5 h-5 text-primary animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center m-2">
                No Activity Logs Yet!
              </h3>
              <p className="text-base-content/60 text-center max-w-sm">
                This user hasn&apos;t performed any actions that would generate
                activity logs. New activities will appear here as they occur.
              </p>
            </motion.div>
          ) : (
            logs.map((log, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-base-200">
                      {log.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={log.photo}
                          alt={log.user}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-xl font-bold text-primary">
                          {log.user.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{log.user}</span>
                      <span className="text-sm text-base-content/60">
                        {log.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="badge badge-ghost gap-1 py-3">
                        {getActivityIcon(log.type)}
                        {log.type.replace("_", " ")}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg font-medium ${getActionColor(log.action)}`}
                      >
                        {log.action}
                      </span>
                    </div>
                    <div className="bg-base-200/50 rounded-lg p-3 text-base-content/80">
                      {log.activity}
                    </div>
                    <div className="text-xs text-base-content/50 font-medium">
                      {formatDistanceToNow(new Date(log.time), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <motion.div
          variants={itemVariants}
          className="fixed bottom-6 left-0 right-0 flex justify-center z-10"
        >
          <div className="join bg-base-100 shadow-lg">
            {Array.from({ length: Math.min(lastPage, 10) }).map((_, index) => (
              <motion.input
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="radio"
                name="options"
                className="join-item btn btn-square"
                aria-label={`${index + 1}`}
                checked={currentPage === index + 1}
                onChange={() => handlePageChange(index + 1)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LogsPage;
