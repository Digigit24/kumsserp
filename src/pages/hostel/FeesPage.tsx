/**
 * Hostel Fees Page - Manage hostel fees
 */

import { useState } from 'react';
import { Column, DataTable } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { useHostelFees, useCreateHostelFee, useUpdateHostelFee, useDeleteHostelFee } from '../../hooks/useHostel';
import { FeeForm } from './components/FeeForm';
import { toast } from 'sonner';
import { format } from 'date-fns';

const FeesPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selected, setSelected] = useState<any | null>(null);

  const { data, isLoading, error, refetch } = useHostelFees(filters);
  const create = useCreateHostelFee();
  const update = useUpdateHostelFee();
  const del = useDeleteHostelFee();

  const columns: Column<any>[] = [
    { key: 'allocation', label: 'Allocation', render: (item) => <span className="font-semibold text-primary">Allocation #{item.allocation}</span>, sortable: true },
    { key: 'month', label: 'Month', render: (item) => item.month, sortable: true },
    { key: 'year', label: 'Year', render: (item) => item.year, sortable: true },
    { key: 'amount', label: 'Amount', render: (item) => `₹${item.amount}` },
    { key: 'due_date', label: 'Due Date', render: (item) => item.due_date ? format(new Date(item.due_date), 'MMM dd, yyyy') : '-' },
    { key: 'is_paid', label: 'Paid', render: (item) => <Badge variant={item.is_paid ? 'default' : 'destructive'}>{item.is_paid ? 'Paid' : 'Unpaid'}</Badge> },
    { key: 'paid_date', label: 'Paid Date', render: (item) => item.paid_date ? format(new Date(item.paid_date), 'MMM dd, yyyy') : '-' },
    { key: 'is_active', label: 'Status', render: (item) => <Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge> },
  ];

  const handleRowClick = (item: any) => { setSelected(item); setSidebarMode('view'); setIsSidebarOpen(true); };
  const handleAddNew = () => { setSelected(null); setSidebarMode('create'); setIsSidebarOpen(true); };
  const handleEdit = () => setSidebarMode('edit');

  const handleFormSubmit = async (formData: any) => {
    try {
      if (sidebarMode === 'create') {
        await create.mutateAsync(formData);
        toast.success('Fee created successfully');
      } else {
        await update.mutateAsync({ id: selected.id, data: formData });
        toast.success('Fee updated successfully');
      }
      setIsSidebarOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save fee');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (window.confirm('Are you sure you want to delete this fee?')) {
      try {
        await del.mutateAsync(selected.id);
        toast.success('Fee deleted successfully');
        setIsSidebarOpen(false);
        refetch();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete fee');
      }
    }
  };

  return (
    <div>
      <DataTable title="Hostel Fees" description="Manage hostel fee payments" columns={columns} data={data || null} isLoading={isLoading} error={error?.message || null}
        filters={filters} onFiltersChange={setFilters} onRowClick={handleRowClick} onRefresh={refetch} onAdd={handleAddNew} addButtonLabel="Add Fee" />

      <DetailSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}
        title={sidebarMode === 'create' ? 'Create Fee' : sidebarMode === 'edit' ? 'Edit Fee' : 'Fee Details'}
        mode={sidebarMode} onEdit={handleEdit} onDelete={handleDelete} data={selected}>
        {(sidebarMode === 'create' || sidebarMode === 'edit') && (
          <FeeForm item={sidebarMode === 'edit' ? selected : null} onSubmit={handleFormSubmit} onCancel={() => setIsSidebarOpen(false)} />
        )}
        {sidebarMode === 'view' && selected && (
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-muted-foreground">Allocation</label><p className="text-base font-semibold">Allocation #{selected.allocation}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Month</label><p className="text-base">{selected.month}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Year</label><p className="text-base">{selected.year}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Amount</label><p className="text-base">₹{selected.amount}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Due Date</label><p className="text-base">{selected.due_date ? format(new Date(selected.due_date), 'MMM dd, yyyy') : '-'}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Paid</label><Badge variant={selected.is_paid ? 'default' : 'destructive'}>{selected.is_paid ? 'Paid' : 'Unpaid'}</Badge></div>
            <div><label className="text-sm font-medium text-muted-foreground">Paid Date</label><p className="text-base">{selected.paid_date ? format(new Date(selected.paid_date), 'MMM dd, yyyy') : '-'}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Remarks</label><p className="text-base">{selected.remarks || '-'}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Status</label><Badge variant={selected.is_active ? 'default' : 'secondary'}>{selected.is_active ? 'Active' : 'Inactive'}</Badge></div>
          </div>
        )}
      </DetailSidebar>
    </div>
  );
};

export default FeesPage;
