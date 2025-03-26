"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useApiStore } from "@/store/apiStore";
import { PencilIcon, Trash2Icon, PlusIcon } from "lucide-react";
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
      className="card bg-base-200 shadow-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h2 className="card-title">{department.department_name}</h2>
          <div className="flex gap-2">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onEdit(department)}
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              className="btn btn-ghost btn-sm text-error"
              onClick={() => onDelete(department)}
            >
              <Trash2Icon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="text-sm opacity-70">
          <p>QA Coordinator: {qaCoordinator?.name || "Not assigned"}</p>
          <p>Last Updated: {format(new Date(department.updated_at), "PPpp")}</p>
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
    {},
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
              error,
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
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h1 variants={itemVariants} className="text-2xl font-bold">
          Departments
        </motion.h1>
        <motion.button
          variants={itemVariants}
          className="btn btn-primary"
          onClick={() => setIsEditModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusIcon className="w-4 h-4" />
          Add Department
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
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            {selectedDepartment ? "Edit" : "Add"} Department
          </h3>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Department Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
            />
          </div>
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleEditSubmit}>
              Save
            </button>
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
            Are you sure you want to delete{" "}
            {selectedDepartment?.department_name}? This action cannot be undone.
          </p>
          <div className="modal-action">
            <button
              className="btn btn-ghost"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleDeleteConfirm}>
              Delete
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsDeleteModalOpen(false)}>close</button>
        </form>
      </dialog>
    </motion.div>
  );
};

export default DepartmentsPage;
