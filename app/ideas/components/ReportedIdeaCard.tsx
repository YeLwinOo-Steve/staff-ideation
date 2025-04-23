"use client";

import { ReportedIdea } from "@/api/models";
import { EyeOff, Flag } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getInitials } from "@/util/getInitials";

interface ReportedIdeaCardProps {
  idea: ReportedIdea;
  onViewDetails: (ideaId: number) => void;
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

export default function ReportedIdeaCard({
  idea,
  onViewDetails,
}: ReportedIdeaCardProps) {
  const isAnonymous = !idea.user_name || idea.user_name === "Anonymous";
  const userName = isAnonymous ? "Anonymous" : idea.user_name;

  return (
    <motion.div
      variants={itemVariants}
      className="card border border-error shadow-sm hover:shadow-sm duration-100 h-full"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      layout
      onClick={() => onViewDetails(idea.id)}
    >
      <div className="card-body p-5 flex flex-col h-full cursor-pointer">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-error/10 rounded-xl mask mask-squircle w-12 h-12 flex items-center justify-center text-xs font-bold">
                {isAnonymous ? (
                  <EyeOff className="w-4 h-4" />
                ) : idea.photo ? (
                  <Image
                    src={idea.photo}
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
                <span className="text-xs opacity-70">{idea.department}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-error/20 px-3 py-1 rounded-lg">
              <Flag className="w-4 h-4 text-error" />
              <span className="text-md font-bold text-error">
                {idea.no_of_report}
              </span>
            </div>
          </div>

          <div className="divider divider-error before:h-[1px] after:h-[1px] my-0"></div>

          {/* Content */}
          <p className="text-md opacity-80 line-clamp-4">{idea.content}</p>

          {/* Status */}
          {idea.hidden === 1 && (
            <div className="flex items-center gap-2 bg-error/20 px-3 py-2 rounded-xl w-fit">
              <EyeOff className="w-4 h-4 text-error" />
              <span className="text-sm font-medium text-error">Hidden</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
