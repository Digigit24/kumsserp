/**
 * Custom React Query Hooks for Fees Module
 * Manages state and API calls for all Fees entities
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  feeMastersApi,
  feeStructuresApi,
  feeDiscountsApi,
  feeFinesApi,
  feeCollectionsApi,
} from '../services/fees.service';

// ============================================================================
// FEE MASTERS HOOKS
// ============================================================================

export const useFeeMasters = (filters?: any) => {
  return useQuery({
    queryKey: ['fee-masters', filters],
    queryFn: () => feeMastersApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeeMasterDetail = (id: number | null) => {
  return useQuery({
    queryKey: ['fee-master-detail', id],
    queryFn: () => feeMastersApi.get(id!),
    enabled: !!id,
  });
};

export const useCreateFeeMaster = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => feeMastersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-masters'] });
    },
  });
};

export const useUpdateFeeMaster = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => feeMastersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-masters'] });
    },
  });
};

export const useDeleteFeeMaster = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => feeMastersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-masters'] });
    },
  });
};

// ============================================================================
// FEE STRUCTURES HOOKS
// ============================================================================

export const useFeeStructures = (filters?: any) => {
  return useQuery({
    queryKey: ['fee-structures', filters],
    queryFn: () => feeStructuresApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeeStructureDetail = (id: number | null) => {
  return useQuery({
    queryKey: ['fee-structure-detail', id],
    queryFn: () => feeStructuresApi.get(id!),
    enabled: !!id,
  });
};

export const useCreateFeeStructure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => feeStructuresApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-structures'] });
    },
  });
};

export const useUpdateFeeStructure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => feeStructuresApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-structures'] });
    },
  });
};

export const useDeleteFeeStructure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => feeStructuresApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-structures'] });
    },
  });
};

// ============================================================================
// FEE DISCOUNTS HOOKS
// ============================================================================

export const useFeeDiscounts = (filters?: any) => {
  return useQuery({
    queryKey: ['fee-discounts', filters],
    queryFn: () => feeDiscountsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeeDiscountDetail = (id: number | null) => {
  return useQuery({
    queryKey: ['fee-discount-detail', id],
    queryFn: () => feeDiscountsApi.get(id!),
    enabled: !!id,
  });
};

export const useCreateFeeDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => feeDiscountsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-discounts'] });
    },
  });
};

export const useUpdateFeeDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => feeDiscountsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-discounts'] });
    },
  });
};

export const useDeleteFeeDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => feeDiscountsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-discounts'] });
    },
  });
};

// ============================================================================
// FEE FINES HOOKS
// ============================================================================

export const useFeeFines = (filters?: any) => {
  return useQuery({
    queryKey: ['fee-fines', filters],
    queryFn: () => feeFinesApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeeFineDetail = (id: number | null) => {
  return useQuery({
    queryKey: ['fee-fine-detail', id],
    queryFn: () => feeFinesApi.get(id!),
    enabled: !!id,
  });
};

export const useCreateFeeFine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => feeFinesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-fines'] });
    },
  });
};

export const useUpdateFeeFine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => feeFinesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-fines'] });
    },
  });
};

export const useDeleteFeeFine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => feeFinesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-fines'] });
    },
  });
};

// ============================================================================
// FEE COLLECTIONS HOOKS
// ============================================================================

export const useFeeCollections = (filters?: any) => {
  return useQuery({
    queryKey: ['fee-collections', filters],
    queryFn: () => feeCollectionsApi.list(filters),
    staleTime: 2 * 60 * 1000,
  });
};

export const useFeeCollectionDetail = (id: number | null) => {
  return useQuery({
    queryKey: ['fee-collection-detail', id],
    queryFn: () => feeCollectionsApi.get(id!),
    enabled: !!id,
  });
};

export const useCreateFeeCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => feeCollectionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-collections'] });
    },
  });
};

export const useUpdateFeeCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => feeCollectionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-collections'] });
    },
  });
};

export const useCancelFeeCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => feeCollectionsApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fee-collections'] });
    },
  });
};

export const useStudentFeeStatus = (studentId: number | null) => {
  return useQuery({
    queryKey: ['student-fee-status', studentId],
    queryFn: () => feeCollectionsApi.studentStatus(studentId!),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000,
  });
};
