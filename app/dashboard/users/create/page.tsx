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
import NavBar from "../../components/navBar";
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
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
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
      console.log("department ids", data.department_ids.join(","));

      console.log("department ids", data.department_ids);

      formData.append("permissions_id", data.permission_ids.join(","));

      if (photoUrl) {
        formData.append("photo", photoUrl);
      }

      await createUser(formData);
      showSuccessToast("User created successfully");
      router.push("/dashboard/users");
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
        <NavBar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-64"
        >
          <span className="loading loading-spinner loading-lg"></span>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-6"
      >
        <motion.div variants={itemVariants} className="flex items-center mb-6">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="btn btn-ghost btn-md mr-2"
            onClick={() => router.back()}
          >
            <ChevronLeft size={24} />
            <h1 className="font-bold">Create New User</h1>
          </motion.button>
        </motion.div>

        <motion.div variants={containerVariants} className="max-w-3xl mx-auto">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col md:flex-row gap-6">
                <motion.div variants={itemVariants}>
                  <UserPhotoUpload
                    initialPhoto={null}
                    onPhotoChange={handlePhotoChange}
                  />
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  className="w-full md:w-2/3"
                >
                  <motion.div variants={itemVariants}>
                    <UserDetailsSection
                      nameError={errors.name?.message}
                      emailError={errors.email?.message}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <RolesSection
                      filteredRoles={filteredRoles}
                      selectedRoles={selectedRoles}
                      handleRoleChange={handleRoleChange}
                      error={errors.role_ids?.message}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <DepartmentsSection
                      departments={departments}
                      control={methods.control}
                      error={errors.department_ids?.message}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <PermissionsSection
                      allPermissions={allPermissions}
                      selectedPermissions={selectedPermissions}
                      handlePermissionChange={handlePermissionChange}
                      roles={roles}
                      error={errors.permission_ids?.message}
                    />
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                variants={itemVariants}
                className="card-actions justify-end mt-6"
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => router.back()}
                  disabled={isUploading || isLoading}
                >
                  Cancel
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="submit"
                  className="btn btn-primary btn-wide"
                  disabled={isUploading || isLoading}
                >
                  {isUploading ? (
                    <div className="flex items-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      <span>Uploading... {uploadProgress}%</span>
                    </div>
                  ) : isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Create User"
                  )}
                </motion.button>
              </motion.div>
            </form>
          </FormProvider>
        </motion.div>
      </motion.div>
    </>
  );
};

export default CreateUser;
