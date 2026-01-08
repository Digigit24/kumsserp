/**
 * Holidays Page - Manage holidays and special dates
 */

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { HolidayForm } from './components/HolidayForm';
import { holidayApi } from '../../services/core.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDeleteHoliday } from '../../hooks/useCore';

const HolidaysPage = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<any>({ page: 1, page_size: 20 });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['holidays', filters],
    queryFn: () => holidayApi.list(filters),
  });

  const { data: selected } = useQuery({
    queryKey: ['holiday', selectedId],
    queryFn: () => selectedId ? holidayApi.get(selectedId) : null,
    enabled: !!selectedId,
  });

  const deleteMutation = useDeleteHoliday();

  const columns: Column<any>[] = [
    {
      key: 'name',
      label: 'Holiday Name',
      sortable: true,
      render: (item) => <span className="font-medium">{item.name}</span>,
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (item) => <span className="text-sm">{new Date(item.date).toLocaleDateString()}</span>,
    },
    {
      key: 'holiday_type',
      label: 'Type',
      render: (item) => {
        const typeColors: Record<string, string> = {
          national: 'default',
          festival: 'success',
          college: 'outline',
          exam: 'destructive',
        };
        return <Badge variant={typeColors[item.holiday_type] as any}>{item.holiday_type_display}</Badge>;
      },
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'holiday_type',
      label: 'Holiday Type',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'national', label: 'National Holiday' },
        { value: 'festival', label: 'Festival' },
        { value: 'college', label: 'College Holiday' },
        { value: 'exam', label: 'Exam Holiday' },
      ],
    },
  ];

  const handleSubmit = async (formData: any) => {
    if (sidebarMode === 'create') {
      await holidayApi.create(formData);
    } else if (selected) {
      await holidayApi.update(selected.id, formData);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutate(deleteId);
      toast.success('Holiday deleted successfully');
      setDeleteId(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete holiday');
    }
  };

  return (
    <div className="p-6">
      <DataTable
        title="Holidays"
        description="Manage holidays and special dates for your institution"
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : error ? String(error) : null}
        onRefresh={refetch}
        onAdd={() => { setSelectedId(null); setSidebarMode('create'); setIsSidebarOpen(true); }}
        onRowClick={(item) => { setSelectedId(item.id); setSidebarMode('view'); setIsSidebarOpen(true); }}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search holidays..."
        addButtonLabel="Add Holiday"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={() => { setIsSidebarOpen(false); setSelectedId(null); }}
        title={sidebarMode === 'create' ? 'Add New Holiday' : sidebarMode === 'edit' ? 'Edit Holiday' : selected?.name || 'Holiday Details'}
        mode={sidebarMode}
        width="lg"
      >
        {sidebarMode === 'create' && (
          <HolidayForm
            mode="create"
            onSuccess={() => { queryClient.invalidateQueries({ queryKey: ['holidays'] }); setIsSidebarOpen(false); }}
            onCancel={() => setIsSidebarOpen(false)}
            onSubmit={handleSubmit}
          />
        )}

        {sidebarMode === 'edit' && selected && (
          <HolidayForm
            mode="edit"
            holiday={selected}
            onSuccess={() => { queryClient.invalidateQueries({ queryKey: ['holidays'] }); queryClient.invalidateQueries({ queryKey: ['holiday', selectedId] }); setIsSidebarOpen(false); }}
            onCancel={() => setIsSidebarOpen(false)}
            onSubmit={handleSubmit}
          />
        )}

        {sidebarMode === 'view' && selected && (
          <div className="space-y-6">
            <div className="flex justify-end gap-2">
              <button onClick={() => setSidebarMode('edit')} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Edit
              </button>
              <button onClick={() => setDeleteId(selected.id)} className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Holiday Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Holiday Name</label>
                    <p className="font-medium text-lg">{selected.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Date</label>
                    <p className="font-medium">{new Date(selected.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Type</label>
                    <div className="mt-1">
                      <Badge>{selected.holiday_type_display}</Badge>
                    </div>
                  </div>
                  {selected.description && (
                    <div>
                      <label className="text-sm text-muted-foreground">Description</label>
                      <p className="text-sm">{selected.description}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Audit Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <label className="text-xs text-muted-foreground">Created At</label>
                    <p>{new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Updated At</label>
                    <p>{new Date(selected.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DetailSidebar>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Holiday"
        description="Are you sure you want to delete this holiday? This action cannot be undone."
        variant="destructive"
      />
    </div>
  );
};

export default HolidaysPage;
