/**
 * Store Management Hooks
 * API hooks for store items, sales, and sale items
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '../utils/fetchInterceptor';

const API_BASE = '/api/v1/store';

// ============================================================================
// SALE ITEMS
// ============================================================================

/**
 * Fetch sale items with optional filters
 */
export const useSaleItems = (filters?: any) => {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
  }

  const queryString = params.toString();
  const url = queryString ? `${API_BASE}/sale-items/?${queryString}` : `${API_BASE}/sale-items/`;

  return useQuery({
    queryKey: ['sale-items', filters],
    queryFn: async () => {
      const response = await fetchWithAuth(url);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.error || 'Failed to fetch sale items');
      }
      return response.json();
    },
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

      const response = await fetchWithAuth(`${API_BASE}/sale-items/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
      }

      return response.json();
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

      const response = await fetchWithAuth(`${API_BASE}/sale-items/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
      }

      return response.json();
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
    mutationFn: async (id: number) => {
      const response = await fetchWithAuth(`${API_BASE}/sale-items/${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete sale item');
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sale-items'] });
    },
  });
};
