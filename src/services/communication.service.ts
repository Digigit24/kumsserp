// Communication API Service
import { API_BASE_URL } from '../config/api.config';
import type {
  BulkMessage,
  BulkMessageCreateInput,
  BulkMessageUpdateInput,
  BulkMessageFilters,
  Chat,
  ChatCreateInput,
  ChatUpdateInput,
  ChatFilters,
  PaginatedResponse,
} from '../types/communication.types';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Build query string from parameters object
 */
const buildQueryString = (params: Record<string, any>): string => {
  const filteredParams = Object.entries(params).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, any>
  );

  const queryString = new URLSearchParams(
    Object.entries(filteredParams).map(([key, value]) => [key, String(value)])
  ).toString();

  return queryString ? `?${queryString}` : '';
};

/**
 * Get the College ID for X-College-ID header
 */
const getCollegeId = (): string => {
  try {
    const storedUser = localStorage.getItem('kumss_user');
    if (!storedUser) {
      return 'all';
    }

    const user = JSON.parse(storedUser);
    if (user.userType === 'super_admin') {
      return 'all';
    }

    return user.college?.toString() || 'all';
  } catch (error) {
    console.error('Error parsing user data for college ID:', error);
    return 'all';
  }
};

/**
 * Fetch wrapper with error handling
 */
const fetchApi = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const token = localStorage.getItem('kumss_auth_token');

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-College-ID': getCollegeId(),
  };

  if (token) {
    defaultHeaders['Authorization'] = `Token ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// ============================================================================
// BULK MESSAGES API
// ============================================================================

export const bulkMessagesApi = {
  /**
   * List all bulk messages with optional filters
   */
  list: (filters?: BulkMessageFilters): Promise<PaginatedResponse<BulkMessage>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<BulkMessage>>(
      `${API_BASE_URL}/api/v1/communication/bulk-messages/${queryString}`
    );
  },

  /**
   * Get a single bulk message by ID
   */
  get: (id: number): Promise<BulkMessage> => {
    return fetchApi<BulkMessage>(
      `${API_BASE_URL}/api/v1/communication/bulk-messages/${id}/`
    );
  },

  /**
   * Create a new bulk message
   */
  create: (data: BulkMessageCreateInput): Promise<BulkMessage> => {
    return fetchApi<BulkMessage>(
      `${API_BASE_URL}/api/v1/communication/bulk-messages/`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Update an existing bulk message (PUT - full update)
   */
  update: (id: number, data: BulkMessageUpdateInput): Promise<BulkMessage> => {
    return fetchApi<BulkMessage>(
      `${API_BASE_URL}/api/v1/communication/bulk-messages/${id}/`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Partially update a bulk message (PATCH)
   */
  partialUpdate: (id: number, data: Partial<BulkMessageUpdateInput>): Promise<BulkMessage> => {
    return fetchApi<BulkMessage>(
      `${API_BASE_URL}/api/v1/communication/bulk-messages/${id}/`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete a bulk message
   */
  delete: (id: number): Promise<void> => {
    return fetchApi<void>(
      `${API_BASE_URL}/api/v1/communication/bulk-messages/${id}/`,
      {
        method: 'DELETE',
      }
    );
  },
};

// ============================================================================
// CHATS API
// ============================================================================

export const chatsApi = {
  /**
   * List all chats with optional filters
   */
  list: (filters?: ChatFilters): Promise<PaginatedResponse<Chat>> => {
    const queryString = buildQueryString(filters || {});
    return fetchApi<PaginatedResponse<Chat>>(
      `${API_BASE_URL}/api/v1/communication/chats/${queryString}`
    );
  },

  /**
   * Get a single chat by ID
   */
  get: (id: number): Promise<Chat> => {
    return fetchApi<Chat>(
      `${API_BASE_URL}/api/v1/communication/chats/${id}/`
    );
  },

  /**
   * Create a new chat message
   */
  create: (data: ChatCreateInput): Promise<Chat> => {
    return fetchApi<Chat>(
      `${API_BASE_URL}/api/v1/communication/chats/`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Update an existing chat (PUT - full update)
   */
  update: (id: number, data: ChatUpdateInput): Promise<Chat> => {
    return fetchApi<Chat>(
      `${API_BASE_URL}/api/v1/communication/chats/${id}/`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Partially update a chat (PATCH)
   */
  partialUpdate: (id: number, data: Partial<ChatUpdateInput>): Promise<Chat> => {
    return fetchApi<Chat>(
      `${API_BASE_URL}/api/v1/communication/chats/${id}/`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete a chat
   */
  delete: (id: number): Promise<void> => {
    return fetchApi<void>(
      `${API_BASE_URL}/api/v1/communication/chats/${id}/`,
      {
        method: 'DELETE',
      }
    );
  },

  /**
   * Mark a chat as read
   */
  markAsRead: (id: number): Promise<Chat> => {
    return fetchApi<Chat>(
      `${API_BASE_URL}/api/v1/communication/chats/${id}/`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          is_read: true,
          read_at: new Date().toISOString(),
        }),
      }
    );
  },
};
