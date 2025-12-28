import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getUserType,
  getDashboardTitle,
  getDashboardWelcome,
  isAdmin,
} from '@/utils/permissions';
import { getSectionsForRole } from '@/config/dashboard.config';
import { SECTION_COMPONENTS } from '@/components/dashboard/sections';

/**
 * Unified Dashboard Component
 *
 * This dashboard uses a config-driven approach where sections are defined
 * in dashboard.config.ts and rendered dynamically based on user role/permissions.
 *
 * To add a new dashboard section:
 * 1. Create the component in src/components/dashboard/sections/
 * 2. Export it from src/components/dashboard/sections/index.tsx
 * 3. Add it to DASHBOARD_SECTIONS in src/config/dashboard.config.ts
 * 4. Specify which roles should see it in allowedRoles
 *
 * This architecture makes it easy to:
 * - Add/remove dashboard sections without touching this file
 * - Control permissions for different roles (including custom roles like HOD)
 * - Reorder sections by changing the 'order' property in config
 * - Reuse sections across different roles
 */
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userRole = getUserType();
  const showAdminContent = isAdmin();

  // Get sections for current user's role from config
  const sections = getSectionsForRole(userRole);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{getDashboardTitle()}</h1>
          <p className="text-muted-foreground mt-2">{getDashboardWelcome()}</p>
        </div>
        <div className="flex gap-2">
          {showAdminContent && (
            <>
              <Button variant="outline" onClick={() => navigate('/core/system-settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button onClick={() => navigate('/communication/notices')}>
                <Bell className="h-4 w-4 mr-2" />
                Announcements
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Sections - Rendered based on config */}
      {sections.map((section) => {
        const SectionComponent = SECTION_COMPONENTS[section.component];

        if (!SectionComponent) {
          console.warn(`Dashboard section component "${section.component}" not found`);
          return null;
        }

        return (
          <div key={section.id}>
            <SectionComponent />
          </div>
        );
      })}

      {/* Empty state if no sections */}
      {sections.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No Dashboard Sections</h3>
          <p className="text-muted-foreground">
            No dashboard sections are configured for your role: {userRole}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Contact your administrator to configure dashboard permissions.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
