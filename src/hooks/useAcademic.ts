/**
 * Custom React Hooks for Academic Module
 * Manages state and API calls for all Academic entities
 */

import { useState, useEffect } from 'react';
import {
  facultyApi,
  programApi,
  classApi,
  sectionApi,
  subjectApi,
  optionalSubjectApi,
  subjectAssignmentApi,
  classroomApi,
  classTimeApi,
  timetableApi,
  labScheduleApi,
  classTeacherApi,
} from '../services/academic.service';
import type {
  FacultyListItem,
  FacultyFilters,
  ProgramListItem,
  ProgramFilters,
  ClassListItem,
  ClassFilters,
  Section,
  SectionFilters,
  SubjectListItem,
  SubjectFilters,
  OptionalSubject,
  OptionalSubjectFilters,
  SubjectAssignmentListItem,
  SubjectAssignmentFilters,
  ClassroomListItem,
  ClassroomFilters,
  ClassTime,
  ClassTimeFilters,
  TimetableListItem,
  TimetableFilters,
  LabSchedule,
  LabScheduleFilters,
  ClassTeacher,
  ClassTeacherFilters,
} from '../types/academic.types';
import { PaginatedResponse } from '../types/core.types';

// ============================================================================
// BASE HOOK TYPE
// ============================================================================

interface UseQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// ============================================================================
// FACULTY HOOKS
// ============================================================================

export const useFaculties = (filters?: FacultyFilters): UseQueryResult<PaginatedResponse<FacultyListItem>> => {
  const [data, setData] = useState<PaginatedResponse<FacultyListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await facultyApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch faculties');
      console.error('Fetch faculties error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// PROGRAM HOOKS
// ============================================================================

export const usePrograms = (filters?: ProgramFilters): UseQueryResult<PaginatedResponse<ProgramListItem>> => {
  const [data, setData] = useState<PaginatedResponse<ProgramListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await programApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch programs');
      console.error('Fetch programs error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// CLASS HOOKS
// ============================================================================

export const useClasses = (filters?: ClassFilters): UseQueryResult<PaginatedResponse<ClassListItem>> => {
  const [data, setData] = useState<PaginatedResponse<ClassListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await classApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch classes');
      console.error('Fetch classes error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// SECTION HOOKS
// ============================================================================

export const useSections = (filters?: SectionFilters): UseQueryResult<PaginatedResponse<Section>> => {
  const [data, setData] = useState<PaginatedResponse<Section> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await sectionApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sections');
      console.error('Fetch sections error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// SUBJECT HOOKS
// ============================================================================

export const useSubjects = (filters?: SubjectFilters): UseQueryResult<PaginatedResponse<SubjectListItem>> => {
  const [data, setData] = useState<PaginatedResponse<SubjectListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await subjectApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subjects');
      console.error('Fetch subjects error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// OPTIONAL SUBJECT HOOKS
// ============================================================================

export const useOptionalSubjects = (filters?: OptionalSubjectFilters): UseQueryResult<PaginatedResponse<OptionalSubject>> => {
  const [data, setData] = useState<PaginatedResponse<OptionalSubject> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await optionalSubjectApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch optional subjects');
      console.error('Fetch optional subjects error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// SUBJECT ASSIGNMENT HOOKS
// ============================================================================

export const useSubjectAssignments = (filters?: SubjectAssignmentFilters): UseQueryResult<PaginatedResponse<SubjectAssignmentListItem>> => {
  const [data, setData] = useState<PaginatedResponse<SubjectAssignmentListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await subjectAssignmentApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subject assignments');
      console.error('Fetch subject assignments error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// CLASSROOM HOOKS
// ============================================================================

export const useClassrooms = (filters?: ClassroomFilters): UseQueryResult<PaginatedResponse<ClassroomListItem>> => {
  const [data, setData] = useState<PaginatedResponse<ClassroomListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await classroomApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch classrooms');
      console.error('Fetch classrooms error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// CLASS TIME HOOKS
// ============================================================================

export const useClassTimes = (filters?: ClassTimeFilters): UseQueryResult<PaginatedResponse<ClassTime>> => {
  const [data, setData] = useState<PaginatedResponse<ClassTime> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await classTimeApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch class times');
      console.error('Fetch class times error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// TIMETABLE HOOKS
// ============================================================================

export const useTimetable = (filters?: TimetableFilters): UseQueryResult<PaginatedResponse<TimetableListItem>> => {
  const [data, setData] = useState<PaginatedResponse<TimetableListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await timetableApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch timetable');
      console.error('Fetch timetable error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// LAB SCHEDULE HOOKS
// ============================================================================

export const useLabSchedules = (filters?: LabScheduleFilters): UseQueryResult<PaginatedResponse<LabSchedule>> => {
  const [data, setData] = useState<PaginatedResponse<LabSchedule> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await labScheduleApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch lab schedules');
      console.error('Fetch lab schedules error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// CLASS TEACHER HOOKS
// ============================================================================

export const useClassTeachers = (filters?: ClassTeacherFilters): UseQueryResult<PaginatedResponse<ClassTeacher>> => {
  const [data, setData] = useState<PaginatedResponse<ClassTeacher> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await classTeacherApi.list(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch class teachers');
      console.error('Fetch class teachers error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};
