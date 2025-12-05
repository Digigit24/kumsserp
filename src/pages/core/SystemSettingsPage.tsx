/**
 * System Settings Page
 */

import { useState } from 'react';
import { useSystemSettings } from '../../hooks/useCore';
import type { SystemSettingFilters } from '../../types/core.types';

export const SystemSettingsPage = () => {
  const [filters] = useState<SystemSettingFilters>({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useSystemSettings(filters);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">System Settings</h1>

      <button onClick={() => refetch()} className="mb-6 px-4 py-2 bg-gray-600 text-white rounded">
        Refresh
      </button>

      {isLoading && <div>Loading...</div>}
      {error && <div className="bg-red-100 p-4 rounded">{error}</div>}

      {data && (
        <>
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p><strong>Total:</strong> {data.count} system settings</p>
          </div>

          <div className="space-y-4">
            {data.results.map((setting) => (
              <div key={setting.id} className="p-4 border rounded bg-white dark:bg-gray-800">
                <h3 className="font-semibold mb-2">{setting.college_name} - System Settings</h3>
                <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto max-h-96">
                  {JSON.stringify(setting, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SystemSettingsPage;
