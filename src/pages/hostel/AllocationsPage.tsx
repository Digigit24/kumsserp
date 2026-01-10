/**
 * Hostel Allocations Page - Manage hostel room allocations
 */

import { useState } from 'react';
import { Column, DataTable } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { useHostelAllocations, useCreateHostelAllocation, useUpdateHostelAllocation, useDeleteHostelAllocation } from '../../hooks/useHostel';
import { AllocationForm } from './components/AllocationForm';
import { toast } from 'sonner';
import { format } from 'date-fns';

const AllocationsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selected, setSelected] = useState<any | null>(null);

  const { data, isLoading, error, refetch } = useHostelAllocations(filters);
  const create = useCreateHostelAllocation();
  const update = useUpdateHostelAllocation();
  const del = useDeleteHostelAllocation();

  const columns: Column<any>[] = [
    { key: 'student', label: 'Student', render: (item) => <span className="font-semibold text-primary">{item.student_name || `Student #${item.student}`}</span>, sortable: true },
    { key: 'hostel', label: 'Hostel', render: (item) => item.hostel_name || `Hostel #${item.hostel}`, sortable: true },
    { key: 'room', label: 'Room', render: (item) => item.room_number || `Room #${item.room}` },
    { key: 'bed', label: 'Bed', render: (item) => item.bed_number || `Bed #${item.bed}` },
    { key: 'from_date', label: 'From Date', render: (item) => item.from_date ? format(new Date(item.from_date), 'MMM dd, yyyy') : '-' },
    { key: 'to_date', label: 'To Date', render: (item) => item.to_date ? format(new Date(item.to_date), 'MMM dd, yyyy') : '-' },
    { key: 'is_current', label: 'Current', render: (item) => <Badge variant={item.is_current ? 'default' : 'secondary'}>{item.is_current ? 'Yes' : 'No'}</Badge> },
    { key: 'is_active', label: 'Status', render: (item) => <Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge> },
  ];

  const handleRowClick = (item: any) => { setSelected(item); setSidebarMode('view'); setIsSidebarOpen(true); };
  const handleAddNew = () => { setSelected(null); setSidebarMode('create'); setIsSidebarOpen(true); };
  const handleEdit = () => setSidebarMode('edit');

  const handleFormSubmit = async (formData: any) => {
    try {
      if (sidebarMode === 'create') {
        await create.mutateAsync(formData);
        toast.success('Allocation created successfully');
      } else {
        await update.mutateAsync({ id: selected.id, data: formData });
        toast.success('Allocation updated successfully');
      }
      setIsSidebarOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save allocation');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (window.confirm('Are you sure you want to delete this allocation?')) {
      try {
        await del.mutateAsync(selected.id);
        toast.success('Allocation deleted successfully');
        setIsSidebarOpen(false);
        refetch();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete allocation');
      }
    }
  };

  return (
    <div>
      <DataTable title="Hostel Allocations" description="Manage hostel room and bed allocations" columns={columns} data={data || null} isLoading={isLoading} error={error?.message || null}
        filters={filters} onFiltersChange={setFilters} onRowClick={handleRowClick} onRefresh={refetch} onAdd={handleAddNew} addButtonLabel="Add Allocation" />

      <DetailSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}
        title={sidebarMode === 'create' ? 'Create Allocation' : sidebarMode === 'edit' ? 'Edit Allocation' : 'Allocation Details'}
        mode={sidebarMode} onEdit={handleEdit} onDelete={handleDelete} data={selected}>
        {(sidebarMode === 'create' || sidebarMode === 'edit') && (
          <AllocationForm item={sidebarMode === 'edit' ? selected : null} onSubmit={handleFormSubmit} onCancel={() => setIsSidebarOpen(false)} />
        )}
        {sidebarMode === 'view' && selected && (
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-muted-foreground">Student</label><p className="text-base font-semibold">{selected.student_name || `Student #${selected.student}`}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Hostel</label><p className="text-base">{selected.hostel_name || `Hostel #${selected.hostel}`}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Room</label><p className="text-base">{selected.room_number || `Room #${selected.room}`}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Bed</label><p className="text-base">{selected.bed_number || `Bed #${selected.bed}`}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">From Date</label><p className="text-base">{selected.from_date ? format(new Date(selected.from_date), 'MMM dd, yyyy') : '-'}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">To Date</label><p className="text-base">{selected.to_date ? format(new Date(selected.to_date), 'MMM dd, yyyy') : '-'}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Remarks</label><p className="text-base">{selected.remarks || '-'}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Current</label><Badge variant={selected.is_current ? 'default' : 'secondary'}>{selected.is_current ? 'Yes' : 'No'}</Badge></div>
            <div><label className="text-sm font-medium text-muted-foreground">Status</label><Badge variant={selected.is_active ? 'default' : 'secondary'}>{selected.is_active ? 'Active' : 'Inactive'}</Badge></div>
          </div>
        )}
      </DetailSidebar>
    </div>
  );
};

export default AllocationsPage;
