"use client";

import { useEffect, useState } from "react";
import { Category } from "@/api/models";
import { useApiStore } from "@/store/apiStore";
import { useToast } from "@/components/toast";
import { CategoryHeader } from "./components/CategoryHeader";
import { CategoryList } from "./components/CategoryList";
import { CategoryModals } from "./components/CategoryModals";

export default function CategoryPage() {
  // State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");

  // Store & Hooks
  const {
    categories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    isLoading,
  } = useApiStore();
  const { showSuccessToast, showErrorToast } = useToast();

  // Effects
  useEffect(() => {
    fetchCategories().catch((error) => {
      console.error("Failed to fetch categories", error);
      showErrorToast("Failed to fetch categories");
    });
  }, [fetchCategories, showErrorToast]);

  // Handlers
  const handleAddClick = () => {
    setSelectedCategory(null);
    setCategoryName("");
    setIsEditModalOpen(true);
  };

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
        await updateCategory(selectedCategory.id, { name: categoryName });
      } else {
        await createCategory(categoryName);
      }
      showSuccessToast(
        `Category ${selectedCategory ? "updated" : "created"} successfully`
      );
      setIsEditModalOpen(false);
      setCategoryName("");
      setSelectedCategory(null);
      await fetchCategories();
    } catch (error) {
      console.error("Failed to save category", error);
      showErrorToast(
        `Failed to ${selectedCategory ? "update" : "create"} category`
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      await deleteCategory(selectedCategory.id);
      showSuccessToast("Category deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete category", error);
      showErrorToast("Failed to delete category");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <CategoryHeader onAddClick={handleAddClick} />

      <CategoryList
        categories={categories}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryModals
        isEditModalOpen={isEditModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        selectedCategory={selectedCategory}
        categoryName={categoryName}
        onCategoryNameChange={setCategoryName}
        onEditModalClose={() => setIsEditModalOpen(false)}
        onDeleteModalClose={() => setIsDeleteModalOpen(false)}
        onEditSubmit={handleEditSubmit}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
