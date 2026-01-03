// Communication React Hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  bulkMessagesApi,
  chatsApi,
  eventsApi,
  eventRegistrationsApi,
  messageLogsApi,
  noticesApi,
  notificationRulesApi,
  messageTemplatesApi
} from '../services/communication.service';
import type {
  BulkMessageFilters,
  BulkMessageCreateInput,
  BulkMessageUpdateInput,
  ChatFilters,
  ChatCreateInput,
  ChatUpdateInput,
  EventFilters,
  EventCreateInput,
  EventUpdateInput,
  EventRegistrationFilters,
  EventRegistrationCreateInput,
  EventRegistrationUpdateInput,
  MessageLogFilters,
  MessageLogCreateInput,
  MessageLogUpdateInput,
  NoticeFilters,
  NoticeCreateInput,
  NoticeUpdateInput,
  NotificationRuleFilters,
  NotificationRuleCreateInput,
  NotificationRuleUpdateInput,
  MessageTemplateFilters,
  MessageTemplateCreateInput,
  MessageTemplateUpdateInput,
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

// ============================================================================
// EVENTS HOOKS
// ============================================================================

/**
 * Query key factory for events
 */
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters?: EventFilters) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: number) => [...eventKeys.details(), id] as const,
};

/**
 * Hook to fetch list of events
 */
export const useEvents = (filters?: EventFilters) => {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: () => eventsApi.list(filters),
  });
};

/**
 * Hook to fetch a single event
 */
export const useEvent = (id: number) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventsApi.get(id),
    enabled: !!id,
  });
};

/**
 * Hook to create an event
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EventCreateInput) => eventsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};

/**
 * Hook to update an event
 */
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EventUpdateInput }) =>
      eventsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to partially update an event
 */
export const usePartialUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EventUpdateInput> }) =>
      eventsApi.partialUpdate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete an event
 */
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
};

// ============================================================================
// EVENT REGISTRATIONS HOOKS
// ============================================================================

/**
 * Query key factory for event registrations
 */
export const eventRegistrationKeys = {
  all: ['eventRegistrations'] as const,
  lists: () => [...eventRegistrationKeys.all, 'list'] as const,
  list: (filters?: EventRegistrationFilters) => [...eventRegistrationKeys.lists(), filters] as const,
  details: () => [...eventRegistrationKeys.all, 'detail'] as const,
  detail: (id: number) => [...eventRegistrationKeys.details(), id] as const,
};

/**
 * Hook to fetch list of event registrations
 */
export const useEventRegistrations = (filters?: EventRegistrationFilters) => {
  return useQuery({
    queryKey: eventRegistrationKeys.list(filters),
    queryFn: () => eventRegistrationsApi.list(filters),
  });
};

/**
 * Hook to fetch a single event registration
 */
export const useEventRegistration = (id: number) => {
  return useQuery({
    queryKey: eventRegistrationKeys.detail(id),
    queryFn: () => eventRegistrationsApi.get(id),
    enabled: !!id,
  });
};

/**
 * Hook to create an event registration
 */
export const useCreateEventRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EventRegistrationCreateInput) => eventRegistrationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventRegistrationKeys.lists() });
    },
  });
};

/**
 * Hook to update an event registration
 */
export const useUpdateEventRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EventRegistrationUpdateInput }) =>
      eventRegistrationsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: eventRegistrationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventRegistrationKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to partially update an event registration
 */
export const usePartialUpdateEventRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EventRegistrationUpdateInput> }) =>
      eventRegistrationsApi.partialUpdate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: eventRegistrationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventRegistrationKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete an event registration
 */
export const useDeleteEventRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eventRegistrationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventRegistrationKeys.lists() });
    },
  });
};

// ============================================================================
// MESSAGE LOGS HOOKS
// ============================================================================

/**
 * Query key factory for message logs
 */
export const messageLogKeys = {
  all: ['messageLogs'] as const,
  lists: () => [...messageLogKeys.all, 'list'] as const,
  list: (filters?: MessageLogFilters) => [...messageLogKeys.lists(), filters] as const,
  details: () => [...messageLogKeys.all, 'detail'] as const,
  detail: (id: number) => [...messageLogKeys.details(), id] as const,
};

/**
 * Hook to fetch list of message logs
 */
export const useMessageLogs = (filters?: MessageLogFilters) => {
  return useQuery({
    queryKey: messageLogKeys.list(filters),
    queryFn: () => messageLogsApi.list(filters),
  });
};

/**
 * Hook to fetch a single message log
 */
export const useMessageLog = (id: number) => {
  return useQuery({
    queryKey: messageLogKeys.detail(id),
    queryFn: () => messageLogsApi.get(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a message log
 */
export const useCreateMessageLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MessageLogCreateInput) => messageLogsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageLogKeys.lists() });
    },
  });
};

/**
 * Hook to update a message log
 */
export const useUpdateMessageLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MessageLogUpdateInput }) =>
      messageLogsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: messageLogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: messageLogKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to partially update a message log
 */
export const usePartialUpdateMessageLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MessageLogUpdateInput> }) =>
      messageLogsApi.partialUpdate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: messageLogKeys.lists() });
      queryClient.invalidateQueries({ queryKey: messageLogKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete a message log
 */
export const useDeleteMessageLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => messageLogsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageLogKeys.lists() });
    },
  });
};

// ============================================================================
// NOTICES HOOKS
// ============================================================================

/**
 * Query key factory for notices
 */
export const noticeKeys = {
  all: ['notices'] as const,
  lists: () => [...noticeKeys.all, 'list'] as const,
  list: (filters?: NoticeFilters) => [...noticeKeys.lists(), filters] as const,
  details: () => [...noticeKeys.all, 'detail'] as const,
  detail: (id: number) => [...noticeKeys.details(), id] as const,
};

/**
 * Hook to fetch list of notices
 */
export const useNotices = (filters?: NoticeFilters) => {
  return useQuery({
    queryKey: noticeKeys.list(filters),
    queryFn: () => noticesApi.list(filters),
  });
};

/**
 * Hook to fetch a single notice
 */
export const useNotice = (id: number) => {
  return useQuery({
    queryKey: noticeKeys.detail(id),
    queryFn: () => noticesApi.get(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a notice
 */
export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NoticeCreateInput) => noticesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
};

/**
 * Hook to update a notice
 */
export const useUpdateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: NoticeUpdateInput }) =>
      noticesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: noticeKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to partially update a notice
 */
export const usePartialUpdateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NoticeUpdateInput> }) =>
      noticesApi.partialUpdate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: noticeKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete a notice
 */
export const useDeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => noticesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticeKeys.lists() });
    },
  });
};

// ============================================================================
// NOTIFICATION RULES HOOKS
// ============================================================================

/**
 * Query key factory for notification rules
 */
export const notificationRuleKeys = {
  all: ['notificationRules'] as const,
  lists: () => [...notificationRuleKeys.all, 'list'] as const,
  list: (filters?: NotificationRuleFilters) => [...notificationRuleKeys.lists(), filters] as const,
  details: () => [...notificationRuleKeys.all, 'detail'] as const,
  detail: (id: number) => [...notificationRuleKeys.details(), id] as const,
};

/**
 * Hook to fetch list of notification rules
 */
export const useNotificationRules = (filters?: NotificationRuleFilters) => {
  return useQuery({
    queryKey: notificationRuleKeys.list(filters),
    queryFn: () => notificationRulesApi.list(filters),
  });
};

/**
 * Hook to fetch a single notification rule
 */
export const useNotificationRule = (id: number) => {
  return useQuery({
    queryKey: notificationRuleKeys.detail(id),
    queryFn: () => notificationRulesApi.get(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a notification rule
 */
export const useCreateNotificationRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NotificationRuleCreateInput) => notificationRulesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationRuleKeys.lists() });
    },
  });
};

/**
 * Hook to update a notification rule
 */
export const useUpdateNotificationRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: NotificationRuleUpdateInput }) =>
      notificationRulesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: notificationRuleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationRuleKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to partially update a notification rule
 */
export const usePartialUpdateNotificationRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NotificationRuleUpdateInput> }) =>
      notificationRulesApi.partialUpdate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: notificationRuleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationRuleKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete a notification rule
 */
export const useDeleteNotificationRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => notificationRulesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationRuleKeys.lists() });
    },
  });
};

// ============================================================================
// MESSAGE TEMPLATES HOOKS
// ============================================================================

/**
 * Query key factory for message templates
 */
export const messageTemplateKeys = {
  all: ['messageTemplates'] as const,
  lists: () => [...messageTemplateKeys.all, 'list'] as const,
  list: (filters?: MessageTemplateFilters) => [...messageTemplateKeys.lists(), filters] as const,
  details: () => [...messageTemplateKeys.all, 'detail'] as const,
  detail: (id: number) => [...messageTemplateKeys.details(), id] as const,
};

/**
 * Hook to fetch list of message templates
 */
export const useMessageTemplates = (filters?: MessageTemplateFilters) => {
  return useQuery({
    queryKey: messageTemplateKeys.list(filters),
    queryFn: () => messageTemplatesApi.list(filters),
  });
};

/**
 * Hook to fetch a single message template
 */
export const useMessageTemplate = (id: number) => {
  return useQuery({
    queryKey: messageTemplateKeys.detail(id),
    queryFn: () => messageTemplatesApi.get(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a message template
 */
export const useCreateMessageTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MessageTemplateCreateInput) => messageTemplatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageTemplateKeys.lists() });
    },
  });
};

/**
 * Hook to update a message template
 */
export const useUpdateMessageTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MessageTemplateUpdateInput }) =>
      messageTemplatesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: messageTemplateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: messageTemplateKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to partially update a message template
 */
export const usePartialUpdateMessageTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MessageTemplateUpdateInput> }) =>
      messageTemplatesApi.partialUpdate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: messageTemplateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: messageTemplateKeys.detail(variables.id) });
    },
  });
};

/**
 * Hook to delete a message template
 */
export const useDeleteMessageTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => messageTemplatesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageTemplateKeys.lists() });
    },
  });
};
