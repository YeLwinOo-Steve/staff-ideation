"use client";

import { LogOutIcon, Mail, Building2, UserCircle2, Shield } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import LogoutDialog from "@/app/dashboard/components/LogoutDialog";
import { getInitials } from "@/util/getInitials";
import { User } from "lucide-react";
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

const AccountPage = () => {
  const { user } = useAuthStore();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  if (!user) return null;

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
                {user.photo && user.photo?.includes("cloudinary") ? (
                  <Image
                    src={user.photo}
                    alt={user.name}
                    width={64}
                    height={64}
                    className="mask mask-squircle"
                  />
                ) : (
                  <span className="text-2xl font-bold">
                    {getInitials(user.name)}
                  </span>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-base-content/60">{user.email}</p>
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
                  <p className="font-medium text-lg">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-info/10 p-3 rounded-xl">
                  <Mail className="w-6 h-6 text-info" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Email</p>
                  <p className="font-medium text-lg">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-accent/10 p-3 rounded-xl">
                  <Building2 className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Department</p>
                  <p className="font-medium text-lg">
                    {user.department || "Not assigned"}
                  </p>
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
                    {user.roles?.map((role, index) => (
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
                  {user.permissions?.map((permission, index) => (
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

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
      />
    </div>
  );
};

export default AccountPage;
