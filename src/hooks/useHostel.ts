/**
 * Hostel Module React Query Hooks
 * Custom hooks for Hostel module data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  hostelAllocationsApi,
  hostelBedsApi,
  hostelFeesApi,
} from '../services/hostel.service';

// ============================================================================
// HOSTEL ALLOCATIONS
// ============================================================================

/**
 * Fetch hostel allocations with optional filters
 */
export const useHostelAllocations = (filters?: any) => {
  return useQuery({
    queryKey: ['hostel-allocations', filters],
    queryFn: () => hostelAllocationsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new hostel allocation
 */
export const useCreateHostelAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
        is_current: data.is_current ?? true,
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
      }

      return hostelAllocationsApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel-allocations'] });
    },
  });
};

/**
 * Update a hostel allocation
 */
export const useUpdateHostelAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.updated_by = userId;
      }

      return hostelAllocationsApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel-allocations'] });
    },
  });
};

/**
 * Delete a hostel allocation
 */
export const useDeleteHostelAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => hostelAllocationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel-allocations'] });
    },
  });
};

// ============================================================================
// HOSTEL BEDS
// ============================================================================

/**
 * Fetch hostel beds with optional filters
 */
export const useHostelBeds = (filters?: any) => {
  return useQuery({
    queryKey: ['hostel-beds', filters],
    queryFn: () => hostelBedsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new hostel bed
 */
export const useCreateHostelBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
      }

      return hostelBedsApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel-beds'] });
    },
  });
};

/**
 * Update a hostel bed
 */
export const useUpdateHostelBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.updated_by = userId;
      }

      return hostelBedsApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel-beds'] });
    },
  });
};

/**
 * Delete a hostel bed
 */
export const useDeleteHostelBed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => hostelBedsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel-beds'] });
    },
  });
};

// ============================================================================
// HOSTEL FEES
// ============================================================================

/**
 * Fetch hostel fees with optional filters
 */
export const useHostelFees = (filters?: any) => {
  return useQuery({
    queryKey: ['hostel-fees', filters],
    queryFn: () => hostelFeesApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new hostel fee
 */
export const useCreateHostelFee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
        is_paid: data.is_paid ?? false,
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
      }

      return hostelFeesApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel-fees'] });
    },
  });
};

/**
 * Update a hostel fee
 */
export const useUpdateHostelFee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.updated_by = userId;
      }

      return hostelFeesApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel-fees'] });
    },
  });
};

/**
 * Delete a hostel fee
 */
export const useDeleteHostelFee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => hostelFeesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hostel-fees'] });
    },
  });
};
