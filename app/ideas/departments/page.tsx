"use client";

import { useEffect, useState } from "react";
import { Department, User } from "@/api/models";
import { useApiStore } from "@/store/apiStore";
import { useAuthStore } from "@/store/authStore";
import { DepartmentHeader } from "./components/DepartmentHeader";
import { DepartmentList } from "./components/DepartmentList";
import { DepartmentModals } from "./components/DepartmentModals";
import { hasAnyRole } from "../../lib/utils";

export default function DepartmentsPage() {
  // State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [departmentName, setDepartmentName] = useState("");
  const [selectedQACoordinator, setSelectedQACoordinator] =
    useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Store
  const {
    departments,
    allUsers,
    departmentUsers,
    fetchDepartments,
    fetchAllUsers,
    getDepartmentUsers,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    isLoading: isLoadingDepartments,
    isLoadingAllUsers,
    user: apiUser,
  } = useApiStore();

  const { user: authUser } = useAuthStore();
  const user = apiUser || authUser;

  // Check if user has admin permissions
  const hasActions = hasAnyRole(user, ["admin", "administrator", "qa manager"]);

  // Effects
  useEffect(() => {
    fetchDepartments();
    fetchAllUsers();
  }, [fetchDepartments, fetchAllUsers]);

  // Handlers
  const handleAddClick = () => {
    setSelectedDepartment(null);
    setDepartmentName("");
    setSelectedQACoordinator(null);
    setSearchQuery("");
    setIsEditModalOpen(true);
  };

  const handleEditClick = (department: Department) => {
    setSelectedDepartment(department);
    getDepartmentUsers(department.id);
    setDepartmentName(department.department_name);
    const qaCoordinator = allUsers.find(
      (u: User) => u.name === department.qa_coordinator_name,
    );
    setSelectedQACoordinator(qaCoordinator || null);
    setSearchQuery(qaCoordinator?.name || "");
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (department: Department) => {
    setSelectedDepartment(department);
    getDepartmentUsers(department.id);
    setIsDeleteModalOpen(true);
  };

  const handleCreateDepartment = async () => {
    if (!departmentName.trim()) return;

    await createDepartment({
      department_name: departmentName,
      QACoordinatorID: selectedQACoordinator?.id || undefined,
    });

    setIsEditModalOpen(false);
    fetchDepartments();
  };

  const handleEditSubmit = async () => {
    if (!selectedDepartment || !departmentName.trim()) return;

    await updateDepartment(Number(selectedDepartment.id), {
      department_name: departmentName,
      QACoordinatorID: selectedQACoordinator?.id || undefined,
    });

    setIsEditModalOpen(false);
    fetchDepartments();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDepartment) return;

    await deleteDepartment(Number(selectedDepartment.id));
    setIsDeleteModalOpen(false);
    fetchDepartments();
  };

  // Filter QA Coordinators
  const qaCoordinators = allUsers.filter(
    (user: User) =>
      user.roles.includes("QA Coordinators") ||
      (user.roles.includes("Administrator") &&
        (!searchQuery ||
          user.name.toLowerCase().includes(searchQuery.toLowerCase()))),
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <DepartmentHeader
        onAddClick={handleAddClick}
        showAddButton={hasActions || false}
      />

      <DepartmentList
        departments={departments}
        allUsers={allUsers}
        isLoading={isLoadingDepartments}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        hasAdminPermissions={hasActions}
      />

      <DepartmentModals
        isEditModalOpen={isEditModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        selectedDepartment={selectedDepartment}
        departmentName={departmentName}
        selectedQACoordinator={selectedQACoordinator}
        searchQuery={searchQuery}
        qaCoordinators={qaCoordinators}
        departmentUsers={selectedDepartment ? departmentUsers : null}
        isLoadingAllUsers={isLoadingAllUsers}
        onDepartmentNameChange={setDepartmentName}
        onQACoordinatorSelect={setSelectedQACoordinator}
        onSearchQueryChange={setSearchQuery}
        onEditModalClose={() => setIsEditModalOpen(false)}
        onDeleteModalClose={() => setIsDeleteModalOpen(false)}
        onEditSubmit={handleEditSubmit}
        onCreateDepartment={handleCreateDepartment}
        onDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
