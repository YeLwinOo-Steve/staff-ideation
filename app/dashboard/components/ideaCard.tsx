"use client";

import { Idea } from "@/api/models";
import { MessageCircle, Paperclip, ThumbsUp, ThumbsDown } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getInitials } from "@/util/getInitials";
import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedNumber } from "./animatedNumber";

interface IdeaCardProps {
  idea: Idea;
  showVoteButtons?: boolean;
}

const buttonVariants = {
  initial: { scale: 1 },
  tap: { scale: 0.9 },
  hover: { scale: 1.1 },
};

export default function IdeaCard({ idea }: IdeaCardProps) {
  const formattedDate = idea.time
    ? formatDistanceToNow(new Date(idea.time), { addSuffix: true })
    : "";

  const [userVote, setUserVote] = useState<number>(idea.user_vote_value || 0);
  const [voteCount, setVoteCount] = useState<number>(
    idea.total_vote_value || 0
  );
  // If anonymous, don't show user details
  const isAnonymous = idea.is_anonymous;
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

  return (
    <Link
      href={`/dashboard/ideas/${idea.id}`}
      className="card bg-base-200 h-full flex flex-col"
    >
      <div className="card-body p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="avatar placeholder">
            <div className="bg-primary text-white mask mask-squircle w-12 h-12 flex items-center justify-center text-xs font-bold">
              {/* {idea.user_photo && !isAnonymous ? (
                <img
                  src={idea.user_photo}
                  alt={userName}
                  className="object-cover mask mask-squircle"
                />
              ) : (
                getInitials(userName)
              )} */}
              {isAnonymous ? "A" : getInitials(userName)}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-sm">{userName}</span>
            {idea.time && (
              <span className="text-xs opacity-70">{formattedDate}</span>
            )}
          </div>
        </div>

        {/* Title and Content */}
        <h3 className="card-title text-base">{idea.title}</h3>
        <p className="text-md opacity-80 mb-2 line-clamp-4">{idea.content}</p>

        {/* Categories */}
        {idea.category && idea.category.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {idea.category.map((cat, index) => (
              <div
                key={index}
                className="badge badge-primary badge-outline text-xs"
              >
                {cat}
              </div>
            ))}
          </div>
        )}

        <div className="card-actions justify-between lg:justify-end items-center mt-auto pt-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 lg:mr-8">
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileTap="tap"
                whileHover="hover"
                className={`p-2 rounded-full transition-colors duration-200 ${
                  userVote === 1 ? "bg-primary/10" : "hover:bg-primary/5"
                }`}
                onClick={(e) => handleVote(1, e)}
              >
                <motion.div
                  animate={{
                    scale: userVote === 1 ? [1, 1.2, 1] : 1,
                    transition: { duration: 0.2 },
                  }}
                >
                  <ThumbsUp
                    className={`w-6 h-6 transition-colors duration-200 ${
                      userVote === 1
                        ? "stroke-primary fill-primary"
                        : "stroke-gray-600 hover:stroke-primary"
                    }`}
                  />
                </motion.div>
              </motion.button>

              <AnimatedNumber value={voteCount} />

              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileTap="tap"
                whileHover="hover"
                className={`p-2 rounded-full transition-colors duration-200 ${
                  userVote === -1 ? "bg-error/10" : "hover:bg-error/5"
                }`}
                onClick={(e) => handleVote(-1, e)}
              >
                <motion.div
                  animate={{
                    scale: userVote === -1 ? [1, 1.2, 1] : 1,
                    transition: { duration: 0.2 },
                  }}
                >
                  <ThumbsDown
                    className={`w-6 h-6 transition-colors duration-200 ${
                      userVote === -1
                        ? "stroke-error fill-error"
                        : "stroke-gray-600 hover:stroke-error"
                    }`}
                  />
                </motion.div>
              </motion.button>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:mr-4 btn btn-sm shadow-none">
            <span className="text-md font-bold">{idea.comments || 0}</span>
            <MessageCircle size={24} />
          </div>

          <div className="flex items-center gap-2 btn btn-sm shadow-none">
            <span className="text-md font-bold">{idea.files?.length || 0}</span>
            <Paperclip size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
}
