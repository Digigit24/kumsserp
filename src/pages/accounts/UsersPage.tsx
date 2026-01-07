/**
 * Users Management Page
 * Complete CRUD interface for user management
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { userApi } from '../../services/accounts.service';
import type { UserFilters, UserListItem } from '../../types/accounts.types';
import { UserForm } from './components/UserForm';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types/accounts.types';

const isSuperAdmin = (user: User | null | undefined) => user?.user_type === 'super_admin';

const UsersPage = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<UserFilters>({ page: 1, page_size: 20 });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch users list
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => userApi.list(filters),
  });

  // Fetch selected user details
  const { data: selectedUser } = useQuery({
    queryKey: ['user', selectedUserId],
    queryFn: () => selectedUserId ? userApi.get(selectedUserId) : null,
    enabled: !!selectedUserId,
  });

  // Define table columns
  const columns: Column<UserListItem>[] = [
    {
      key: 'username',
      label: 'Username',
      sortable: true,
      render: (user) => (
        <code className="px-2 py-1 bg-muted rounded text-sm font-medium">
          {user.username}
        </code>
      ),
    },
    {
      key: 'full_name',
      label: 'Full Name',
      sortable: true,
      render: (user) => (
        <div>
          <p className="font-medium">{user.full_name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      ),
    },
    {
      key: 'user_type_display',
      label: 'User Type',
      render: (user) => (
        <Badge variant="outline">{user.user_type_display}</Badge>
      ),
    },
    {
      key: 'college_name',
      label: 'College',
      render: (user) => (
        <span className="text-sm">{user.college_name || 'N/A'}</span>
      ),
    },
    {
      key: 'is_verified',
      label: 'Verified',
      render: (user) => (
        user.is_verified ? (
          <Badge variant="default">Verified</Badge>
        ) : (
          <Badge variant="secondary">Not Verified</Badge>
        )
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (user) => (
        <Badge variant={user.is_active ? 'success' : 'destructive'}>
          {user.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  // Define filter configuration
  const filterConfig: FilterConfig[] = [
    {
      name: 'is_active',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' },
      ],
    },
    {
      name: 'is_verified',
      label: 'Verification',
      type: 'select',
      options: [
        { value: 'true', label: 'Verified' },
        { value: 'false', label: 'Not Verified' },
      ],
    },
    {
      name: 'user_type',
      label: 'User Type',
      type: 'select',
      options: [
        { value: 'super_admin', label: 'Super Admin' },
        { value: 'college_admin', label: 'College Admin' },
        { value: 'teacher', label: 'Teacher' },
        { value: 'student', label: 'Student' },
        { value: 'parent', label: 'Parent' },
        { value: 'staff', label: 'Staff' },
        { value: 'central_manager', label: 'Central Store Manager' },
      ],
    },
    ...(isSuperAdmin((useAuth().user) as unknown as User) ? [{
      name: 'college',
      label: 'College',
      type: 'select' as const,
      options: (() => {
        return [];
      })()
    }] : []),
  ];

  const handleRowClick = (user: UserListItem) => {
    setSelectedUserId(user.id);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleAdd = () => {
    setSelectedUserId(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedUserId(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    if (selectedUserId) {
      queryClient.invalidateQueries({ queryKey: ['user', selectedUserId] });
    }
    handleCloseSidebar();
  };

  const handleSubmit = async (formData: any) => {
    if (sidebarMode === 'create') {
      await userApi.create(formData);
    } else if (selectedUser) {
      await userApi.update(selectedUser.id, formData);
    }
  };

  return (
    <div className="p-6">
      <DataTable
        title="Users"
        description="Manage users in the system"
        data={data ?? null}
        columns={columns}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : error ? String(error) : null}
        onRefresh={refetch}
        onAdd={handleAdd}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search by username, name, or email..."
        addButtonLabel="Add User"
      />

      {/* Detail/Create/Edit Sidebar */}
      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={
          sidebarMode === 'create'
            ? 'Add New User'
            : sidebarMode === 'edit'
              ? 'Edit User'
              : selectedUser?.full_name || 'User Details'
        }
        mode={sidebarMode}
        width="xl"
      >
        {sidebarMode === 'create' && (
          <UserForm
            mode="create"
            onSuccess={handleFormSuccess}
            onCancel={handleCloseSidebar}
            onSubmit={handleSubmit}
          />
        )}

        {sidebarMode === 'edit' && selectedUser && (
          <UserForm
            mode="edit"
            user={selectedUser}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseSidebar}
            onSubmit={handleSubmit}
          />
        )}

        {sidebarMode === 'view' && selectedUser && (
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Edit User
              </button>
            </div>

            {/* User Details */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Username</label>
                    <p className="font-medium">
                      <code className="px-2 py-1 bg-background rounded text-sm">{selectedUser.username}</code>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-muted-foreground">Full Name</label>
                    <p className="font-medium text-lg">{selectedUser.full_name}</p>
                  </div>
                  {selectedUser.phone && (
                    <div>
                      <label className="text-sm text-muted-foreground">Phone</label>
                      <p className="font-medium">{selectedUser.phone}</p>
                    </div>
                  )}
                  {selectedUser.gender_display && (
                    <div>
                      <label className="text-sm text-muted-foreground">Gender</label>
                      <p className="font-medium">{selectedUser.gender_display}</p>
                    </div>
                  )}
                  {selectedUser.date_of_birth && (
                    <div>
                      <label className="text-sm text-muted-foreground">Date of Birth</label>
                      <p className="font-medium">{new Date(selectedUser.date_of_birth).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Account Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">User Type</span>
                    <Badge variant="outline">{selectedUser.user_type_display}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">College</span>
                    <span className="font-medium">{selectedUser.college_name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={selectedUser.is_active ? 'success' : 'destructive'}>
                      {selectedUser.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Verified</span>
                    {selectedUser.is_verified ? (
                      <Badge variant="default">Verified</Badge>
                    ) : (
                      <Badge variant="secondary">Not Verified</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Staff Member</span>
                    <span className="font-medium">{selectedUser.is_staff ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Login Information */}
              {(selectedUser.last_login || selectedUser.last_login_ip) && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Login Information</h3>
                  <div className="space-y-2">
                    {selectedUser.last_login && (
                      <div>
                        <label className="text-sm text-muted-foreground">Last Login</label>
                        <p className="font-medium">{new Date(selectedUser.last_login).toLocaleString()}</p>
                      </div>
                    )}
                    {selectedUser.last_login_ip && (
                      <div>
                        <label className="text-sm text-muted-foreground">Last Login IP</label>
                        <p className="font-medium">{selectedUser.last_login_ip}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Audit Information */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Audit Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <label className="text-xs text-muted-foreground">Date Joined</label>
                    <p>{new Date(selectedUser.date_joined).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Created At</label>
                    <p>{new Date(selectedUser.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Updated At</label>
                    <p>{new Date(selectedUser.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Raw Data */}
              <details className="bg-muted/30 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold mb-2 text-sm">
                  Raw API Data
                </summary>
                <pre className="text-xs overflow-auto max-h-64 bg-background p-2 rounded mt-2">
                  {JSON.stringify(selectedUser, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </DetailSidebar>
    </div>
  );
};

export default UsersPage;
