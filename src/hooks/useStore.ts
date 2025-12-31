/**
 * Store Management Hooks
 * API hooks for store items, sales, and sale items
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeItemsApi, saleItemsApi, salesApi, categoriesApi, creditsApi } from '../services/store.service';

// ============================================================================
// CATEGORIES
// ============================================================================

/**
 * Fetch categories with optional filters
 */
export const useCategories = (filters?: any) => {
  return useQuery({
    queryKey: ['store-categories', filters],
    queryFn: () => categoriesApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');
      const collegeId = localStorage.getItem('kumss_college_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
      }

      if (collegeId) {
        submitData.college = parseInt(collegeId);
      }

      return categoriesApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-categories'] });
    },
  });
};

/**
 * Update a category
 */
export const useUpdateCategory = () => {
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

      return categoriesApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-categories'] });
    },
  });
};

/**
 * Delete a category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-categories'] });
    },
  });
};

// ============================================================================
// STORE ITEMS
// ============================================================================

/**
 * Fetch store items with optional filters
 */
export const useStoreItems = (filters?: any) => {
  return useQuery({
    queryKey: ['store-items', filters],
    queryFn: () => storeItemsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new store item
 */
export const useCreateStoreItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');
      const collegeId = localStorage.getItem('kumss_college_id');

      const submitData: any = {
        ...data,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
      }

      if (collegeId) {
        submitData.college = parseInt(collegeId);
      }

      // Remove empty string fields (image, barcode) as backend expects file upload or null
      if (submitData.image === '') {
        delete submitData.image;
      }
      if (submitData.barcode === '') {
        delete submitData.barcode;
      }

      return storeItemsApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-items'] });
    },
  });
};

/**
 * Update a store item
 */
export const useUpdateStoreItem = () => {
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

      // Remove empty string fields (image, barcode) as backend expects file upload or null
      if (submitData.image === '') {
        delete submitData.image;
      }
      if (submitData.barcode === '') {
        delete submitData.barcode;
      }

      return storeItemsApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-items'] });
    },
  });
};

/**
 * Delete a store item
 */
export const useDeleteStoreItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => storeItemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-items'] });
    },
  });
};

// ============================================================================
// SALE ITEMS
// ============================================================================

/**
 * Fetch sale items with optional filters
 */
export const useSaleItems = (filters?: any) => {
  return useQuery({
    queryKey: ['sale-items', filters],
    queryFn: () => saleItemsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new sale item
 */
export const useCreateSaleItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        sale: data.sale,
        item: data.item,
        quantity: data.quantity,
        unit_price: data.unit_price,
        total_price: data.total_price,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.created_by = userId;
        submitData.updated_by = userId;
      }

      return saleItemsApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sale-items'] });
    },
  });
};

/**
 * Update a sale item
 */
export const useUpdateSaleItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const userId = localStorage.getItem('kumss_user_id');

      const submitData: any = {
        sale: data.sale,
        item: data.item,
        quantity: data.quantity,
        unit_price: data.unit_price,
        total_price: data.total_price,
        is_active: data.is_active ?? true,
      };

      if (userId) {
        submitData.updated_by = userId;
      }

      return saleItemsApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sale-items'] });
    },
  });
};

/**
 * Delete a sale item
 */
export const useDeleteSaleItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => saleItemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sale-items'] });
    },
  });
};

// ============================================================================
// CREDITS
// ============================================================================

/**
 * Fetch credits with optional filters
 */
export const useCredits = (filters?: any) => {
  return useQuery({
    queryKey: ['store-credits', filters],
    queryFn: () => creditsApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Create a new credit
 */
export const useCreateCredit = () => {
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

      return creditsApi.create(submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-credits'] });
    },
  });
};

/**
 * Update a credit
 */
export const useUpdateCredit = () => {
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

      return creditsApi.update(id, submitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-credits'] });
    },
  });
};

/**
 * Delete a credit
 */
export const useDeleteCredit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => creditsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-credits'] });
    },
  });
};
