import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
    mutationFn: async (data: any) => {
      console.log('=== STORE INDENT CREATE - ORIGINAL DATA ===', JSON.stringify(data, null, 2));
      
      // Deep copy to avoid mutating original data
      const cleanedData = JSON.parse(JSON.stringify(data));
      
      // Save items for later
      const items = cleanedData.items || [];
      
      // Convert empty strings to null for optional fields
      const optionalFields = [
        'approved_date',
        'approved_by',
        'attachments',
        'requesting_store_manager',
        'approval_request',
      ];
      
      optionalFields.forEach(field => {
        if (cleanedData[field] === '' || cleanedData[field] === null) {
          delete cleanedData[field];
        }
      });
      
      // STEP 1: Create indent WITHOUT items
      delete cleanedData.items;
      console.log('=== STEP 1: Creating indent without items ===', JSON.stringify(cleanedData, null, 2));
      
      const createdIndent = await storeIndentsApi.create(cleanedData);
      console.log('=== Indent created with ID ===', createdIndent.id);
      
      // STEP 2: Update indent with items (now we have the indent ID)
      if (items.length > 0) {
        const itemsWithIndentId = items.map((item: any) => ({
          ...item,
          indent: createdIndent.id, // Now we have the indent ID!
        }));
        
        console.log('=== STEP 2: Updating with items ===', JSON.stringify(itemsWithIndentId, null, 2));
        
        await storeIndentsApi.update(createdIndent.id, {
          ...createdIndent,
          items: itemsWithIndentId,
        });
      }
      
      return createdIndent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeIndentKeys.lists() });
    },
  });
};

export const useUpdateStoreIndent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      console.log('=== STORE INDENT UPDATE - BEFORE CLEANING ===', data);
      
      // Clean up data before sending
      const cleanedData = { ...data };
      
      // Remove indent field from items (should already be set)
      if (cleanedData.items && Array.isArray(cleanedData.items)) {
        cleanedData.items = cleanedData.items.map((item: any) => {
          const { indent, ...itemWithoutIndent } = item;
          return itemWithoutIndent;
        });
      }
      
      // Convert empty strings to null for optional fields
      const optionalFields = [
        'approved_date',
        'approved_by',
        'attachments',
        'requesting_store_manager',
        'approval_request',
      ];
      
      optionalFields.forEach(field => {
        if (cleanedData[field] === '' || cleanedData[field] === null) {
          delete cleanedData[field];
        }
      });
      
      console.log('=== STORE INDENT UPDATE - AFTER CLEANING ===', cleanedData);
      
      return storeIndentsApi.update(id, cleanedData);
    },
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
