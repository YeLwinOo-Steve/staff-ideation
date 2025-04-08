"use client";

import { Idea } from "@/api/models";
import {
  MessageCircle,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  Send,
  EyeOff,
  Flag,
  AlertTriangle,
  X,
} from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { getInitials } from "@/util/getInitials";
import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedNumber } from "./animatedNumber";
import { useApiStore } from "@/store/apiStore";
import { useToast } from "@/components/toast";

interface IdeaCardProps {
  idea: Idea;
  showVoteButtons?: boolean;
}

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

const buttonVariants = {
  initial: { scale: 1 },
  tap: { scale: 0.9 },
  hover: { scale: 1.1 },
};

export default function IdeaCard({ idea }: IdeaCardProps) {
  const { submitIdea, error } = useApiStore();
  const { showSuccessToast, showErrorToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const formattedDate = idea.time
    ? formatDistanceToNow(new Date(idea.time), { addSuffix: true })
    : "";

  const [userVote, setUserVote] = useState<number>(idea.user_vote_value || 0);
  const [voteCount, setVoteCount] = useState<number>(
    idea.total_vote_value || 0
  );
  // If anonymous, don't show user details
  const isAnonymous = idea.is_anonymous || idea.user_name === "Anonymous";
  const userName = isAnonymous ? "Anonymous" : idea.user_name || "Unknown";

  const handleVote = (value: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let newVoteValue;
    if (userVote === value) {
      newVoteValue = 0;
    } else {
      newVoteValue = value;
    }

    const voteDelta = newVoteValue - userVote;
    setVoteCount((prevCount) => prevCount + voteDelta);
    setUserVote(newVoteValue);

    // TODO (Ye): API call to update vote
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsSubmitting(true);
    try {
      await submitIdea(idea.id);
      showSuccessToast("Idea submitted successfully");
    } catch (e) {
      console.error("Failed to submit idea", e);
      showErrorToast(error || "Failed to submit idea");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      showSuccessToast("Idea reported successfully");
      setShowReportDialog(false);
    } catch (e) {
      console.error("Failed to report idea", e);
      showErrorToast("Failed to report idea");
    }
  };

  return (
    <>
      <motion.div
        variants={itemVariants}
        className="card bg-base-200 shadow-sm hover:shadow-sm duration-100 h-full"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        layout
      >
        <div className="card-body p-5 flex flex-col h-full">
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-xl mask mask-squircle w-12 h-12 flex items-center justify-center text-xs font-bold">
                  {isAnonymous ? (
                    <EyeOff className="w-4 h-4" />
                  ) : idea.user_photo &&
                    idea.user_photo.includes("cloudinary") ? (
                    <Image
                      src={idea.user_photo}
                      alt={userName}
                      width={40}
                      height={40}
                      className="object-cover mask mask-squircle"
                    />
                  ) : (
                    getInitials(userName)
                  )}
                </div>
                <div className="flex flex-col">
                  <h3 className="card-title text-lg">{idea.title}</h3>
                  <span className="text-xs opacity-70">{formattedDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  className="btn btn-circle btn-sm bg-error/10 hover:bg-error border-0"
                  variants={buttonVariants}
                  initial="initial"
                  whileTap="tap"
                  whileHover="hover"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowReportDialog(true);
                  }}
                >
                  <Flag className="w-4 h-4 text-error" />
                </motion.button>
              </div>
            </div>

            <div className="divider divider-primary before:h-[1px] after:h-[1px] my-0"></div>

            {/* Content */}
            <p className="text-md opacity-80 line-clamp-4">{idea.content}</p>

            {/* Categories */}
            {idea.category && idea.category.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {idea.category.map((cat, index) => (
                  <div
                    key={index}
                    className="badge badge-primary badge-outline text-xs px-3 py-2"
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom row with voting, comments and attachments */}
          <div className="flex items-center justify-between mt-auto pt-4">
            <div className="flex items-center gap-2">
              {idea.isPending ? (
                <motion.button
                  variants={buttonVariants}
                  initial="initial"
                  whileTap="tap"
                  whileHover="hover"
                  className="btn btn-primary btn-sm gap-2"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Submit Idea
                </motion.button>
              ) : (
                <>
                  <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileTap="tap"
                    whileHover="hover"
                    className={`btn btn-circle btn-sm ${
                      userVote === 1
                        ? "bg-primary text-primary-content border-0"
                        : "bg-primary/10 hover:bg-primary border-0"
                    }`}
                    onClick={(e) => handleVote(1, e)}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </motion.button>

                  <AnimatedNumber value={voteCount} />

                  <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileTap="tap"
                    whileHover="hover"
                    className={`btn btn-circle btn-sm ${
                      userVote === -1
                        ? "bg-error text-error-content border-0"
                        : "bg-error/10 hover:bg-error border-0"
                    }`}
                    onClick={(e) => handleVote(-1, e)}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </motion.button>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-base-100 px-3 py-2 rounded-xl">
                <MessageCircle className="w-4 h-4 text-info" />
                <span className="text-sm font-medium text-info">
                  {idea.comments || 0}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-base-100 px-3 py-2 rounded-xl">
                <Paperclip className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">
                  {idea.files?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Report Confirmation Dialog */}
      {showReportDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowReportDialog(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-base-100 rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-base-300"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-warning/10 p-3 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold">Report Idea</h3>
                  <p className="text-sm text-base-content/70">{idea.title}</p>
                </div>
              </div>

              <div className="divider divider-warning before:h-[1px] after:h-[1px] my-2"></div>

              <div className="bg-warning/5 p-4 rounded-xl space-y-1">
                <p className="font-medium">
                  Are you sure you want to report this idea?
                </p>
                <p className="text-base-content/70 text-sm">
                  By reporting this idea, you are indicating that it contains:
                </p>
                <ul className="text-sm text-base-content/70 list-disc list-inside space-y-1">
                  <li>Inappropriate or offensive content</li>
                  <li>Violent or harmful material</li>
                  <li>Spam or misleading information</li>
                  <li>Copyright infringement</li>
                </ul>
                <p className="text-sm text-base-content/70 mt-2">
                  QA Coordinator and QA Managers will review this report and
                  take appropriate action.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <motion.button
                  className="btn btn-ghost btn-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowReportDialog(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </motion.button>
                <motion.button
                  className="btn btn-warning btn-sm"
                  onClick={handleReport}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Flag className="w-4 h-4" />
                  Report
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
