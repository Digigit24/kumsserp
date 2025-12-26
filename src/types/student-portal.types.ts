/**
 * Student Portal Types
 * Type definitions for student-facing features
 */

import type { PaginatedResponse } from './core.types';

// ============================================================================
// STUDENT DASHBOARD
// ============================================================================

export interface StudentDashboardData {
  todaysClasses: TodayClass[];
  attendanceSummary: AttendanceSummary;
  pendingFees: PendingFeeSummary;
  pendingAssignments: AssignmentSummary[];
  upcomingExams: ExamSummary[];
  recentNotices: NoticeSummary[];
  recentResults: ResultSummary[];
}

export interface TodayClass {
  id: number;
  subject: string;
  subjectCode: string;
  time: string;
  room: string;
  teacher: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  startTime: string;
  endTime: string;
}

// ============================================================================
// ATTENDANCE
// ============================================================================

export interface AttendanceSummary {
  percentage: number;
  present: number;
  absent: number;
  total: number;
  requiredPercentage: number;
  month: string;
  year: number;
}

export interface SubjectAttendance {
  id: number;
  subjectId: number;
  subject: string;
  subjectCode: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

export interface MonthlyAttendance {
  date: string;
  status: 'present' | 'absent' | 'leave' | 'holiday';
  remarks?: string;
}

export interface AttendanceFilters {
  startDate?: string;
  endDate?: string;
  subjectId?: number;
  month?: number;
  year?: number;
}

// ============================================================================
// SUBJECTS
// ============================================================================

export interface EnrolledSubject {
  id: number;
  subjectId: number;
  name: string;
  code: string;
  teacher: string;
  teacherId: number;
  credits: number;
  type: 'Core' | 'Elective' | 'Optional';
  schedule: ClassSchedule[];
  syllabus?: string;
  description?: string;
}

export interface ClassSchedule {
  id: number;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  room: string;
  roomId: number;
}

// ============================================================================
// ASSIGNMENTS
// ============================================================================

export interface Assignment {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  subject: string;
  subjectCode: string;
  assignedDate: string;
  dueDate: string;
  marks: number;
  priority: 'high' | 'medium' | 'low';
  attachments?: AssignmentAttachment[];
  instructions?: string;
}

export interface AssignmentSummary {
  id: number;
  subject: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  marks: number;
}

export interface SubmittedAssignment extends Assignment {
  submittedDate: string;
  submittedFiles?: SubmittedFile[];
  status: 'pending-evaluation' | 'evaluated' | 'returned';
  obtainedMarks?: number;
  feedback?: string;
  evaluatedDate?: string;
}

export interface AssignmentAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}

export interface SubmittedFile {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

export interface AssignmentSubmitInput {
  assignmentId: number;
  files: File[];
  remarks?: string;
}

export interface AssignmentFilters {
  subjectId?: number;
  status?: 'pending' | 'submitted' | 'evaluated';
  fromDate?: string;
  toDate?: string;
}

// ============================================================================
// EXAMINATIONS
// ============================================================================

export interface Exam {
  id: number;
  name: string;
  type: 'Mid-term' | 'Final' | 'Unit Test' | 'Practical' | 'Viva' | 'Project';
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  fee: number;
  status: 'registration-open' | 'registration-closed' | 'upcoming' | 'ongoing' | 'completed';
  registered: boolean;
  registrationDate?: string;
  admitCardAvailable: boolean;
  admitCardUrl?: string;
}

export interface ExamSummary {
  id: number;
  subject: string;
  date: string;
  type: string;
}

export interface ExamSchedule {
  id: number;
  examId: number;
  date: string;
  subjectId: number;
  subject: string;
  subjectCode: string;
  startTime: string;
  endTime: string;
  room: string;
  duration: number; // in minutes
  maxMarks: number;
}

export interface ExamRegistration {
  examId: number;
  subjects: number[];
  paymentMode?: 'online' | 'cash' | 'upi';
}

// ============================================================================
// RESULTS
// ============================================================================

export interface StudentPerformance {
  currentCGPA: number;
  currentSemesterGPA: number;
  totalCredits: number;
  earnedCredits: number;
  rank?: number;
  totalStudents?: number;
}

export interface SemesterResult {
  id: number;
  semester: string;
  examType: string;
  publishedDate: string;
  gpa: number;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  results: SubjectResult[];
}

export interface SubjectResult {
  id: number;
  subjectId: number;
  subject: string;
  subjectCode: string;
  totalMarks: number;
  obtainedMarks: number;
  grade: string;
  gradePoints: number;
  credits: number;
  remarks?: string;
}

export interface ResultSummary {
  subject: string;
  percentage: number;
  examType: string;
}

// ============================================================================
// FEES
// ============================================================================

export interface FeesSummary {
  totalFees: number;
  paidFees: number;
  pendingFees: number;
  dueDate?: string;
  academicYear: string;
}

export interface PendingFeeSummary {
  amount: number;
  dueDate: string;
  description: string;
}

export interface FeeStructure {
  id: number;
  category: string;
  amount: number;
  paid: number;
  pending: number;
  status: 'paid' | 'pending' | 'partial';
  dueDate?: string;
}

export interface PaymentHistory {
  id: number;
  receiptNo: string;
  date: string;
  description: string;
  amount: number;
  paymentMode: 'Online' | 'Cash' | 'UPI' | 'Cheque' | 'Card';
  status: 'completed' | 'pending' | 'failed';
  transactionId?: string;
}

export interface FeePaymentInput {
  feeStructureIds: number[];
  amount: number;
  paymentMode: 'online' | 'cash' | 'upi' | 'cheque' | 'card';
  transactionId?: string;
  remarks?: string;
}

// ============================================================================
// CERTIFICATES
// ============================================================================

export interface CertificateType {
  id: number;
  name: string;
  processingDays: number;
  fee: number;
  description?: string;
  requiredDocuments?: string[];
}

export interface CertificateRequest {
  id: number;
  ticketNo?: string;
  type: string;
  typeId: number;
  requestDate: string;
  status: 'pending' | 'processing' | 'ready' | 'issued' | 'rejected';
  estimatedDate?: string;
  completedDate?: string;
  purpose: string;
  fee: number;
  paymentStatus: 'paid' | 'pending';
  remarks?: string;
}

export interface IssuedCertificate {
  id: number;
  certificateNo: string;
  type: string;
  issueDate: string;
  validUntil?: string;
  downloadUrl: string;
  issuedBy?: string;
}

export interface CertificateRequestInput {
  typeId: number;
  purpose: string;
  quantity?: number;
  deliveryMode?: 'pickup' | 'courier';
  address?: string;
}

export interface CertificateFilters {
  status?: 'pending' | 'processing' | 'ready' | 'issued' | 'rejected';
  typeId?: number;
  fromDate?: string;
  toDate?: string;
}

// ============================================================================
// NOTICES
// ============================================================================

export interface Notice {
  id: number;
  title: string;
  description: string;
  category: 'academic' | 'event' | 'holiday' | 'general' | 'exam' | 'urgent';
  priority: 'important' | 'normal' | 'low';
  publishedDate: string;
  validUntil?: string;
  pinned: boolean;
  attachments?: NoticeAttachment[];
  author?: string;
  targetAudience?: string[];
}

export interface NoticeSummary {
  id: number;
  title: string;
  date: string;
  type: string;
}

export interface NoticeAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
}

export interface NoticeFilters {
  category?: 'academic' | 'event' | 'holiday' | 'general' | 'exam' | 'urgent';
  priority?: 'important' | 'normal' | 'low';
  pinned?: boolean;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

// ============================================================================
// SUPPORT / HELPDESK
// ============================================================================

export interface SupportTicket {
  id: number;
  ticketNo: string;
  subject: string;
  category: 'Technical' | 'Academic' | 'Fees' | 'Certificates' | 'General';
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'high' | 'medium' | 'low';
  createdDate: string;
  lastUpdate: string;
  resolvedDate?: string;
  response?: string;
  attachments?: TicketAttachment[];
}

export interface TicketAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
}

export interface SupportTicketInput {
  subject: string;
  category: 'Technical' | 'Academic' | 'Fees' | 'Certificates' | 'General';
  description: string;
  priority?: 'high' | 'medium' | 'low';
  attachments?: File[];
}

export interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
  helpful?: number;
  order?: number;
}

export interface ContactInfo {
  title: string;
  phone: string;
  email: string;
  hours: string;
  location?: string;
}

export interface TicketFilters {
  status?: 'open' | 'in-progress' | 'resolved' | 'closed';
  category?: string;
  priority?: string;
  fromDate?: string;
  toDate?: string;
}

// ============================================================================
// STUDENT PROFILE
// ============================================================================

export interface StudentProfile {
  id: number;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodGroup?: string;
  address: string;
  profileImage?: string;

  // Academic Info
  classId: number;
  class: string;
  sectionId: number;
  section: string;
  rollNumber: string;
  programId: number;
  program: string;
  academicYearId: number;
  academicYear: string;
  admissionDate: string;
  admissionNumber?: string;

  // Guardian Info
  guardians?: StudentGuardian[];
}

export interface StudentGuardian {
  id: number;
  name: string;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Other';
  phone: string;
  email?: string;
  occupation?: string;
  address?: string;
  isPrimary: boolean;
}

export interface StudentProfileUpdateInput {
  phone?: string;
  email?: string;
  address?: string;
  bloodGroup?: string;
}
