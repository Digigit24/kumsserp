import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { coreKeys } from '../../hooks/useCore';
import { academicYearApi, collegeApi } from '../../services/core.service';

/**
 * Component to prefetch common data for the application
 * This helps in reducing loading times for dropdowns and common lists
 */
export const DataPrefetcher = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetchCommonData = async () => {
      // Check for token first
      const token = localStorage.getItem('kumss_auth_token');
      if (!token) return;

      // Prefetch Colleges (Dropdowns everywhere)
      await queryClient.prefetchQuery({
        queryKey: coreKeys.collegesList(),
        queryFn: () => collegeApi.list(),
        staleTime: 1000 * 60 * 30, // 30 mins
      });

      // Prefetch Academic Years
      await queryClient.prefetchQuery({
        queryKey: coreKeys.academicYearsList(),
        queryFn: () => academicYearApi.list(),
        staleTime: 1000 * 60 * 60, // 60 mins
      });

      console.log('Common data prefetched');
    };

    prefetchCommonData();
  }, [queryClient]);

  return null;
};
