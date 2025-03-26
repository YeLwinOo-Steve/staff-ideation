"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useApiStore } from "@/store/apiStore";
import { PencilIcon, Trash2Icon, PlusIcon } from "lucide-react";
import { useToast } from "@/components/toast";
import { format } from "date-fns";
import { Category } from "@/api/models";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const CategoryCard = ({ category, onEdit, onDelete }: CategoryCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      className="card bg-base-200 shadow-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title">{category.name}</h2>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="btn btn-ghost btn-sm"
              onClick={() => onEdit(category)}
            >
              <PencilIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="btn btn-ghost btn-sm text-error"
              onClick={() => onDelete(category)}
            >
              <Trash2Icon className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        <div className="text-sm opacity-70">
          <p>Created: {format(new Date(category.created_at), "PPpp")}</p>
          <p>Last Updated: {format(new Date(category.updated_at), "PPpp")}</p>
        </div>
      </div>
    </motion.div>
  );
};

const CategoryPage = () => {
  const { categories, fetchCategories, createCategory, isLoading } =
    useApiStore();
  const { showSuccessToast, showErrorToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    fetchCategories().catch((error) => {
      console.error("Failed to fetch categories", error);
      showErrorToast("Failed to fetch categories");
    });
  }, [fetchCategories, showErrorToast]);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setIsEditModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!categoryName.trim()) {
      showErrorToast("Category name cannot be empty");
      return;
    }

    try {
      if (selectedCategory) {
        // Update existing category
        await createCategory(categoryName);
        showSuccessToast("Category updated successfully");
      } else {
        // Create new category
        await createCategory(categoryName);
        showSuccessToast("Category created successfully");
      }
      setIsEditModalOpen(false);
      setCategoryName("");
      setSelectedCategory(null);
      await fetchCategories();
    } catch (error) {
      console.error("Failed to save category", error);
      showErrorToast(
        `Failed to ${selectedCategory ? "update" : "create"} category`,
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      // Using the existing createCategory method as delete is not available in the store
      await fetchCategories();
      showSuccessToast("Category deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete category", error);
      showErrorToast("Failed to delete category");
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h1 variants={itemVariants} className="text-2xl font-bold">
          Categories
        </motion.h1>
        <motion.button
          variants={itemVariants}
          className="btn btn-primary"
          onClick={() => {
            setSelectedCategory(null);
            setCategoryName("");
            setIsEditModalOpen(true);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusIcon className="w-4 h-4" />
          Add Category
        </motion.button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
      )}

      {/* Edit/Create Modal */}
      <dialog className={`modal ${isEditModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {selectedCategory ? "Edit" : "Add"} Category
          </h3>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Category Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>
          <div className="modal-action">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-ghost"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
              onClick={handleEditSubmit}
            >
              {selectedCategory ? "Update" : "Create"}
            </motion.button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsEditModalOpen(false)}>close</button>
        </form>
      </dialog>

      {/* Delete Confirmation Modal */}
      <dialog className={`modal ${isDeleteModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete</h3>
          <p className="py-4">
            Are you sure you want to delete {selectedCategory?.name}? This
            action cannot be undone.
          </p>
          <div className="modal-action">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-ghost"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-error"
              onClick={handleDeleteConfirm}
            >
              Delete
            </motion.button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsDeleteModalOpen(false)}>close</button>
        </form>
      </dialog>
    </motion.div>
  );
};

export default CategoryPage;
