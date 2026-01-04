/**
 * Student Groups Page
 * Manage student groups (Morning Batch, Evening Batch, etc.)
 */

import { useState } from 'react';
import { useStudentGroups, useStudentGroup, useDeleteStudentGroup } from '../../hooks/useStudents';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Badge } from '../../components/ui/badge';
import { StudentGroupForm } from './components/StudentGroupForm';
import type { StudentGroupListItem, StudentGroupFilters, StudentGroup } from '../../types/students.types';

export const StudentGroupsPage = () => {
  const [filters, setFilters] = useState<StudentGroupFilters>({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useStudentGroups(filters);
  const deleteMutation = useDeleteStudentGroup();

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<StudentGroupListItem | null>(null);

  const { data: selectedGroup } = useStudentGroup(selectedGroupId);

  // Define table columns
  const columns: Column<StudentGroupListItem>[] = [
    {
      key: 'name',
      label: 'Group Name',
      sortable: true,
      render: (group) => (
        <span className="font-medium">{group.name}</span>
      ),
    },
    {
      key: 'college_name',
      label: 'College',
      render: (group) => (
        <span className="text-sm text-muted-foreground">{group.college_name}</span>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (group) => (
        <Badge variant={group.is_active ? 'success' : 'destructive'}>
          {group.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  // Define filter configuration
  const filterConfig: FilterConfig[] = [
    {
      name: 'is_active',
      label: 'Active Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' },
      ],
    },
  ];

  const handleRowClick = (group: StudentGroupListItem) => {
    setSelectedGroupId(group.id);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleAdd = () => {
    setSelectedGroupId(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleDelete = (group: StudentGroupListItem) => {
    setGroupToDelete(group);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (groupToDelete) {
      await deleteMutation.mutateAsync(groupToDelete.id);
      refetch();
      setDeleteDialogOpen(false);
      setGroupToDelete(null);
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedGroupId(null);
  };

  const handleFormSuccess = () => {
    refetch();
    handleCloseSidebar();
  };

  return (
    <div className="p-6">
      <DataTable
        title="Student Groups"
        description="Manage student groups such as Morning Batch, Evening Batch, Hostel Students, etc."
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error}
        onRefresh={refetch}
        onAdd={handleAdd}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search groups by name..."
        addButtonLabel="Add Group"
      />

      {/* Detail/Create/Edit Sidebar */}
      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={
          sidebarMode === 'create'
            ? 'Add New Group'
            : sidebarMode === 'edit'
            ? 'Edit Group'
            : selectedGroup?.name || 'Group Details'
        }
        mode={sidebarMode}
        width="lg"
      >
        {sidebarMode === 'create' && (
          <StudentGroupForm
            mode="create"
            onSuccess={handleFormSuccess}
            onCancel={handleCloseSidebar}
          />
        )}

        {sidebarMode === 'edit' && selectedGroup && (
          <StudentGroupForm
            mode="edit"
            group={selectedGroup}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseSidebar}
          />
        )}

        {sidebarMode === 'view' && selectedGroup && (
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Edit Group
              </button>
            </div>

            {/* Group Details */}
            <div className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Group Name</label>
                    <p className="font-medium text-lg">{selectedGroup.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">College</label>
                    <p className="font-medium">{selectedGroup.college_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Status</label>
                    <div className="mt-1">
                      <Badge variant={selectedGroup.is_active ? 'success' : 'destructive'}>
                        {selectedGroup.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  {selectedGroup.description && (
                    <div>
                      <label className="text-sm text-muted-foreground">Description</label>
                      <p className="text-sm">{selectedGroup.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Information */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Audit Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <label className="text-xs text-muted-foreground">Created At</label>
                    <p>{new Date(selectedGroup.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Updated At</label>
                    <p>{new Date(selectedGroup.updated_at).toLocaleString()}</p>
                  </div>
                  {selectedGroup.created_by && (
                    <div>
                      <label className="text-xs text-muted-foreground">Created By</label>
                      <p>{selectedGroup.created_by.full_name || selectedGroup.created_by.username}</p>
                    </div>
                  )}
                  {selectedGroup.updated_by && (
                    <div>
                      <label className="text-xs text-muted-foreground">Updated By</label>
                      <p>{selectedGroup.updated_by.full_name || selectedGroup.updated_by.username}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Raw Data */}
              <details className="bg-muted/30 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold mb-2 text-sm">
                  Raw API Data
                </summary>
                <pre className="text-xs overflow-auto max-h-64 bg-background p-2 rounded mt-2">
                  {JSON.stringify(selectedGroup, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </DetailSidebar>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Student Group"
        description={`Are you sure you want to delete the group "${groupToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
};
