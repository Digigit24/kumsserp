/**
 * Payroll Items Page - Manage payroll items
 */

import { useState } from 'react';
import { Column, DataTable } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { usePayrollItems, useCreatePayrollItem, useUpdatePayrollItem, useDeletePayrollItem } from '../../hooks/useHR';
import { PayrollItemForm } from './forms/PayrollItemForm';
import { toast } from 'sonner';

const PayrollItemsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selected, setSelected] = useState<any | null>(null);

  const { data, isLoading, error, refetch } = usePayrollItems(filters);
  const create = useCreatePayrollItem();
  const update = useUpdatePayrollItem();
  const del = useDeletePayrollItem();

  const columns: Column<any>[] = [
    { key: 'payroll', label: 'Payroll ID', render: (item) => <span className="font-semibold text-primary">{item.payroll}</span>, sortable: true },
    { key: 'component_name', label: 'Component Name', render: (item) => item.component_name, sortable: true },
    { key: 'component_type', label: 'Type', render: (item) => item.component_type },
    { key: 'amount', label: 'Amount', render: (item) => `₹${item.amount}` },
    { key: 'is_active', label: 'Status', render: (item) => <Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Active' : 'Inactive'}</Badge> },
  ];

  const handleRowClick = (item: any) => { setSelected(item); setSidebarMode('view'); setIsSidebarOpen(true); };
  const handleAddNew = () => { setSelected(null); setSidebarMode('create'); setIsSidebarOpen(true); };
  const handleEdit = () => setSidebarMode('edit');

  const handleFormSubmit = async (formData: any) => {
    try {
      if (sidebarMode === 'create') {
        await create.mutateAsync(formData);
        toast.success('Payroll item created successfully');
      } else {
        await update.mutateAsync({ id: selected.id, data: formData });
        toast.success('Payroll item updated successfully');
      }
      setIsSidebarOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save payroll item');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (window.confirm('Are you sure you want to delete this payroll item?')) {
      try {
        await del.mutateAsync(selected.id);
        toast.success('Payroll item deleted successfully');
        setIsSidebarOpen(false);
        refetch();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete payroll item');
      }
    }
  };

  return (
    <div>
      <DataTable title="Payroll Items" description="Manage payroll items" columns={columns} data={data || null} isLoading={isLoading} error={error?.message || null}
        filters={filters} onFiltersChange={setFilters} onRowClick={handleRowClick} onRefresh={refetch} onAdd={handleAddNew} addButtonLabel="Add Payroll Item" />

      <DetailSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}
        title={sidebarMode === 'create' ? 'Create Payroll Item' : sidebarMode === 'edit' ? 'Edit Payroll Item' : 'Payroll Item Details'}
        mode={sidebarMode} onEdit={handleEdit} onDelete={handleDelete} data={selected}>
        {(sidebarMode === 'create' || sidebarMode === 'edit') && (
          <PayrollItemForm item={sidebarMode === 'edit' ? selected : null} onSubmit={handleFormSubmit} onCancel={() => setIsSidebarOpen(false)} />
        )}
        {sidebarMode === 'view' && selected && (
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-muted-foreground">Payroll ID</label><p className="text-base font-semibold">{selected.payroll}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Component Name</label><p className="text-base">{selected.component_name}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Component Type</label><p className="text-base">{selected.component_type}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Amount</label><p className="text-base">₹{selected.amount}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Status</label><Badge variant={selected.is_active ? 'default' : 'secondary'}>{selected.is_active ? 'Active' : 'Inactive'}</Badge></div>
          </div>
        )}
      </DetailSidebar>
    </div>
  );
};

export default PayrollItemsPage;
