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
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/components/toast";
import { format } from "date-fns";
import { Department, User } from "@/api/models";
import * as api from "@/api/repository";

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
      className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 border border-base-200"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-body p-5">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="card-title text-lg">{department.department_name}</h3>
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
                <UserCircle className="w-4 h-4 text-info" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs opacity-70">QA Coordinator</span>
                <span className="text-sm font-medium">{qaCoordinator?.name || "Not assigned"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-info/5 p-3 rounded-xl">
              <div className="bg-info/10 p-2 rounded-lg">
                <Clock className="w-4 h-4 text-info" />
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
  const { departments, fetchDepartments, isLoading } = useApiStore();
  const { showSuccessToast, showErrorToast } = useToast();
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState("");
  const [qaCoordinators, setQaCoordinators] = useState<Record<number, User>>(
    {}
  );

  useEffect(() => {
    fetchDepartments().catch((error) => {
      console.error("Failed to fetch departments", error);
      showErrorToast("Failed to fetch departments");
    });
  }, [fetchDepartments, showErrorToast]);

  useEffect(() => {
    const fetchQACoordinators = async () => {
      const coordinators: Record<number, User> = {};
      for (const dept of departments) {
        if (dept.QACoordinatorID) {
          try {
            const user = await api.userApi.getOne(dept.QACoordinatorID);
            coordinators[dept.QACoordinatorID] = user.data.data;
          } catch (error) {
            console.error(
              `Failed to fetch QA Coordinator for department ${dept.id}`,
              error
            );
          }
        }
      }
      setQaCoordinators(coordinators);
    };

    fetchQACoordinators();
  }, [departments]);

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setDepartmentName(department.department_name);
    setIsEditModalOpen(true);
  };

  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedDepartment) return;

    try {
      await api.departmentApi.update(selectedDepartment.id, {
        department_name: departmentName,
      });
      await fetchDepartments();
      showSuccessToast("Department updated successfully");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update department", error);
      showErrorToast("Failed to update department");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDepartment) return;

    try {
      await api.departmentApi.delete(selectedDepartment.id);
      await fetchDepartments();
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
    >
      <div className="flex justify-between items-center mb-8">
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Departments</h1>
        </motion.div>
        <motion.button
          variants={itemVariants}
          className="btn btn-primary"
          onClick={() => {
            setSelectedDepartment(null);
            setDepartmentName("");
            setIsEditModalOpen(true);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusIcon className="w-5 h-5" />
          Add Department
        </motion.button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {departments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onEdit={handleEdit}
              onDelete={handleDelete}
              qaCoordinator={qaCoordinators[department.QACoordinatorID]}
            />
          ))}
        </motion.div>
      )}

      {/* Edit Modal */}
      <dialog className={`modal ${isEditModalOpen ? "modal-open" : ""}`}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="modal-box"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-full bg-primary">
              {selectedDepartment ? (
                <PencilIcon className="w-6 h-6 text-primary-content" />
              ) : (
                <PlusIcon className="w-6 h-6 text-primary-content" />
              )}
            </div>
            <h3 className="font-bold text-xl">
              {selectedDepartment ? "Edit" : "Add"} Department
            </h3>
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-base">Department Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full focus:input-primary"
              placeholder="Enter department name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
            />
          </div>
          <div className="modal-action mt-8">
            <motion.button
              className="btn btn-ghost"
              onClick={() => setIsEditModalOpen(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              className="btn btn-primary"
              onClick={handleEditSubmit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle2 className="w-5 h-5" />
              Save
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
          className="modal-box"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-error">
              <AlertCircle className="w-6 h-6 text-error-content" />
            </div>
            <h3 className="font-bold text-xl">Confirm Delete</h3>
          </div>
          <p className="py-4 text-base">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {selectedDepartment?.department_name}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="modal-action">
            <motion.button
              className="btn btn-ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              className="btn btn-error"
              onClick={handleDeleteConfirm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2Icon className="w-5 h-5" />
              Delete
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
