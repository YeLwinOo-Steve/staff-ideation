"use client";

import { Permission, Role } from "@/api/models";
import { Lock, Info, Unlock } from "lucide-react";
import { motion } from "framer-motion";

interface PermissionsSectionProps {
  allPermissions: Permission[];
  selectedPermissions: string[];
  handlePermissionChange: (permId: string) => void;
  roles: Role[];
  error?: string;
}

export default function PermissionsSection({
  allPermissions,
  selectedPermissions,
  handlePermissionChange,
  roles,
  error,
}: PermissionsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-3 rounded-xl">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Additional Permissions</h3>
          <p className="text-sm text-base-content/70">
            Grant specific permissions beyond role-based access
          </p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-error bg-error/5 p-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-base-200/30 rounded-xl p-4">
        <div className="flex items-start gap-2 text-sm">
          <Info className="w-4 h-4 text-info mt-0.5" />
          <p className="text-base-content/70">
            Selected roles already provide some permissions. Additional
            permissions selected here will be combined with role-based
            permissions.
          </p>
        </div>
      </div>

      <div className="space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {allPermissions.map((permission) => {
          const rolesWithPermission = roles
            .filter((role) =>
              role.permissions.some((p) => p.id === permission.id)
            )
            .map((role) => role.role);
          return (
            <div key={permission.id}>
              <div className="gap-3">
                <motion.label
                  key={permission.id}
                  className={`relative flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all
                    ${
                      selectedPermissions.includes(permission.id.toString())
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-base-200/50 hover:bg-base-200 border-2 border-transparent"
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedPermissions.includes(
                      permission.id.toString()
                    )}
                    onChange={() =>
                      handlePermissionChange(permission.id.toString())
                    }
                  />
                  <div
                    className={`p-2 rounded-lg ${
                      selectedPermissions.includes(permission.id.toString())
                        ? "bg-primary/20"
                        : "bg-base-300/50"
                    }`}
                  >
                    {selectedPermissions.includes(permission.id.toString()) ? (
                      <Unlock
                        className={`w-5 h-5 ${
                          selectedPermissions.includes(permission.id.toString())
                            ? "text-primary"
                            : "opacity-50"
                        }`}
                      />
                    ) : (
                      <Lock
                        className={`w-5 h-5 ${
                          selectedPermissions.includes(permission.id.toString())
                            ? "text-primary"
                            : "opacity-50"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{permission.permission}</p>
                    <p className="text-xs text-base-content/70">
                      {rolesWithPermission.join(", ")}
                    </p>
                  </div>
                  {selectedPermissions.includes(permission.id.toString()) && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary"
                      layoutId={`permission-selected-${permission.id}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    />
                  )}
                </motion.label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
