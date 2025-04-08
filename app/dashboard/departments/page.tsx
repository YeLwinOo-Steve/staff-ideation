"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useApiStore } from "@/store/apiStore";
import {
  PencilIcon,
  Trash2Icon,
  PlusIcon,
  Building2,
  UserCircle,
  Clock,
  AlertCircle,
  OctagonX,
  Users,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/components/toast";
import { format } from "date-fns";
import { Department, User } from "@/api/models";
import { Avatar } from "@/app/components/Avatar";
import { SearchableUserDropdown } from "@/app/components/SearchableUserDropdown";

const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 10,
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

interface DepartmentCardProps {
  department: Department;
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
  qaCoordinator?: User | null;
}

const DepartmentCard = ({
  department,
  onEdit,
  onDelete,
  qaCoordinator,
}: DepartmentCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      className="card bg-base-100 shadow-sm hover:shadow-md duration-300 border border-base-200"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <div className="card-body p-5">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="card-title text-lg">
                {department.department_name}
              </h3>
            </div>
            <div className="flex gap-2">
              <motion.button
                className="btn btn-circle btn-sm bg-primary/10 hover:bg-primary border-0"
                onClick={() => onEdit(department)}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "hsl(var(--p))",
                }}
                whileTap={{ scale: 0.9 }}
              >
                <PencilIcon className="w-4 h-4 text-primary group-hover:text-white" />
              </motion.button>
              <motion.button
                className="btn btn-circle btn-sm bg-error/10 hover:bg-error border-0"
                onClick={() => onDelete(department)}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "hsl(var(--er))",
                }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2Icon className="w-4 h-4 text-error group-hover:text-white" />
              </motion.button>
            </div>
          </div>

          <div className="divider divider-primary before:h-[1px] after:h-[1px] my-0"></div>

          <div className="grid gap-3">
            <div className="flex items-center gap-3 bg-info/5 p-3 rounded-xl">
              <div className="bg-info/10 p-2 rounded-lg">
                <Avatar
                  src={qaCoordinator?.photo}
                  alt={qaCoordinator?.name}
                  className="w-6 h-6 text-info"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs opacity-70">QA Coordinator</span>
                <span className="text-sm font-medium">
                  {qaCoordinator?.name || "Not assigned"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-info/5 p-3 rounded-xl">
              <div className="bg-info/10 p-2 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs opacity-70">Last Updated</span>
                <span className="text-sm font-medium">
                  {format(new Date(department.updated_at), "PPpp")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DepartmentsPage = () => {
  const {
    departments,
    departmentUsers,
    fetchDepartments,
    getDepartmentUsers,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    isLoading,
    getUser,
    users,
    fetchUsers,
    fetchAllUsers,
    allUsers,
    isLoadingAllUsers,
  } = useApiStore();

  const { showSuccessToast, showErrorToast } = useToast();
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [selectedQACoordinator, setSelectedQACoordinator] =
    useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [qaCoordinators, setQaCoordinators] = useState<User[]>([]);

  useEffect(() => {
    fetchDepartments().catch((error) => {
      console.error("Failed to fetch departments", error);
      showErrorToast("Failed to fetch departments");
    });
  }, [fetchDepartments, showErrorToast]);

  useEffect(() => {
    fetchAllUsers().catch((error) => {
      console.error("Failed to fetch all users:", error);
      showErrorToast("Failed to load QA coordinators");
    });
  }, [fetchAllUsers, showErrorToast]);

  useEffect(() => {
    const coordinators = allUsers.filter(
      (user) =>
        (user.roles.includes("QA Coordinators") ||
          user.roles.includes("Administrator")) &&
        (!searchQuery ||
          user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setQaCoordinators(coordinators);
  }, [searchQuery, allUsers]);

  const handleCreateDepartment = async () => {
    try {
      await createDepartment({
        department_name: departmentName,
        QACoordinatorID: selectedQACoordinator?.id,
      });
      await fetchDepartments({ isCache: false });
      showSuccessToast("Department created successfully");
      setIsEditModalOpen(false);
      setDepartmentName("");
      setSelectedQACoordinator(null);
    } catch (error) {
      showErrorToast("Failed to create department");
    }
  };

  useEffect(() => {
    if (selectedDepartment) {
      getDepartmentUsers(selectedDepartment.id);
    }
  }, [selectedDepartment, getDepartmentUsers]);

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setDepartmentName(department.department_name);
    if (department.QACoordinatorID) {
      const coordinator = allUsers.find(
        (u) => u.id === department.QACoordinatorID
      );
      setSelectedQACoordinator(coordinator || null);
      if (coordinator) {
        setSearchQuery(coordinator.name);
      }
    } else {
      setSelectedQACoordinator(null);
      setSearchQuery("");
    }
    setIsEditModalOpen(true);
  };

  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedDepartment) return;

    try {
      await updateDepartment(selectedDepartment.id, {
        department_name: departmentName,
        QACoordinatorID: selectedQACoordinator?.id,
      });
      await fetchDepartments({ isCache: false });
      showSuccessToast("Department updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      showErrorToast("Failed to update department");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDepartment) return;

    try {
      await deleteDepartment(selectedDepartment.id);
      await fetchDepartments({ isCache: false });
      showSuccessToast("Department deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete department", error);
      showErrorToast("Failed to delete department");
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 max-w-7xl mx-auto"
      layout
    >
      <div className="flex justify-between items-center mb-8">
        <motion.div variants={itemVariants} className="flex items-center gap-3" layout>
          <Building2 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Departments</h1>
        </motion.div>
        <motion.button
          variants={itemVariants}
          className="btn btn-primary"
          onClick={() => {
            setSelectedDepartment(null);
            setDepartmentName("");
            setSelectedQACoordinator(null);
            setSearchQuery("");
            setIsEditModalOpen(true);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          layout
        >
          <PlusIcon className="w-5 h-5" />
          Add Department
        </motion.button>
      </div>

      {isLoading ? (
        <motion.div 
          className="flex justify-center items-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          layout
        >
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          {departments.map((department) => (
            <motion.div
              key={department.id}
              variants={itemVariants}
              className="h-full"
              layout
            >
              <DepartmentCard
                department={department}
                onEdit={handleEdit}
                onDelete={handleDelete}
                qaCoordinator={allUsers.find(
                  (u) => u.id === department.QACoordinatorID
                )}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

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
                  onChange={(e) => setDepartmentName(e.target.value)}
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
                  onSelect={setSelectedQACoordinator}
                  onLoadMore={() => {}}
                  isLoading={isLoadingAllUsers}
                  hasMore={false}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
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
              onClick={() => {
                setIsEditModalOpen(false);
                setDepartmentName("");
                setSelectedQACoordinator(null);
                setSearchQuery("");
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              className="btn btn-primary"
              onClick={
                selectedDepartment ? handleEditSubmit : handleCreateDepartment
              }
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
          <button onClick={() => setIsEditModalOpen(false)}>close</button>
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
              onClick={() => setIsDeleteModalOpen(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              className="btn btn-error"
              onClick={handleDeleteConfirm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={departmentUsers && departmentUsers.length > 0}
            >
              <Trash2Icon className="w-5 h-5" />
              Delete Department
            </motion.button>
          </div>
        </motion.div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsDeleteModalOpen(false)}>close</button>
        </form>
      </dialog>
    </motion.div>
  );
};

export default DepartmentsPage;
