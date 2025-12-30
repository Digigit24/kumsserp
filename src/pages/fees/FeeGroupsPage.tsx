/**
 * Fee Groups Page
 */

import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useFeeGroups, useCreateFeeGroup, useUpdateFeeGroup, useDeleteFeeGroup } from '../../hooks/useFees';
import { FeeGroup } from '../../types/fees.types';
import { FeeGroupForm } from './forms/FeeGroupForm';
import { toast } from 'sonner';

const FeeGroupsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selectedFeeGroup, setSelectedFeeGroup] = useState<FeeGroup | null>(null);

  const { data, isLoading, error, refetch } = useFeeGroups(filters);
  const createFeeGroup = useCreateFeeGroup();
  const updateFeeGroup = useUpdateFeeGroup();
  const deleteFeeGroup = useDeleteFeeGroup();

  const columns: Column<FeeGroup>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    {
      key: 'is_active',
      label: 'Status',
      render: (feeGroup) => (
        <Badge variant={feeGroup.is_active ? 'success' : 'destructive'}>
          {feeGroup.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
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
    setSelectedFeeGroup(null);
    setSidebarMode('create');
    setIsSidebarOpen(true);
  };

  const handleRowClick = (feeGroup: FeeGroup) => {
    setSelectedFeeGroup(feeGroup);
    setSidebarMode('view');
    setIsSidebarOpen(true);
  };

  const handleEdit = () => {
    setSidebarMode('edit');
  };

  const handleFormSubmit = async (data: Partial<FeeGroup>) => {
    try {
      if (sidebarMode === 'create') {
        await createFeeGroup.mutateAsync(data);
        toast.success('Fee group created successfully');
      } else if (sidebarMode === 'edit' && selectedFeeGroup) {
        await updateFeeGroup.mutateAsync({ id: selectedFeeGroup.id, data });
        toast.success('Fee group updated successfully');
      }
      setIsSidebarOpen(false);
      setSelectedFeeGroup(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred');
      console.error('Form submission error:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedFeeGroup) return;

    if (confirm('Are you sure you want to delete this fee group?')) {
      try {
        await deleteFeeGroup.mutateAsync(selectedFeeGroup.id);
        toast.success('Fee group deleted successfully');
        setIsSidebarOpen(false);
        setSelectedFeeGroup(null);
        refetch();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete fee group');
      }
    }
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedFeeGroup(null);
  };

  return (
    <div className="">
      <DataTable
        title="Fee Groups List"
        description="View and manage all fee groups"
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
        searchPlaceholder="Search fee groups..."
        addButtonLabel="Add Fee Group"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        title={sidebarMode === 'create' ? 'Create Fee Group' : selectedFeeGroup?.name || 'Fee Group'}
        mode={sidebarMode}
      >
        {sidebarMode === 'view' && selectedFeeGroup ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="mt-1 text-lg font-semibold">{selectedFeeGroup.name}</p>
            </div>
            {selectedFeeGroup.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1">{selectedFeeGroup.description}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <Badge variant={selectedFeeGroup.is_active ? 'success' : 'destructive'}>
                  {selectedFeeGroup.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleEdit} className="flex-1">Edit</Button>
              <Button onClick={handleDelete} variant="destructive" className="flex-1">Delete</Button>
            </div>
          </div>
        ) : (
          <FeeGroupForm
            feeGroup={sidebarMode === 'edit' ? selectedFeeGroup : null}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseSidebar}
          />
        )}
      </DetailSidebar>
    </div>
  );
};

export default FeeGroupsPage;
