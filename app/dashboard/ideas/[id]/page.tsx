"use client";
import React, { useEffect, useState } from "react";
import { Download, Lightbulb, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useApiStore } from "@/store/apiStore";
import { getInitials } from "@/util/getInitials";
import { formatDistanceToNow } from "date-fns";
import saveAs from "file-saver";
import JSZip from "jszip";
import NavBar from "../../components/navBar";

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
            `Error downloading file ${index + 1}: ${errorMessage}`
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
    <div>
      <button
        onClick={downloadZipFile}
        className={`btn btn-sm btn-outline mb-2 ${
          status === "error" ? "btn-error" : ""
        }`}
        disabled={isLoading}
      >
        {getButtonText()}
      </button>
      {error && <div className="txt-error text-base">{error}</div>}
    </div>
  );
};

const IdeaDetail = () => {
  const { id } = useParams();
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

  const showLoading = loadingStage !== "complete" || isLoading;

  if (showLoading) {
    return (
      <div className="bg-base-100 min-h-screen">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <span className="loading loading-spinner loading-lg"></span>
          <div className="text-base-content/60">
            {loadingStage === "idea" && "Loading idea details..."}
            {loadingStage === "comments" && "Loading comments..."}
            {loadingStage === "user" && "Loading user information..."}
          </div>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="bg-base-100 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="alert alert-error max-w-md">
            <span>
              Failed to load idea. The idea may not exist or you don&apos;t have
              permission to view it.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 min-h-screen">
      <NavBar />
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2"
                >
                  <Lightbulb size={16} />
                  Home
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-2">
                  Idea Detail {id}
                </span>
              </li>
            </ul>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm">Edit</button>
            <button className="btn btn-error btn-sm">Delete</button>
          </div>
        </div>
        <div className="my-4 max-w-4xl mx-auto">
          <div className="bg-base-200 p-4 rounded-lg mb-4">
            <h1 className="font-bold text-2xl">{idea?.title}</h1>
            <div className="flex justify-between items-center gap-2 mt-4">
              <div className="flex items-center gap-2">
                <div className="avatar placeholder">
                  <div className="bg-base-100 text-primary-content mask mask-squircle w-12 h-12 flex items-center justify-center text-xs font-bold">
                    {getInitials(user?.name || "")}
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold text-md">{user?.name}</span>
                  {idea?.updated_at && (
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
          </div>
          <p className="text-lg my-6">{idea?.content}</p>
          <div className="card-actions justify-between lg:justify-end items-center mt-auto pt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 lg:mr-8">
                <ThumbsUp
                  className={`btn btn-md btn-square p-1 ${userVote === 1 ? "btn-primary" : "btn-ghost"}`}
                  onClick={(e) => handleVote(1, e)}
                />
                <span className="text-md font-bold min-w-6 text-center">
                  {voteCount || 0}
                </span>
                <ThumbsDown
                  className={`btn btn-md btn-square p-1 ${userVote === -1 ? "btn-error" : "btn-ghost"}`}
                  onClick={(e) => handleVote(-1, e)}
                />
              </div>
            </div>
          </div>
          <hr className="my-4" />
          {comments.length === 0 ? (
            <p className="text-center text-sm opacity-70">No comments yet</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="avatar placeholder">
                    <div className="bg-base-200 text-primary-content mask mask-squircle w-8 h-8 flex items-center justify-center text-xs font-bold">
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
                <p className="text-md my-4">{comment.comment}</p>
                <hr className="my-2" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IdeaDetail;
