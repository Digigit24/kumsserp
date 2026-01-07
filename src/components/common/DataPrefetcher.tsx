import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { coreKeys } from '../../hooks/useCore';
import { collegeApi, academicYearApi } from '../../services/core.service';

/**
 * Component to prefetch common data for the application
 * This helps in reducing loading times for dropdowns and common lists
 */
export const DataPrefetcher = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetchCommonData = async () => {
      // Don't prefetch if not authenticated or on login page
      const token = localStorage.getItem('kumss_auth_token');
      const isLoginPage = window.location.pathname.includes('/login');
      
      if (!token || isLoginPage) return;

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
