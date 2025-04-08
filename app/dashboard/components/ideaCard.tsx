"use client";

import { Idea } from "@/api/models";
import {
  MessageCircle,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { getInitials } from "@/util/getInitials";
import { useState } from "react";
import { motion } from "framer-motion";
import { EyeOff, Flag } from "lucide-react";
import { AnimatedNumber } from "./animatedNumber";

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

  return (
    <motion.div
      variants={itemVariants}
      className="card bg-base-200 shadow-sm hover:shadow-sm duration-100 h-full"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <div className="card-body p-5">
        <div className="flex flex-col gap-4">
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
                  console.log("flagged idea", idea.id);
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
      </div>
    </motion.div>
  );
}
