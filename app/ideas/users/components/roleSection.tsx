"use client";

import { Role } from "@/api/models";
import { Shield, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface RolesSectionProps {
  filteredRoles: Role[];
  selectedRoles: string[];
  handleRoleChange: (roleId: string) => void;
  error?: string;
}

export default function RolesSection({
  filteredRoles,
  selectedRoles,
  handleRoleChange,
  error,
}: RolesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-3 rounded-xl">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">User Roles</h3>
          <p className="text-sm text-base-content/70">
            Select the roles this user should have
          </p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-error bg-error/5 p-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredRoles.map((role) => (
          <motion.label
            key={role.id}
            className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
              ${
                selectedRoles.includes(role.id.toString())
                  ? "bg-primary/10 border-2 border-primary"
                  : "bg-base-200/50 hover:bg-base-200 border-2 border-transparent"
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="checkbox"
              className="hidden"
              checked={selectedRoles.includes(role.id.toString())}
              onChange={() => handleRoleChange(role.id.toString())}
            />
            <div
              className={`p-2 rounded-lg ${
                selectedRoles.includes(role.id.toString())
                  ? "bg-primary/20"
                  : "bg-base-300/50"
              }`}
            >
              <ShieldCheck
                className={`w-5 h-5 ${
                  selectedRoles.includes(role.id.toString())
                    ? "text-primary"
                    : "opacity-50"
                }`}
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{role.role}</p>
            </div>
            {selectedRoles.includes(role.id.toString()) && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary"
                layoutId={`role-selected-${role.id}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              />
            )}
          </motion.label>
        ))}
      </div>
    </div>
  );
}
