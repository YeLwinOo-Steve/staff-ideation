"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Calendar, ChevronLeft, Send } from "lucide-react";
import FilePreview from "../../components/filePreview";
import { useApiStore } from "@/store/apiStore";
import { useAuthStore } from "@/store/authStore";
import { getInitials } from "@/util/getInitials";
import { useToast } from "@/components/toast";
import CategoryChip from "../../components/categoryChip";
import Image from "next/image";
import Link from "next/link";
import { uploadToCloudinary } from "@/util/uploadCloudinary";

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

const IdeaCreatePage = () => {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const { fetchCategories, createIdea, categories, error } = useApiStore();
  const { user: authUser } = useAuthStore();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isAnonymous: false,
    agreeToTerms: false,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

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
    if (!formData.agreeToTerms) {
      showErrorToast("You must agree to the terms of use and privacy policy");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // First, upload files to Cloudinary if any
      let uploadedFileUrls: string[] = [];
      if (files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          const result = await uploadToCloudinary(file, (progress) => {
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: Math.round(progress),
            }));
          });
          return result;
        });

        uploadedFileUrls = await Promise.all(uploadPromises);
      }

      // Then create the idea with the uploaded file URLs
      const ideaFormData = new FormData();
      ideaFormData.append("title", formData.title);
      ideaFormData.append("content", formData.content);
      ideaFormData.append("is_anonymous", formData.isAnonymous ? "1" : "0");
      ideaFormData.append("category", selectedCategories.join(","));
      
      if (uploadedFileUrls.length > 0) {
        ideaFormData.append("document", JSON.stringify(uploadedFileUrls));
      }

      await createIdea(ideaFormData);

      // Reset form state
      setFormData({
        title: "",
        content: "",
        isAnonymous: false,
        agreeToTerms: false,
      });
      setSelectedCategories([]);
      setFiles([]);
      setUploadProgress({});
      setIsSubmitting(false);

      showSuccessToast("Idea created successfully");
      router.push("/dashboard");
    } catch (e) {
      setIsSubmitting(false);
      showErrorToast(error || "Failed to create idea");
      console.error("Failed to create idea:", e);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        className="btn btn-outline btn-md mb-6"
        onClick={() => router.back()}
      >
        <ChevronLeft size={24} />
        <h1 className="font-bold">Back to ideas</h1>
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
            <FilePreview setFiles={setFiles} uploadProgress={uploadProgress} />
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

            <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-base-200/50 rounded-xl transition-all border border-transparent hover:border-base-300">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={formData.agreeToTerms}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    agreeToTerms: e.target.checked,
                  }))
                }
              />
              <div>
                <p className="font-medium">Terms & Conditions</p>
                <p className="text-sm text-base-content/60">
                  I agree to the{" "}
                  <Link href="/terms-of-use" className="link link-primary">
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="link link-primary">
                    Privacy Policy
                  </Link>
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
            disabled={isSubmitting || !formData.agreeToTerms}
          >
            {isSubmitting ? (
              "Creating Idea..."
            ) : (
              <>
                <Send size={18} />
                Submit Idea
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default IdeaCreatePage;
