/**
 * Holidays Management Page
 */

import { useState } from 'react';
import { useHolidays, useCreateHoliday } from '../../hooks/useCore';
import type { HolidayFilters, HolidayCreateInput } from '../../types/core.types';

export const HolidaysPage = () => {
  const [filters, setFilters] = useState<HolidayFilters>({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useHolidays(filters);
  const createHoliday = useCreateHoliday();

  const handleCreate = async () => {
    const newHoliday: HolidayCreateInput = {
      college: 1,
      name: 'Test Holiday',
      date: '2025-12-25',
      holiday_type: 'festival',
      description: 'Test holiday description',
    };

    try {
      await createHoliday.mutate(newHoliday);
      refetch();
      alert('Holiday created!');
    } catch (err) {
      alert('Failed to create holiday');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Holidays</h1>

      <div className="mb-6 flex gap-4">
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Test Holiday
        </button>
        <button onClick={() => refetch()} className="px-4 py-2 bg-gray-600 text-white rounded">
          Refresh
        </button>
      </div>

      {isLoading && <div>Loading...</div>}
      {error && <div className="bg-red-100 p-4 rounded">{error}</div>}

      {data && (
        <>
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p><strong>Total:</strong> {data.count} holidays</p>
          </div>

          <div className="space-y-4">
            {data.results.map((holiday) => (
              <div key={holiday.id} className="p-4 border rounded bg-white dark:bg-gray-800">
                <h3 className="font-semibold">{holiday.name} - {holiday.date}</h3>
                <p className="text-sm text-gray-600">{holiday.holiday_type_display}</p>
                <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded mt-2 overflow-x-auto">
                  {JSON.stringify(holiday, null, 2)}
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

export default HolidaysPage;
