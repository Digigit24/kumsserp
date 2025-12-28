/**
 * Permission Utility Functions
 * Helper functions to check user roles and permissions
 */

import { UserType } from '@/types/accounts.types';

/**
 * Get the current user from localStorage
 */
export const getCurrentUser = (): { user_type?: UserType; userType?: UserType; roles?: string[]; permissions?: Record<string, any> } | null => {
  try {
    const user = JSON.parse(localStorage.getItem('kumss_user') || '{}');
    return user;
  } catch {
    return null;
  }
}; 

/**
 * Get the current user's user_type
 */
export const getUserType = (): UserType | string => {
  const user = getCurrentUser();
  return user?.user_type || user?.userType || 'student';
};

/**
 * Check if user has ANY of the specified roles
 * Supports both hardcoded roles (user_type) and custom roles
 */
export const hasAnyRole = (allowedRoles: string[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  const userType = user.user_type || user.userType;

  // Check hardcoded user_type
  if (userType && allowedRoles.includes(userType)) {
    return true;
  }

  // Check custom roles (for future implementation when backend sends roles)
  if (user.roles && Array.isArray(user.roles)) {
    return user.roles.some(role => allowedRoles.includes(role));
  }

  return false;
};

/**
 * Check if user has ALL of the specified roles
 */
export const hasAllRoles = (requiredRoles: string[]): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  const userType = user.user_type || user.userType;

  // For hardcoded user_type, check if it matches all required roles
  if (userType && requiredRoles.length === 1 && requiredRoles.includes(userType)) {
    return true;
  }

  // Check custom roles (for future implementation)
  if (user.roles && Array.isArray(user.roles)) {
    return requiredRoles.every(role => user.roles!.includes(role));
  }

  return false;
};

/**
 * Check if user is an admin (super_admin or college_admin)
 */
export const isAdmin = (): boolean => {
  return hasAnyRole(['super_admin', 'college_admin']);
};

/**
 * Check if user is a teacher
 */
export const isTeacher = (): boolean => {
  return hasAnyRole(['teacher']);
};

/**
 * Check if user is a student
 */
export const isStudent = (): boolean => {
  return hasAnyRole(['student']);
};

/**
 * Check if user is a parent
 */
export const isParent = (): boolean => {
  return hasAnyRole(['parent']);
};

/**
 * Check if user has a specific permission
 * This is for future implementation when backend sends granular permissions
 */
export const hasPermission = (permission: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  // If user has permissions object from backend, check it
  if (user.permissions && typeof user.permissions === 'object') {
    // Check if permission exists and is true
    const parts = permission.split('.');
    let current: any = user.permissions;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return false;
      }
    }

    return Boolean(current);
  }

  // Fallback: admins have all permissions
  return isAdmin();
};

/**
 * Get role-based dashboard title
 */
export const getDashboardTitle = (): string => {
  const userType = getUserType();

  switch (userType) {
    case 'super_admin':
    case 'college_admin':
      return 'Admin Dashboard';
    case 'teacher':
      return 'Teacher Dashboard';
    case 'student':
      return 'Student Dashboard';
    case 'parent':
      return 'Parent Dashboard';
    case 'staff':
      return 'Staff Dashboard';
    default:
      // For custom roles, capitalize the role name
      return `${userType.charAt(0).toUpperCase()}${userType.slice(1)} Dashboard`;
  }
};

/**
 * Get role-based welcome message
 */
export const getDashboardWelcome = (): string => {
  const userType = getUserType();

  switch (userType) {
    case 'super_admin':
    case 'college_admin':
      return "Welcome back! Here's your institution overview";
    case 'teacher':
      return "Welcome back! Here's what's happening today";
    case 'student':
      return "Welcome back! Here's your overview for today";
    case 'parent':
      return "Welcome back! Here's your child's overview";
    case 'staff':
      return "Welcome back! Here's your dashboard";
    default:
      return "Welcome back!";
  }
};
