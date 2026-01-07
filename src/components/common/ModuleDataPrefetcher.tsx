import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

// Import Service APIs directly to avoid circular dependencies with hooks
import { 
  storeIndentsApi, 
  materialIssuesApi, 
  centralStoreApi
} from '../../services/store.service';
import { 
  teachersApi, 
  leaveApplicationsApi
} from '../../services/hr.service';
import {
  booksApi,
  libraryMembersApi
} from '../../services/library.service';

// Import Keys from Hooks (or define them here if not exported)
import { storeIndentKeys } from '../../hooks/useStoreIndents';
import { materialIssueKeys } from '../../hooks/useMaterialIssues';

/**
 * ModuleDataPrefetcher
 * 
 * listens to route changes and optimistically prefetches data 
 * when a user enters a main module (e.g., /store, /hr).
 */
export const ModuleDataPrefetcher = () => {
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetchModuleData = async () => {
      // 1. STORE MODULE
      if (pathname.startsWith('/store')) {
        console.log('Prefetching Store Module Data...');
        
        // Prefetch Store Indents (Matches StoreIndentsPage default filters)
        queryClient.prefetchQuery({
          queryKey: storeIndentKeys.list({ page: 1, page_size: 10 }),
          queryFn: () => storeIndentsApi.list({ page: 1, page_size: 10 }),
          staleTime: 5 * 60 * 1000, 
        });

        // Prefetch Material Issues (Matches TransfersWorkflowPage default filters)
        queryClient.prefetchQuery({
          queryKey: materialIssueKeys.list({ ordering: '-created_at', page_size: 1000 }),
          queryFn: () => materialIssuesApi.list({ ordering: '-created_at', page_size: 1000 }),
          staleTime: 5 * 60 * 1000,
        });

        // Prefetch Central Store Items
        queryClient.prefetchQuery({
          queryKey: ['central-stores', 'list'],
          queryFn: () => centralStoreApi.list(),
          staleTime: 10 * 60 * 1000, 
        });
      }

      // 2. HR MODULE
      if (pathname.startsWith('/hr')) {
        console.log('Prefetching HR Module Data...');

        // Prefetch Teachers/Staff
        queryClient.prefetchQuery({
          queryKey: ['teachers'],
          queryFn: () => teachersApi.list(),
          staleTime: 10 * 60 * 1000,
        });

        // Prefetch Leave Applications
        queryClient.prefetchQuery({
          queryKey: ['hr-leave-applications'],
          queryFn: () => leaveApplicationsApi.list(),
          staleTime: 2 * 60 * 1000,
        });
      }

      // 3. LIBRARY MODULE
      if (pathname.startsWith('/library')) {
        console.log('Prefetching Library Module Data...');

        // Prefetch Books
        queryClient.prefetchQuery({
          queryKey: ['books'],
          queryFn: () => booksApi.list(),
          staleTime: 10 * 60 * 1000,
        });

        // Prefetch Members
        queryClient.prefetchQuery({
          queryKey: ['library-members'],
          queryFn: () => libraryMembersApi.list(),
          staleTime: 5 * 60 * 1000,
        });
      }


    };

    prefetchModuleData();
  }, [pathname, queryClient]);

  return null;
};
