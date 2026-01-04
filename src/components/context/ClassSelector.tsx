/**
 * Class Selector Component
 *
 * Permission-aware dropdown for selecting class context
 * - Shows only if user has permission (canChooseClass)
 * - Auto-fetches available classes based on selected college
 * - Syncs with HierarchicalContext
 */

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useClassContext, useCollegeContext } from '@/contexts/HierarchicalContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useContextClasses } from '@/hooks/useContextSelectors';

interface ClassSelectorProps {
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onValueChange?: (value: number | null) => void;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
  label = 'Class',
  placeholder = 'Select class',
  required = false,
  disabled = false,
  className = '',
  onValueChange,
}) => {
  console.log('🔵 [ClassSelector] Component rendered');

  const { selectedCollege, setSelectedCollege } = useCollegeContext();
  const { selectedClass, setSelectedClass, classes, isLoadingClasses } =
    useClassContext();
  const { permissions, userContext } = usePermissions();

  console.log('🔵 [ClassSelector] Initial state:', {
    selectedCollege,
    selectedClass,
    classesCount: classes.length,
    permissions: {
      canChooseClass: permissions?.canChooseClass,
      canChooseCollege: permissions?.canChooseCollege
    },
    userContext: {
      college_id: userContext?.college_id
    }
  });

  // Auto-select college for users who can't choose college (teachers)
  React.useEffect(() => {
    console.log('[ClassSelector] Debug:', {
      canChooseCollege: permissions?.canChooseCollege,
      userContextCollegeId: userContext?.college_id,
      selectedCollege,
      willAutoSelect: !permissions?.canChooseCollege && userContext?.college_id && !selectedCollege
    });

    if (!permissions?.canChooseCollege && userContext?.college_id && !selectedCollege) {
      console.log('[ClassSelector] Auto-selecting college for teacher:', userContext.college_id);
      setSelectedCollege(userContext.college_id);
    }
  }, [permissions?.canChooseCollege, userContext?.college_id, selectedCollege, setSelectedCollege]);

  // Auto-select class if teacher has only one class
  React.useEffect(() => {
    if (permissions?.isTeacher && !selectedClass && classes.length === 1 && !isLoadingClasses) {
      console.log('[ClassSelector] Auto-selecting single class for teacher:', classes[0].id);
      setSelectedClass(classes[0].id);
    }
  }, [permissions?.isTeacher, selectedClass, classes, isLoadingClasses, setSelectedClass]);

  // Fetch classes (hook updates context automatically)
  useContextClasses();

  // Don't render if user can't choose class
  if (!permissions?.canChooseClass) {
    return null;
  }

  const handleChange = (value: string) => {
    const classId = value ? Number(value) : null;
    console.log('[ClassSelector] Class changed:', { value, classId, currentSelectedClass: selectedClass });
    setSelectedClass(classId);
    onValueChange?.(classId);
  };

  // Debug: Log classes and selected class
  React.useEffect(() => {
    console.log('[ClassSelector] State update:', {
      selectedClass,
      classesCount: classes.length,
      classes: classes.map(c => ({ id: c.id, name: c.name })),
      isLoadingClasses
    });
  }, [selectedClass, classes, isLoadingClasses]);

  const isDisabled =
    disabled ||
    isLoadingClasses ||
    (permissions.canChooseCollege && !selectedCollege);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor="class-selector">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select
        value={selectedClass ? String(selectedClass) : undefined}
        onValueChange={handleChange}
        disabled={isDisabled}
      >
        <SelectTrigger id="class-selector">
          <SelectValue
            placeholder={
              isLoadingClasses
                ? 'Loading...'
                : !selectedCollege && permissions.canChooseCollege
                ? 'Select college first'
                : placeholder
            }
          />
        </SelectTrigger>
        <SelectContent>
          {classes.map((cls) => (
            <SelectItem key={cls.id} value={String(cls.id)}>
              {cls.name} ({cls.program_name})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
