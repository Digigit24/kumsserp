/**
 * Approvals Service
 * API calls for approval requests and notifications
 */

import { API_ENDPOINTS, buildApiUrl, getDefaultHeaders } from '../config/api.config';
import type {
  ApprovalRequest,
  ApprovalReviewInput,
  ApprovalNotification,
  ApprovalNotificationUnreadCount,
  FeePaymentApprovalInput,
  ApprovalListParams,
  PaginatedApprovalRequests,
  PaginatedApprovalNotifications,
} from '../types/approvals.types';

/**
 * Generic fetch wrapper
 */
const fetchApi = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const headers = new Headers();
  const defaultHeaders = getDefaultHeaders();
  Object.entries(defaultHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Build query string from params
 */
const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

// ===========================================
// APPROVAL REQUESTS API
// ===========================================

export const approvalsApi = {
  /**
   * List all approval requests
   */
  list: async (params?: ApprovalListParams): Promise<PaginatedApprovalRequests> => {
    const queryString = params ? buildQueryString(params) : '';
    return fetchApi<PaginatedApprovalRequests>(
      buildApiUrl(`${API_ENDPOINTS.approvals.list}${queryString}`)
    );
  },

  /**
   * Get pending approvals for current user
   */
  pendingApprovals: async (params?: ApprovalListParams): Promise<PaginatedApprovalRequests> => {
    const queryString = params ? buildQueryString(params) : '';
    return fetchApi<PaginatedApprovalRequests>(
      buildApiUrl(`${API_ENDPOINTS.approvals.pendingApprovals}${queryString}`)
    );
  },

  /**
   * Get current user's approval requests
   */
  myRequests: async (params?: ApprovalListParams): Promise<PaginatedApprovalRequests> => {
    const queryString = params ? buildQueryString(params) : '';
    return fetchApi<PaginatedApprovalRequests>(
      buildApiUrl(`${API_ENDPOINTS.approvals.myRequests}${queryString}`)
    );
  },

  /**
   * Get approval request by ID
   */
  get: async (id: number): Promise<ApprovalRequest> => {
    return fetchApi<ApprovalRequest>(buildApiUrl(API_ENDPOINTS.approvals.detail(id)));
  },

  /**
   * Review approval request (approve or reject)
   */
  review: async (id: number, data: ApprovalReviewInput): Promise<ApprovalRequest> => {
    return fetchApi<ApprovalRequest>(buildApiUrl(API_ENDPOINTS.approvals.review(id)), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Create fee payment approval request
   */
  createFeePaymentApproval: async (data: FeePaymentApprovalInput): Promise<ApprovalRequest> => {
    return fetchApi<ApprovalRequest>(buildApiUrl(API_ENDPOINTS.approvals.feePayment), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ===========================================
// APPROVAL NOTIFICATIONS API
// ===========================================

export const approvalNotificationsApi = {
  /**
   * List approval notifications
   */
  list: async (params?: { page?: number; page_size?: number }): Promise<PaginatedApprovalNotifications> => {
    const queryString = params ? buildQueryString(params) : '';
    return fetchApi<PaginatedApprovalNotifications>(
      buildApiUrl(`${API_ENDPOINTS.approvals.notifications}${queryString}`)
    );
  },

  /**
   * Get unread notification count
   */
  unreadCount: async (): Promise<ApprovalNotificationUnreadCount> => {
    return fetchApi<ApprovalNotificationUnreadCount>(
      buildApiUrl(API_ENDPOINTS.approvals.unreadCount)
    );
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (id: number): Promise<ApprovalNotification> => {
    return fetchApi<ApprovalNotification>(buildApiUrl(API_ENDPOINTS.approvals.markAsRead(id)), {
      method: 'POST',
    });
  },
};
