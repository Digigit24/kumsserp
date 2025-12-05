/**
 * Colleges Management Page
 * Displays raw API response data for colleges
 */

import { useState } from 'react';
import { useColleges, useCreateCollege, useUpdateCollege, useDeleteCollege } from '../../hooks/useCore';
import type { CollegeFilters, CollegeCreateInput } from '../../types/core.types';

export const CollegesPage = () => {
  const [filters, setFilters] = useState<CollegeFilters>({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useColleges(filters);
  const createCollege = useCreateCollege();
  const updateCollege = useUpdateCollege();
  const deleteCollege = useDeleteCollege();

  // Debug: Check token
  const token = localStorage.getItem('kumss_auth_token');
  console.log('[CollegesPage] Current token:', token);
  console.log('[CollegesPage] All localStorage keys:', Object.keys(localStorage));
  console.log('[CollegesPage] localStorage kumss_auth_token:', localStorage.getItem('kumss_auth_token'));

  const handleCreate = async () => {
    const newCollege: CollegeCreateInput = {
      code: 'TEST001',
      name: 'Test College',
      short_name: 'TC',
      email: 'test@college.edu',
      phone: '+1234567890',
      address_line1: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      pincode: '12345',
      country: 'Test Country',
      primary_color: '#1976d2',
      secondary_color: '#dc004e',
    };

    try {
      await createCollege.mutate(newCollege);
      refetch();
      alert('College created successfully!');
    } catch (err) {
      alert('Failed to create college');
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateCollege.mutate({
        id,
        data: { email: `updated_${Date.now()}@college.edu` },
      });
      refetch();
      alert('College updated successfully!');
    } catch (err) {
      alert('Failed to update college');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this college?')) return;

    try {
      await deleteCollege.mutate(id);
      refetch();
      alert('College deleted successfully!');
    } catch (err) {
      alert('Failed to delete college');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Colleges Management</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Raw API Response Display - Core Module
        </p>
      </div>

      {/* Debug: Auth Token Status */}
      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-700 rounded">
        <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-300">
          Debug: Authentication Status
        </h3>
        <p className="text-sm">
          <strong>Token Present:</strong> {token ? '✅ Yes' : '❌ No'}
        </p>
        {token && (
          <p className="text-sm">
            <strong>Token:</strong> {token.substring(0, 20)}...
          </p>
        )}
        {!token && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">
            ⚠️ No token found! Please log out and log in again.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={handleCreate}
          disabled={createCollege.isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {createCollege.isLoading ? 'Creating...' : 'Create Test College'}
        </button>
        <button
          onClick={() => refetch()}
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
              <option value={100}>100</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Active Only</label>
            <select
              value={filters.is_active?.toString() || ''}
              onChange={(e) => setFilters({ ...filters, is_active: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined, page: 1 })}
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              placeholder="Search colleges..."
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading colleges...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Data Display */}
      {data && (
        <>
          {/* Summary */}
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p className="text-sm">
              <strong>Total Count:</strong> {data.count} |{' '}
              <strong>Page:</strong> {filters.page} |{' '}
              <strong>Results on this page:</strong> {data.results.length}
            </p>
          </div>

          {/* Colleges List */}
          <div className="space-y-4">
            {data.results.map((college) => (
              <div
                key={college.id}
                className="p-4 border rounded dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {college.name} ({college.code})
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {college.city}, {college.state}, {college.country}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(college.id)}
                      disabled={updateCollege.isLoading}
                      className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(college.id)}
                      disabled={deleteCollege.isLoading}
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
                    {JSON.stringify(college, null, 2)}
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
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {filters.page || 1}
            </span>
            <button
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
              disabled={!data.next}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Mutation States */}
      {createCollege.data && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded">
          <p className="text-sm font-semibold mb-2">Last Created College:</p>
          <pre className="text-xs bg-white dark:bg-gray-900 p-3 rounded overflow-x-auto">
            {JSON.stringify(createCollege.data, null, 2)}
          </pre>
        </div>
      )}

      {updateCollege.data && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
          <p className="text-sm font-semibold mb-2">Last Updated College:</p>
          <pre className="text-xs bg-white dark:bg-gray-900 p-3 rounded overflow-x-auto">
            {JSON.stringify(updateCollege.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CollegesPage;
