/**
 * Custom React Hooks for Accounts Module
 * Manages state and API calls for all Accounts entities
 */

import { useState, useEffect } from 'react';
import {
  userApi,
  roleApi,
  userRoleApi,
  departmentApi,
  userProfileApi,
} from '../services/accounts.service';
import type {
  UserListItem,
  UserFilters,
  RoleListItem,
  RoleFilters,
  UserRole,
  UserRoleFilters,
  DepartmentListItem,
  DepartmentFilters,
  UserProfile,
  UserProfileFilters,
} from '../types/accounts.types';
import { PaginatedResponse } from '../types/core.types';

// ============================================================================
// BASE HOOK TYPE
// ============================================================================

interface UseQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ============================================================================
// USER HOOKS
// ============================================================================

export const useUsers = (filters?: UserFilters): UseQueryResult<PaginatedResponse<UserListItem>> => {
  const [data, setData] = useState<PaginatedResponse<UserListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await userApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      console.error('Fetch users error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// ROLE HOOKS
// ============================================================================

export const useRoles = (filters?: RoleFilters): UseQueryResult<PaginatedResponse<RoleListItem>> => {
  const [data, setData] = useState<PaginatedResponse<RoleListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await roleApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch roles');
      console.error('Fetch roles error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// USER ROLE HOOKS
// ============================================================================

export const useUserRoles = (filters?: UserRoleFilters): UseQueryResult<PaginatedResponse<UserRole>> => {
  const [data, setData] = useState<PaginatedResponse<UserRole> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await userRoleApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user roles');
      console.error('Fetch user roles error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// DEPARTMENT HOOKS
// ============================================================================

export const useDepartments = (filters?: DepartmentFilters): UseQueryResult<PaginatedResponse<DepartmentListItem>> => {
  const [data, setData] = useState<PaginatedResponse<DepartmentListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await departmentApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch departments');
      console.error('Fetch departments error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// USER PROFILE HOOKS
// ============================================================================

export const useUserProfiles = (filters?: UserProfileFilters): UseQueryResult<PaginatedResponse<UserProfile>> => {
  const [data, setData] = useState<PaginatedResponse<UserProfile> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await userProfileApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user profiles');
      console.error('Fetch user profiles error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};
