/**
 * Activity Logs Page (Read-Only)
 * View system activity logs and audit trail
 */

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Column, DataTable, FilterConfig } from '../../components/common/DataTable';
import { DetailSidebar } from '../../components/common/DetailSidebar';
import { Badge } from '../../components/ui/badge';
import { useDebounce } from '../../hooks/useDebounce';
import { activityLogApi } from '../../services/core.service';

const ActivityLogsPage = () => {
  const [filters, setFilters] = useState<any>({ page: 1, page_size: 20, ordering: '-timestamp' });

  // Destructure search from filters for debouncing only the search term
  const { search, ...restFilters } = filters;
  const debouncedSearch = useDebounce(search, 500);

  // Combine debounced search with other filters for the query
  const queryFilters = { ...restFilters, ...(debouncedSearch ? { search: debouncedSearch } : {}) };

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['activity-logs', queryFilters],
    queryFn: () => activityLogApi.list(queryFilters),
  });

  const { data: selected } = useQuery({
    queryKey: ['activity-log', selectedId],
    queryFn: () => selectedId ? activityLogApi.get(selectedId) : null,
    enabled: !!selectedId,
  });

  const columns: Column<any>[] = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      sortable: true,
      render: (item) => <span className="text-sm">{new Date(item.timestamp).toLocaleString()}</span>,
    },
    {
      key: 'action',
      label: 'Action',
      render: (item) => {
        const actionColors: Record<string, string> = {
          create: 'success',
          read: 'outline',
          update: 'warning',
          delete: 'destructive',
          login: 'default',
          logout: 'secondary',
        };
        return <Badge variant={actionColors[item.action] as any}>{item.action_display}</Badge>;
      },
    },
    {
      key: 'model_name',
      label: 'Model',
      render: (item) => <span className="font-medium">{item.model_name}</span>,
    },
    {
      key: 'user_name',
      label: 'User',
      render: (item) => <span className="text-sm text-muted-foreground">{item.user_name || 'System'}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (item) => (
        <span className="text-sm truncate max-w-xs block">{item.description}</span>
      ),
    },
  ];

  const filterConfig: FilterConfig[] = [
    {
      name: 'action',
      label: 'Action',
      type: 'select',
      options: [
        { value: '', label: 'All Actions' },
        { value: 'create', label: 'Create' },
        { value: 'read', label: 'Read' },
        { value: 'update', label: 'Update' },
        { value: 'delete', label: 'Delete' },
        { value: 'login', label: 'Login' },
        { value: 'logout', label: 'Logout' },
      ],
    },
    {
      name: 'model_name',
      label: 'Model',
      type: 'text',
    },
    {
      name: 'user_name',
      label: 'User',
      type: 'text',
    },
    {
      name: 'timestamp',
      label: 'Date',
      type: 'date',
    },
  ];

  return (
    <div className="p-6">
      <DataTable
        title="Activity Logs"
        description="View system activity logs and audit trail (read-only)"
        data={data || null}
        columns={columns}
        isLoading={isLoading}
        error={error ? (error as Error).message : null}
        onRefresh={refetch}
        onRowClick={(item) => { setSelectedId(item.id); setIsSidebarOpen(true); }}
        filters={filters}
        onFiltersChange={setFilters}
        filterConfig={filterConfig}
        searchPlaceholder="Search logs..."
      />

      <DetailSidebar
        isOpen={isSidebarOpen}
        onClose={() => { setIsSidebarOpen(false); setSelectedId(null); }}
        title="Activity Log Details"
        mode="view"
        width="xl"
      >
        {selected && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Log Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-muted-foreground">Action</label>
                    <Badge>{selected.action_display}</Badge>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Model</label>
                    <p className="font-medium">{selected.model_name}</p>
                  </div>
                  {selected.object_id && (
                    <div>
                      <label className="text-sm text-muted-foreground">Object ID</label>
                      <p className="font-medium">#{selected.object_id}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-muted-foreground">User</label>
                    <p className="font-medium">{selected.user_name || 'System'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">College</label>
                    <p className="font-medium">{selected.college_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Timestamp</label>
                    <p className="font-medium">{new Date(selected.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Description</label>
                    <p className="text-sm">{selected.description}</p>
                  </div>
                </div>
              </div>

              {selected.metadata && Object.keys(selected.metadata).length > 0 && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Metadata</h3>
                  <pre className="text-xs bg-background p-4 rounded overflow-auto max-h-96 border">
                    {JSON.stringify(selected.metadata, null, 2)}
                  </pre>
                </div>
              )}

              <details className="bg-muted/30 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold mb-2 text-sm">
                  Raw API Data
                </summary>
                <pre className="text-xs overflow-auto max-h-64 bg-background p-2 rounded mt-2">
                  {JSON.stringify(selected, null, 2)}
                </pre>
              </details>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Note: Activity logs are read-only and maintained for audit purposes. They cannot be modified or deleted.
                </p>
              </div>
            </div>
          </div>
        )}
      </DetailSidebar>
    </div>
  );
};

export default ActivityLogsPage;
