/**
 * Approvals Module Types
 */

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type ApprovalType = 'fee_payment' | 'leave_request' | 'document_request' | 'store_indent' | 'other';
export type ApprovalPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Approver {
  id: number;
  name: string;
  email?: string;
  user_type?: string;
}

export interface ApprovalRequest {
  id: number;
  request_type: ApprovalType;
  title: string;
  description: string;
  requester: number;
  requester_name?: string;
  requester_email?: string;
  approvers: Approver[];
  status: ApprovalStatus;
  priority: ApprovalPriority;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  reviewed_at?: string | null;
  reviewed_by?: number | null;
  reviewer_name?: string;
  review_comments?: string;
  is_user_approver?: boolean;
}

export interface ApprovalReviewInput {
  action: 'approve' | 'reject';
  comments?: string;
}

export interface ApprovalNotification {
  id: number;
  approval_request: number;
  request_type: ApprovalType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  priority: ApprovalPriority;
  metadata?: Record<string, any>;
}

export interface ApprovalNotificationUnreadCount {
  unread_count: number;
}

export interface FeePaymentApprovalInput {
  student_id: number;
  amount: number;
  payment_mode: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface ApprovalListParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: ApprovalStatus;
  request_type?: ApprovalType;
  priority?: ApprovalPriority;
  ordering?: string;
}

export interface PaginatedApprovalRequests {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApprovalRequest[];
}

export interface PaginatedApprovalNotifications {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApprovalNotification[];
}
