"use client";

import { useState, useEffect } from "react";
import { Role } from "@/api/models";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { userFormSchema } from "@/schema/validations";
import { z } from "zod";

// compare arrays
const arraysEqual = <T>(a: T[], b: T[]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

type UserFormValues = z.infer<typeof userFormSchema>;

export const useRolePermissions = (
  roles: Role[],
  setValue: UseFormSetValue<UserFormValues>,
  watch: UseFormWatch<UserFormValues>,
) => {
  const [updatePermissions, setUpdatePermissions] = useState(false);
  const [updateRoles, setUpdateRoles] = useState(false);

  const selectedRoles = watch("role_ids");
  const selectedPermissions = watch("permission_ids");

  // update permissions when roles change
  useEffect(() => {
    if (!roles.length || !updatePermissions) return;

    const permissionIds: string[] = [];
    const roleIds = selectedRoles || [];

    roles.forEach((role) => {
      if (roleIds.includes(role.id.toString())) {
        role.permissions.forEach((permission) => {
          if (!permissionIds.includes(permission.id.toString())) {
            permissionIds.push(permission.id.toString());
          }
        });
      }
    });

    if (
      !arraysEqual(permissionIds.sort(), (selectedPermissions || []).sort())
    ) {
      setValue("permission_ids", permissionIds);
    }

    setUpdatePermissions(false);
  }, [selectedRoles, roles, setValue, selectedPermissions, updatePermissions]);

  // update roles when permissions change
  useEffect(() => {
    if (!roles.length || !updateRoles) return;

    const permissionIds = selectedPermissions || [];
    const roleIds = [...(selectedRoles || [])];
    const rolesToAdd: string[] = [];
    const rolesToRemove: string[] = [];

    const permissionToRolesMap = new Map<string, string[]>();

    roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        const permId = permission.id.toString();
        if (!permissionToRolesMap.has(permId)) {
          permissionToRolesMap.set(permId, []);
        }
        permissionToRolesMap.get(permId)!.push(role.id.toString());
      });
    });

    permissionIds.forEach((permId: string) => {
      const rolesWithThisPermission = permissionToRolesMap.get(permId) || [];

      if (rolesWithThisPermission.length > 0) {
        const alreadyHasSelectedRole = rolesWithThisPermission.some((roleId) =>
          roleIds.includes(roleId),
        );

        if (!alreadyHasSelectedRole) {
          const lastRoleId =
            rolesWithThisPermission[rolesWithThisPermission.length - 1];
          if (!rolesToAdd.includes(lastRoleId)) {
            rolesToAdd.push(lastRoleId);
          }
        }
      }
    });

    roleIds.forEach((roleId) => {
      const role = roles.find((r) => r.id.toString() === roleId);
      if (!role) return;

      const allPermissionsUnchecked = role.permissions.every(
        (permission) => !permissionIds.includes(permission.id.toString()),
      );

      if (allPermissionsUnchecked) {
        rolesToRemove.push(roleId);
      }
    });

    if (rolesToAdd.length > 0 || rolesToRemove.length > 0) {
      const newRoles = [
        ...roleIds.filter((roleId) => !rolesToRemove.includes(roleId)),
        ...rolesToAdd,
      ];
      setValue("role_ids", newRoles);
    }

    setUpdateRoles(false);
  }, [selectedPermissions, roles, setValue, selectedRoles, updateRoles]);

  const handleRoleChange = (roleId: string, checked: boolean) => {
    const currentRoles = selectedRoles || [];
    let newRoles: string[];

    if (checked) {
      newRoles = [...currentRoles, roleId];
    } else {
      newRoles = currentRoles.filter((id: string) => id !== roleId);
    }

    setValue("role_ids", newRoles);
    setUpdatePermissions(true);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const currentPermissions = selectedPermissions || [];
    let newPermissions: string[];

    if (checked) {
      newPermissions = [...currentPermissions, permissionId];
    } else {
      newPermissions = currentPermissions.filter(
        (id: string) => id !== permissionId,
      );
    }

    setValue("permission_ids", newPermissions);
    setUpdateRoles(true);
  };

  const allPermissions = roles
    .flatMap((role) => role.permissions)
    .filter(
      (permission, index, self) =>
        index === self.findIndex((p) => p.id === permission.id),
    );

  // filter out the "Retired" role
  const filteredRoles = roles.filter((role) => role.role !== "Retired");

  return {
    handleRoleChange,
    handlePermissionChange,
    filteredRoles,
    allPermissions,
    selectedRoles,
    selectedPermissions,
  };
};
