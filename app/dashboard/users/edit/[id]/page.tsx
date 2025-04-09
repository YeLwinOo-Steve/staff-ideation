"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useApiStore } from "@/store/apiStore";
import { useAuthStore } from "@/store/authStore";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, KeyRound, AlertTriangle, X } from "lucide-react";
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
import { motion } from "framer-motion";

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
    error,
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

  const handleRoleSelection = (roleId: string) => {
    handleRoleChange(roleId, !selectedRoles.includes(roleId));
  };

  const handlePermissionSelection = (permId: string) => {
    handlePermissionChange(permId, !selectedPermissions.includes(permId));
  };

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
                (dept) => dept.department_name === user.department
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
                      (p) => p.permission === perm
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
      showErrorToast(error || "Failed to update user");
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
      <div className="bg-base-100 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <motion.button
              className="btn gap-2 text-md"
              onClick={() => router.back()}
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Edit User Profile</span>
            </motion.button>
            <motion.button
              className="btn btn-error gap-2"
              onClick={() => setIsResetPasswordModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <KeyRound className="w-4 h-4" />
              Reset Password
            </motion.button>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left Column - Photo Upload */}
                  <div className="w-full lg:w-1/3">
                    <div className="sticky top-6 max-w-sm mx-auto lg:max-w-full">
                      <UserPhotoUpload
                        initialPhoto={
                          fetchedUser?.photo &&
                          fetchedUser?.photo?.includes("cloudinary")
                            ? fetchedUser?.photo
                            : null
                        }
                        onPhotoChange={handlePhotoChange}
                      />
                      {isUploading && (
                        <div className="mt-4">
                          <div className="w-full bg-base-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-sm text-center mt-2 text-base-content/70">
                            Uploading... {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Form Sections */}
                  <div className="lg:w-2/3 space-y-6">
                    <UserDetailsSection
                      nameError={errors.name?.message}
                      emailError={errors.email?.message}
                      user={fetchedUser}
                    />

                    <div className="divider before:bg-base-300/50 after:bg-base-300/50"></div>

                    <RolesSection
                      filteredRoles={filteredRoles}
                      selectedRoles={selectedRoles}
                      handleRoleChange={handleRoleSelection}
                      error={errors.role_ids?.message}
                    />

                    <div className="divider before:bg-base-300/50 after:bg-base-300/50"></div>

                    <DepartmentsSection
                      departments={departments}
                      control={methods.control}
                      error={errors.department_ids?.message}
                    />

                    <div className="divider before:bg-base-300/50 after:bg-base-300/50"></div>

                    <PermissionsSection
                      allPermissions={allPermissions}
                      selectedPermissions={selectedPermissions}
                      handlePermissionChange={handlePermissionSelection}
                      roles={roles}
                      error={errors.permission_ids?.message}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6">
                  <motion.button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => router.back()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="btn btn-primary btn-wide"
                    disabled={isLoading || isUploading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading || isUploading ? (
                      <div className="flex items-center gap-2">
                        <span className="loading loading-spinner loading-sm"></span>
                        <span>
                          {isUploading ? "Uploading..." : "Updating..."}
                        </span>
                      </div>
                    ) : (
                      "Update User"
                    )}
                  </motion.button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>

        {/* Reset Password Dialog */}
        {isResetPasswordModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsResetPasswordModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-base-100 rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-base-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-error/10 p-3 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-error" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold">Reset Password</h3>
                    <p className="text-sm text-base-content/70">
                      {fetchedUser?.name}
                    </p>
                  </div>
                </div>

                <div className="divider divider-error before:h-[1px] after:h-[1px] my-2"></div>

                <div className="bg-error/5 p-4 rounded-xl space-y-2">
                  <p className="font-medium">
                    Are you sure you want to reset the password?
                  </p>
                  <p className="text-base-content/70 text-sm">
                    This action will:
                  </p>
                  <ul className="text-sm text-base-content/70 list-disc list-inside space-y-1">
                    <li>Generate a new temporary password</li>
                    <li>Send it to the user's email address</li>
                  </ul>
                  <p className="text-sm bg-error/5 text-error p-3 rounded-lg">
                    This action cannot be undone.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <motion.button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setIsResetPasswordModalOpen(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </motion.button>
                  <motion.button
                    className="btn btn-error btn-sm"
                    onClick={handleResetPassword}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <KeyRound className="w-4 h-4" />
                    Reset Password
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default EditUser;
