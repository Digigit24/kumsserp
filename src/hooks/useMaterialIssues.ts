import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materialIssuesApi } from '../services/store.service';

export const materialIssueKeys = {
  all: ['materialIssues'] as const,
  lists: () => [...materialIssueKeys.all, 'list'] as const,
  list: (filters?: any) => [...materialIssueKeys.lists(), filters] as const,
  details: () => [...materialIssueKeys.all, 'detail'] as const,
  detail: (id: number) => [...materialIssueKeys.details(), id] as const,
};

export const useMaterialIssues = (filters?: any) => {
  return useQuery({
    queryKey: materialIssueKeys.list(filters),
    queryFn: () => materialIssuesApi.list(filters),
  });
};

export const useMaterialIssue = (id: number) => {
  return useQuery({
    queryKey: materialIssueKeys.detail(id),
    queryFn: () => materialIssuesApi.get(id),
    enabled: !!id,
  });
};

export const useCreateMaterialIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: materialIssuesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialIssueKeys.lists() });
    },
  });
};

export const useUpdateMaterialIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => materialIssuesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: materialIssueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: materialIssueKeys.detail(variables.id) });
    },
  });
};

export const useDeleteMaterialIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: materialIssuesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialIssueKeys.lists() });
    },
  });
};

export const useDispatchMaterialIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => materialIssuesApi.dispatch(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: materialIssueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: materialIssueKeys.detail(variables.id) });
    },
  });
};

export const useConfirmReceipt = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => materialIssuesApi.confirmReceipt(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: materialIssueKeys.lists() });
      queryClient.invalidateQueries({ queryKey: materialIssueKeys.detail(variables.id) });
    },
  });
};

export const useGeneratePdf = () => {
  return useMutation({
    mutationFn: materialIssuesApi.generatePdf,
  });
};
