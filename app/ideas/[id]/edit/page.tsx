"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { Calendar, ChevronLeft, Save } from "lucide-react";
import FilePreview from "@/app/ideas/components/filePreview";
import { useApiStore } from "@/store/apiStore";
import { useAuthStore } from "@/store/authStore";
import { getInitials } from "@/util/getInitials";
import { useToast } from "@/components/toast";
import CategoryChip from "@/app/ideas/components/categoryChip";
import Image from "next/image";
import { uploadToCloudinary } from "@/util/uploadCloudinary";
import { Document } from "@/api/models";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const IdeaEditPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const { showSuccessToast, showErrorToast } = useToast();
  const { fetchCategories, updateIdea, categories, error, getIdea, idea } =
    useApiStore();
  const { user: authUser } = useAuthStore();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isAnonymous: false,
  });
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [cloudinaryFiles, setCloudinaryFiles] = useState<Document[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const loadIdea = async () => {
      if (id) {
        await getIdea(Number(id));
      }
    };
    loadIdea();
  }, [id, getIdea]);

  useEffect(() => {
    if (idea) {
      setFormData({
        title: idea.title || "",
        content: idea.content || "",
        isAnonymous: idea.is_anonymous || false,
      });
      setSelectedCategories(
        idea.category
          ?.map((cat) => categories.find((c) => c.name === cat)?.id || 0)
          .filter((id) => id !== 0) || [],
      );

      // Set existing Cloudinary files
      if (idea.files && idea.files.length > 0) {
        setCloudinaryFiles(idea.files);
      }
    }
  }, [idea, categories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      let uploadedFileUrls: { file_name: string; file_path: string }[] = [];

      // Upload only new local files
      if (localFiles.length > 0) {
        const uploadPromises = localFiles.map(async (file) => {
          const result = await uploadToCloudinary(file, (progress) => {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: Math.round(progress),
            }));
          });
          return {
            file_name: file.name,
            file_path: result,
          };
        });

        uploadedFileUrls = await Promise.all(uploadPromises);
      }

      // Combine existing Cloudinary files with newly uploaded files
      const allFiles = [...cloudinaryFiles, ...uploadedFileUrls];

      const ideaFormData = new FormData();
      ideaFormData.append("title", formData.title);
      ideaFormData.append("content", formData.content);
      ideaFormData.append("is_anonymous", formData.isAnonymous ? "1" : "0");
      ideaFormData.append("category", selectedCategories.join(","));
      ideaFormData.append("document", JSON.stringify(allFiles));

      await updateIdea(Number(id), ideaFormData);

      showSuccessToast("Idea updated successfully");
      router.push(`/dashboard/ideas/${id}`);
    } catch (e) {
      setIsSubmitting(false);
      showErrorToast(error || "Failed to update idea");
      console.error("Failed to update idea:", e);
    }
  };

  if (!idea) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button className="btn btn-md mb-6" onClick={() => router.back()}>
        <ChevronLeft size={24} />
        <h1 className="font-bold">Back to idea</h1>
      </button>
      <motion.div
        className="max-w-4xl mx-auto p-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center gap-4 mb-8"
        >
          <div className="flex flex-wrap items-center gap-4 justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-base-200 mask mask-squircle w-12">
                  {authUser?.photo ? (
                    <Image
                      src={authUser.photo}
                      alt={authUser.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-lg">
                      {getInitials(authUser?.name || "")}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  {formData.isAnonymous ? "Anonymous User" : authUser?.name}
                </h1>
                <p className="text-base-content/60">{authUser?.email}</p>
              </div>
            </div>
            <div className="badge badge-info gap-2 p-4">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div variants={itemVariants} className="form-control mb-6">
            <input
              type="text"
              placeholder="Enter your idea title"
              className="input input-bordered input-md w-full text-md"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </motion.div>

          <motion.div variants={itemVariants} className="form-control mb-6">
            <textarea
              className="textarea textarea-bordered min-h-[200px]"
              placeholder="Share your thoughts..."
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
            />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <label className="label">
              <span className="label-text text-lg font-semibold">
                Categories
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <CategoryChip
                  key={category.id}
                  category={category}
                  isSelected={selectedCategories.includes(category.id)}
                  onClick={handleCategoryToggle}
                />
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <FilePreview
              setFiles={setLocalFiles}
              uploadProgress={uploadProgress}
              existingFiles={cloudinaryFiles}
              onRemoveExistingFile={(file) => {
                setCloudinaryFiles((prev) =>
                  prev.filter((f) => f.file_path !== file.file_path),
                );
              }}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4 pt-4">
            <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-base-200/50 rounded-xl transition-all border border-transparent hover:border-base-300">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={formData.isAnonymous}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isAnonymous: e.target.checked,
                  }))
                }
              />
              <div>
                <p className="font-medium">Post anonymously</p>
                <p className="text-sm text-base-content/60">
                  Your identity will be hidden from other users
                </p>
              </div>
            </label>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`btn btn-primary btn-wide gap-2 my-4`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Updating Idea..."
            ) : (
              <>
                <Save size={18} />
                Update Idea
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default IdeaEditPage;
