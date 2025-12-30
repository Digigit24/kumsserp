/**
 * Library Members Page
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useLibraryMembers, useCreateLibraryMember, useUpdateLibraryMember, useDeleteLibraryMember } from '../../hooks/useLibrary';
import { LibraryMember } from '../../types/library.types';
import { LibraryMemberForm } from './forms/LibraryMemberForm';
import { toast } from 'sonner';

const LibraryMembersPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedMember, setSelectedMember] = useState<LibraryMember | null>(null);

  const { data, isLoading, error, refetch } = useLibraryMembers(filters);
  const createMember = useCreateLibraryMember();
  const updateMember = useUpdateLibraryMember();
  const deleteMember = useDeleteLibraryMember();

  const columns: Column<LibraryMember>[] = [
    { key: 'member_id', label: 'Member ID', sortable: true },
    { key: 'user_name', label: 'Name', sortable: true },
    { key: 'member_type', label: 'Type', sortable: true },
    { key: 'max_books_allowed', label: 'Max Books', sortable: false },
    { key: 'joining_date', label: 'Joining Date', sortable: true },
    {
      key: 'is_blocked',
      label: 'Blocked',
      render: (member) => (
        <Badge variant={member.is_blocked ? 'destructive' : 'success'}>
          {member.is_blocked ? 'Blocked' : 'Active'}
        </Badge>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (member) => (
        <Badge variant={member.is_active ? 'success' : 'destructive'}>
          {member.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'member_type',
      label: 'Member Type',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'student', label: 'Student' },
        { value: 'teacher', label: 'Teacher' },
        { value: 'staff', label: 'Staff' },
      ],
    },
    {
      name: 'is_active',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' },
      ],
    },
  ];

  const handleAddNew = () => {
    setSelectedMember(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (member: LibraryMember) => {
    setSelectedMember(member);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (data: Partial<LibraryMember>) => {
    try {
      if (sidebarMode === 'create') {
        await createMember.mutateAsync(data);
        toast.success('Library member created successfully');
      } else if (sidebarMode === 'edit' && selectedMember) {
        await updateMember.mutateAsync({ id: selectedMember.id, data });
        toast.success('Library member updated successfully');
      }
      setIsSidebarOpen(false);
      setSelectedMember(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred');
      console.error('Form submission error:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) return;

    if (confirm(`Are you sure you want to delete member "${selectedMember.member_id}"?`)) {
      try {
        await deleteMember.mutateAsync(selectedMember.id);
        toast.success('Library member deleted successfully');
        setIsSidebarOpen(false);
        setSelectedMember(null);
        refetch();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete member');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="">
      <DataTable
        title="Members List"
        description="View and manage all library members"
        columns={columns}
        data={data}
        isLoading={isLoading}
        error={error?.message}
        onRefresh={refetch}
        onAdd={handleAddNew}
        onRowClick={handleRowClick}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search members..."
        addButtonLabel="Add Member"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Add New Member' : selectedMember?.member_id || 'Member Details'}
        mode={sidebarMode}
      >
        {sidebarMode === 'view' && selectedMember ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Member ID</h3>
                <p className="mt-1 text-lg font-semibold">{selectedMember.member_id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Member Type</h3>
                <p className="mt-1 text-lg capitalize">{selectedMember.member_type}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="mt-1">{selectedMember.user_name || selectedMember.user}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Max Books Allowed</h3>
                <p className="mt-1 text-lg font-semibold">{selectedMember.max_books_allowed}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Max Days Allowed</h3>
                <p className="mt-1 text-lg font-semibold">{selectedMember.max_days_allowed}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Joining Date</h3>
                <p className="mt-1">{selectedMember.joining_date}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Expiry Date</h3>
                <p className="mt-1">{selectedMember.expiry_date || 'N/A'}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Blocked Status</h3>
              <p className="mt-1">
                <Badge variant={selectedMember.is_blocked ? 'destructive' : 'success'}>
                  {selectedMember.is_blocked ? 'Blocked' : 'Active'}
                </Badge>
              </p>
              {selectedMember.is_blocked && selectedMember.block_reason && (
                <p className="mt-2 text-sm text-muted-foreground">Reason: {selectedMember.block_reason}</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedMember.is_active ? 'success' : 'destructive'}>
                  {selectedMember.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEdit} className="flex-1">Edit</Button>
              <Button onClick={handleDelete} variant="destructive" className="flex-1">Delete</Button>
            </div>
          </div>
        ) : (
          <LibraryMemberForm
            member={sidebarMode === 'edit' ? selectedMember : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default LibraryMembersPage;
