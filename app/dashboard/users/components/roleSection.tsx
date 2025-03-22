"use client";

import { Role } from "@/api/models";

interface RolesSectionProps {
  filteredRoles: Role[];
  selectedRoles: string[] | undefined;
  handleRoleChange: (roleId: string, checked: boolean) => void;
  error?: string;
}

const RolesSection = ({
  filteredRoles,
  selectedRoles,
  handleRoleChange,
  error,
}: RolesSectionProps) => {
  return (
    <div className="form-control mt-4">
      <label className="label">
        <span className="label-text">Roles</span>
        <span className="label-text-alt text-info">Select at least one</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {filteredRoles.map((role) => (
          <div key={role.id} className="form-control">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                value={role.id}
                checked={selectedRoles?.includes(role.id.toString())}
                onChange={(e) =>
                  handleRoleChange(role.id.toString(), e.target.checked)
                }
              />
              <span className="label-text ml-2">{role.role}</span>
            </label>
          </div>
        ))}
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};

export default RolesSection;
