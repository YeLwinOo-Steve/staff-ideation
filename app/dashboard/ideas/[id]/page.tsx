"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  ThumbsDown,
  ThumbsUp,
  ChevronLeft,
  Pencil,
  Trash,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useApiStore } from "@/store/apiStore";
import { getInitials } from "@/util/getInitials";
import { formatDistanceToNow } from "date-fns";
import saveAs from "file-saver";
import JSZip from "jszip";
import { AnimatedNumber } from "../../components/animatedNumber";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
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

const listContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const zip = new JSZip();

const ZipDownloadBtn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "downloading" | "zipping" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const urls = [
    "https://i.pinimg.com/736x/7e/f3/00/7ef3009e0efeb251f1d6d16f56ddff64.jpg",
    "https://i.pinimg.com/236x/ac/0d/b7/ac0db732637f7a08231ea4cd23d411a9.jpg",
  ];

  const downloadZipFile = async () => {
    try {
      setIsLoading(true);
      setStatus("downloading");
      setError(null);

      for (const [index, url] of urls.entries()) {
        try {
          const proxyUrl = "https://api.allorigins.win/raw?url=";
          const res = await fetch(proxyUrl + encodeURIComponent(url));
          if (!res.ok) throw new Error(`Failed to download file ${index + 1}`);

          const blob = await res.blob();
          zip.file(`file${index + 1}.${blob.type.split("/")[1]}`, blob);
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred";
          throw new Error(
            `Error downloading file ${index + 1}: ${errorMessage}`,
          );
        }
      }
      setStatus("zipping");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "downloaded_documents.zip");
      setStatus("idle");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "downloading":
        return (
          <>
            <span className="loading loading-spinner"></span>
            <span className="ml-2">Downloading files...</span>
          </>
        );
      case "zipping":
        return (
          <>
            <span className="loading loading-spinner"></span>
            <span className="ml-2">Creating ZIP file...</span>
          </>
        );
      case "error":
        return "Try Again";
      default:
        return (
          <>
            <Download size={16} />
            <span className="ml-2">Download Files</span>
          </>
        );
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <button
        onClick={downloadZipFile}
        className={`btn btn-sm btn-outline mb-2 ${status === "error" ? "btn-error" : ""}`}
        disabled={isLoading}
      >
        {getButtonText()}
      </button>
      {error && <div className="txt-error text-base">{error}</div>}
    </motion.div>
  );
};

const IdeaDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loadingStage, setLoadingStage] = useState<
    "initial" | "idea" | "comments" | "user" | "complete"
  >("initial");
  const {
    getIdea,
    getCommentsForIdea,
    getUser,
    idea,
    user,
    comments,
    isLoading,
  } = useApiStore();
  const [userVote, setUserVote] = useState<number>(0);
  const [voteCount, setVoteCount] = useState<number>(0);

  const handleVote = (value: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newVoteValue = userVote === value ? 0 : value;
    const voteDelta = newVoteValue - userVote;
    setVoteCount((prevCount) => prevCount + voteDelta);
    setUserVote(newVoteValue);
  };

  useEffect(() => {
    const loadIdea = async () => {
      if (id && loadingStage === "initial") {
        setLoadingStage("idea");
        await getIdea(Number(id));
        setLoadingStage("comments");
      }
    };
    loadIdea();
  }, [id, getIdea, loadingStage]);

  useEffect(() => {
    const loadComments = async () => {
      if (id && loadingStage === "comments") {
        await getCommentsForIdea(Number(id));
        setLoadingStage("user");
      }
    };
    loadComments();
  }, [id, getCommentsForIdea, loadingStage]);

  useEffect(() => {
    const loadUser = async () => {
      if (idea && loadingStage === "user") {
        await getUser(idea.user_id);
        setLoadingStage("complete");
      }
    };
    loadUser();
  }, [idea, getUser, loadingStage]);

  if (loadingStage !== "complete" || isLoading) {
    return (
      <div className="bg-base-100 min-h-screen">
        <motion.div
          className="flex flex-col justify-center items-center h-64 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="loading loading-spinner loading-lg"></span>
          <div className="text-base-content/60">
            {loadingStage === "idea" && "Loading idea details..."}
            {loadingStage === "comments" && "Loading comments..."}
            {loadingStage === "user" && "Loading user information..."}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="bg-base-100 min-h-screen">
        <motion.div
          className="flex justify-center items-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="alert alert-error max-w-md">
            <span>
              Failed to load idea. The idea may not exist or you don&apos;t have
              permission to view it.
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="px-6 py-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Back button section */}
        <div className="flex justify-between mx-4 my-2">
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-ghost btn-md mb-4"
            onClick={() => router.back()}
          >
            <ChevronLeft size={24} />
            <span className="font-bold">Back to ideas</span>
          </motion.button>
          <div className="flex gap-2 mb-4">
            <button className="btn btn-sm">
              <Pencil size={16} />
              <span className="font-bold">Edit</span>
            </button>
            <button className="btn btn-sm btn-error">
              <Trash size={16} />
              <span className="font-bold">Delete</span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {/* Header section */}
          <motion.div
            variants={itemVariants}
            className="bg-base-200 p-6 rounded-lg mb-6"
          >
            <h1 className="font-bold text-2xl mb-4">{idea.title}</h1>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-base-100 text-primary-content mask mask-squircle w-12 h-12 flex items-center justify-center text-xs font-bold">
                    {idea.is_anonymous ? "A" : getInitials(user?.name || "")}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-md">
                    {idea.is_anonymous ? "Anonymous User" : user?.name}
                  </span>
                  {idea.updated_at && (
                    <span className="text-xs opacity-70">
                      {formatDistanceToNow(new Date(idea.updated_at), {
                        addSuffix: true,
                      })}
                    </span>
                  )}
                </div>
              </div>
              <ZipDownloadBtn />
            </div>
          </motion.div>

          {/* Content section */}
          <motion.div variants={itemVariants} className="prose max-w-none mb-8">
            <p className="text-lg">{idea.content}</p>
          </motion.div>

          {/* Voting section */}
          <motion.div
            variants={itemVariants}
            className="flex justify-end items-center gap-3 mb-8"
          >
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
                    className={`w-8 h-8 transition-colors duration-200 ${
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
                    className={`w-8 h-8 transition-colors duration-200 ${
                      userVote === -1
                        ? "stroke-error fill-error"
                        : "stroke-gray-600 hover:stroke-error"
                    }`}
                  />
                </motion.div>
              </motion.button>
            </div>
          </motion.div>

          {/* Comments section */}
          <motion.div variants={listContainerVariants} className="mt-8">
            <motion.h2
              variants={itemVariants}
              className="text-xl font-bold mb-4 flex items-center gap-2"
            >
              Comments{" "}
              <span className="badge badge-outline text-sm opacity-70">
                {comments.length}
              </span>
            </motion.h2>
            {comments.length === 0 ? (
              <motion.p
                variants={itemVariants}
                className="text-center text-sm opacity-70"
              >
                No comments yet
              </motion.p>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  variants={itemVariants}
                  className="bg-base-200 p-4 rounded-lg mb-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="avatar placeholder">
                      <div className="bg-base-100 text-primary-content mask mask-squircle w-8 h-8 flex items-center justify-center text-xs font-bold">
                        {comment.is_anonymous
                          ? "?"
                          : getInitials(comment.user_name)}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {comment.user_name}
                      </span>
                      {comment.created_at && (
                        <span className="text-xs opacity-70">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-md ml-12">{comment.comment}</p>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default IdeaDetail;
