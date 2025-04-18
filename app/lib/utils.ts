import { User } from "@/api/models";

/**
 * Normalize a string to handle both singular and plural forms
 * Removes trailing 's' and converts to lowercase
 */
function normalizePermission(permission: string): string {
  return permission.toLowerCase().replace(/s$/, "");
}

/**
 * Check if user has a specific permission
 * Handles both singular and plural forms (e.g., "user" matches "Users")
 */
export function hasPermission(
  user: User | null,
  requiredPermission: string,
): boolean {
  if (!user?.permissions) return false;

  const normalizedRequired = normalizePermission(requiredPermission);
  return user.permissions.some((permission) =>
    normalizePermission(permission).includes(normalizedRequired),
  );
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  user: User | null,
  requiredPermissions: string[],
): boolean {
  return requiredPermissions.some((permission) =>
    hasPermission(user, permission),
  );
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  user: User | null,
  requiredPermissions: string[],
): boolean {
  return requiredPermissions.every((permission) =>
    hasPermission(user, permission),
  );
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: string): boolean {
  if (!user?.roles) return false;

  const normalizedRole = role.toLowerCase();
  return user.roles.some(
    (userRole) => userRole.toLowerCase() === normalizedRole,
  );
}

/**
 * Check if user has any of the specified roles
 * @param user - The user object containing roles and permissions
 * @param roles - Array of roles to check for (case insensitive)
 * @returns boolean indicating if user has any of the roles
 */
export function hasAnyRole(user: User | null, roles: string[]): boolean {
  return roles.some((role) => hasRole(user, role));
}
