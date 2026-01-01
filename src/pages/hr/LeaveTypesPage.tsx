/**
 * Leave Types Page - Manage leave types
 */

import { useState } from 'react';
import { Column, DataTable } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { useLeaveTypes, useCreateLeaveType, useUpdateLeaveType, useDeleteLeaveType } from '../../hooks/useHR';
import { LeaveTypeForm } from './forms/LeaveTypeForm';
import { toast } from 'sonner';

const LeaveTypesPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selected, setSelected] = useState<any | null>(null);

  const { data, isLoading, error, refetch } = useLeaveTypes(filters);
  const create = useCreateLeaveType();
  const update = useUpdateLeaveType();
  const del = useDeleteLeaveType();

  const columns: Column<any>[] = [
    { key: 'name', label: 'Name', render: (item) => <span className="font-semibold text-primary">{item.name}</span>, sortable: true },
    { key: 'code', label: 'Code', render: (item) => item.code, sortable: true },
    { key: 'max_days_per_year', label: 'Max Days/Year', render: (item) => item.max_days_per_year },
    { key: 'is_paid', label: 'Paid', render: (item) => <Badge variant={item.is_paid ? 'default' : 'secondary'}>{item.is_paid ? 'Yes' : 'No'}</Badge> },
    { key: 'is_active', label: 'Status', render: (item) => <Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge> },
  ];

  const handleRowClick = (item: any) => { setSelected(item); setSidebarMode('view'); setIsSidebarOpen(true); };
  const handleAddNew = () => { setSelected(null); setSidebarMode('create'); setIsSidebarOpen(true); };
  const handleEdit = () => setSidebarMode('edit');

  const handleFormSubmit = async (formData: any) => {
    try {
      if (sidebarMode === 'create') {
        await create.mutateAsync(formData);
        toast.success('Leave type created successfully');
      } else {
        await update.mutateAsync({ id: selected.id, data: formData });
        toast.success('Leave type updated successfully');
      }
      setIsSidebarOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save leave type');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (window.confirm('Are you sure you want to delete this leave type?')) {
      try {
        await del.mutateAsync(selected.id);
        toast.success('Leave type deleted successfully');
        setIsSidebarOpen(false);
        refetch();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete leave type');
      }
    }
  };

  return (
    <div>
      <DataTable title="Leave Types" description="Manage leave types" columns={columns} data={data || null} isLoading={isLoading} error={error?.message || null}
        filters={filters} onFiltersChange={setFilters} onRowClick={handleRowClick} onRefresh={refetch} onAdd={handleAddNew} addButtonLabel="Add Leave Type" />

      <DetailSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}
        title={sidebarMode === 'create' ? 'Create Leave Type' : sidebarMode === 'edit' ? 'Edit Leave Type' : 'Leave Type Details'}
        mode={sidebarMode} onEdit={handleEdit} onDelete={handleDelete} data={selected}>
        {(sidebarMode === 'create' || sidebarMode === 'edit') && (
          <LeaveTypeForm item={sidebarMode === 'edit' ? selected : null} onSubmit={handleFormSubmit} onCancel={() => setIsSidebarOpen(false)} />
        )}
        {sidebarMode === 'view' && selected && (
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-muted-foreground">Name</label><p className="text-base font-semibold">{selected.name}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Code</label><p className="text-base">{selected.code}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Max Days/Year</label><p className="text-base">{selected.max_days_per_year}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Description</label><p className="text-base">{selected.description || '-'}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Paid</label><Badge variant={selected.is_paid ? 'default' : 'secondary'}>{selected.is_paid ? 'Yes' : 'No'}</Badge></div>
            <div><label className="text-sm font-medium text-muted-foreground">Status</label><Badge variant={selected.is_active ? 'default' : 'secondary'}>{selected.is_active ? 'Active' : 'Inactive'}</Badge></div>
          </div>
        )}
      </DetailSidebar>
    </div>
  );
};

export default LeaveTypesPage;
