"use client";

import { motion } from "framer-motion";
import { Category } from "@/api/models";
import { PencilIcon, PlusIcon, AlertCircle, Trash2Icon } from "lucide-react";

interface CategoryModalsProps {
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedCategory: Category | null;
  categoryName: string;
  onCategoryNameChange: (name: string) => void;
  onEditModalClose: () => void;
  onDeleteModalClose: () => void;
  onEditSubmit: () => void;
  onDeleteConfirm: () => void;
}

export function CategoryModals({
  isEditModalOpen,
  isDeleteModalOpen,
  selectedCategory,
  categoryName,
  onCategoryNameChange,
  onEditModalClose,
  onDeleteModalClose,
  onEditSubmit,
  onDeleteConfirm,
}: CategoryModalsProps) {
  return (
    <>
      {/* Edit/Create Modal */}
      <dialog className={`modal ${isEditModalOpen ? "modal-open" : ""}`}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="modal-box bg-base-100 p-0 max-w-xl"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-xl">
                {selectedCategory ? (
                  <PencilIcon className="w-6 h-6 text-primary" />
                ) : (
                  <PlusIcon className="w-6 h-6 text-primary" />
                )}
              </div>
              <h3 className="font-bold text-xl">
                {selectedCategory ? "Edit" : "Add"} Category
              </h3>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base font-medium">
                  Category Name
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full focus:input-primary bg-base-200/50"
                value={categoryName}
                onChange={(e) => onCategoryNameChange(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
          </div>

          <div className="bg-base-200/30 p-4 flex justify-end gap-2">
            <motion.button
              className="btn btn-ghost"
              onClick={onEditModalClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              className="btn btn-primary"
              onClick={onEditSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!categoryName.trim()}
            >
              {selectedCategory ? "Save Changes" : "Create Category"}
            </motion.button>
          </div>
        </motion.div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={onEditModalClose}>close</button>
        </form>
      </dialog>

      {/* Delete Confirmation Modal */}
      <dialog className={`modal ${isDeleteModalOpen ? "modal-open" : ""}`}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="modal-box bg-base-100 p-0"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-error/10 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-error" />
              </div>
              <h3 className="font-bold text-xl">Confirm Delete</h3>
            </div>

            <p className="text-base">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedCategory?.name}</span>?
            </p>

            <p className="text-sm bg-error/5 text-error p-3 rounded-lg">
              This action cannot be undone.
            </p>
          </div>

          <div className="bg-base-200/30 p-4 flex justify-end gap-2">
            <motion.button
              className="btn btn-ghost"
              onClick={onDeleteModalClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              className="btn btn-error"
              onClick={onDeleteConfirm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2Icon className="w-5 h-5" />
              Delete Category
            </motion.button>
          </div>
        </motion.div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={onDeleteModalClose}>close</button>
        </form>
      </dialog>
    </>
  );
}
