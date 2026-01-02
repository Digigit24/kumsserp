import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeIndentsApi } from '../services/store.service';

export const storeIndentKeys = {
  all: ['storeIndents'] as const,
  lists: () => [...storeIndentKeys.all, 'list'] as const,
  list: (filters?: any) => [...storeIndentKeys.lists(), filters] as const,
  details: () => [...storeIndentKeys.all, 'detail'] as const,
  detail: (id: number) => [...storeIndentKeys.details(), id] as const,
};

export const useStoreIndents = (filters?: any) => {
  return useQuery({
    queryKey: storeIndentKeys.list(filters),
    queryFn: () => storeIndentsApi.list(filters),
  });
};

export const useStoreIndent = (id: number) => {
  return useQuery({
    queryKey: storeIndentKeys.detail(id),
    queryFn: () => storeIndentsApi.get(id),
    enabled: !!id,
  });
};

export const useCreateStoreIndent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeIndentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeIndentKeys.lists() });
    },
  });
};

export const useUpdateStoreIndent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => storeIndentsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: storeIndentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeIndentKeys.detail(variables.id) });
    },
  });
};

export const useDeleteStoreIndent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeIndentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeIndentKeys.lists() });
    },
  });
};

export const useApproveStoreIndent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => storeIndentsApi.approve(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: storeIndentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeIndentKeys.detail(variables.id) });
    },
  });
};

export const useRejectStoreIndent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => storeIndentsApi.reject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: storeIndentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeIndentKeys.detail(variables.id) });
    },
  });
};

export const useSubmitStoreIndent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => storeIndentsApi.submit(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: storeIndentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: storeIndentKeys.detail(variables.id) });
    },
  });
};
