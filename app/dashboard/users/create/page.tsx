"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApiStore } from "@/store/apiStore";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { userFormSchema } from "@/schema/validations";
import { z } from "zod";
import NavBar from "../../components/navBar";
import UserPhotoUpload from "../../components/userPhotoUpload";
import UserDetailsSection from "../components/userDetailsSection";
import RolesSection from "../components/roleSection";
import DepartmentsSection from "../components/departmentsSection";
import PermissionsSection from "../components/permissionsSection";
import { useRolePermissions } from "../hooks/userRolePermissions";
import { useToast } from "@/components/toast";

type UserFormValues = z.infer<typeof userFormSchema>;

const CreateUser = () => {
  const {
    createUser,
    isLoading,
    departments,
    roles,
    fetchDepartments,
    fetchRoles,
  } = useApiStore();

  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const methods = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role_ids: [],
      department_ids: [],
      permission_ids: [],
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const {
    handleRoleChange,
    handlePermissionChange,
    filteredRoles,
    allPermissions,
    selectedRoles,
    selectedPermissions,
  } = useRolePermissions(roles, setValue, watch);

  const [isFormReady, setIsFormReady] = useState(roles.length > 0);

  useEffect(() => {
    if (roles.length > 0) {
      setIsFormReady(true);
    }
  }, [roles.length]);

  useEffect(() => {
    if (!departments.length) {
      fetchDepartments();
    }
    if (!roles.length) {
      fetchRoles();
    }
  }, [fetchDepartments, fetchRoles, roles.length, departments.length]);

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
  };

  const onSubmit = async (data: UserFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);

    formData.append("role_id", data.role_ids.join(","));
    formData.append("department_id", data.department_ids.join(","));
    formData.append("permissions_id", data.permission_ids.join(","));

    if (photoFile) {
      formData.append("photo", photoFile);
    }

    try {
      await createUser(formData);
      router.push("/dashboard/users");
      showSuccessToast("User created successfully");
    } catch (error) {
      showErrorToast("Failed to create user");
      console.error("Failed to create user:", error);
    }
  };

  if (!isFormReady) {
    return (
      <div className="bg-base-100 min-h-screen">
        <NavBar />
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 min-h-screen">
      <NavBar />
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            className="btn btn-ghost btn-md mr-2"
            onClick={() => router.back()}
          >
            <ChevronLeft size={24} />
            <h1 className="font-bold">Create New User</h1>
          </button>
        </div>

        <div className="max-w-3xl mx-auto">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col md:flex-row gap-6">
                <UserPhotoUpload
                  initialPhoto={null}
                  onPhotoChange={handlePhotoChange}
                />

                <div className="w-full md:w-2/3">
                  <UserDetailsSection
                    nameError={errors.name?.message}
                    emailError={errors.email?.message}
                  />

                  <RolesSection
                    filteredRoles={filteredRoles}
                    selectedRoles={selectedRoles}
                    handleRoleChange={handleRoleChange}
                    error={errors.role_ids?.message}
                  />

                  <DepartmentsSection
                    departments={departments}
                    control={methods.control}
                    error={errors.department_ids?.message}
                  />

                  <PermissionsSection
                    allPermissions={allPermissions}
                    selectedPermissions={selectedPermissions}
                    handlePermissionChange={handlePermissionChange}
                    roles={roles}
                    error={errors.permission_ids?.message}
                  />
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => router.back()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-wide"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
