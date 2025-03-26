"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApiStore } from "@/store/apiStore";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import NavBar from "../../../components/navBar";
import { userFormSchema } from "@/schema/validations";
import { z } from "zod";
import UserPhotoUpload from "../../../components/userPhotoUpload";
import UserDetailsSection from "../../components/userDetailsSection";
import RolesSection from "../../components/roleSection";
import DepartmentsSection from "../../components/departmentsSection";
import PermissionsSection from "../../components/permissionsSection";
import { useRolePermissions } from "../../hooks/userRolePermissions";
import { Department, Permission, Role, User } from "@/api/models";
import { useToast } from "@/components/toast";

type UserFormValues = z.infer<typeof userFormSchema>;

const EditUser = () => {
  const {
    updateUser,
    getUser,
    fetchDepartments,
    fetchRoles,
    departments,
    roles,
    error,
    isLoading,
  } = useApiStore();

  const router = useRouter();
  const params = useParams();
  const { showSuccessToast, showErrorToast } = useToast();
  const userId = Number(params.id);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [fetchedUser, setUser] = useState<User>();
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

  const hasFetchedData = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (hasFetchedData.current) return;
      hasFetchedData.current = true;
      setIsPageLoading(true);

      try {
        const promises = [];
        if (!roles.length) {
          promises.push(fetchRoles());
        }
        if (!departments.length) {
          promises.push(fetchDepartments());
        }

        if (promises.length > 0) {
          await Promise.all(promises);
        }

        if (userId) {
          const user = await getUser(userId);
          if (user) {
            setUser(user);
            setValue("name", user.name);
            setValue("email", user.email);

            if (user.roles && Array.isArray(user.roles)) {
              const roleIds = user.roles
                .map((role: string | Role) => {
                  if (typeof role === "string") {
                    const foundRole = roles.find((r) => r.role === role);
                    return foundRole ? foundRole.id.toString() : null;
                  }
                  return role.id.toString();
                })
                .filter((id): id is string => id !== null && id !== undefined);
              setValue("role_ids", roleIds);
            }

            if (user.department && Array.isArray(user.department)) {
              const deptIds = user.department.map(
                (dept: string | Department) =>
                  typeof dept === "string" ? dept : dept.id.toString(),
              );
              setValue("department_ids", deptIds);
            }

            if (user.permissions && Array.isArray(user.permissions)) {
              const permIds = user.permissions
                .map((perm: string | Permission) => {
                  if (typeof perm === "string") {
                    const foundPerm = allPermissions.find(
                      (p) => p.permission === perm,
                    );
                    return foundPerm ? foundPerm.id.toString() : null;
                  }
                  return perm.id.toString();
                })
                .filter((id): id is string => id !== null && id !== undefined);
              setValue("permission_ids", permIds);
            }
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        showErrorToast("Failed to load data");
      } finally {
        setIsPageLoading(false);
      }
    };

    loadData();
  }, [
    userId,
    getUser,
    fetchDepartments,
    allPermissions,
    departments,
    fetchRoles,
    roles,
    setValue,
    showErrorToast,
  ]);

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
      await updateUser(userId, formData);
      router.back();
      showSuccessToast("User updated successfully");
    } catch (e) {
      showErrorToast(error || "Failed to update user");
      console.error("Failed to update user:", e);
    }
  };

  if (isPageLoading) {
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
    <>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            className="btn btn-ghost btn-md mr-2"
            onClick={() => router.back()}
          >
            <ChevronLeft size={24} />
            <h1 className="font-bold">Edit User</h1>
          </button>
          <div className="flex justify-end w-full">
            <button className="btn btn-error btn-md">Reset Password</button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col md:flex-row gap-6">
                <UserPhotoUpload
                  initialPhoto={
                    fetchedUser?.photo &&
                    fetchedUser?.photo?.includes("cloudinary")
                      ? fetchedUser?.photo
                      : null
                  }
                  onPhotoChange={handlePhotoChange}
                />

                <div className="w-full md:w-2/3">
                  <UserDetailsSection
                    nameError={errors.name?.message}
                    emailError={errors.email?.message}
                    user={fetchedUser}
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
                    "Update User"
                  )}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default EditUser;
