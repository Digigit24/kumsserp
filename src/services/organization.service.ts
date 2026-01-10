/**
 * Organization Hierarchy Module API Service
 * All API calls for Organization Hierarchy entities
 */

import { buildApiUrl, getDefaultHeaders } from "../config/api.config";
import type {
  OrganizationNode,
  OrganizationNodeTree,
  OrganizationNodeCreateInput,
  OrganizationNodeUpdateInput,
  OrganizationNodeFilters,
  DynamicRole,
  DynamicRoleCreateInput,
  DynamicRoleUpdateInput,
  DynamicRoleFilters,
  RolePermissionsUpdateInput,
  HierarchyPermission,
  PermissionsByCategory,
  HierarchyUserRole,
  UserRoleAssignInput,
  UserRoleRevokeInput,
  Team,
  TeamCreateInput,
  TeamUpdateInput,
  TeamFilters,
  HierarchyTeamMember,
  TeamMemberAddInput,
  PaginatedResponse,
} from "../types/core.types";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, String(value));
    }
  });
  const qs = queryParams.toString();
  return qs ? `?${qs}` : "";
};

const fetchApi = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const token = localStorage.getItem("kumss_auth_token");

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
      Object.entries(customHeaders as Record<string, string>).forEach(
        ([key, value]) => {
          headers.set(key, value);
        }
      );
    }
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Token ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      message: errorData.detail || errorData.message || "Request failed",
      status: response.status,
      data: errorData,
    };
  }

  return response.json();
};

// ============================================================================
// ORGANIZATION NODE API
// ============================================================================

export const organizationNodeApi = {
  /**
   * Get organization hierarchy tree
   * Returns nested tree structure
   * Cached for 5 minutes on backend
   */
  getTree: async (): Promise<{ tree: OrganizationNodeTree[] }> => {
    // API_ENDPOINTS does not currently contain organization hierarchy entries; use explicit path.
    const endpoint = "/api/v1/core/organization/nodes/tree/";
    return fetchApi<{ tree: OrganizationNodeTree[] }>(buildApiUrl(endpoint));
  },

  /**
   * Get all organization nodes (list view)
   */
  getAll: async (
    filters?: OrganizationNodeFilters
  ): Promise<PaginatedResponse<OrganizationNode>> => {
    const queryString = filters ? buildQueryString(filters) : "";
    return fetchApi<PaginatedResponse<OrganizationNode>>(
      buildApiUrl(`${API_ENDPOINTS.organizationHierarchy.nodes.list}${queryString}`)
    );
  },

  /**
   * Get single organization node by ID
   */
  getById: async (id: number): Promise<OrganizationNode> => {
    return fetchApi<OrganizationNode>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.nodes.detail(id))
    );
  },

  /**
   * Create new organization node
   * Clears tree cache on backend
   */
  create: async (data: OrganizationNodeCreateInput): Promise<OrganizationNode> => {
    return fetchApi<OrganizationNode>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.nodes.create),
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Update organization node
   * Clears tree cache on backend
   */
  update: async (id: number, data: OrganizationNodeUpdateInput): Promise<OrganizationNode> => {
    return fetchApi<OrganizationNode>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.nodes.update(id)),
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Partial update organization node
   * Clears tree cache on backend
   */
  patch: async (id: number, data: Partial<OrganizationNodeUpdateInput>): Promise<OrganizationNode> => {
    return fetchApi<OrganizationNode>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.nodes.patch(id)),
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete organization node
   * Clears tree cache on backend
   */
  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.nodes.delete(id)),
      {
        method: "DELETE",
      }
    );
  },
};

// ============================================================================
// DYNAMIC ROLE API
// ============================================================================

export const dynamicRoleApi = {
  /**
   * Get all dynamic roles
   */
  getAll: async (
    filters?: DynamicRoleFilters
  ): Promise<PaginatedResponse<DynamicRole>> => {
    const queryString = filters ? buildQueryString(filters) : "";
    return fetchApi<PaginatedResponse<DynamicRole>>(
      buildApiUrl(`${API_ENDPOINTS.organizationHierarchy.roles.list}${queryString}`)
    );
  },

  /**
   * Get single dynamic role by ID
   */
  getById: async (id: number): Promise<DynamicRole> => {
    return fetchApi<DynamicRole>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.roles.detail(id))
    );
  },

  /**
   * Create new dynamic role
   */
  create: async (data: DynamicRoleCreateInput): Promise<DynamicRole> => {
    return fetchApi<DynamicRole>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.roles.create),
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Update dynamic role
   */
  update: async (id: number, data: DynamicRoleUpdateInput): Promise<DynamicRole> => {
    return fetchApi<DynamicRole>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.roles.update(id)),
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Partial update dynamic role
   */
  patch: async (id: number, data: Partial<DynamicRoleUpdateInput>): Promise<DynamicRole> => {
    return fetchApi<DynamicRole>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.roles.patch(id)),
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete dynamic role
   */
  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.roles.delete(id)),
      {
        method: "DELETE",
      }
    );
  },

  /**
   * Update role permissions
   * Add or remove permissions from a role
   */
  updatePermissions: async (
    id: number,
    data: RolePermissionsUpdateInput
  ): Promise<DynamicRole> => {
    return fetchApi<DynamicRole>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.roles.updatePermissions(id)),
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },
};

// ============================================================================
// HIERARCHY PERMISSION API
// ============================================================================

export const hierarchyPermissionApi = {
  /**
   * Get all hierarchy permissions
   */
  getAll: async (): Promise<HierarchyPermission[]> => {
    return fetchApi<HierarchyPermission[]>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.permissions.list)
    );
  },

  /**
   * Get permissions grouped by category
   * Useful for permission selection UI
   */
  getByCategory: async (): Promise<PermissionsByCategory[]> => {
    return fetchApi<PermissionsByCategory[]>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.permissions.byCategory)
    );
  },
};

// ============================================================================
// USER ROLE ASSIGNMENT API
// ============================================================================

export const hierarchyUserRoleApi = {
  /**
   * Assign role to user at a node
   */
  assign: async (data: UserRoleAssignInput): Promise<HierarchyUserRole> => {
    return fetchApi<HierarchyUserRole>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.userRoles.assign),
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Revoke role from user at a node
   */
  revoke: async (data: UserRoleRevokeInput): Promise<void> => {
    return fetchApi<void>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.userRoles.revoke),
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },
};

// ============================================================================
// TEAM API
// ============================================================================

export const teamApi = {
  /**
   * Get all teams
   */
  getAll: async (filters?: TeamFilters): Promise<PaginatedResponse<Team>> => {
    const queryString = filters ? buildQueryString(filters) : "";
    return fetchApi<PaginatedResponse<Team>>(
      buildApiUrl(`${API_ENDPOINTS.organizationHierarchy.teams.list}${queryString}`)
    );
  },

  /**
   * Get single team by ID
   */
  getById: async (id: number): Promise<Team> => {
    return fetchApi<Team>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.teams.detail(id))
    );
  },

  /**
   * Create new team
   */
  create: async (data: TeamCreateInput): Promise<Team> => {
    return fetchApi<Team>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.teams.create),
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Update team
   */
  update: async (id: number, data: TeamUpdateInput): Promise<Team> => {
    return fetchApi<Team>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.teams.update(id)),
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Partial update team
   */
  patch: async (id: number, data: Partial<TeamUpdateInput>): Promise<Team> => {
    return fetchApi<Team>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.teams.patch(id)),
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Delete team
   */
  delete: async (id: number): Promise<void> => {
    return fetchApi<void>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.teams.delete(id)),
      {
        method: "DELETE",
      }
    );
  },

  /**
   * Get team members
   */
  getMembers: async (id: number): Promise<HierarchyTeamMember[]> => {
    return fetchApi<HierarchyTeamMember[]>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.teams.members(id))
    );
  },

  /**
   * Add member to team
   */
  addMember: async (id: number, data: TeamMemberAddInput): Promise<HierarchyTeamMember> => {
    return fetchApi<HierarchyTeamMember>(
      buildApiUrl(API_ENDPOINTS.organizationHierarchy.teams.addMember(id)),
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },
};
