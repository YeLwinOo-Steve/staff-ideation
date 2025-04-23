import { motion } from "framer-motion";
import IdeaCard from "./ideaCard";
import ReportedIdeaCard from "./ReportedIdeaCard";
import { useApiStore } from "@/store/apiStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { hasAnyRole } from "@/app/lib/utils";
import { Idea, ReportedIdea } from "@/api/models";

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
    y: 20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export default function IdeaList({ gridCols = 4 }: { gridCols?: number }) {
  const [page, setPage] = useState(1);
  const [latest, setLatest] = useState<boolean | null>(null);
  const [popular, setPopular] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "reported">("all");
  const {
    ideaPagination: { data: ideas, currentPage, lastPage, loading },
    pendingIdeaPagination: {
      data: pendingIdeas,
      currentPage: pendingCurrentPage,
      lastPage: pendingLastPage,
      loading: pendingLoading,
    },
    reportedIdeas: {
      data: reportedIdeasData,
      currentPage: reportedCurrentPage,
      lastPage: reportedLastPage,
      loading: reportedLoading,
    },
    fetchIdeas,
    fetchUsers,
    getToSubmit,
    fetchReportedIdeas,
  } = useApiStore();

  const user = useAuthStore((state) => state.user);
  const canSubmitIdea = hasAnyRole(user, ["QA coordinators"]);
  const isQAManager = hasAnyRole(user, ["QA manager"]);

  const displayedIdeas: Array<Idea | ReportedIdea> = 
    activeTab === "pending" 
      ? pendingIdeas 
      : activeTab === "reported"
      ? reportedIdeasData
      : ideas;
      
  const currentPageToShow =
    activeTab === "pending"
      ? pendingCurrentPage
      : activeTab === "reported"
      ? reportedCurrentPage
      : currentPage;
      
  const lastPageToShow =
    activeTab === "pending"
      ? pendingLastPage
      : activeTab === "reported"
      ? reportedLastPage
      : lastPage;
      
  const isLoading =
    activeTab === "pending"
      ? pendingLoading
      : activeTab === "reported"
      ? reportedLoading
      : loading;

  const gridClass = `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(gridCols, 4)} gap-6`;

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (activeTab === "pending") {
      getToSubmit(page);
    } else if (activeTab === "reported") {
      fetchReportedIdeas(page);
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
  }, [page, popular, latest, fetchIdeas, getToSubmit, fetchReportedIdeas, activeTab]);

  const handleTabChange = (tab: "all" | "pending" | "reported") => {
    setActiveTab(tab);
    setPage(1);
    setPopular(null);
    setLatest(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
            onClick={() => handleTabChange("all")}
          >
            All Ideas
          </button>
          {canSubmitIdea && (
            <button
              className={`tab ${activeTab === "pending" ? "tab-active" : ""}`}
              onClick={() => handleTabChange("pending")}
            >
              Pending Ideas
            </button>
          )}
          {isQAManager && (
            <button
              className={`tab ${activeTab === "reported" ? "tab-active" : ""}`}
              onClick={() => handleTabChange("reported")}
            >
              Reported Ideas
            </button>
          )}
        </div>

        {activeTab === "all" && (
          <div className="flex items-center gap-4">
            <div className="join">
              <input
                type="radio"
                name="sort"
                className="join-item btn btn-sm"
                aria-label="Latest"
                checked={latest === true}
                onChange={() => {
                  setPage(1);
                  setPopular(false);
                  setLatest(true);
                }}
              />
              <input
                type="radio"
                name="sort"
                className="join-item btn btn-sm"
                aria-label="Popular"
                checked={popular === true}
                onChange={() => {
                  setPage(1);
                  setPopular(true);
                  setLatest(null);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Ideas Grid with Loading State */}
      {isLoading ? (
        <motion.div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </motion.div>
      ) : displayedIdeas.length === 0 ? (
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
          {displayedIdeas.map((idea, index) => (
            <motion.div 
              key={activeTab === "reported" ? `reported-${index}` : (idea as Idea).id} 
              variants={itemVariants} 
              className="h-full" 
              layout
            >
              {activeTab === "reported" ? (
                <ReportedIdeaCard idea={idea as ReportedIdea} />
              ) : (
                <Link href={`/dashboard/ideas/${(idea as Idea).id}`} className="h-full">
                  <IdeaCard idea={idea as Idea} />
                </Link>
              )}
            </motion.div>
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
