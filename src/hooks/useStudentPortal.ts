/**
 * Custom React Hooks for Student Portal
 * Manages state and API calls for student-facing features
 */

import { useState, useEffect } from 'react';
import {
  dashboardApi,
  studentProfileApi,
  attendanceApi,
  subjectsApi,
  assignmentsApi,
  examsApi,
  resultsApi,
  feesApi,
  certificatesApi,
  noticesApi,
  supportApi,
} from '../services/student-portal.service';
import type {
  StudentDashboardData,
  AttendanceSummary,
  SubjectAttendance,
  MonthlyAttendance,
  AttendanceFilters,
  EnrolledSubject,
  Assignment,
  SubmittedAssignment,
  AssignmentSubmitInput,
  AssignmentFilters,
  Exam,
  ExamSchedule,
  ExamRegistration,
  StudentPerformance,
  SemesterResult,
  FeesSummary,
  FeeStructure,
  PaymentHistory,
  FeePaymentInput,
  CertificateType,
  CertificateRequest,
  IssuedCertificate,
  CertificateRequestInput,
  CertificateFilters,
  Notice,
  NoticeFilters,
  SupportTicket,
  SupportTicketInput,
  FAQ,
  ContactInfo,
  TicketFilters,
  StudentProfile,
  StudentProfileUpdateInput,
} from '../types/student-portal.types';
import type { PaginatedResponse } from '../types/core.types';

// ============================================================================
// BASE HOOK TYPES
// ============================================================================

interface UseQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseMutationResult<TData, TInput> {
  mutate: (input: TInput) => Promise<TData | null>;
  isLoading: boolean;
  error: string | null;
  data: TData | null;
}

// ============================================================================
// DASHBOARD HOOKS
// ============================================================================

/**
 * Hook to fetch student dashboard data
 */
export const useStudentDashboard = (): UseQueryResult<StudentDashboardData> => {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await dashboardApi.getDashboard();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Fetch dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// PROFILE HOOKS
// ============================================================================

/**
 * Hook to fetch student profile
 */
export const useStudentProfile = (): UseQueryResult<StudentProfile> => {
  const [data, setData] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await studentProfileApi.getProfile();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
      console.error('Fetch profile error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to update student profile
 */
export const useUpdateProfile = (): UseMutationResult<StudentProfile, StudentProfileUpdateInput> => {
  const [data, setData] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (input: StudentProfileUpdateInput): Promise<StudentProfile | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await studentProfileApi.updateProfile(input);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update profile';
      setError(errorMessage);
      console.error('Update profile error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error, data };
};

// ============================================================================
// ATTENDANCE HOOKS
// ============================================================================

/**
 * Hook to fetch attendance summary
 */
export const useAttendanceSummary = (): UseQueryResult<AttendanceSummary> => {
  const [data, setData] = useState<AttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await attendanceApi.getSummary();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch attendance summary');
      console.error('Fetch attendance summary error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to fetch subject-wise attendance
 */
export const useSubjectAttendance = (): UseQueryResult<SubjectAttendance[]> => {
  const [data, setData] = useState<SubjectAttendance[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await attendanceApi.getSubjectWise();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subject attendance');
      console.error('Fetch subject attendance error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to fetch monthly attendance
 */
export const useMonthlyAttendance = (filters?: AttendanceFilters): UseQueryResult<MonthlyAttendance[]> => {
  const [data, setData] = useState<MonthlyAttendance[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await attendanceApi.getMonthly(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch monthly attendance');
      console.error('Fetch monthly attendance error:', err);
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
// SUBJECTS HOOKS
// ============================================================================

/**
 * Hook to fetch enrolled subjects
 */
export const useEnrolledSubjects = (): UseQueryResult<EnrolledSubject[]> => {
  const [data, setData] = useState<EnrolledSubject[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await subjectsApi.getEnrolled();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch enrolled subjects');
      console.error('Fetch enrolled subjects error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// ASSIGNMENTS HOOKS
// ============================================================================

/**
 * Hook to fetch pending assignments
 */
export const usePendingAssignments = (filters?: AssignmentFilters): UseQueryResult<PaginatedResponse<Assignment>> => {
  const [data, setData] = useState<PaginatedResponse<Assignment> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await assignmentsApi.getPending(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pending assignments');
      console.error('Fetch pending assignments error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to fetch submitted assignments
 */
export const useSubmittedAssignments = (filters?: AssignmentFilters): UseQueryResult<PaginatedResponse<SubmittedAssignment>> => {
  const [data, setData] = useState<PaginatedResponse<SubmittedAssignment> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await assignmentsApi.getSubmitted(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch submitted assignments');
      console.error('Fetch submitted assignments error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to submit assignment
 */
export const useSubmitAssignment = (): UseMutationResult<SubmittedAssignment, AssignmentSubmitInput> => {
  const [data, setData] = useState<SubmittedAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (input: AssignmentSubmitInput): Promise<SubmittedAssignment | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await assignmentsApi.submit(input);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to submit assignment';
      setError(errorMessage);
      console.error('Submit assignment error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error, data };
};

// ============================================================================
// EXAMS HOOKS
// ============================================================================

/**
 * Hook to fetch available exams
 */
export const useAvailableExams = (): UseQueryResult<Exam[]> => {
  const [data, setData] = useState<Exam[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await examsApi.getAvailable();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch available exams');
      console.error('Fetch available exams error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to fetch registered exams
 */
export const useRegisteredExams = (): UseQueryResult<Exam[]> => {
  const [data, setData] = useState<Exam[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await examsApi.getRegistered();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch registered exams');
      console.error('Fetch registered exams error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to fetch exam schedule
 */
export const useExamSchedule = (examId: number | null): UseQueryResult<ExamSchedule[]> => {
  const [data, setData] = useState<ExamSchedule[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!examId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const result = await examsApi.getSchedule(examId);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch exam schedule');
      console.error('Fetch exam schedule error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [examId]);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to register for exam
 */
export const useRegisterExam = (): UseMutationResult<{ success: boolean; message: string }, ExamRegistration> => {
  const [data, setData] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (input: ExamRegistration): Promise<{ success: boolean; message: string } | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await examsApi.register(input);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to register for exam';
      setError(errorMessage);
      console.error('Register exam error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error, data };
};

// ============================================================================
// RESULTS HOOKS
// ============================================================================

/**
 * Hook to fetch student performance
 */
export const useStudentPerformance = (): UseQueryResult<StudentPerformance> => {
  const [data, setData] = useState<StudentPerformance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await resultsApi.getPerformance();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch performance data');
      console.error('Fetch performance error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to fetch semester results
 */
export const useSemesterResults = (): UseQueryResult<SemesterResult[]> => {
  const [data, setData] = useState<SemesterResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await resultsApi.getSemesterResults();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch semester results');
      console.error('Fetch semester results error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// FEES HOOKS
// ============================================================================

/**
 * Hook to fetch fees summary
 */
export const useFeesSummary = (): UseQueryResult<FeesSummary> => {
  const [data, setData] = useState<FeesSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await feesApi.getSummary();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch fees summary');
      console.error('Fetch fees summary error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to fetch fee structure
 */
export const useFeeStructure = (): UseQueryResult<FeeStructure[]> => {
  const [data, setData] = useState<FeeStructure[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await feesApi.getStructure();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch fee structure');
      console.error('Fetch fee structure error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to fetch payment history
 */
export const usePaymentHistory = (): UseQueryResult<PaginatedResponse<PaymentHistory>> => {
  const [data, setData] = useState<PaginatedResponse<PaymentHistory> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await feesApi.getPaymentHistory();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch payment history');
      console.error('Fetch payment history error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to make fee payment
 */
export const useMakePayment = (): UseMutationResult<{ success: boolean; receiptNo: string }, FeePaymentInput> => {
  const [data, setData] = useState<{ success: boolean; receiptNo: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (input: FeePaymentInput): Promise<{ success: boolean; receiptNo: string } | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await feesApi.makePayment(input);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to make payment';
      setError(errorMessage);
      console.error('Make payment error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error, data };
};

// ============================================================================
// CERTIFICATES HOOKS
// ============================================================================

/**
 * Hook to fetch certificate types
 */
export const useCertificateTypes = (): UseQueryResult<CertificateType[]> => {
  const [data, setData] = useState<CertificateType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await certificatesApi.getTypes();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch certificate types');
      console.error('Fetch certificate types error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to fetch certificate requests
 */
export const useCertificateRequests = (filters?: CertificateFilters): UseQueryResult<PaginatedResponse<CertificateRequest>> => {
  const [data, setData] = useState<PaginatedResponse<CertificateRequest> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await certificatesApi.getRequests(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch certificate requests');
      console.error('Fetch certificate requests error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to fetch issued certificates
 */
export const useIssuedCertificates = (): UseQueryResult<IssuedCertificate[]> => {
  const [data, setData] = useState<IssuedCertificate[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await certificatesApi.getIssued();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch issued certificates');
      console.error('Fetch issued certificates error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to request certificate
 */
export const useRequestCertificate = (): UseMutationResult<CertificateRequest, CertificateRequestInput> => {
  const [data, setData] = useState<CertificateRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (input: CertificateRequestInput): Promise<CertificateRequest | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await certificatesApi.request(input);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to request certificate';
      setError(errorMessage);
      console.error('Request certificate error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error, data };
};

// ============================================================================
// NOTICES HOOKS
// ============================================================================

/**
 * Hook to fetch all notices
 */
export const useNotices = (filters?: NoticeFilters): UseQueryResult<PaginatedResponse<Notice>> => {
  const [data, setData] = useState<PaginatedResponse<Notice> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await noticesApi.getAll(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notices');
      console.error('Fetch notices error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to fetch pinned notices
 */
export const usePinnedNotices = (): UseQueryResult<Notice[]> => {
  const [data, setData] = useState<Notice[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await noticesApi.getPinned();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pinned notices');
      console.error('Fetch pinned notices error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

// ============================================================================
// SUPPORT HOOKS
// ============================================================================

/**
 * Hook to fetch support tickets
 */
export const useSupportTickets = (filters?: TicketFilters): UseQueryResult<PaginatedResponse<SupportTicket>> => {
  const [data, setData] = useState<PaginatedResponse<SupportTicket> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await supportApi.getTickets(filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch support tickets');
      console.error('Fetch support tickets error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to create support ticket
 */
export const useCreateTicket = (): UseMutationResult<SupportTicket, SupportTicketInput> => {
  const [data, setData] = useState<SupportTicket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (input: SupportTicketInput): Promise<SupportTicket | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await supportApi.createTicket(input);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create ticket';
      setError(errorMessage);
      console.error('Create ticket error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error, data };
};

/**
 * Hook to fetch FAQs
 */
export const useFAQs = (): UseQueryResult<FAQ[]> => {
  const [data, setData] = useState<FAQ[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await supportApi.getFAQs();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch FAQs');
      console.error('Fetch FAQs error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};

/**
 * Hook to fetch contact info
 */
export const useContactInfo = (): UseQueryResult<ContactInfo[]> => {
  const [data, setData] = useState<ContactInfo[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await supportApi.getContactInfo();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch contact info');
      console.error('Fetch contact info error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, refetch: fetchData };
};
