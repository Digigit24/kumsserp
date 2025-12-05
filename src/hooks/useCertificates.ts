/**
 * React hook for fetching certificates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificateApi } from '../services/students.service';
import type {
    Certificate,
    CertificateFilters,
    CertificateCreateInput,
    CertificateUpdateInput,
} from '../types/students.types';
import type { PaginatedResponse } from '../types/core.types';

export const useCertificates = (filters?: CertificateFilters) => {
    return useQuery<PaginatedResponse<Certificate>>({
        queryKey: ['certificates', filters],
        queryFn: () => certificateApi.list(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCertificate = (id: number | null) => {
    return useQuery<Certificate>({
        queryKey: ['certificate', id],
        queryFn: () => certificateApi.get(id!),
        enabled: !!id,
    });
};

export const useCreateCertificate = () => {
    const queryClient = useQueryClient();

    return useMutation<Certificate, Error, CertificateCreateInput>({
        mutationFn: (data) => certificateApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['certificates'] });
        },
    });
};

export const useUpdateCertificate = () => {
    const queryClient = useQueryClient();

    return useMutation<Certificate, Error, { id: number; data: CertificateUpdateInput }>({
        mutationFn: ({ id, data }) => certificateApi.patch(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['certificates'] });
            queryClient.invalidateQueries({ queryKey: ['certificate', variables.id] });
        },
    });
};

export const useDeleteCertificate = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
        mutationFn: (id) => certificateApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['certificates'] });
        },
    });
};
