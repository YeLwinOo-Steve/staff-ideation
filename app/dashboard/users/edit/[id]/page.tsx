"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApiStore } from "@/store/apiStore";
import { useAuthStore } from "@/store/authStore";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { userFormSchema } from "@/schema/validations";
import { z } from "zod";
import UserPhotoUpload from "../../../components/userPhotoUpload";
import UserDetailsSection from "../../components/userDetailsSection";
import RolesSection from "../../components/roleSection";
import DepartmentsSection from "../../components/departmentsSection";
import PermissionsSection from "../../components/permissionsSection";
import { useRolePermissions } from "../../hooks/userRolePermissions";
import { Permission, Role, User } from "@/api/models";
import { useToast } from "@/components/toast";
import { uploadToCloudinary } from "@/util/uploadCloudinary";
import { AxiosError } from "axios";

type UserFormValues = z.infer<typeof userFormSchema>;

const EditUser = () => {
  const {
    updateUser,
    getUser,
    fetchDepartments,
    fetchRoles,
    departments,
    roles,
    isLoading,
  } = useApiStore();
  const { resetPassword } = useAuthStore();

  const router = useRouter();
  const params = useParams();
  const { showSuccessToast, showErrorToast } = useToast();
  const userId = Number(params.id);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [fetchedUser, setUser] = useState<User>();
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
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

            if (user.department) {
              const foundDept = departments.find(
                (dept) => dept.department_name === user.department,
              );
              if (foundDept) {
                setValue("department_ids", [foundDept.id.toString()]);
              }
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

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
  };

  const onSubmit = async (data: UserFormValues) => {
    let photoUrl = fetchedUser?.photo;
    setIsUploading(true);
    try {
      if (photoFile) {
        photoUrl = await uploadToCloudinary(photoFile, (fileName, progress) => {
          setUploadProgress(progress);
        });
      }

      console.log("Photo URL", photoUrl);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);

      formData.append("role_id", data.role_ids.join(","));
      formData.append("department_id", data.department_ids.join(","));
      formData.append("permissions_id", data.permission_ids.join(","));

      if (photoUrl) {
        formData.append("photo", photoUrl);
      }

      await updateUser(userId, formData);
      router.back();
      showSuccessToast("User updated successfully");
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      const errorMessage =
        error.response?.data?.message || "Failed to update user";
      showErrorToast(errorMessage);
      console.error("Failed to update user:", e);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleResetPassword = async () => {
    try {
      const success = await resetPassword(userId);
      if (success) {
        showSuccessToast("Password has been reset successfully");
      } else {
        showErrorToast("Failed to reset password");
      }
    } catch (error) {
      console.log("Error resetting password:", error);
      showErrorToast("Failed to reset password");
    } finally {
      setIsResetPasswordModalOpen(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="bg-base-100 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            className="btn btn-outline btn-md"
            onClick={() => router.back()}
          >
            <ChevronLeft size={24} />
            <h1 className="font-bold">Edit User</h1>
          </button>
          <button
            className="btn btn-error btn-md"
            onClick={() => setIsResetPasswordModalOpen(true)}
          >
            Reset Password
          </button>
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

              <div className="flex flex-row gap-4 justify-end mt-6">
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
                  disabled={isLoading || isUploading}
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      <span>Uploading... {uploadProgress}%</span>
                    </div>
                  ) : isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Update User"
                  )}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>

        {isResetPasswordModalOpen && (
          <dialog className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Reset Password</h3>
              <p className="py-4">
                Are you sure you want to reset the password for this user? This
                action cannot be undone.
              </p>
              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-error" onClick={handleResetPassword}>
                  Reset Password
                </button>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button onClick={() => setIsResetPasswordModalOpen(false)}>
                close
              </button>
            </form>
          </dialog>
        )}
      </div>
    </>
  );
};

export default EditUser;
