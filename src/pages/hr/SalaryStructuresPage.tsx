/**
 * Salary Structures Page - Manage salary structures
 */

import { useState } from 'react';
import { Column, DataTable } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { useSalaryStructures, useCreateSalaryStructure, useUpdateSalaryStructure, useDeleteSalaryStructure } from '../../hooks/useHR';
import { SalaryStructureForm } from './forms/SalaryStructureForm';
import { toast } from 'sonner';

const SalaryStructuresPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selected, setSelected] = useState<any | null>(null);

  const { data, isLoading, error, refetch } = useSalaryStructures(filters);
  const create = useCreateSalaryStructure();
  const update = useUpdateSalaryStructure();
  const del = useDeleteSalaryStructure();

  const columns: Column<any>[] = [
    { key: 'teacher_name', label: 'Teacher', render: (item) => <span className="font-semibold text-primary">{item.teacher_name || 'N/A'}</span>, sortable: true },
    { key: 'effective_from', label: 'Effective From', render: (item) => new Date(item.effective_from).toLocaleDateString(), sortable: true },
    { key: 'basic_salary', label: 'Basic Salary', render: (item) => `₹${item.basic_salary}` },
    { key: 'gross_salary', label: 'Gross Salary', render: (item) => `₹${item.gross_salary}` },
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
        toast.success('Salary structure created successfully');
      } else {
        await update.mutateAsync({ id: selected.id, data: formData });
        toast.success('Salary structure updated successfully');
      }
      setIsSidebarOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save salary structure');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (window.confirm('Are you sure you want to delete this salary structure?')) {
      try {
        await del.mutateAsync(selected.id);
        toast.success('Salary structure deleted successfully');
        setIsSidebarOpen(false);
        refetch();
      } catch (error: any) {
        toast.error(error?.message || 'Failed to delete salary structure');
      }
    }
  };

  return (
    <div>
      <DataTable title="Salary Structures" description="Manage salary structures" columns={columns} data={data || null} isLoading={isLoading} error={error?.message || null}
        filters={filters} onFiltersChange={setFilters} onRowClick={handleRowClick} onRefresh={refetch} onAdd={handleAddNew} addButtonLabel="Add Salary Structure" />

      <DetailSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}
        title={sidebarMode === 'create' ? 'Create Salary Structure' : sidebarMode === 'edit' ? 'Edit Salary Structure' : 'Salary Structure Details'}
        mode={sidebarMode} onEdit={handleEdit} onDelete={handleDelete} data={selected}>
        {(sidebarMode === 'create' || sidebarMode === 'edit') && (
          <SalaryStructureForm item={sidebarMode === 'edit' ? selected : null} onSubmit={handleFormSubmit} onCancel={() => setIsSidebarOpen(false)} />
        )}
        {sidebarMode === 'view' && selected && (
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-muted-foreground">Teacher</label><p className="text-base font-semibold">{selected.teacher_name || 'N/A'}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Effective From</label><p className="text-base">{new Date(selected.effective_from).toLocaleDateString()}</p></div>
            {selected.effective_to && <div><label className="text-sm font-medium text-muted-foreground">Effective To</label><p className="text-base">{new Date(selected.effective_to).toLocaleDateString()}</p></div>}
            <div><label className="text-sm font-medium text-muted-foreground">Basic Salary</label><p className="text-base">₹{selected.basic_salary}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">HRA</label><p className="text-base">₹{selected.hra}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">DA</label><p className="text-base">₹{selected.da}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Other Allowances</label><p className="text-base">₹{selected.other_allowances}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Gross Salary</label><p className="text-base">₹{selected.gross_salary}</p></div>
            <div><label className="text-sm font-medium text-muted-foreground">Current</label><Badge variant={selected.is_current ? 'default' : 'secondary'}>{selected.is_current ? 'Yes' : 'No'}</Badge></div>
            <div><label className="text-sm font-medium text-muted-foreground">Status</label><Badge variant={selected.is_active ? 'default' : 'secondary'}>{selected.is_active ? 'Active' : 'Inactive'}</Badge></div>
          </div>
        )}
      </DetailSidebar>
    </div>
  );
};

export default SalaryStructuresPage;
