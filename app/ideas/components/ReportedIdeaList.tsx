"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApiStore } from "@/store/apiStore";
import { useToast } from "@/components/toast";
import ReportedIdeaCard from "./ReportedIdeaCard";
import { ReportDetailsModal } from "./ReportDetailsModal";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
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
