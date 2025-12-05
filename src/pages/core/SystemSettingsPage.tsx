/**
 * System Settings Page - Manage system-wide settings
 */

import { useState } from 'react';
import { DataTable, Column } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { systemSettingApi } from '../../services/core.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const SystemSettingsPage = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<any>({ page: 1, page_size: 20 });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['system-settings', filters],
    queryFn: () => systemSettingApi.list(filters),
  });

  const { data: selected } = useQuery({
    queryKey: ['system-setting', selectedId],
    queryFn: () => selectedId ? systemSettingApi.get(selectedId) : null,
    enabled: !!selectedId,
  });

  const columns: Column<any>[] = [
    {
      key: 'college_name',
      label: 'College',
      sortable: true,
      render: (item) => <span className="font-medium">{item.college_name}</span>,
    },
    {
      key: 'settings',
      label: 'Settings',
      render: (item) => (
        <span className="text-sm text-muted-foreground">
          {Object.keys(item.settings || {}).length} setting(s) configured
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <DataTable
        title="System Settings"
        description="Manage system-wide settings for your institution"
        data={data}
        columns={columns}
        isLoading={isLoading}
        error={error as string}
        onRefresh={refetch}
        onRowClick={(item) => { setSelectedId(item.id); setIsSidebarOpen(true); }}
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search settings..."
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={() => { setIsSidebarOpen(false); setSelectedId(null); }}
        title="System Settings"
        mode="view"
        width="xl"
      >
        {selected && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">College Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">College</label>
                    <p className="font-medium">{selected.college_name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Settings</h3>
                <pre className="text-xs bg-background p-4 rounded overflow-auto max-h-96 border">
                  {JSON.stringify(selected.settings, null, 2)}
                </pre>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: Settings editing interface coming soon. For now, settings can be modified via API.
                </p>
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

              <details className="bg-muted/30 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold mb-2 text-sm">
                  Raw API Data
                </summary>
                <pre className="text-xs overflow-auto max-h-64 bg-background p-2 rounded mt-2">
                  {JSON.stringify(selected, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </DetailSidebar>
    </div>
  );
};

export default SystemSettingsPage;
