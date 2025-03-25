import { motion } from "framer-motion";
import IdeaCard from "./ideaCard";
import { useApiStore } from "@/store/apiStore";
import { useState, useEffect } from "react";

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
  const {
    ideaPagination: { data: ideas, currentPage, lastPage, loading },
    fetchIdeas,
  } = useApiStore();

  const gridClass = `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${Math.min(gridCols, 4)} gap-4`;

  useEffect(() => {
    if (popular !== null && popular === true) {
      fetchIdeas({
        page: page.toString(),
        popular: "desc",
      });
    } else if (latest !== null) {
      fetchIdeas({ page: page.toString(), latest: latest ? "true" : "false" });
    } else {
      fetchIdeas({ page: page.toString() });
    }
  }, [page, popular, latest, fetchIdeas]);

  if (loading) {
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 w-full max-w-full overflow-hidden"
    >
      <motion.div
        variants={containerVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <h2 className="text-xl font-bold">Ideas</h2>
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
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
      </motion.div>

      {ideas.length === 0 ? (
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
          {ideas.map((idea) => (
            <motion.div
              key={idea.id}
              variants={itemVariants}
              className="h-full"
              layout // Add layout prop for smooth grid transitions
            >
              <IdeaCard idea={idea} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {lastPage > 1 && (
        <motion.div
          variants={itemVariants}
          className="flex justify-center mt-4 overflow-x-auto pb-2"
        >
          <div className="join">
            {Array.from({ length: Math.min(lastPage, 10) }).map((_, index) => (
              <motion.input
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="join-item btn btn-square"
                type="radio"
                name="options"
                aria-label={`${index + 1}`}
                checked={currentPage === index + 1}
                onChange={() => {
                  setPage(index + 1);
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
