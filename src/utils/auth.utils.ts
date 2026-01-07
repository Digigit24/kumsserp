
import { User } from '@/types/auth.types';

/**
 * Check if a user is a Super Admin
 * Checks both is_superuser flag and user_type
 */
export const isSuperAdmin = (user?: User | null): boolean => {
  if (!user) {
    // Try to get from localStorage if not provided
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const localUser = JSON.parse(userStr);
        return localUser.is_superuser === true || localUser.user_type === 'super_admin';
      } catch (e) {
        return false;
      }
    }
    return false;
  }
  
  return user.is_superuser === true || user.user_type === 'super_admin';
};

/**
 * Get the current user's college ID
 * Returns null if user is super admin (as they should select college)
 * Returns college ID for regular users
 */
export const getCurrentUserCollege = (user?: User | null): number | null => {
  if (isSuperAdmin(user)) {
    return null;
  }

  if (!user) {
    // Try to get from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const localUser = JSON.parse(userStr);
        return localUser.college || localUser.college_id || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  return user.college || (user as any).college_id || null;
};
