"use client";

import {
  LogOutIcon,
  Mail,
  Building2,
  UserCircle2,
  Shield,
  Lock,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import LogoutDialog from "@/app/ideas/components/LogoutDialog";
import { getInitials } from "@/util/getInitials";
import { User } from "lucide-react";
import { useApiStore } from "@/store/apiStore";
import { changePasswordSchema } from "@/schema/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isValid, z } from "zod";
import { useToast } from "@/components/toast";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

const AccountPage = () => {
  const { user } = useAuthStore();
  const { getUser, user: userData } = useApiStore();
  const { changePassword, isLoading, error } = useAuthStore();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const { showSuccessToast, showErrorToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (user?.id) {
      getUser(user.id);
    }
  }, [getUser, user?.id]);

  if (!userData) return null;

  const handleChangePassword = async (data: ChangePasswordForm) => {
    try {
      await changePassword(data.currentPassword, data.newPassword);
      setIsChangePasswordModalOpen(false);
      reset();
      showSuccessToast("Password changed successfully");
    } catch (e) {
      console.log("Failed to change password", e);
      showErrorToast(error || "Failed to change password");
      return;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <User className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">Account</h1>
        </div>
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-error btn-sm gap-2"
          onClick={() => setIsLogoutDialogOpen(true)}
        >
          <LogOutIcon className="w-4 h-4" />
          Log Out
        </motion.button>
      </div>

      <motion.div
        className="max-w-4xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-between gap-4 bg-base-200/30 p-6 rounded-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="avatar placeholder">
              <div className="bg-base-300 mask mask-squircle w-16">
                {userData.photo && userData.photo?.includes("cloudinary") ? (
                  <Image
                    src={userData.photo}
                    alt={userData.name}
                    width={64}
                    height={64}
                    className="mask mask-squircle"
                  />
                ) : (
                  <span className="text-2xl font-bold">
                    {getInitials(userData.name)}
                  </span>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <p className="text-base-content/60">{userData.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Details Section */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left Column */}
          <div className="space-y-4">
            <div className="bg-base-200/50 p-6 rounded-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <UserCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Full Name</p>
                  <p className="font-medium text-lg">{userData.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-info/10 p-3 rounded-xl">
                  <Mail className="w-6 h-6 text-info" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Email</p>
                  <p className="font-medium text-lg">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-accent/10 p-3 rounded-xl">
                  <Building2 className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Department</p>
                  <p className="font-medium text-lg">
                    {userData.department || "Not assigned"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-warning/10 p-3 rounded-xl">
                  <Lock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Password</p>
                  <button
                    className="btn btn-warning btn-sm mt-1"
                    onClick={() => setIsChangePasswordModalOpen(true)}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="bg-base-200/50 p-6 rounded-2xl space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-success/10 p-3 rounded-xl">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Roles</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData.roles?.map((role, index) => (
                      <div key={index} className="badge badge-primary p-3">
                        {role}
                      </div>
                    )) || (
                      <p className="text-base-content/60">No roles assigned</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-base-content/70">Permissions</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {userData.permissions?.map((permission, index) => (
                    <div
                      key={index}
                      className="bg-info text-info-content px-4 py-2 rounded-xl text-sm font-medium"
                    >
                      {permission}
                    </div>
                  )) || (
                    <p className="text-base-content/60">
                      No permissions assigned
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Change Password Modal */}
      <dialog
        className={`modal ${isChangePasswordModalOpen ? "modal-open" : ""}`}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="modal-box bg-base-100 p-0 max-w-md"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-warning/10 p-3 rounded-xl">
                <Lock className="w-6 h-6 text-warning" />
              </div>
              <h3 className="font-bold text-xl">Change Password</h3>
            </div>

            <form
              onSubmit={handleSubmit(handleChangePassword)}
              className="space-y-4"
            >
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Current Password</span>
                </label>
                <input
                  type="password"
                  className={`input input-bordered w-full ${
                    errors.currentPassword ? "input-error" : ""
                  }`}
                  {...register("currentPassword")}
                  placeholder="Enter current password"
                />
                {errors.currentPassword && (
                  <span className="text-error text-xs mt-1">
                    {errors.currentPassword.message}
                  </span>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  className={`input input-bordered w-full ${
                    errors.newPassword ? "input-error" : ""
                  }`}
                  {...register("newPassword")}
                  placeholder="Enter new password"
                />
                {errors.newPassword && (
                  <span className="text-error text-xs mt-1">
                    {errors.newPassword.message}
                  </span>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Confirm New Password</span>
                </label>
                <input
                  type="password"
                  className={`input input-bordered w-full ${
                    errors.confirmPassword ? "input-error" : ""
                  }`}
                  {...register("confirmPassword")}
                  placeholder="Confirm new password"
                />
                {errors.confirmPassword && (
                  <span className="text-error text-xs mt-1">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              <div className="bg-base-200/30 p-4 flex justify-end gap-2">
                <motion.button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setIsChangePasswordModalOpen(false);
                    reset();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="btn btn-warning btn-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Change Password
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsChangePasswordModalOpen(false)}>
            close
          </button>
        </form>
      </dialog>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
      />
    </div>
  );
};

export default AccountPage;
