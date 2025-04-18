import { User } from "@/api/models";

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  user: User | null,
  requiredPermission: string
): boolean {
  if (!user?.permissions) return false;

  // Convert both the required permission and user permissions to lowercase for case-insensitive comparison
  const normalizedRequiredPermission = requiredPermission.toLowerCase();
  return user.permissions.some((permission) =>
    permission.toLowerCase().includes(normalizedRequiredPermission)
  );
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  user: User | null,
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.some((permission) =>
    hasPermission(user, permission)
  );
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  user: User | null,
  requiredPermissions: string[]
): boolean {
  return requiredPermissions.every((permission) =>
    hasPermission(user, permission)
  );
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: string): boolean {
  if (!user?.roles) return false;

  const normalizedRole = role.toLowerCase();
  return user.roles.some(
    (userRole) => userRole.toLowerCase() === normalizedRole
  );
}
