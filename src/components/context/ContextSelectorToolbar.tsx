/**
 * Context Selector Toolbar
 *
 * Combined toolbar with Class and Section selectors
 * Perfect for pages like Attendance that need hierarchical filtering
 *
 * NOTE: College selector is now global in the header, so showCollege defaults to false
 */

import { Card, CardContent } from '@/components/ui/card';
import { usePermissions } from '@/contexts/PermissionsContext';
import React from 'react';
import { ClassSelector } from './ClassSelector';
import { CollegeSelector } from './CollegeSelector';
import { SectionSelector } from './SectionSelector';

interface ContextSelectorToolbarProps {
  showCollege?: boolean; // Deprecated: Use global college selector in header instead
  showClass?: boolean;
  showSection?: boolean;
  className?: string;
}

export const ContextSelectorToolbar: React.FC<ContextSelectorToolbarProps> = ({
  showCollege = false, // Changed default: College selection is now global in header
  showClass = true,
  showSection = true,
  className = '',
}) => {
  const { permissions } = usePermissions();

  // Don't render anything if no selectors are needed
  const hasAnySelector =
    (showCollege && permissions?.canChooseCollege) ||
    (showClass && permissions?.canChooseClass) ||
    (showSection && permissions?.canChooseSection);

  if (!hasAnySelector) {
    return null;
  }

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showCollege && !permissions?.isCollegeAdmin && <CollegeSelector required />}
          {showClass && <ClassSelector required />}
          {showSection && <SectionSelector required />}
        </div>
      </CardContent>
    </Card>
  );
};
