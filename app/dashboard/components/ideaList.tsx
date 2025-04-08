import { motion } from "framer-motion";
import IdeaCard from "./ideaCard";
import { useApiStore } from "@/store/apiStore";
import { useState, useEffect } from "react";
import Link from "next/link";

interface IdeaListProps {
  baseUrl?: string;
  gridCols?: number;
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

export default function IdeaList({ gridCols = 3 }: IdeaListProps) {
  const [page, setPage] = useState(1);
  const [latest, setLatest] = useState<boolean | null>(null);
  const [popular, setPopular] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "pending">("all");
  const {
    ideaPagination: { data: ideas, currentPage, lastPage, loading },
    pendingIdeaPagination: {
      data: pendingIdeas,
      currentPage: pendingCurrentPage,
      lastPage: pendingLastPage,
      loading: pendingLoading,
    },
    fetchIdeas,
    fetchUsers,
    getToSubmit,
  } = useApiStore();

  const displayedIdeas = activeTab === "pending" ? pendingIdeas : ideas;
  const currentPageToShow =
    activeTab === "pending" ? pendingCurrentPage : currentPage;
  const lastPageToShow = activeTab === "pending" ? pendingLastPage : lastPage;
  const isLoading = activeTab === "pending" ? pendingLoading : loading;
  const gridClass = `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(gridCols, 4)} gap-6`;

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (activeTab === "pending") {
      getToSubmit(page);
    } else if (popular !== null && popular === true) {
      fetchIdeas({
        page: page.toString(),
        popular: "desc",
      });
    } else if (latest !== null) {
      fetchIdeas({ page: page.toString(), latest: latest ? "true" : "false" });
    } else {
      fetchIdeas({ page: page.toString() });
    }
  }, [page, popular, latest, fetchIdeas, getToSubmit, activeTab]);

  const handleTabChange = (tab: "all" | "pending") => {
    setActiveTab(tab);
    setPage(1);
    setPopular(null);
    setLatest(null);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center py-8"
      >
        <span className="loading loading-spinner loading-lg"></span>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 pb-24 w-full">
      {/* Header with tabs and filters */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full"
      >
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
            onClick={() => handleTabChange("all")}
          >
            All Ideas
          </button>
          <button
            className={`tab ${activeTab === "pending" ? "tab-active" : ""}`}
            onClick={() => handleTabChange("pending")}
          >
            Pending Ideas
          </button>
        </div>

        {activeTab === "all" && (
          <div className="flex gap-4 justify-center sm:justify-end">
            <motion.label
              variants={itemVariants}
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="radio"
                name="radio-4"
                className="radio radio-primary"
                checked={popular === true}
                onChange={() => {
                  setPage(1);
                  setPopular(true);
                  setLatest(null);
                }}
              />
              Popular
            </motion.label>
            <motion.label
              variants={itemVariants}
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="radio"
                name="radio-4"
                className="radio radio-primary"
                checked={latest === true}
                onChange={() => {
                  setPage(1);
                  setPopular(false);
                  setLatest(true);
                }}
              />
              Latest
            </motion.label>
          </div>
        )}
      </motion.div>

      {/* Ideas Grid */}
      {displayedIdeas.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center py-8"
        >
          <div>No ideas found.</div>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={gridClass}
        >
          {displayedIdeas.map((idea) => (
            <Link
              key={idea.id}
              href={`/dashboard/ideas/${idea.id}`}
              className="h-full"
            >
              <motion.div variants={itemVariants} className="h-full" layout>
                <IdeaCard idea={idea} />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {lastPageToShow > 1 && (
        <motion.div
          variants={itemVariants}
          className="fixed bottom-6 left-0 right-0 flex justify-center z-10"
        >
          <div className="join bg-base-100">
            {Array.from({ length: Math.min(lastPageToShow, 10) }).map(
              (_, index) => (
                <motion.input
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="join-item btn btn-square"
                  type="radio"
                  name="options"
                  aria-label={`${index + 1}`}
                  checked={currentPageToShow === index + 1}
                  onChange={() => {
                    setPage(index + 1);
                  }}
                />
              ),
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
