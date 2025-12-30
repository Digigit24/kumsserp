/**
 * Context Selector Toolbar
 *
 * Combined toolbar with all three selectors
 * Perfect for pages like Attendance that need hierarchical filtering
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CollegeSelector } from './CollegeSelector';
import { ClassSelector } from './ClassSelector';
import { SectionSelector } from './SectionSelector';
import { usePermissions } from '@/contexts/PermissionsContext';

interface ContextSelectorToolbarProps {
  showCollege?: boolean;
  showClass?: boolean;
  showSection?: boolean;
  className?: string;
}

export const ContextSelectorToolbar: React.FC<ContextSelectorToolbarProps> = ({
  showCollege = true,
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {showCollege && <CollegeSelector required />}
          {showClass && <ClassSelector required />}
          {showSection && <SectionSelector required />}
        </div>
      </CardContent>
    </Card>
  );
};
