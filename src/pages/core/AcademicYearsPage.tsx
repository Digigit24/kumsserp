/**
 * Academic Years Management Page
 * Displays raw API response data for academic years
 */

import { useState } from 'react';
import { useAcademicYears, useCurrentAcademicYear, useCreateAcademicYear, useUpdateAcademicYear, useDeleteAcademicYear } from '../../hooks/useCore';
import type { AcademicYearFilters, AcademicYearCreateInput } from '../../types/core.types';

export const AcademicYearsPage = () => {
  const [filters, setFilters] = useState<AcademicYearFilters>({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useAcademicYears(filters);
  const { data: currentYear, refetch: refetchCurrent } = useCurrentAcademicYear();
  const createAcademicYear = useCreateAcademicYear();
  const updateAcademicYear = useUpdateAcademicYear();
  const deleteAcademicYear = useDeleteAcademicYear();

  const handleCreate = async () => {
    const newYear: AcademicYearCreateInput = {
      college: 1, // Replace with actual college ID
      year: '2025-2026',
      start_date: '2025-08-01',
      end_date: '2026-07-31',
      is_current: false,
    };

    try {
      await createAcademicYear.mutate(newYear);
      refetch();
      refetchCurrent();
      alert('Academic year created successfully!');
    } catch (err) {
      alert('Failed to create academic year');
    }
  };

  const handleSetCurrent = async (id: number) => {
    try {
      await updateAcademicYear.mutate({
        id,
        data: { is_current: true },
      });
      refetch();
      refetchCurrent();
      alert('Academic year set as current!');
    } catch (err) {
      alert('Failed to update academic year');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this academic year?')) return;

    try {
      await deleteAcademicYear.mutate(id);
      refetch();
      refetchCurrent();
      alert('Academic year deleted successfully!');
    } catch (err) {
      alert('Failed to delete academic year');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Academic Years Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Raw API Response Display - Core Module
        </p>
      </div>

      {/* Current Academic Year */}
      {currentYear && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-400 dark:border-green-700 rounded">
          <h3 className="font-semibold mb-2 text-green-800 dark:text-green-300">
            Current Academic Year
          </h3>
          <pre className="text-xs bg-white dark:bg-gray-900 p-3 rounded overflow-x-auto">
            {JSON.stringify(currentYear, null, 2)}
          </pre>
        </div>
      )}

      {/* Actions */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={handleCreate}
          disabled={createAcademicYear.isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {createAcademicYear.isLoading ? 'Creating...' : 'Create Test Academic Year'}
        </button>
        <button
          onClick={() => {
            refetch();
            refetchCurrent();
          }}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <h3 className="font-semibold mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="block text-sm font-medium mb-1">Current Only</label>
            <select
              value={filters.is_current?.toString() || ''}
              onChange={(e) => setFilters({ ...filters, is_current: e.target.value === 'true' ? true : undefined, page: 1 })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All</option>
              <option value="true">Current</option>
            </select>
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

      {/* Loading/Error States */}
      {isLoading && <div className="text-center py-8">Loading academic years...</div>}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Data Display */}
      {data && (
        <>
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p className="text-sm">
              <strong>Total Count:</strong> {data.count} | <strong>Results:</strong> {data.results.length}
            </p>
          </div>

          <div className="space-y-4">
            {data.results.map((year) => (
              <div
                key={year.id}
                className="p-4 border rounded dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {year.year}
                      {year.is_current && (
                        <span className="ml-2 px-2 py-1 text-xs bg-green-500 text-white rounded">
                          CURRENT
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {year.start_date} to {year.end_date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!year.is_current && (
                      <button
                        onClick={() => handleSetCurrent(year.id)}
                        disabled={updateAcademicYear.isLoading}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Set Current
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(year.id)}
                      disabled={deleteAcademicYear.isLoading}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-1">
                    Raw API Response:
                  </p>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto">
                    {JSON.stringify(year, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
              disabled={!data.previous}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {filters.page || 1}</span>
            <button
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
              disabled={!data.next}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AcademicYearsPage;
