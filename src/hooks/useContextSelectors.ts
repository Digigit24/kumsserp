/**
 * Context Selector Hooks
 *
 * Provides hooks for fetching and managing context options:
 * - useColleges
 * - useClasses
 * - useSections
 *
 * These hooks automatically fetch options based on:
 * 1. User permissions
 * 2. Parent context (e.g., classes depend on selected college)
 */

import { useQuery } from '@tanstack/react-query';
import {
  fetchContextColleges,
  fetchContextClasses,
  fetchContextSections,
} from '@/services/permissions.service';
import { useCollegeContext, useClassContext, useSectionContext } from '@/contexts/HierarchicalContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { useEffect } from 'react';

// ============================================================================
// COLLEGES HOOK
// ============================================================================

export const useContextColleges = () => {
  const { setColleges, setIsLoadingColleges } = useCollegeContext();
  const { permissions } = usePermissions();

  const query = useQuery({
    queryKey: ['context', 'colleges'],
    queryFn: fetchContextColleges,
    enabled: permissions?.canChooseCollege !== false, // Fetch even if false for initial data
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update context when data changes
  useEffect(() => {
    if (query.data?.results) {
      setColleges(query.data.results);
    }
    setIsLoadingColleges(query.isLoading);
  }, [query.data, query.isLoading, setColleges, setIsLoadingColleges]);

  return query;
};

// ============================================================================
// CLASSES HOOK
// ============================================================================

export const useContextClasses = () => {
  const { selectedCollege } = useCollegeContext();
  const { setClasses, setIsLoadingClasses, setSelectedClass } = useClassContext();
  const { permissions } = usePermissions();

  const query = useQuery({
    queryKey: ['context', 'classes', selectedCollege],
    queryFn: () => fetchContextClasses(selectedCollege || undefined),
    enabled: permissions?.canChooseClass !== false, // Fetch even if false for initial data
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update context when data changes
  useEffect(() => {
    if (query.data?.results) {
      setClasses(query.data.results);
    }
    setIsLoadingClasses(query.isLoading);
  }, [query.data, query.isLoading, setClasses, setIsLoadingClasses]);

  // Reset class selection when college changes
  useEffect(() => {
    setSelectedClass(null);
  }, [selectedCollege, setSelectedClass]);

  return query;
};

// ============================================================================
// SECTIONS HOOK
// ============================================================================

export const useContextSections = () => {
  const { selectedClass } = useClassContext();
  const { setSections, setIsLoadingSections, setSelectedSection } = useSectionContext();
  const { permissions } = usePermissions();

  const query = useQuery({
    queryKey: ['context', 'sections', selectedClass],
    queryFn: () => fetchContextSections(selectedClass || undefined),
    enabled: !!selectedClass && permissions?.canChooseSection !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update context when data changes
  useEffect(() => {
    if (query.data?.results) {
      setSections(query.data.results);
    }
    setIsLoadingSections(query.isLoading);
  }, [query.data, query.isLoading, setSections, setIsLoadingSections]);

  // Reset section selection when class changes
  useEffect(() => {
    setSelectedSection(null);
  }, [selectedClass, setSelectedSection]);

  return query;
};
