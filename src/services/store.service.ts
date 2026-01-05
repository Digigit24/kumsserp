/**
 * Store Module API Service
 * All API calls for Store entities
 */

import { buildApiUrl, getDefaultHeaders } from '../config/api.config';
import type { PaginatedResponse } from '../types/core.types';
import type {
  Vendor,
  VendorCreateInput,
  VendorUpdateInput,
  VendorFilters,
  StockReceipt,
  StockReceiptCreateInput,
  StockReceiptUpdateInput,
  StockReceiptFilters,
} from '../types/store.types';

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
// CATEGORIES API
// ============================================================================

export const categoriesApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`/api/v1/store/categories/${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/categories/${id}/`));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/categories/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/categories/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/categories/${id}/`), {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// STORE ITEMS API
// ============================================================================

export const storeItemsApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`/api/v1/store/items/${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/items/${id}/`));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/items/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/items/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/items/${id}/`), {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// SALE ITEMS API
// ============================================================================

export const saleItemsApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`/api/v1/store/sale-items/${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/sale-items/${id}/`));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/sale-items/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/sale-items/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/sale-items/${id}/`), {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// SALES API
// ============================================================================

export const salesApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`/api/v1/store/sales/${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/sales/${id}/`));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/sales/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/sales/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/sales/${id}/`), {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// CREDITS API
// ============================================================================

export const creditsApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`/api/v1/store/credits/${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/credits/${id}/`));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/credits/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/credits/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/credits/${id}/`), {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// PRINT JOBS API
// ============================================================================

export const printJobsApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`/api/v1/store/print-jobs/${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/print-jobs/${id}/`));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/print-jobs/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/print-jobs/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  partialUpdate: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/print-jobs/${id}/`), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/print-jobs/${id}/`), {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// VENDOR API
// ============================================================================

export const vendorApi = {
  /**
   * List all vendors with pagination and filters
   */
  list: async (filters?: VendorFilters): Promise<PaginatedResponse<Vendor>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<Vendor>>(
      buildApiUrl(`/api/v1/store/vendors/${queryString}`)
    );
  },

  /**
   * Get vendor by ID
   */
  get: async (id: number): Promise<Vendor> => {
    return fetchApi<Vendor>(buildApiUrl(`/api/v1/store/vendors/${id}/`));
  },

  /**
   * Create new vendor
   */
  create: async (data: VendorCreateInput): Promise<Vendor> => {
    return fetchApi<Vendor>(buildApiUrl('/api/v1/store/vendors/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update vendor (full update)
   */
  update: async (id: number, data: VendorUpdateInput): Promise<Vendor> => {
    return fetchApi<Vendor>(buildApiUrl(`/api/v1/store/vendors/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Partial update vendor
   */
  patch: async (id: number, data: Partial<VendorUpdateInput>): Promise<Vendor> => {
    return fetchApi<Vendor>(buildApiUrl(`/api/v1/store/vendors/${id}/`), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete vendor
   */
  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/vendors/${id}/`), {
      method: 'DELETE',
    });
  },
};

// ============================================================================
// STOCK RECEIPT API
// ============================================================================

export const stockReceiptApi = {
  /**
   * List all stock receipts with pagination and filters
   */
  list: async (filters?: StockReceiptFilters): Promise<PaginatedResponse<StockReceipt>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<StockReceipt>>(
      buildApiUrl(`/api/v1/store/stock-receipts/${queryString}`)
    );
  },

  /**
   * Get stock receipt by ID
   */
  get: async (id: number): Promise<StockReceipt> => {
    return fetchApi<StockReceipt>(buildApiUrl(`/api/v1/store/stock-receipts/${id}/`));
  },

  /**
   * Create new stock receipt
   */
  create: async (data: StockReceiptCreateInput): Promise<StockReceipt> => {
    return fetchApi<StockReceipt>(buildApiUrl('/api/v1/store/stock-receipts/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update stock receipt (full update)
   */
  update: async (id: number, data: StockReceiptUpdateInput): Promise<StockReceipt> => {
    return fetchApi<StockReceipt>(buildApiUrl(`/api/v1/store/stock-receipts/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Partial update stock receipt
   */
  patch: async (id: number, data: Partial<StockReceiptUpdateInput>): Promise<StockReceipt> => {
    return fetchApi<StockReceipt>(buildApiUrl(`/api/v1/store/stock-receipts/${id}/`), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete stock receipt
   */
  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/stock-receipts/${id}/`), {
      method: 'DELETE',
    });
  },
};
// ============================================================================
// CENTRAL STORE API
// ============================================================================

export const centralStoreApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`/api/v1/store/central-stores/${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/central-stores/${id}/`));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/central-stores/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/central-stores/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/central-stores/${id}/`), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/central-stores/${id}/`), {
      method: 'DELETE',
    });
  },

  inventory: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/central-stores/${id}/inventory/`));
  },

  stockSummary: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/central-stores/${id}/stock_summary/`));
  },
};
// ============================================================================
// CENTRAL INVENTORY API
// ============================================================================

export const centralInventoryApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`/api/v1/store/central-inventory/${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/central-inventory/${id}/`));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/central-inventory/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/central-inventory/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/central-inventory/${id}/`), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/central-inventory/${id}/`), {
      method: 'DELETE',
    });
  },

  adjustStock: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/central-inventory/${id}/adjust_stock/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  lowStock: async (): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/central-inventory/low_stock/'));
  },
};
// ============================================================================
// MATERIAL ISSUES API
// ============================================================================

export const materialIssuesApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`/api/v1/store/material-issues/${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/material-issues/${id}/`));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/material-issues/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/material-issues/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/material-issues/${id}/`), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/material-issues/${id}/`), {
      method: 'DELETE',
    });
  },

  confirmReceipt: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/material-issues/${id}/confirm_receipt/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  dispatch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/material-issues/${id}/dispatch/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  generatePdf: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/material-issues/${id}/generate_pdf/`), {
      method: 'POST',
    });
  },
};

// ============================================================================
// STORE INDENTS API
// ============================================================================

export const storeIndentsApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`/api/v1/store/indents/${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/indents/${id}/`));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/indents/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/indents/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/indents/${id}/`), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/indents/${id}/`), {
      method: 'DELETE',
    });
  },

  approve: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/indents/${id}/approve/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  reject: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/indents/${id}/reject/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  submit: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/indents/${id}/submit/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // College Admin Approvals
  pendingCollegeApprovals: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    const response = await fetchApi<any>(
      buildApiUrl(`/api/v1/store/indents/pending_college_approvals/${queryString}`)
    );

    // If the response is an array, transform it to paginated format
    if (Array.isArray(response)) {
      return {
        count: response.length,
        next: null,
        previous: null,
        results: response,
      };
    }

    // If it's already paginated, return as is
    return response;
  },

  collegeAdminApprove: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/indents/${id}/college_admin_approve/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  collegeAdminReject: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/indents/${id}/college_admin_reject/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Super Admin Approvals
  pendingSuperAdminApprovals: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    const response = await fetchApi<any>(
      buildApiUrl(`/api/v1/store/indents/pending_super_admin_approvals/${queryString}`)
    );

    // If the response is an array, transform it to paginated format
    if (Array.isArray(response)) {
      return {
        count: response.length,
        next: null,
        previous: null,
        results: response,
      };
    }

    // If it's already paginated, return as is
    return response;
  },

  superAdminApprove: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/indents/${id}/super_admin_approve/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  superAdminReject: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/indents/${id}/super_admin_reject/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Material Issuance
  issueMaterials: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/indents/${id}/issue_materials/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// PROCUREMENT - REQUIREMENTS API
// ============================================================================

export const procurementRequirementsApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`/api/v1/store/procurement/requirements/${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/requirements/${id}/`));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/procurement/requirements/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/requirements/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/requirements/${id}/`), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/procurement/requirements/${id}/`), {
      method: 'DELETE',
    });
  },

  getQuotations: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/requirements/${id}/quotations/`));
  },

  selectQuotation: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/requirements/${id}/select_quotation/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  submitForApproval: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/requirements/${id}/submit_for_approval/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// PROCUREMENT - QUOTATIONS API
// ============================================================================

export const procurementQuotationsApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`/api/v1/store/procurement/quotations/${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/quotations/${id}/`));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/procurement/quotations/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/quotations/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/quotations/${id}/`), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/procurement/quotations/${id}/`), {
      method: 'DELETE',
    });
  },

  markSelected: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/quotations/${id}/mark_selected/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// PROCUREMENT - PURCHASE ORDERS API
// ============================================================================

export const procurementPurchaseOrdersApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`/api/v1/store/procurement/purchase-orders/${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/purchase-orders/${id}/`));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/procurement/purchase-orders/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/purchase-orders/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/purchase-orders/${id}/`), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/procurement/purchase-orders/${id}/`), {
      method: 'DELETE',
    });
  },

  acknowledge: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/purchase-orders/${id}/acknowledge/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  generatePdf: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/purchase-orders/${id}/generate_pdf/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  sendToSupplier: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/purchase-orders/${id}/send_to_supplier/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// PROCUREMENT - GOODS RECEIPTS API
// ============================================================================

export const procurementGoodsReceiptsApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`/api/v1/store/procurement/goods-receipts/${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/goods-receipts/${id}/`));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/procurement/goods-receipts/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/goods-receipts/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/goods-receipts/${id}/`), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/procurement/goods-receipts/${id}/`), {
      method: 'DELETE',
    });
  },

  postToInventory: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/goods-receipts/${id}/post_to_inventory/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  submitForInspection: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/goods-receipts/${id}/submit_for_inspection/`), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============================================================================
// PROCUREMENT - INSPECTIONS API
// ============================================================================

export const procurementInspectionsApi = {
  list: async (filters?: any): Promise<PaginatedResponse<any>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<any>>(
      buildApiUrl(`/api/v1/store/procurement/inspections/${queryString}`)
    );
  },

  get: async (id: number): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/inspections/${id}/`));
  },

  create: async (data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl('/api/v1/store/procurement/inspections/'), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/inspections/${id}/`), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch: async (id: number, data: any): Promise<any> => {
    return fetchApi<any>(buildApiUrl(`/api/v1/store/procurement/inspections/${id}/`), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(buildApiUrl(`/api/v1/store/procurement/inspections/${id}/`), {
      method: 'DELETE',
    });
  },
};
