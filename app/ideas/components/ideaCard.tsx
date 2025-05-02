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
} from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { getInitials } from "@/util/getInitials";
import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedNumber } from "./animatedNumber";
import { useApiStore } from "@/store/apiStore";
import { useToast } from "@/components/toast";
import ReportDialog from "./ReportDialog";

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
      ease: "easeInOut",
    },
  },
};

const buttonVariants = {
  initial: { scale: 1 },
  tap: { scale: 0.9 },
  hover: { scale: 1.1 },
};

export default function IdeaCard({ idea }: IdeaCardProps) {
  const { submitIdea, error, createVote } = useApiStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();
  const [showReportDialog, setShowReportDialog] = useState(false);
  const formattedDate = idea.time
    ? formatDistanceToNow(new Date(idea.time), { addSuffix: true })
    : "";

  const [isVoting, setIsVoting] = useState(false);
  const [voteCountLocal, setVoteCountLocal] = useState(
    idea.total_vote_value || 0
  );
  const [userVoteLocal, setUserVoteLocal] = useState(idea.user_vote_value || 0);

  // If anonymous, don't show user details
  const isAnonymous = idea.is_anonymous || idea.user_name === "Anonymous";
  const userName = isAnonymous ? "Anonymous" : idea.user_name || "Unknown";

  const handleVote = async (e: React.MouseEvent, value: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (isVoting) return;

    try {
      setIsVoting(true);

      setVoteCountLocal((prev) => prev + (value - userVoteLocal));
      setUserVoteLocal(value);

      await createVote(idea.id, idea.total_vote_value || 0 + value);
    } catch (e) {
      console.error("Failed to update vote", e);
      setVoteCountLocal(idea.total_vote_value || 0);
      setUserVoteLocal(idea.user_vote_value || 0);
      showErrorToast(error || "Failed to update vote");
    } finally {
      setIsVoting(false);
    }
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Only allow click propagation if the click was directly on the card
    // and not on any interactive elements
    if (e.target === e.currentTarget) {
      return;
    }
    e.stopPropagation();
  };

  return (
    <>
      <motion.div
        variants={itemVariants}
        className="card border border-primary shadow-sm hover:shadow-sm duration-100 h-full cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        layout
        onClick={handleCardClick}
      >
        <div
          className="card-body p-5 flex flex-col h-full cursor-pointer"
          onClick={handleCardClick}
        >
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex justify-between items-center">
              <div
                className="flex items-center gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-primary/10 rounded-xl mask mask-squircle w-12 h-12 flex items-center justify-center text-xs font-bold">
                  {isAnonymous ? (
                    <EyeOff className="w-4 h-4" />
                  ) : idea.user_photo &&
                    idea.user_photo.includes("cloudinary") ? (
                    <Image
                      src={idea.user_photo}
                      alt={userName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      priority
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

              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  className="btn btn-circle btn-sm bg-warning/50 hover:bg-warning border-0"
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
                  <Flag className="w-4 h-4 group-hover:text-warning" />
                </motion.button>
              </div>
            </div>

            <div className="divider divider-primary before:h-[1px] after:h-[1px] my-0"></div>

            {/* Content */}
            <p className="text-md opacity-80 line-clamp-4">{idea.content}</p>

            {/* Categories */}
            {idea.category && idea.category.length > 0 && (
              <div
                className="flex flex-wrap gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {idea.category.map((cat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="badge badge-lg bg-primary/10 text-primary border-primary/20 gap-1 px-4 py-3"
                  >
                    {cat}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom row with voting, comments and attachments */}
          <div
            className="flex items-center justify-between mt-auto pt-4"
            onClick={(e) => e.stopPropagation()}
          >
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
                  Publish Idea
                </motion.button>
              ) : (
                <>
                  <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileTap="tap"
                    whileHover="hover"
                    className={`btn btn-circle btn-sm ${
                      userVoteLocal === 1
                        ? "bg-primary text-primary-content border-0"
                        : "bg-primary/50 hover:bg-primary border-0"
                    }`}
                    onClick={(e) => handleVote(e, 1)}
                    disabled={isVoting}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </motion.button>

                  <AnimatedNumber value={voteCountLocal} />

                  <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileTap="tap"
                    whileHover="hover"
                    className={`btn btn-circle btn-sm ${
                      userVoteLocal === -1
                        ? "bg-error text-error-content border-0"
                        : "bg-error/50 hover:bg-error border-0"
                    }`}
                    onClick={(e) => handleVote(e, -1)}
                    disabled={isVoting}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </motion.button>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-info/50 px-3 py-2 rounded-xl">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {idea.comments || 0}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-success/50 px-3 py-2 rounded-xl">
                <Paperclip className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {idea.files?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <ReportDialog
        idea={idea}
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
      />
    </>
  );
}
