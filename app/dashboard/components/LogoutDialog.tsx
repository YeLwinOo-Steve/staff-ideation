"use client";

import { LogOut, AlertTriangle, X, DoorOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutDialog({ isOpen, onClose }: LogoutDialogProps) {
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // TODO: Add logout logic here (e.g. clear tokens, etc)

    // Navigate to login page
    router.push("/login");
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
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
              <AlertTriangle className="w-6 h-6 text-error" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold">Confirm Logout</h3>
              <p className="text-sm text-base-content/70">
                You are about to sign out
              </p>
            </div>
          </div>

          <div className="divider divider-error before:h-[1px] after:h-[1px] my-2"></div>

          <div className="bg-error/5 p-4 rounded-xl space-y-3">
            <div className="flex gap-3 items-start">
              <DoorOpen className="w-12 h-12 text-error mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">Are you sure you want to logout?</p>
                <p className="text-sm opacity-70">
                  You will need to sign in again to access your account and
                  settings.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <motion.button
              className="btn btn-ghost btn-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <X className="w-4 h-4" />
              Cancel
            </motion.button>
            <motion.button
              className="btn btn-error btn-sm"
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
