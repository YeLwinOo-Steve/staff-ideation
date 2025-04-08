"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Calendar, ChevronLeft, Send, Paperclip, LightbulbIcon } from "lucide-react";
import FilePreview from "../../components/filePreview";
import { useApiStore } from "@/store/apiStore";
import { useAuthStore } from "@/store/authStore";
import { getInitials } from "@/util/getInitials";
import { useToast } from "@/components/toast";
import CategoryChip from "../../components/categoryChip";
import Image from "next/image";
import Link from "next/link";

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

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
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
      const ideaFormData = new FormData();
      ideaFormData.append("title", formData.title);
      ideaFormData.append("content", formData.content);
      ideaFormData.append("is_anonymous", formData.isAnonymous ? "1" : "0");
      ideaFormData.append("category", selectedCategories.join(","));
      files.forEach((file) => {
        ideaFormData.append("files[]", file);
      });

      await createIdea(ideaFormData);
      
      setFormData({
        title: "",
        content: "",
        isAnonymous: false,
        agreeToTerms: false,
      });
      setSelectedCategories([]);
      setFiles([]);
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
    <div className="min-h-screen bg-base-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <motion.button
          className="btn btn-ghost gap-2 mb-8 hover:bg-base-200"
          onClick={() => router.back()}
          variants={itemVariants}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to ideas</span>
        </motion.button>

        <motion.div
          className="bg-base-200 rounded-2xl p-8 shadow-lg"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-14 h-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {authUser?.photo ? (
                      <Image
                        src={authUser.photo}
                        alt={authUser.name}
                        width={56}
                        height={56}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="bg-primary text-primary-content w-full h-full flex items-center justify-center text-xl font-semibold">
                        {getInitials(authUser?.name || "")}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {formData.isAnonymous ? "Anonymous User" : authUser?.name}
                  </h2>
                  <p className="text-base-content/60 text-sm">{authUser?.email}</p>
                </div>
              </div>
              <div className="badge badge-neutral gap-2 p-4">
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

            <div className="divider"></div>
          </motion.div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <input
                type="text"
                placeholder="What's your brilliant idea?"
                className="input input-lg w-full bg-base-100 text-lg font-medium"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <textarea
                className="textarea textarea-bordered w-full min-h-[200px] bg-base-100 text-base leading-relaxed"
                placeholder="Describe your idea in detail..."
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="text-base font-medium mb-2 block">Categories</label>
              <div className="flex flex-wrap gap-2 p-4 bg-base-100 rounded-xl">
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

            <motion.div variants={itemVariants} className="bg-base-100 rounded-xl p-4">
              <FilePreview setFiles={setFiles} />
            </motion.div>

            <div className="divider"></div>

            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-base-100 p-3 rounded-lg transition-colors">
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
                <span className="font-medium">Post anonymously</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-base-100 p-3 rounded-lg transition-colors">
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
                <span>
                  I agree to the{" "}
                  <Link href="/terms-of-use" className="link link-primary">
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="link link-primary">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="pt-6 flex justify-center"
            >
              <button
                className={`btn btn-primary btn-wide btn-lg gap-3 ${isSubmitting ? 'loading' : ''}`}
                type="submit"
                disabled={isSubmitting || !formData.agreeToTerms}
              >
                {isSubmitting ? (
                  "Creating Idea..."
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span className="font-medium">Submit Idea</span>
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default IdeaCreatePage;
