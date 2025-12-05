/**
 * Activity Logs Page (Read-Only)
 */

import { useState } from 'react';
import { useActivityLogs } from '../../hooks/useCore';
import type { ActivityLogFilters } from '../../types/core.types';

export const ActivityLogsPage = () => {
  const [filters, setFilters] = useState<ActivityLogFilters>({ page: 1, page_size: 20, ordering: '-timestamp' });
  const { data, isLoading, error, refetch } = useActivityLogs(filters);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Activity Logs (Read-Only)</h1>

      <div className="mb-6 flex gap-4">
        <button onClick={() => refetch()} className="px-4 py-2 bg-gray-600 text-white rounded">
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <h3 className="font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Action</label>
            <select
              value={filters.action || ''}
              onChange={(e) => setFilters({ ...filters, action: e.target.value as any || undefined, page: 1 })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Actions</option>
              <option value="create">Create</option>
              <option value="read">Read</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Model</label>
            <input
              type="text"
              value={filters.model_name || ''}
              onChange={(e) => setFilters({ ...filters, model_name: e.target.value || undefined, page: 1 })}
              placeholder="e.g., College"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              placeholder="Search..."
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      {isLoading && <div>Loading...</div>}
      {error && <div className="bg-red-100 p-4 rounded">{error}</div>}

      {data && (
        <>
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p><strong>Total:</strong> {data.count} activity logs</p>
          </div>

          <div className="space-y-4">
            {data.results.map((log) => (
              <div key={log.id} className="p-4 border rounded bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">
                      {log.action_display} - {log.model_name}
                      {log.object_id && ` #${log.object_id}`}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {log.user_name || 'System'} | {new Date(log.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm">{log.description}</p>
                  </div>
                </div>
                <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded mt-2 overflow-x-auto max-h-64">
                  {JSON.stringify(log, null, 2)}
                </pre>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
              disabled={!data.previous}
              className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {filters.page || 1}</span>
            <button
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
              disabled={!data.next}
              className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityLogsPage;
