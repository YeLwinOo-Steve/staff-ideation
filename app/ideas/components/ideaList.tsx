import { motion } from "framer-motion";
import IdeaCard from "./ideaCard";
import { useApiStore } from "@/store/apiStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { hasAnyRole } from "@/app/lib/utils";
import ReportedIdeaList from "./ReportedIdeaList";
import CategoryChip from "./categoryChip";
import { Search, ClipboardList, AlertCircle } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "reported">(
    "all",
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    ideaPagination: { data: ideas, currentPage, lastPage, loading },
    pendingIdeaPagination: {
      data: pendingIdeas,
      currentPage: pendingCurrentPage,
      lastPage: pendingLastPage,
      loading: pendingLoading,
    },
    reportedIdeas: {
      currentPage: reportedCurrentPage,
      lastPage: reportedLastPage,
      loading: reportedLoading,
    },
    categories,
    fetchIdeas,
    fetchCategories,
    getToSubmit,
    fetchReportedIdeas,
  } = useApiStore();

  const user = useAuthStore((state) => state.user);
  const canSubmitIdea = hasAnyRole(user, ["QA coordinators"]);
  const isQAManager = hasAnyRole(user, ["QA manager"]);

  const displayedIdeas = activeTab === "pending" ? pendingIdeas : ideas;

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

  const gridClass = `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(
    gridCols,
    4,
  )} gap-6`;

  useEffect(() => {
    console.log("Categories state:", categories);
    const loadData = async () => {
      const promises = [];
      if (categories.length === 0) {
        console.log("fetching categories");
        promises.push(fetchCategories());
      }
      if (promises.length > 0) {
        await Promise.all(promises);
      }
    };
    loadData();
  }, [fetchCategories, categories]);

  useEffect(() => {
    if (activeTab === "pending") {
      getToSubmit(page);
    } else if (activeTab === "reported") {
      fetchReportedIdeas(page);
    } else if (popular !== null && popular === true) {
      fetchIdeas({
        page: page.toString(),
        popular: "desc",
        ...(debouncedSearchTerm && { title: debouncedSearchTerm }),
      });
    } else if (latest !== null) {
      fetchIdeas({
        page: page.toString(),
        latest: latest ? "true" : "false",
        ...(debouncedSearchTerm && { title: debouncedSearchTerm }),
      });
    } else {
      fetchIdeas({
        page: page.toString(),
        ...(debouncedSearchTerm && { title: debouncedSearchTerm }),
      });
    }
  }, [
    page,
    popular,
    latest,
    fetchIdeas,
    getToSubmit,
    fetchReportedIdeas,
    activeTab,
    debouncedSearchTerm,
  ]);

  const handleTabChange = (tab: "all" | "pending" | "reported") => {
    setActiveTab(tab);
    setPage(1);
    setPopular(null);
    setLatest(null);
  };

  const filteredIdeas = selectedCategoryId
    ? displayedIdeas.filter((idea) =>
        idea.category?.some((catName) => {
          const cat = categories.find((c) => c.id === selectedCategoryId);
          return cat && cat.name === catName;
        }),
      )
    : displayedIdeas;

  const [filteredIdeasState, setFilteredIdeasState] = useState(filteredIdeas);

  useEffect(() => {
    const filtered = ideas.filter((idea) => {
      if (selectedCategoryId === null) return true;
      return idea.category?.some((catName) => {
        const cat = categories.find((c) => c.id === selectedCategoryId);
        return cat && cat.name === catName;
      });
    });
    setFilteredIdeasState(filtered);
  }, [ideas, selectedCategoryId, categories]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-2">
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

        <div className="flex items-center gap-4">
          {activeTab === "all" && (
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
          )}
          {activeTab === "all" && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // Reset to first page when searching
                }}
                className="input input-bordered input-md pl-9 pr-3 w-full sm:w-[300px] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}
        </div>
      </div>
      {/* Category Chips Row */}
      <div className="w-full overflow-x-auto p-1">
        <div className="flex flex-row gap-2 min-w-max">
          {activeTab === "all" &&
            categories.map((cat) => (
              <div key={cat.id}>
                <CategoryChip
                  category={cat}
                  isSelected={selectedCategoryId === cat.id}
                  onClick={() =>
                    setSelectedCategoryId(
                      selectedCategoryId === cat.id ? null : cat.id,
                    )
                  }
                />
              </div>
            ))}
        </div>
      </div>
      {/* Ideas Grid with Loading State */}
      {isLoading ? (
        <motion.div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </motion.div>
      ) : activeTab === "reported" ? (
        <ReportedIdeaList />
      ) : filteredIdeasState.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center py-16 px-4"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full" />
            <div className="relative bg-primary/10 p-6 rounded-full">
              {activeTab === "pending" ? (
                <ClipboardList className="w-12 h-12 text-primary" />
              ) : (
                <AlertCircle className="w-12 h-12 text-primary" />
              )}
            </div>
            <div className="absolute -right-2 -top-2 bg-base-100 rounded-full p-2">
              <Search className="w-5 h-5 text-primary animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-center m-2">
            {activeTab === "pending" ? "No Pending Ideas" : "No Ideas Found"}
          </h3>
          <p className="text-base-content/60 text-center max-w-sm">
            {activeTab === "pending"
              ? "There are no ideas waiting for approval at the moment. New submissions will appear here."
              : selectedCategoryId
                ? "No ideas found in the selected category. Try selecting a different category or removing filters."
                : "No ideas match your current search. Try adjusting your search terms or removing filters."}
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={gridClass}
        >
          {filteredIdeasState.map((idea) => (
            <motion.div
              key={idea.id}
              variants={itemVariants}
              className="h-full"
              layout
            >
              <Link href={`/ideas/${idea.id}`} className="h-full">
                <IdeaCard idea={idea} />
              </Link>
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
