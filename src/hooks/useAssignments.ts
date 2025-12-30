/**
 * Assignments React Query Hooks
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { assignmentsApi, assignmentSubmissionsApi } from '../services/assignments.service';
import type {
  Assignment,
  AssignmentCreateInput,
  AssignmentUpdateInput,
  AssignmentListParams,
  PaginatedAssignments,
  AssignmentSubmission,
  AssignmentSubmissionCreateInput,
  AssignmentSubmissionGradeInput,
  AssignmentSubmissionListParams,
  PaginatedSubmissions,
} from '../types/assignments.types';

// Query keys
export const assignmentKeys = {
  all: ['assignments'] as const,
  lists: () => [...assignmentKeys.all, 'list'] as const,
  list: (params?: AssignmentListParams) => [...assignmentKeys.lists(), params] as const,
  details: () => [...assignmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...assignmentKeys.details(), id] as const,
  myAssignments: (params?: AssignmentListParams) => [...assignmentKeys.all, 'my', params] as const,
};

export const submissionKeys = {
  all: ['submissions'] as const,
  lists: () => [...submissionKeys.all, 'list'] as const,
  list: (params?: AssignmentSubmissionListParams) => [...submissionKeys.lists(), params] as const,
  details: () => [...submissionKeys.all, 'detail'] as const,
  detail: (id: number) => [...submissionKeys.details(), id] as const,
  mySubmissions: (params?: AssignmentSubmissionListParams) => [...submissionKeys.all, 'my', params] as const,
};

// ===========================================
// ASSIGNMENTS HOOKS
// ===========================================

/**
 * Fetch assignments list
 */
export const useAssignments = (
  params?: AssignmentListParams
): UseQueryResult<PaginatedAssignments, Error> => {
  return useQuery({
    queryKey: assignmentKeys.list(params),
    queryFn: () => assignmentsApi.list(params),
  });
};

/**
 * Fetch single assignment
 */
export const useAssignment = (id: number): UseQueryResult<Assignment, Error> => {
  return useQuery({
    queryKey: assignmentKeys.detail(id),
    queryFn: () => assignmentsApi.get(id),
    enabled: !!id,
  });
};

/**
 * Fetch my assignments (teacher)
 */
export const useMyAssignments = (
  params?: AssignmentListParams
): UseQueryResult<PaginatedAssignments, Error> => {
  return useQuery({
    queryKey: assignmentKeys.myAssignments(params),
    queryFn: () => assignmentsApi.myAssignments(params),
  });
};

/**
 * Create assignment mutation
 */
export const useCreateAssignment = (): UseMutationResult<
  Assignment,
  Error,
  AssignmentCreateInput | FormData
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignmentCreateInput | FormData) => assignmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.myAssignments() });
    },
  });
};

/**
 * Update assignment mutation
 */
export const useUpdateAssignment = (): UseMutationResult<
  Assignment,
  Error,
  { id: number; data: AssignmentUpdateInput | FormData }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => assignmentsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.myAssignments() });
    },
  });
};

/**
 * Patch assignment mutation
 */
export const usePatchAssignment = (): UseMutationResult<
  Assignment,
  Error,
  { id: number; data: Partial<AssignmentUpdateInput> }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => assignmentsApi.patch(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.myAssignments() });
    },
  });
};

/**
 * Delete assignment mutation
 */
export const useDeleteAssignment = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => assignmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.myAssignments() });
    },
  });
};

// ===========================================
// SUBMISSIONS HOOKS
// ===========================================

/**
 * Fetch submissions list
 */
export const useSubmissions = (
  params?: AssignmentSubmissionListParams
): UseQueryResult<PaginatedSubmissions, Error> => {
  return useQuery({
    queryKey: submissionKeys.list(params),
    queryFn: () => assignmentSubmissionsApi.list(params),
  });
};

/**
 * Fetch single submission
 */
export const useSubmission = (id: number): UseQueryResult<AssignmentSubmission, Error> => {
  return useQuery({
    queryKey: submissionKeys.detail(id),
    queryFn: () => assignmentSubmissionsApi.get(id),
    enabled: !!id,
  });
};

/**
 * Fetch my submissions (student)
 */
export const useMySubmissions = (
  params?: AssignmentSubmissionListParams
): UseQueryResult<PaginatedSubmissions, Error> => {
  return useQuery({
    queryKey: submissionKeys.mySubmissions(params),
    queryFn: () => assignmentSubmissionsApi.mySubmissions(params),
  });
};

/**
 * Create submission mutation
 */
export const useCreateSubmission = (): UseMutationResult<
  AssignmentSubmission,
  Error,
  AssignmentSubmissionCreateInput | FormData
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignmentSubmissionCreateInput | FormData) =>
      assignmentSubmissionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: submissionKeys.mySubmissions() });
    },
  });
};

/**
 * Update submission mutation
 */
export const useUpdateSubmission = (): UseMutationResult<
  AssignmentSubmission,
  Error,
  { id: number; data: AssignmentSubmissionCreateInput | FormData }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => assignmentSubmissionsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: submissionKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: submissionKeys.mySubmissions() });
    },
  });
};

/**
 * Delete submission mutation
 */
export const useDeleteSubmission = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => assignmentSubmissionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: submissionKeys.mySubmissions() });
    },
  });
};

/**
 * Grade submission mutation
 */
export const useGradeSubmission = (): UseMutationResult<
  AssignmentSubmission,
  Error,
  { id: number; data: AssignmentSubmissionGradeInput }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => assignmentSubmissionsApi.grade(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: submissionKeys.detail(variables.id) });
    },
  });
};
