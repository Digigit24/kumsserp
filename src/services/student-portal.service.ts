/**
 * Student Portal API Service
 * All API calls for student-facing features
 */

import { API_ENDPOINTS, buildApiUrl, getDefaultHeaders } from '../config/api.config';
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
// HELPER FUNCTIONS
// ============================================================================

const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  const qs = queryParams.toString();
  return qs ? `?${qs}` : '';
};

const fetchApi = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const token = localStorage.getItem('kumss_auth_token');
  const tenantId = localStorage.getItem('tenant_id');

  const headers = new Headers();
  const defaultHeaders = getDefaultHeaders();
  Object.entries(defaultHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  if (options?.headers) {
    const customHeaders = options.headers;
    if (customHeaders instanceof Headers) {
      customHeaders.forEach((value, key) => headers.set(key, value));
    } else if (Array.isArray(customHeaders)) {
      customHeaders.forEach(([key, value]) => headers.set(key, value));
    } else {
      Object.entries(customHeaders).forEach(([key, value]) => headers.set(key, value));
    }
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (tenantId) {
    headers.set('X-Tenant-ID', tenantId);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
};

// ============================================================================
// DASHBOARD API
// ============================================================================

export const dashboardApi = {
  getDashboard: (): Promise<StudentDashboardData> =>
    fetchApi(buildApiUrl('/student/dashboard')),
};

// ============================================================================
// PROFILE API
// ============================================================================

export const studentProfileApi = {
  getProfile: (): Promise<StudentProfile> =>
    fetchApi(buildApiUrl('/student/profile')),

  updateProfile: (data: StudentProfileUpdateInput): Promise<StudentProfile> =>
    fetchApi(buildApiUrl('/student/profile'), {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ============================================================================
// ATTENDANCE API
// ============================================================================

export const attendanceApi = {
  getSummary: (): Promise<AttendanceSummary> =>
    fetchApi(buildApiUrl('/student/attendance/summary')),

  getSubjectWise: (): Promise<SubjectAttendance[]> =>
    fetchApi(buildApiUrl('/student/attendance/subjects')),

  getMonthly: (filters?: AttendanceFilters): Promise<MonthlyAttendance[]> =>
    fetchApi(buildApiUrl(`/student/attendance/monthly${buildQueryString(filters || {})}`)),

  getDetailedAttendance: (filters?: AttendanceFilters): Promise<PaginatedResponse<MonthlyAttendance>> =>
    fetchApi(buildApiUrl(`/student/attendance${buildQueryString(filters || {})}`)),
};

// ============================================================================
// SUBJECTS API
// ============================================================================

export const subjectsApi = {
  getEnrolled: (): Promise<EnrolledSubject[]> =>
    fetchApi(buildApiUrl('/student/subjects')),

  getSubjectDetails: (id: number): Promise<EnrolledSubject> =>
    fetchApi(buildApiUrl(`/student/subjects/${id}`)),
};

// ============================================================================
// ASSIGNMENTS API
// ============================================================================

export const assignmentsApi = {
  getPending: (filters?: AssignmentFilters): Promise<PaginatedResponse<Assignment>> =>
    fetchApi(buildApiUrl(`/student/assignments/pending${buildQueryString(filters || {})}`)),

  getSubmitted: (filters?: AssignmentFilters): Promise<PaginatedResponse<SubmittedAssignment>> =>
    fetchApi(buildApiUrl(`/student/assignments/submitted${buildQueryString(filters || {})}`)),

  getDetails: (id: number): Promise<Assignment> =>
    fetchApi(buildApiUrl(`/student/assignments/${id}`)),

  submit: (data: AssignmentSubmitInput): Promise<SubmittedAssignment> => {
    const formData = new FormData();
    formData.append('assignmentId', data.assignmentId.toString());
    if (data.remarks) formData.append('remarks', data.remarks);
    data.files.forEach(file => formData.append('files', file));

    return fetchApi(buildApiUrl('/student/assignments/submit'), {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
};

// ============================================================================
// EXAMS API
// ============================================================================

export const examsApi = {
  getAvailable: (): Promise<Exam[]> =>
    fetchApi(buildApiUrl('/student/exams/available')),

  getRegistered: (): Promise<Exam[]> =>
    fetchApi(buildApiUrl('/student/exams/registered')),

  getSchedule: (examId: number): Promise<ExamSchedule[]> =>
    fetchApi(buildApiUrl(`/student/exams/${examId}/schedule`)),

  register: (data: ExamRegistration): Promise<{ success: boolean; message: string }> =>
    fetchApi(buildApiUrl('/student/exams/register'), {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  downloadAdmitCard: (examId: number): Promise<Blob> =>
    fetchApi(buildApiUrl(`/student/exams/${examId}/admit-card`)),
};

// ============================================================================
// RESULTS API
// ============================================================================

export const resultsApi = {
  getPerformance: (): Promise<StudentPerformance> =>
    fetchApi(buildApiUrl('/student/results/performance')),

  getSemesterResults: (): Promise<SemesterResult[]> =>
    fetchApi(buildApiUrl('/student/results/semesters')),

  getResultDetails: (semesterId: number): Promise<SemesterResult> =>
    fetchApi(buildApiUrl(`/student/results/semesters/${semesterId}`)),

  downloadReportCard: (semesterId: number): Promise<Blob> =>
    fetchApi(buildApiUrl(`/student/results/semesters/${semesterId}/report`)),
};

// ============================================================================
// FEES API
// ============================================================================

export const feesApi = {
  getSummary: (): Promise<FeesSummary> =>
    fetchApi(buildApiUrl('/student/fees/summary')),

  getStructure: (): Promise<FeeStructure[]> =>
    fetchApi(buildApiUrl('/student/fees/structure')),

  getPaymentHistory: (): Promise<PaginatedResponse<PaymentHistory>> =>
    fetchApi(buildApiUrl('/student/fees/history')),

  makePayment: (data: FeePaymentInput): Promise<{ success: boolean; receiptNo: string }> =>
    fetchApi(buildApiUrl('/student/fees/pay'), {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  downloadReceipt: (receiptId: number): Promise<Blob> =>
    fetchApi(buildApiUrl(`/student/fees/receipt/${receiptId}`)),
};

// ============================================================================
// CERTIFICATES API
// ============================================================================

export const certificatesApi = {
  getTypes: (): Promise<CertificateType[]> =>
    fetchApi(buildApiUrl('/student/certificates/types')),

  getRequests: (filters?: CertificateFilters): Promise<PaginatedResponse<CertificateRequest>> =>
    fetchApi(buildApiUrl(`/student/certificates/requests${buildQueryString(filters || {})}`)),

  getIssued: (): Promise<IssuedCertificate[]> =>
    fetchApi(buildApiUrl('/student/certificates/issued')),

  request: (data: CertificateRequestInput): Promise<CertificateRequest> =>
    fetchApi(buildApiUrl('/student/certificates/request'), {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  download: (certificateId: number): Promise<Blob> =>
    fetchApi(buildApiUrl(`/student/certificates/${certificateId}/download`)),
};

// ============================================================================
// NOTICES API
// ============================================================================

export const noticesApi = {
  getAll: (filters?: NoticeFilters): Promise<PaginatedResponse<Notice>> =>
    fetchApi(buildApiUrl(`/student/notices${buildQueryString(filters || {})}`)),

  getPinned: (): Promise<Notice[]> =>
    fetchApi(buildApiUrl('/student/notices/pinned')),

  getDetails: (id: number): Promise<Notice> =>
    fetchApi(buildApiUrl(`/student/notices/${id}`)),

  markAsRead: (id: number): Promise<{ success: boolean }> =>
    fetchApi(buildApiUrl(`/student/notices/${id}/read`), {
      method: 'POST',
    }),
};

// ============================================================================
// SUPPORT / HELPDESK API
// ============================================================================

export const supportApi = {
  getTickets: (filters?: TicketFilters): Promise<PaginatedResponse<SupportTicket>> =>
    fetchApi(buildApiUrl(`/student/support/tickets${buildQueryString(filters || {})}`)),

  getTicketDetails: (id: number): Promise<SupportTicket> =>
    fetchApi(buildApiUrl(`/student/support/tickets/${id}`)),

  createTicket: (data: SupportTicketInput): Promise<SupportTicket> => {
    const formData = new FormData();
    formData.append('subject', data.subject);
    formData.append('category', data.category);
    formData.append('description', data.description);
    if (data.priority) formData.append('priority', data.priority);
    if (data.attachments) {
      data.attachments.forEach(file => formData.append('attachments', file));
    }

    return fetchApi(buildApiUrl('/student/support/tickets'), {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  getFAQs: (): Promise<FAQ[]> =>
    fetchApi(buildApiUrl('/student/support/faqs')),

  getContactInfo: (): Promise<ContactInfo[]> =>
    fetchApi(buildApiUrl('/student/support/contact')),
};
