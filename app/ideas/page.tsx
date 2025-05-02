"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import IdeaList from "./components/ideaList";
import { useApiStore } from "@/store/apiStore";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlusIcon, AlertCircle } from "lucide-react";
import { hasPermission } from "@/app/lib/utils";

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

const bannerVariants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const {
    fetchIdeas,
    ideaPagination: { total },
  } = useApiStore();

  useEffect(() => {
    const loadData = async () => {
      const promises = [];
      if (!total) {
        promises.push(fetchIdeas({ page: "1" }));
      }
      if (promises.length > 0) {
        await Promise.all(promises);
      }
    };
    loadData();
  }, [fetchIdeas, total]);

  const canCreateIdea = hasPermission(user, "create idea");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto"
    >
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">
            Welcome, {user?.name.split(" ")[0]}!
          </h1>
          {canCreateIdea ? (
            <Link
              href="/ideas/create"
              className="btn btn-primary btn-md w-full sm:w-auto"
            >
              <PlusIcon className="w-4 h-4" />
              Create New Idea
            </Link>
          ) : (
            <motion.div
              variants={bannerVariants}
              className="inline-flex items-center gap-2 text-info-content bg-info rounded-lg py-1.5 px-3 w-full sm:w-auto"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">
                No permission to <span className="font-bold">Create Ideas</span>
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Ideas Section */}
      <div className="mb-6 sm:mb-8">
        <IdeaList />
      </div>
    </motion.div>
  );
}
