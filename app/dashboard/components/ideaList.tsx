import IdeaCard from "./ideaCard";
import { useApiStore } from "@/store/apiStore";
import { useState, useEffect } from "react";

interface IdeaListProps {
  baseUrl?: string;
  gridCols?: number;
}

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
      <div className="flex justify-center items-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold">Ideas</h2>
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <label className="flex items-center gap-2">
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
          </label>
          <label className="flex items-center gap-2">
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
          </label>
          {/* <label className="flex items-center gap-2">
            <input
              type="radio"
              name="radio-4"
              className="radio radio-primary"
              checked={latest === false}
              onChange={() => {
                setPage(1);
                setPopular(false);
                setLatest(false);
              }}
            />
            Oldest
          </label> */}
        </div>
      </div>

      {ideas.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <div>No ideas found.</div>
        </div>
      ) : (
        <div className={gridClass}>
          {ideas.map((idea) => (
            <div key={idea.id} className="h-full">
              <IdeaCard idea={idea} />
            </div>
          ))}
        </div>
      )}

      {/* pagination controls */}
      {lastPage > 1 && (
        <div className="flex justify-center mt-4 overflow-x-auto pb-2">
          <div className="join">
            {Array.from({ length: Math.min(lastPage, 10) }).map((_, index) => (
              <input
                key={index}
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
        </div>
      )}
    </div>
  );
}
