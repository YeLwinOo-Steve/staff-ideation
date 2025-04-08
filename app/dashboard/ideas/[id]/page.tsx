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
  Send,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useApiStore } from "@/store/apiStore";
import { getInitials } from "@/util/getInitials";
import { formatDistanceToNow } from "date-fns";
import saveAs from "file-saver";
import JSZip from "jszip";
import { AnimatedNumber } from "../../components/animatedNumber";
import { useToast } from "@/components/toast";

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
    "initial" | "idea" | "comments" | "complete"
  >("initial");
  const {
    getIdea,
    getCommentsForIdea,
    idea,
    comments,
    isLoading,
    createVote,
    createComment,
    deleteIdea,
  } = useApiStore();
  const [userVote, setUserVote] = useState<number>(0);
  const [voteCount, setVoteCount] = useState<number>(0);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isAnonymousComment, setIsAnonymousComment] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();

  const handleVote = (value: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newVoteValue = userVote === value ? 0 : value;
    const voteDelta = newVoteValue - userVote;
    setVoteCount((prevCount) => prevCount + voteDelta);
    setUserVote(newVoteValue);
    handleVoteSubmit();
  };

  const handleVoteSubmit = async () => {
    if (!userVote) return;
    await createVote(Number(id), userVote);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    const formData = new FormData();
    formData.append("idea_id", id as string);
    formData.append("comment", newComment);
    formData.append("is_anonymous", isAnonymousComment ? "1" : "0");
    try {
      await createComment(formData);
      setNewComment("");
      setIsSubmittingComment(false);
      showSuccessToast("Comment submitted successfully");
    } catch (e) {
      console.error("Error submitting comment:", e);
      showErrorToast(e as string);
      setIsSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIdea(Number(id));
      showSuccessToast("Idea deleted successfully");
      router.back();
    } catch (e) {
      console.error("Error deleting idea:", e);
      showErrorToast("Failed to delete idea");
    }
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
        setLoadingStage("complete");
      }
    };
    loadComments();
  }, [id, getCommentsForIdea, loadingStage]);

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
        <div className="bg-base-100 z-30 -mx-6 px-6 py-4">
          <div className="flex justify-between max-w-6xl mx-auto">
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-ghost btn-sm"
              onClick={() => router.back()}
            >
              <ChevronLeft size={20} />
              <span className="font-bold">Back to ideas</span>
            </motion.button>
            <div className="flex gap-2">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="btn btn-sm btn-primary"
              >
                <Pencil size={16} />
                <span className="font-bold">Edit</span>
              </motion.button>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="btn btn-sm btn-error"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash size={16} />
                <span className="font-bold">Delete</span>
              </motion.button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 pt-4">
          {/* Header section */}
          <motion.div
            variants={itemVariants}
            className="bg-base-200 p-6 rounded-lg mb-6"
          >
            <h1 className="font-bold text-2xl mb-4">{idea.title}</h1>
            <div className="flex justify-between items-center flex-wrap">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-white mask mask-squircle w-12 h-12 flex items-center justify-center text-xs font-bold">
                    {idea.is_anonymous
                      ? "A"
                      : getInitials(idea.user_name || "")}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-md">
                    {idea.is_anonymous ? "Anonymous User" : idea.user_name}
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
            <div className="flex items-center gap-2">
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileTap="tap"
                whileHover="hover"
                className={`btn btn-circle btn-md ${
                  userVote === 1
                    ? "bg-primary text-primary-content border-0"
                    : "bg-primary/10 hover:bg-primary border-0"
                }`}
                onClick={(e) => handleVote(1, e)}
              >
                <ThumbsUp className="w-6 h-6" />
              </motion.button>

              <AnimatedNumber value={voteCount} />

              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileTap="tap"
                whileHover="hover"
                className={`btn btn-circle btn-md ${
                  userVote === -1
                    ? "bg-error text-error-content border-0"
                    : "bg-error/10 hover:bg-error border-0"
                }`}
                onClick={(e) => handleVote(-1, e)}
              >
                <ThumbsDown className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>

          {/* Comments section */}
          <motion.div
            variants={listContainerVariants}
            className="mt-8 space-y-6"
          >
            <motion.h2
              variants={itemVariants}
              className="text-xl font-bold flex items-center gap-2"
            >
              Comments{" "}
              <span className="badge badge-outline text-sm opacity-70">
                {comments.length}
              </span>
            </motion.h2>

            {/* New Comment Form */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleCommentSubmit}
              className="flex flex-col gap-4 bg-base-200 p-4 rounded-lg"
            >
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-primary"
                    checked={isAnonymousComment}
                    onChange={(e) => setIsAnonymousComment(e.target.checked)}
                  />
                  <span className="text-sm opacity-75">
                    Comment anonymously
                  </span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setNewComment("");
                      setIsAnonymousComment(false);
                    }}
                    disabled={isSubmittingComment || !newComment.trim()}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={isSubmittingComment || !newComment.trim()}
                    onClick={handleCommentSubmit}
                  >
                    {isSubmittingComment ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <Send size={16} />
                    )}
                    Comment
                  </button>
                </div>
              </div>
            </motion.form>

            {/* Comments List */}
            {comments.length === 0 ? (
              <motion.p
                variants={itemVariants}
                className="text-center text-sm opacity-70 bg-base-200 p-4 rounded-lg"
              >
                No comments yet. Be the first to comment!
              </motion.p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    variants={itemVariants}
                    className="bg-base-200 p-4 rounded-lg"
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
                    <p className="text-md ml-10">{comment.comment}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-base-100 p-6 rounded-lg max-w-md w-full mx-4"
          >
            <h3 className="font-bold text-lg mb-4">Delete Idea</h3>
            <p className="mb-6">
              Are you sure you want to delete this idea? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-ghost"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default IdeaDetail;
