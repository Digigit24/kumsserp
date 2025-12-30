/**
 * Permissions Context Provider
 *
 * Provides normalized permissions throughout the app
 * Loads permissions once on mount and exposes easy-to-use boolean flags
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  fetchUserPermissions,
  normalizePermissions,
} from '@/services/permissions.service';
import type {
  UserPermissionsJSON,
  NormalizedPermissions,
  UserContext,
  PermissionsResponse,
} from '@/types/permissions.types';

// ============================================================================
// CONTEXT TYPE
// ============================================================================

interface PermissionsContextType {
  permissions: NormalizedPermissions | null;
  rawPermissions: UserPermissionsJSON | null;
  userContext: UserContext | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

// ============================================================================
// HOOK
// ============================================================================

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within PermissionsProvider');
  }
  return context;
};

// ============================================================================
// PROVIDER
// ============================================================================

interface PermissionsProviderProps {
  children: ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
  const [permissions, setPermissions] = useState<NormalizedPermissions | null>(null);
  const [rawPermissions, setRawPermissions] = useState<UserPermissionsJSON | null>(null);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response: PermissionsResponse = await fetchUserPermissions();

      setRawPermissions(response.user_permissions);
      setUserContext(response.user_context);

      // Ensure user_context exists before normalizing
      if (!response.user_context) {
        throw new Error('User context is missing from permissions response');
      }

      const normalized = normalizePermissions(
        response.user_permissions,
        response.user_context
      );
      setPermissions(normalized);
    } catch (err: any) {
      console.error('Failed to load permissions:', err);
      setError(err.message || 'Failed to load permissions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        rawPermissions,
        userContext,
        isLoading,
        error,
        refetch: loadPermissions,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};
