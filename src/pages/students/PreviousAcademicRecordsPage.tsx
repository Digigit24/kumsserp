/**
 * Previous Academic Records Page
 * Displays all previous academic records from API
 */

import { useState } from 'react';
import { usePreviousAcademicRecords } from '../../hooks/useStudents';
import type { PreviousAcademicRecordFilters } from '../../types/students.types';

export const PreviousAcademicRecordsPage = () => {
  const [filters, setFilters] = useState<PreviousAcademicRecordFilters>({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = usePreviousAcademicRecords(filters);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Previous Academic Records</h1>
        <p className="text-gray-600">List of all student previous academic records (10th, 12th, UG, PG)</p>
      </div>

      <div className="mb-4 flex gap-4">
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-lg">Loading previous academic records...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {!isLoading && !error && data && (
        <div className="bg-white border border-gray-200 rounded">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Full API Response (JSON)</h2>
          </div>
          <pre className="p-4 overflow-auto max-h-[600px] text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
