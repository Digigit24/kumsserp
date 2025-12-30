/**
 * Fees Module API Service
 * All API calls for Fees entities
 */

import { API_ENDPOINTS, buildApiUrl, getDefaultHeaders } from '../config/api.config';
import type { PaginatedResponse } from '../types/core.types';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  const qs = queryParams.toString();
  return qs ? `?${qs}` : '';
};

const fetchApi = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const token = localStorage.getItem('kumss_auth_token');

  const headers = new Headers();
  const defaultHeaders = getDefaultHeaders();
  Object.entries(defaultHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  if (options?.headers) {
    const customHeaders = options.headers;
    if (customHeaders instanceof Headers) {
      customHeaders.forEach((value, key) => headers.set(key, value));
    } else if (Array.isArray(customHeaders)) {
      customHeaders.forEach(([key, value]) => headers.set(key, value));
    } else {
      Object.entries(customHeaders as Record<string, string>).forEach(([key, value]) => {
        headers.set(key, value);
      });
    }
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Token ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      message: errorData.detail || errorData.message || 'Request failed',
      status: response.status,
      errors: errorData,
    };
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
};

// ============================================================================
// FEE MASTERS API
// ============================================================================

export const feeMastersApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`${API_ENDPOINTS.feeMasters.list}${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeMasters.detail(id)));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeMasters.create), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeMasters.update(id)), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeMasters.patch(id)), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(API_ENDPOINTS.feeMasters.delete(id)), {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// FEE STRUCTURES API
// ============================================================================

export const feeStructuresApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`${API_ENDPOINTS.feeStructures.list}${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeStructures.detail(id)));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeStructures.create), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeStructures.update(id)), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeStructures.patch(id)), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(API_ENDPOINTS.feeStructures.delete(id)), {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// FEE DISCOUNTS API
// ============================================================================

export const feeDiscountsApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`${API_ENDPOINTS.feeDiscounts.list}${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeDiscounts.detail(id)));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeDiscounts.create), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeDiscounts.update(id)), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeDiscounts.patch(id)), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(API_ENDPOINTS.feeDiscounts.delete(id)), {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// FEE FINES API
// ============================================================================

export const feeFinesApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`${API_ENDPOINTS.feeFines.list}${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeFines.detail(id)));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeFines.create), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeFines.update(id)), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeFines.patch(id)), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(API_ENDPOINTS.feeFines.delete(id)), {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// FEE COLLECTIONS API
// ============================================================================

export const feeCollectionsApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`${API_ENDPOINTS.feeCollections.list}${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeCollections.detail(id)));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeCollections.create), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeCollections.update(id)), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeCollections.patch(id)), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(API_ENDPOINTS.feeCollections.delete(id)), {
      method: 'DELETE',
    });
  },

  cancel: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeCollections.cancel(id)), {
      method: 'POST',
    });
  },

  studentStatus: async (studentId: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeCollections.studentStatus(studentId)));
  },
};

// ============================================================================
// FEE TYPES API
// ============================================================================

export const feeTypesApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`${API_ENDPOINTS.feeTypes.list}${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeTypes.detail(id)));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeTypes.create), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeTypes.update(id)), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(API_ENDPOINTS.feeTypes.patch(id)), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(API_ENDPOINTS.feeTypes.delete(id)), {
      method: 'DELETE',
    });
  },
};
