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
  Trash2Icon,
  Flag,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useApiStore } from "@/store/apiStore";
import { getInitials } from "@/util/getInitials";
import { formatDistanceToNow } from "date-fns";
import saveAs from "file-saver";
import JSZip from "jszip";
import { AnimatedNumber } from "../../components/animatedNumber";
import { useToast } from "@/components/toast";
import { AxiosError } from "axios";
import ReportDialog from "../../components/ReportDialog";

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
    pendingIdeas,
    comments,
    isLoading,
    createVote,
    createComment,
    deleteIdea,
    submitIdea,
    error,
    getToSubmit,
  } = useApiStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [userVoteLocal, setUserVoteLocal] = useState<number>(0);
  const [voteCountLocal, setVoteCountLocal] = useState<number>(0);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isAnonymousComment, setIsAnonymousComment] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();

  useEffect(() => {
    if (idea) {
      setUserVoteLocal(idea.user_vote_value || 0);
      setVoteCountLocal(idea.total_vote_value || 0);
    }
  }, [idea]);

  const handleVote = async (value: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isVoting) return;

    try {
      setIsVoting(true);

      setVoteCountLocal((prev) => prev + (value - userVoteLocal));
      setUserVoteLocal(value);

      await createVote(Number(id), value);
    } catch (e) {
      console.error("Failed to update vote", e);
      setVoteCountLocal(idea?.total_vote_value || 0);
      setUserVoteLocal(idea?.user_vote_value || 0);
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
      await submitIdea(Number(id));
      setIsPending(false);
      showSuccessToast("Idea submitted successfully");
    } catch (e) {
      console.error("Failed to submit idea", e);
      showErrorToast(error || "Failed to submit idea");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      const formData = new FormData();
      formData.append("idea_id", id as string);
      formData.append("comment", newComment);
      formData.append("is_anonymous", isAnonymousComment ? "1" : "0");

      await createComment(formData);

      // Reset form state after successful submission
      setNewComment("");
      setIsAnonymousComment(false);
      showSuccessToast("Comment submitted successfully");
    } catch (error) {
      const e = error as AxiosError<{ message: string }>;
      const message = e.response?.data?.message || "Failed to submit comment";
      showErrorToast(message);
    } finally {
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

        // First load the idea
        await getIdea(Number(id));

        // Then load pending ideas if needed and check status
        if (pendingIdeas.length === 0) {
          await getToSubmit();
        }

        // Now check the pending status after both operations are complete
        const isPendingIdea = pendingIdeas.some(
          (idea) => idea.id === Number(id),
        );
        setIsPending(isPendingIdea);

        setLoadingStage("comments");
      }
    };
    loadIdea();
  }, [id, getIdea, loadingStage, getToSubmit, pendingIdeas]);

  // Add a separate effect to update pending status when pendingIdeas changes
  useEffect(() => {
    if (id && pendingIdeas.length > 0) {
      const isPendingIdea = pendingIdeas.some((idea) => idea.id === Number(id));
      setIsPending(isPendingIdea);
    }
  }, [id, pendingIdeas]);

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
              className="btn btn-md"
              onClick={() => router.back()}
            >
              <ChevronLeft size={20} />
              <span className="font-bold">Idea Details</span>
            </motion.button>
            <div className="flex gap-2">
              {isPending ? (
                <motion.button
                  variants={buttonVariants}
                  initial="initial"
                  whileTap="tap"
                  whileHover="hover"
                  className="btn btn-primary btn-md gap-2"
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
                    whileHover="hover"
                    whileTap="tap"
                    className="btn btn-md btn-primary"
                  >
                    <Pencil size={16} />
                    <span className="font-bold">Edit</span>
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="btn btn-md btn-error"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash size={16} />
                    <span className="font-bold">Delete</span>
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 pt-4">
          {/* Header section */}
          <motion.div
            variants={itemVariants}
            className="bg-base-200 p-6 rounded-lg mb-6"
          >
            <div className="flex justify-between items-start">
              <h1 className="font-bold text-2xl mb-4">{idea.title}</h1>
              <div className="flex items-center gap-2">
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
                  {idea.time && (
                    <span className="text-xs opacity-70">
                      {formatDistanceToNow(new Date(idea.time), {
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
                  userVoteLocal === 1
                    ? "bg-primary text-primary-content border-0"
                    : "bg-primary/50 hover:bg-primary border-0"
                }`}
                onClick={(e) => handleVote(1, e)}
                disabled={isVoting}
              >
                <ThumbsUp className="w-6 h-6" />
              </motion.button>

              <AnimatedNumber value={voteCountLocal} />

              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileTap="tap"
                whileHover="hover"
                className={`btn btn-circle btn-md ${
                  userVoteLocal === -1
                    ? "bg-error text-error-content border-0"
                    : "bg-error/50 hover:bg-error border-0"
                }`}
                onClick={(e) => handleVote(-1, e)}
                disabled={isVoting}
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
                    <p className="text-md ml-10 opacity-70">
                      {comment.comment}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
      {/* Report Dialog */}
      <ReportDialog
        idea={idea}
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
      />
      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
                <div className="bg-error/10 p-3 rounded-xl">
                  <Trash2Icon className="w-5 h-5 text-error" />
                </div>
                <h3 className="text-xl font-bold">Delete Idea</h3>
              </div>

              <div className="divider divider-error before:h-[1px] after:h-[1px] my-2"></div>

              <div className="bg-error/5 p-4 rounded-xl space-y-1">
                <p className="font-medium">Are you sure?</p>
                <p className="text-base-content/70 text-sm">
                  This action cannot be undone. This will permanently delete
                  your idea and remove all associated data.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <motion.button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowDeleteDialog(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="btn btn-error btn-sm"
                  onClick={handleDelete}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "hsl(var(--er))",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2Icon className="w-4 h-4" />
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default IdeaDetail;
