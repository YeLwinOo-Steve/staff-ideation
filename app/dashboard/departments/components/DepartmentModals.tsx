"use client";

import { motion } from "framer-motion";
import { Department, User } from "@/api/models";
import { SearchableUserDropdown } from "@/app/components/SearchableUserDropdown";
import {
  PencilIcon,
  PlusIcon,
  AlertCircle,
  OctagonX,
  Users,
  CheckCircle2,
  Trash2Icon,
} from "lucide-react";
import { Avatar } from "@/app/components/Avatar";

interface DepartmentModalsProps {
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedDepartment: Department | null;
  departmentName: string;
  selectedQACoordinator: User | null;
  searchQuery: string;
  qaCoordinators: User[];
  departmentUsers: User[] | null;
  isLoadingAllUsers: boolean;
  onDepartmentNameChange: (name: string) => void;
  onQACoordinatorSelect: (user: User | null) => void;
  onSearchQueryChange: (query: string) => void;
  onEditModalClose: () => void;
  onDeleteModalClose: () => void;
  onEditSubmit: () => void;
  onCreateDepartment: () => void;
  onDeleteConfirm: () => void;
}

export function DepartmentModals({
  isEditModalOpen,
  isDeleteModalOpen,
  selectedDepartment,
  departmentName,
  selectedQACoordinator,
  searchQuery,
  qaCoordinators,
  departmentUsers,
  isLoadingAllUsers,
  onDepartmentNameChange,
  onQACoordinatorSelect,
  onSearchQueryChange,
  onEditModalClose,
  onDeleteModalClose,
  onEditSubmit,
  onCreateDepartment,
  onDeleteConfirm,
}: DepartmentModalsProps) {
  return (
    <>
      {/* Edit Modal */}
      <dialog className={`modal ${isEditModalOpen ? "modal-open" : ""}`}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="modal-box bg-base-100 p-0 max-w-xl overflow-visible"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-xl">
                {selectedDepartment ? (
                  <PencilIcon className="w-6 h-6 text-primary" />
                ) : (
                  <PlusIcon className="w-6 h-6 text-primary" />
                )}
              </div>
              <h3 className="font-bold text-xl">
                {selectedDepartment ? "Edit" : "Add"} Department
              </h3>
            </div>

            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Department Name
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:input-primary bg-base-200/50"
                  placeholder="Enter department name"
                  value={departmentName}
                  onChange={(e) => onDepartmentNameChange(e.target.value)}
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    QA Coordinator
                  </span>
                </label>
                <SearchableUserDropdown
                  users={qaCoordinators}
                  selectedUser={selectedQACoordinator}
                  onSelect={onQACoordinatorSelect}
                  onLoadMore={() => {}}
                  isLoading={isLoadingAllUsers}
                  hasMore={false}
                  searchQuery={searchQuery}
                  onSearchChange={onSearchQueryChange}
                />
              </div>

              {selectedDepartment && departmentUsers && (
                <div className="bg-base-200/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <h4 className="font-medium">Department Members</h4>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {departmentUsers.length > 0 ? (
                      departmentUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-2 bg-base-100 p-2 rounded-lg"
                        >
                          <Avatar
                            src={user.photo}
                            alt={user.name}
                            className="w-8 h-8"
                          />
                          <span className="text-sm">{user.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm opacity-70">
                        No members in this department
                      </p>
                    )}
                  </div>
                </div>
              )}
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
              onClick={selectedDepartment ? onEditSubmit : onCreateDepartment}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!departmentName.trim()}
            >
              <CheckCircle2 className="w-5 h-5" />
              {selectedDepartment ? "Save Changes" : "Create Department"}
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

            {selectedDepartment && departmentUsers && (
              <div className="bg-base-200/50 rounded-xl p-4 space-y-3">
                <p className="text-base">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">
                    {selectedDepartment.department_name}
                  </span>
                  ?
                </p>

                <div className="flex items-center gap-2 text-sm text-error">
                  <Users className="w-4 h-4" />
                  <span>
                    {departmentUsers.length} member
                    {departmentUsers.length !== 1 ? "s" : ""} in this department
                  </span>
                </div>

                <div className="flex -space-x-2">
                  {departmentUsers.slice(0, 5).map((user) => (
                    <Avatar
                      key={user.id}
                      src={user.photo}
                      alt={user.name}
                      className="w-8 h-8 border-2 border-base-200"
                    />
                  ))}
                  {departmentUsers.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-base-200 border-2 border-base-100 flex items-center justify-center">
                      <span className="text-xs">
                        +{departmentUsers.length - 5}
                      </span>
                    </div>
                  )}
                </div>

                {departmentUsers.length > 0 && (
                  <div className="bg-warning/10 p-4 rounded-lg flex gap-3 items-start">
                    <OctagonX className="w-14 h-14 text-error mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-medium text-error">
                        Cannot Delete Department
                      </p>
                      <p className="text-sm opacity-90">
                        This department cannot be deleted because it has active
                        members. Please reassign or remove all members before
                        deleting the department.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {departmentUsers?.length === 0 && (
              <p className="text-sm bg-error/5 text-error p-3 rounded-lg">
                This action cannot be undone.
              </p>
            )}
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
              disabled={Boolean(departmentUsers?.length)}
            >
              <Trash2Icon className="w-5 h-5" />
              Delete Department
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