"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApiStore } from "@/store/apiStore";
import { useToast } from "@/components/toast";
import ReportedIdeaCard from "./ReportedIdeaCard";
import { ReportDetailsModal } from "./ReportDetailsModal";
import { motion } from "framer-motion";
import { Flag, AlertCircle } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export default function ReportedIdeaList() {
  const router = useRouter();
  const [selectedIdeaId, setSelectedIdeaId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    reportedIdeas: { data: reportedIdeasData },
    fetchReportDetails,
    reportDetails,
  } = useApiStore();
  const { showErrorToast } = useToast();

  const handleViewDetails = async (ideaId: number) => {
    setSelectedIdeaId(ideaId);
    setIsLoading(true);
    try {
      await fetchReportDetails(ideaId);
    } catch (error) {
      console.log("failed to fetch report details", error);
      showErrorToast("Failed to fetch report details");
      setSelectedIdeaId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedIdea = reportedIdeasData.find(
    (idea) => idea.id === selectedIdeaId,
  );

  const handleMoreDetails = () => {
    router.push(`/reports/ideas/${selectedIdeaId}`);
  };
  
  if (reportedIdeasData.length === 0) {
    return (
      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-ping bg-primary/20 rounded-full" />
          <div className="relative bg-primary/10 p-6 rounded-full">
            <Flag className="w-12 h-12 text-primary" />
          </div>
          <div className="absolute -right-2 -top-2 bg-base-100 rounded-full p-2">
            <AlertCircle className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-center m-2">
          No Reported Ideas
        </h3>
        <p className="text-base-content/60 text-center max-w-sm">
          No ideas have been reported. Reported ideas will appear here for review.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {reportedIdeasData.map((idea) => (
          <ReportedIdeaCard
            key={idea.id}
            idea={idea}
            onViewDetails={handleViewDetails}
          />
        ))}
      </motion.div>

      {selectedIdea && (
        <ReportDetailsModal
          isOpen={selectedIdeaId !== null}
          onClose={() => setSelectedIdeaId(null)}
          onMoreDetails={() => handleMoreDetails()}
          idea={selectedIdea}
          reportDetails={reportDetails}
          isLoading={isLoading}
        />
      )}
    </>
  );
}
