"use client";

import { Permission, Role } from "@/api/models";

interface PermissionsSectionProps {
  allPermissions: Permission[];
  selectedPermissions: string[] | undefined;
  handlePermissionChange: (permissionId: string, checked: boolean) => void;
  roles: Role[];
  error?: string;
}

const PermissionsSection = ({
  allPermissions,
  selectedPermissions,
  handlePermissionChange,
  roles,
  error,
}: PermissionsSectionProps) => {
  return (
    <div className="form-control mt-4">
      <label className="label">
        <span className="label-text">Permissions</span>
        <span className="label-text-alt text-info">
          Auto-selected based on roles. You can customize.
        </span>
      </label>
      <div className="flex flex-wrap gap-2">
        {allPermissions.map((permission) => {
          const rolesWithPermission = roles
            .filter((role) =>
              role.permissions.some((p) => p.id === permission.id),
            )
            .map((role) => role.role);

          return (
            <div key={permission.id} className="form-control">
              <label className="label cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  value={permission.id}
                  checked={selectedPermissions?.includes(
                    permission.id.toString(),
                  )}
                  onChange={(e) =>
                    handlePermissionChange(
                      permission.id.toString(),
                      e.target.checked,
                    )
                  }
                />
                <div className="ml-2">
                  <span className="label-text">{permission.permission}</span>
                  <div className="text-xs text-opacity-60 text-base-content">
                    {rolesWithPermission.join(", ")}
                  </div>
                </div>
              </label>
            </div>
          );
        })}
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

export default PermissionsSection;
