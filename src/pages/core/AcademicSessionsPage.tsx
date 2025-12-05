/**
 * Academic Sessions Management Page
 */

import { useState } from 'react';
import { useAcademicSessions, useCreateAcademicSession } from '../../hooks/useCore';
import type { AcademicSessionFilters, AcademicSessionCreateInput } from '../../types/core.types';

export const AcademicSessionsPage = () => {
  const [filters, setFilters] = useState<AcademicSessionFilters>({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useAcademicSessions(filters);
  const createSession = useCreateAcademicSession();

  const handleCreate = async () => {
    const newSession: AcademicSessionCreateInput = {
      college: 1,
      academic_year: 1,
      name: 'Fall Semester 2025',
      semester: 1,
      start_date: '2025-08-01',
      end_date: '2025-12-20',
      is_current: false,
    };

    try {
      await createSession.mutate(newSession);
      refetch();
      alert('Session created successfully!');
    } catch (err) {
      alert('Failed to create session');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Academic Sessions</h1>

      <div className="mb-6 flex gap-4">
        <button
          onClick={handleCreate}
          disabled={createSession.isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {createSession.isLoading ? 'Creating...' : 'Create Test Session'}
        </button>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <h3 className="font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Page Size</label>
            <select
              value={filters.page_size}
              onChange={(e) => setFilters({ ...filters, page_size: Number(e.target.value), page: 1 })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Semester</label>
            <input
              type="number"
              min="1"
              max="8"
              value={filters.semester || ''}
              onChange={(e) => setFilters({ ...filters, semester: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
              placeholder="1-8"
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

      {isLoading && <div className="text-center py-8">Loading...</div>}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {data && (
        <>
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p><strong>Total:</strong> {data.count} sessions</p>
          </div>

          <div className="space-y-4">
            {data.results.map((session) => (
              <div key={session.id} className="p-4 border rounded dark:border-gray-700 bg-white dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-2">
                  {session.name} - Semester {session.semester}
                  {session.is_current && <span className="ml-2 px-2 py-1 text-xs bg-green-500 text-white rounded">CURRENT</span>}
                </h3>
                <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto">
                  {JSON.stringify(session, null, 2)}
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

export default AcademicSessionsPage;
