/**
 * Payrolls Page - Manage payrolls
 */

import { useState } from 'react';
import { Column, DataTable } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { usePayrolls, useCreatePayroll, useUpdatePayroll, useDeletePayroll } from '../../hooks/useHR';
import { PayrollForm } from './forms/PayrollForm';
import { toast } from 'sonner';

const PayrollsPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selected, setSelected] = useState<any | null>(null);

  const { data, isLoading, error, refetch } = usePayrolls(filters);
  const create = useCreatePayroll();
  const update = useUpdatePayroll();
  const del = useDeletePayroll();

  const columns: Column<any>[] = [
    { key: 'teacher_name', label: 'Teacher', render: (item) => <span className="font-semibold text-primary">{item.teacher_name || 'N/A'}</span>, sortable: true },
    { key: 'month', label: 'Month', render: (item) => item.month, sortable: true },
    { key: 'year', label: 'Year', render: (item) => item.year, sortable: true },
    { key: 'gross_salary', label: 'Gross Salary', render: (item) => `₹${item.gross_salary}` },
    { key: 'net_salary', label: 'Net Salary', render: (item) => `₹${item.net_salary}` },
    { key: 'status', label: 'Status', render: (item) => <Badge variant={item.status === 'paid' ? 'default' : item.status === 'pending' ? 'secondary' : 'destructive'}>{item.status}</Badge> },
  ];

  const handleRowClick = (item: any) => { setSelected(item); setSidebarMode('view'); setIsSidebarOpen(true); };
  const handleAddNew = () => { setSelected(null); setSidebarMode('create'); setIsSidebarOpen(true); };
  const handleEdit = () => setSidebarMode('edit');

  const handleFormSubmit = async (formData: any) => {
    try {
      if (sidebarMode === 'create') {
        await create.mutateAsync(formData);
        toast.success('Payroll created successfully');
      } else {
        await update.mutateAsync({ id: selected.id, data: formData });
        toast.success('Payroll updated successfully');
      }
      setIsSidebarOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save payroll');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (window.confirm('Are you sure you want to delete this payroll?')) {
      try {
        await del.mutateAsync(selected.id);
        toast.success('Payroll deleted successfully');
        setIsSidebarOpen(false);
        refetch();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete payroll');
      }
    }
  };

  return (
    <div>
      <DataTable title="Payrolls" description="Manage payrolls" columns={columns} data={data || null} isLoading={isLoading} error={error?.message || null}
        filters={filters} onFiltersChange={setFilters} onRowClick={handleRowClick} onRefresh={refetch} onAdd={handleAddNew} addButtonLabel="Add Payroll" />

      <DetailSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}
        title={sidebarMode === 'create' ? 'Create Payroll' : sidebarMode === 'edit' ? 'Edit Payroll' : 'Payroll Details'}
        mode={sidebarMode} onEdit={handleEdit} onDelete={handleDelete} data={selected}>
        {(sidebarMode === 'create' || sidebarMode === 'edit') && (
          <PayrollForm item={sidebarMode === 'edit' ? selected : null} onSubmit={handleFormSubmit} onCancel={() => setIsSidebarOpen(false)} />
        )}
        {sidebarMode === 'view' && selected && (
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-muted-foreground">Teacher</label><p className="text-base font-semibold">{selected.teacher_name || 'N/A'}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Month</label><p className="text-base">{selected.month}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Year</label><p className="text-base">{selected.year}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Gross Salary</label><p className="text-base">₹{selected.gross_salary}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Total Allowances</label><p className="text-base">₹{selected.total_allowances}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Total Deductions</label><p className="text-base">₹{selected.total_deductions}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Net Salary</label><p className="text-base">₹{selected.net_salary}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Payment Date</label><p className="text-base">{new Date(selected.payment_date).toLocaleDateString()}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Payment Method</label><p className="text-base">{selected.payment_method}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Status</label><Badge variant={selected.status === 'paid' ? 'default' : selected.status === 'pending' ? 'secondary' : 'destructive'}>{selected.status}</Badge></div>
            {selected.remarks && <div><label className="text-sm font-medium text-muted-foreground">Remarks</label><p className="text-base">{selected.remarks}</p></div>}
          </div>
        )}
      </DetailSidebar>
    </div>
  );
};

export default PayrollsPage;
