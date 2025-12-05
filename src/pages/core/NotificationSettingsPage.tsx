/**
 * Notification Settings Page
 */

import { useState } from 'react';
import { useNotificationSettings } from '../../hooks/useCore';
import type { NotificationSettingFilters } from '../../types/core.types';

export const NotificationSettingsPage = () => {
  const [filters] = useState<NotificationSettingFilters>({ page: 1, page_size: 20 });
  const { data, isLoading, error, refetch } = useNotificationSettings(filters);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Notification Settings</h1>

      <button onClick={() => refetch()} className="mb-6 px-4 py-2 bg-gray-600 text-white rounded">
        Refresh
      </button>

      {isLoading && <div>Loading...</div>}
      {error && <div className="bg-red-100 p-4 rounded">{error}</div>}

      {data && (
        <>
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p><strong>Total:</strong> {data.count} notification settings</p>
          </div>

          <div className="space-y-4">
            {data.results.map((setting) => (
              <div key={setting.id} className="p-4 border rounded bg-white dark:bg-gray-800">
                <h3 className="font-semibold mb-2">{setting.college_name} - Notifications</h3>
                <div className="mb-3 space-y-1">
                  <p className="text-sm">
                    <strong>SMS:</strong> {setting.sms_enabled ? 'Enabled' : 'Disabled'}
                    {setting.sms_enabled && ` (${setting.sms_gateway})`}
                  </p>
                  <p className="text-sm">
                    <strong>Email:</strong> {setting.email_enabled ? 'Enabled' : 'Disabled'}
                    {setting.email_enabled && ` (${setting.email_gateway})`}
                  </p>
                  <p className="text-sm">
                    <strong>WhatsApp:</strong> {setting.whatsapp_enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
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

export default NotificationSettingsPage;
