import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Library,
  ShoppingCart,
  Store,
  Users,
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { hasModulePermission } from '@/utils/permissions';

export const StaffQuickActions: React.FC = () => {
  const navigate = useNavigate();

  // Check permissions for each module
  const hasStoreAccess = hasModulePermission('store', 'read');
  const hasLibraryAccess = hasModulePermission('library', 'read');
  const hasStudentsAccess = hasModulePermission('students', 'read');

  return (
    <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 border-teal-200 dark:border-teal-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-teal-600" />
          Quick Actions
        </CardTitle>
        <CardDescription>Access your assigned modules</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {hasStoreAccess && (
            <>
              <Button
                variant="outline"
                className="h-24 bg-white dark:bg-gray-950 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
                onClick={() => navigate('/store/central-inventory')}
              >
                <div className="flex flex-col items-center gap-2">
                  <Store className="h-6 w-6 text-blue-600" />
                  <span className="text-xs font-medium">Inventory</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-24 bg-white dark:bg-gray-950 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all"
                onClick={() => navigate('/store/indents')}
              >
                <div className="flex flex-col items-center gap-2">
                  <ClipboardList className="h-6 w-6 text-purple-600" />
                  <span className="text-xs font-medium">Indents</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-24 bg-white dark:bg-gray-950 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all"
                onClick={() => navigate('/store/items')}
              >
                <div className="flex flex-col items-center gap-2">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                  <span className="text-xs font-medium">Store Items</span>
                </div>
              </Button>
            </>
          )}

          {hasLibraryAccess && (
            <>
              <Button
                variant="outline"
                className="h-24 bg-white dark:bg-gray-950 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all"
                onClick={() => navigate('/library/books')}
              >
                <div className="flex flex-col items-center gap-2">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                  <span className="text-xs font-medium">Books</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-24 bg-white dark:bg-gray-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all"
                onClick={() => navigate('/library/issues')}
              >
                <div className="flex flex-col items-center gap-2">
                  <Library className="h-6 w-6 text-indigo-600" />
                  <span className="text-xs font-medium">Book Issues</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-24 bg-white dark:bg-gray-950 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                onClick={() => navigate('/library/members')}
              >
                <div className="flex flex-col items-center gap-2">
                  <Users className="h-6 w-6 text-rose-600" />
                  <span className="text-xs font-medium">Members</span>
                </div>
              </Button>
            </>
          )}

          {hasStudentsAccess && (
            <Button
              variant="outline"
              className="h-24 bg-white dark:bg-gray-950 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-all"
              onClick={() => navigate('/students/list')}
            >
              <div className="flex flex-col items-center gap-2">
                <GraduationCap className="h-6 w-6 text-cyan-600" />
                <span className="text-xs font-medium">Students</span>
              </div>
            </Button>
          )}
        </div>

        {!hasStoreAccess && !hasLibraryAccess && !hasStudentsAccess && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No module permissions assigned</p>
            <p className="text-xs mt-1">Contact your administrator for access</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
