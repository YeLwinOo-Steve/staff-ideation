"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApiStore } from "@/store/apiStore";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { userFormSchema } from "@/schema/validations";
import { z } from "zod";
import UserPhotoUpload from "../../components/userPhotoUpload";
import UserDetailsSection from "../components/userDetailsSection";
import RolesSection from "../components/roleSection";
import DepartmentsSection from "../components/departmentsSection";
import PermissionsSection from "../components/permissionsSection";
import { useRolePermissions } from "../hooks/userRolePermissions";
import { useToast } from "@/components/toast";
import { uploadToCloudinary } from "@/util/uploadCloudinary";

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

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isFormReady, setIsFormReady] = useState(roles.length > 0);

  const methods = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
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

  useEffect(() => {
    if (roles.length > 0) {
      setIsFormReady(true);
    }
  }, [roles.length]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const promises = [];
        if (!departments.length) promises.push(fetchDepartments());
        if (!roles.length) promises.push(fetchRoles());
        if (promises.length > 0) await Promise.all(promises);
        console.log(departments);
      } catch (error) {
        console.error("Error loading initial data:", error);
        showErrorToast("Failed to load initial data");
      }
    };

    loadInitialData();
  }, [fetchDepartments, fetchRoles, departments, roles.length, showErrorToast]);

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
  };

  const onSubmit = async (data: UserFormValues) => {
    setIsUploading(true);
    let photoUrl = "";

    try {
      if (photoFile) {
        setIsUploading(true);
        photoUrl = await uploadToCloudinary(photoFile, (progress) => {
          setUploadProgress(progress);
        });
      }

      console.log("Photo URL", photoUrl);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("role_id", data.role_ids.join(","));
      formData.append("department_id", data.department_ids.join(","));
      console.log("department ids", data.department_ids.join(","));

      console.log("department ids", data.department_ids);

      formData.append("permissions_id", data.permission_ids.join(","));

      if (photoUrl) {
        formData.append("photo", photoUrl);
      }

      await createUser(formData);
      showSuccessToast("User created successfully");
      router.push("/ideas/users");
    } catch (error) {
      console.error("Failed to create user:", error);
      showErrorToast(
        error instanceof Error ? error.message : "Failed to create user",
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (!isFormReady) {
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="bg-base-100 p-6"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="lg:sticky md:sticky top-[5rem] z-30 bg-base-100 pb-4"
          >
            <div className="flex items-center justify-between">
              <motion.button
                variants={buttonVariants}
                className="btn gap-2 text-md"
                onClick={() => router.back()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Create New User</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <motion.div
                  variants={containerVariants}
                  className="flex flex-col lg:flex-row gap-8"
                >
                  {/* Left Column - Photo Upload */}
                  <motion.div
                    variants={itemVariants}
                    className="w-full lg:w-1/3"
                  >
                    <div className="sticky top-48 z-[31] max-w-sm mx-auto lg:max-w-full">
                      <UserPhotoUpload
                        initialPhoto={null}
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
                      <div className="text-center mt-4">
                        Upload Profile Image
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Column - Form Sections */}
                  <motion.div
                    variants={containerVariants}
                    className="lg:w-2/3 space-y-6"
                  >
                    <motion.div variants={itemVariants}>
                      <UserDetailsSection
                        nameError={errors.name?.message}
                        emailError={errors.email?.message}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <div className="divider before:bg-base-300/50 after:bg-base-300/50"></div>
                      <RolesSection
                        filteredRoles={filteredRoles}
                        selectedRoles={selectedRoles}
                        handleRoleChange={(roleId) =>
                          handleRoleChange(
                            roleId,
                            !selectedRoles.includes(roleId),
                          )
                        }
                        error={errors.role_ids?.message}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <div className="divider before:bg-base-300/50 after:bg-base-300/50"></div>
                      <DepartmentsSection
                        departments={departments}
                        control={methods.control}
                        error={errors.department_ids?.message}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <div className="divider before:bg-base-300/50 after:bg-base-300/50"></div>
                      <PermissionsSection
                        allPermissions={allPermissions}
                        selectedPermissions={selectedPermissions}
                        handlePermissionChange={(permId) =>
                          handlePermissionChange(
                            permId,
                            !selectedPermissions.includes(permId),
                          )
                        }
                        roles={roles}
                        error={errors.permission_ids?.message}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  variants={itemVariants}
                  className="flex justify-end gap-3 pt-6"
                >
                  <motion.button
                    variants={buttonVariants}
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => router.back()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isUploading || isLoading}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    type="submit"
                    className="btn btn-primary btn-wide"
                    disabled={isUploading || isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading || isUploading ? (
                      <div className="flex items-center gap-2">
                        <span className="loading loading-spinner loading-sm"></span>
                        <span>
                          {isUploading ? "Uploading..." : "Creating..."}
                        </span>
                      </div>
                    ) : (
                      "Create User"
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </FormProvider>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default CreateUser;
