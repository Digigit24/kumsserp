// Communication React Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkMessagesApi, chatsApi } from '../services/communication.service';
import type {
  BulkMessageFilters,
  BulkMessageCreateInput,
  BulkMessageUpdateInput,
  ChatFilters,
  ChatCreateInput,
  ChatUpdateInput,
} from '../types/communication.types';

// ============================================================================
// BULK MESSAGES HOOKS
// ============================================================================

/**
 * Query key factory for bulk messages
 */
export const bulkMessageKeys = {
  all: ['bulkMessages'] as const,
  lists: () => [...bulkMessageKeys.all, 'list'] as const,
  list: (filters?: BulkMessageFilters) => [...bulkMessageKeys.lists(), filters] as const,
  details: () => [...bulkMessageKeys.all, 'detail'] as const,
  detail: (id: number) => [...bulkMessageKeys.details(), id] as const,
};

/**
 * Hook to fetch list of bulk messages
 */
export const useBulkMessages = (filters?: BulkMessageFilters) => {
  return useQuery({
    queryKey: bulkMessageKeys.list(filters),
    queryFn: () => bulkMessagesApi.list(filters),
  });
};

/**
 * Hook to fetch a single bulk message
 */
export const useBulkMessage = (id: number) => {
  return useQuery({
    queryKey: bulkMessageKeys.detail(id),
    queryFn: () => bulkMessagesApi.get(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a bulk message
 */
export const useCreateBulkMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkMessageCreateInput) => bulkMessagesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bulkMessageKeys.lists() });
    },
  });
};

/**
 * Hook to update a bulk message
 */
export const useUpdateBulkMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BulkMessageUpdateInput }) =>
      bulkMessagesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bulkMessageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bulkMessageKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to partially update a bulk message
 */
export const usePartialUpdateBulkMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BulkMessageUpdateInput> }) =>
      bulkMessagesApi.partialUpdate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bulkMessageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bulkMessageKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete a bulk message
 */
export const useDeleteBulkMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => bulkMessagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bulkMessageKeys.lists() });
    },
  });
};

// ============================================================================
// CHATS HOOKS
// ============================================================================

/**
 * Query key factory for chats
 */
export const chatKeys = {
  all: ['chats'] as const,
  lists: () => [...chatKeys.all, 'list'] as const,
  list: (filters?: ChatFilters) => [...chatKeys.lists(), filters] as const,
  details: () => [...chatKeys.all, 'detail'] as const,
  detail: (id: number) => [...chatKeys.details(), id] as const,
};

/**
 * Hook to fetch list of chats
 */
export const useChats = (filters?: ChatFilters) => {
  return useQuery({
    queryKey: chatKeys.list(filters),
    queryFn: () => chatsApi.list(filters),
  });
};

/**
 * Hook to fetch a single chat
 */
export const useChat = (id: number) => {
  return useQuery({
    queryKey: chatKeys.detail(id),
    queryFn: () => chatsApi.get(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a chat message
 */
export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChatCreateInput) => chatsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
  });
};

/**
 * Hook to update a chat
 */
export const useUpdateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ChatUpdateInput }) =>
      chatsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
      queryClient.invalidateQueries({ queryKey: chatKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to partially update a chat
 */
export const usePartialUpdateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ChatUpdateInput> }) =>
      chatsApi.partialUpdate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
      queryClient.invalidateQueries({ queryKey: chatKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete a chat
 */
export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => chatsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
  });
};

/**
 * Hook to mark a chat as read
 */
export const useMarkChatAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => chatsApi.markAsRead(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
      queryClient.invalidateQueries({ queryKey: chatKeys.detail(id) });
    },
  });
};
