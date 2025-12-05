/**
 * Academic Years Page - Manage academic years
 */

import { useState } from 'react';
import { DataTable, Column, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { AcademicYearForm } from './components/AcademicYearForm';
import { academicYearApi } from '../../services/core.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const AcademicYearsPage = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<any>({ page: 1, page_size: 20 });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [sidebarMode, setSidebarMode] = useState<'view' | 'create' | 'edit'>('view');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['academic-years', filters],
    queryFn: () => academicYearApi.list(filters),
  });

  const { data: selected } = useQuery({
    queryKey: ['academic-year', selectedId],
    queryFn: () => selectedId ? academicYearApi.get(selectedId) : null,
    enabled: !!selectedId,
  });

  const columns: Column<any>[] = [
    {
      key: 'year',
      label: 'Academic Year',
      sortable: true,
      render: (item) => <span className="font-medium">{item.year}</span>,
    },
    {
      key: 'start_date',
      label: 'Duration',
      render: (item) => (
        <span className="text-sm">{new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'is_current',
      label: 'Current',
      render: (item) => item.is_current ? <Badge variant="default">Current</Badge> : <Badge variant="outline">Past/Future</Badge>,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (item) => (
        <Badge variant={item.is_active ? 'success' : 'destructive'}>
          {item.is_active ? 'Active' : 'Inactive'}
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
    {
      name: 'is_current',
      label: 'Current',
      type: 'select',
      options: [
        { value: '', label: 'All' },
        { value: 'true', label: 'Current' },
        { value: 'false', label: 'Past/Future' },
      ],
    },
  ];

  const handleSubmit = async (formData: any) => {
    if (sidebarMode === 'create') {
      await academicYearApi.create(formData);
    } else if (selected) {
      await academicYearApi.update(selected.id, formData);
    }
  };

  return (
    <div className="p-6">
      <DataTable
        title="Academic Years"
        description="Manage academic years for your institution"
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error as string}
        onRefresh={refetch}
        onAdd={() => { setSelectedId(null); setSidebarMode('create'); setIsSidebarOpen(true); }}
        onRowClick={(item) => { setSelectedId(item.id); setSidebarMode('view'); setIsSidebarOpen(true); }}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search academic years..."
        addButtonLabel="Add Academic Year"
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={() => { setIsSidebarOpen(false); setSelectedId(null); }}
        title={sidebarMode === 'create' ? 'Add New Academic Year' : sidebarMode === 'edit' ? 'Edit Academic Year' : selected?.year || 'Academic Year Details'}
        mode={sidebarMode}
        width="lg"
      >
        {sidebarMode === 'create' && (
          <AcademicYearForm
            mode="create"
            onSuccess={() => { queryClient.invalidateQueries({ queryKey: ['academic-years'] }); setIsSidebarOpen(false); }}
            onCancel={() => setIsSidebarOpen(false)}
            onSubmit={handleSubmit}
          />
        )}

        {sidebarMode === 'edit' && selected && (
          <AcademicYearForm
            mode="edit"
            academicYear={selected}
            onSuccess={() => { queryClient.invalidateQueries({ queryKey: ['academic-years'] }); queryClient.invalidateQueries({ queryKey: ['academic-year', selectedId] }); setIsSidebarOpen(false); }}
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
            </div>

            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Academic Year Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Year</label>
                    <p className="font-medium text-lg">{selected.year}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Start Date</label>
                      <p className="font-medium">{new Date(selected.start_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">End Date</label>
                      <p className="font-medium">{new Date(selected.end_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Current:</span>
                      {selected.is_current ? <Badge variant="default">Yes</Badge> : <Badge variant="outline">No</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant={selected.is_active ? 'success' : 'destructive'}>
                        {selected.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
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
    </div>
  );
};

export default AcademicYearsPage;
