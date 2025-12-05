/**
 * Weekends Management Page
 */

import { useState } from 'react';
import { useWeekends } from '../../hooks/useCore';
import type { WeekendFilters } from '../../types/core.types';

export const WeekendsPage = () => {
  const [filters] = useState<WeekendFilters>({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useWeekends(filters);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Weekends Configuration</h1>

      <button onClick={() => refetch()} className="mb-6 px-4 py-2 bg-gray-600 text-white rounded">
        Refresh
      </button>

      {isLoading && <div>Loading...</div>}
      {error && <div className="bg-red-100 p-4 rounded">{error}</div>}

      {data && (
        <>
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p><strong>Total:</strong> {data.count} weekend configurations</p>
          </div>

          <div className="space-y-4">
            {data.results.map((weekend) => (
              <div key={weekend.id} className="p-4 border rounded bg-white dark:bg-gray-800">
                <h3 className="font-semibold">{weekend.day_display} (Day {weekend.day})</h3>
                <p className="text-sm text-gray-600">{weekend.college_name}</p>
                <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded mt-2 overflow-x-auto">
                  {JSON.stringify(weekend, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WeekendsPage;
