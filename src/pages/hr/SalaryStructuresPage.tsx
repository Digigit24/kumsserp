/**
 * Salary Structures Page - Manage salary structures
 */

import { useMemo, useState } from 'react';
import { Column, DataTable } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useSalaryStructures, useCreateSalaryStructure, useUpdateSalaryStructure, useDeleteSalaryStructure } from '../../hooks/useHR';
import { SalaryStructureForm } from './forms/SalaryStructureForm';
import { toast } from 'sonner';
import { Building2, Layers, Sparkles, Star } from 'lucide-react';

const SalaryStructuresPage = () => {
  const [filters, setFilters] = useState<Record<string, any>>({ page: 1, page_size: 10 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [selected, setSelected] = useState<any | null>(null);

  const { data, isLoading, error, refetch } = useSalaryStructures(filters);
  const create = useCreateSalaryStructure();
  const update = useUpdateSalaryStructure();
  const del = useDeleteSalaryStructure();

  const rows = useMemo(() => data?.results || [], [data]);
  const metrics = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((r: any) => r.is_active).length;
    const current = rows.filter((r: any) => r.is_current).length;
    const avgGross =
      total === 0
        ? 0
        : Math.round(
            rows.reduce((sum: number, r: any) => sum + (Number(r.gross_salary) || 0), 0) / total
          );
    return { total, active, current, avgGross };
  }, [rows]);

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-primary/70">Salary Structures</p>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Compensation Blueprints <Sparkles className="h-5 w-5 text-primary" />
          </h1>
          <p className="text-muted-foreground">Manage salary templates and effective periods.</p>
        </div>
        <Button size="lg" onClick={handleAddNew}>
          <Layers className="h-4 w-4 mr-2" />
          New Structure
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Structures</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{metrics.total}</CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-background border-emerald-500/20">
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Active</CardTitle>
            <Building2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{metrics.active}</CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-background border-indigo-500/20">
          <CardHeader className="pb-2 flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Current</CardTitle>
            <Star className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{metrics.current}</CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-background border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg Gross</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">ƒ,1{metrics.avgGross.toLocaleString()}</CardContent>
        </Card>
      </div>

      <Card className="border-primary/10 shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Structure Library</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <DataTable
            columns={columns}
            data={data || null}
            isLoading={isLoading}
            error={error?.message || null}
            filters={filters}
            onFiltersChange={setFilters}
            onRowClick={handleRowClick}
            onRefresh={refetch}
            onAdd={handleAddNew}
            addButtonLabel="Add Salary Structure"
          />
        </CardContent>
      </Card>

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
