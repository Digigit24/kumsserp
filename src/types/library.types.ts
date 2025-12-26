/**
 * Library Module Types for KUMSS ERP
 * All types matching Django backend models
 */

import { UserBasic } from './accounts.types';

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface AuditFields {
  created_by: UserBasic | null;
  updated_by: UserBasic | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// BOOK TYPES
// ============================================================================

export interface Book extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  accession_number: string;
  isbn: string | null;
  title: string;
  subtitle: string | null;
  author: string;
  publisher: string | null;
  edition: string | null;
  publication_year: number | null;
  category: string;
  language: string;
  pages: number | null;
  price: number | null;
  location: string | null; // Shelf location
  total_copies: number;
  available_copies: number;
  description: string | null;
  cover_image: string | null;
  is_available: boolean;
  is_active: boolean;
}

export interface BookListItem {
  id: number;
  accession_number: string;
  isbn: string | null;
  title: string;
  author: string;
  publisher: string | null;
  category: string;
  total_copies: number;
  available_copies: number;
  is_available: boolean;
  is_active: boolean;
}

export interface BookCreateInput {
  college: number;
  accession_number: string;
  isbn?: string | null;
  title: string;
  subtitle?: string | null;
  author: string;
  publisher?: string | null;
  edition?: string | null;
  publication_year?: number | null;
  category: string;
  language: string;
  pages?: number | null;
  price?: number | null;
  location?: string | null;
  total_copies: number;
  description?: string | null;
  cover_image?: string | null;
  is_active?: boolean;
}

export interface BookUpdateInput extends Partial<BookCreateInput> {}

// ============================================================================
// LIBRARY MEMBER TYPES
// ============================================================================

export interface LibraryMember extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  member_id: string;
  user: string;
  user_details: UserBasic;
  member_type: 'student' | 'teacher' | 'staff';
  max_books_allowed: number;
  max_days_allowed: number;
  current_books_issued: number;
  total_books_issued: number;
  total_fines_paid: number;
  joined_date: string;
  expiry_date: string | null;
  is_blocked: boolean;
  block_reason: string | null;
  is_active: boolean;
}

export interface LibraryMemberListItem {
  id: number;
  member_id: string;
  user: string;
  user_name: string;
  member_type: string;
  max_books_allowed: number;
  current_books_issued: number;
  joined_date: string;
  is_blocked: boolean;
  is_active: boolean;
}

export interface LibraryMemberCreateInput {
  college: number;
  member_id: string;
  user: string;
  member_type: 'student' | 'teacher' | 'staff';
  max_books_allowed: number;
  max_days_allowed: number;
  joined_date: string;
  expiry_date?: string | null;
  is_active?: boolean;
}

export interface LibraryMemberUpdateInput extends Partial<LibraryMemberCreateInput> {}

// ============================================================================
// BOOK ISSUE TYPES
// ============================================================================

export interface BookIssue extends AuditFields {
  id: number;
  college: number;
  college_name: string;
  book: number;
  book_details: BookListItem;
  member: number;
  member_details: LibraryMemberListItem;
  issue_date: string;
  due_date: string;
  return_date: string | null;
  status: 'issued' | 'returned' | 'overdue' | 'lost';
  fine_amount: number;
  fine_paid: boolean;
  fine_paid_date: string | null;
  remarks: string | null;
  issued_by: UserBasic | null;
  returned_to: UserBasic | null;
  is_renewed: boolean;
  renewal_count: number;
}

export interface BookIssueListItem {
  id: number;
  book: number;
  book_title: string;
  accession_number: string;
  member: number;
  member_name: string;
  member_id: string;
  issue_date: string;
  due_date: string;
  return_date: string | null;
  status: string;
  fine_amount: number;
  issued_by_name: string | null;
  is_renewed: boolean;
}

export interface BookIssueCreateInput {
  college: number;
  book: number;
  member: number;
  issue_date: string;
  due_date: string;
  remarks?: string | null;
}

export interface BookIssueUpdateInput extends Partial<BookIssueCreateInput> {}

export interface RenewBookInput {
  issue_id: number;
  new_due_date: string;
  remarks?: string | null;
}

// ============================================================================
// BOOK RETURN TYPES
// ============================================================================

export interface BookReturn extends AuditFields {
  id: number;
  book_issue: number;
  book_issue_details: BookIssueListItem;
  return_date: string;
  condition: 'good' | 'fair' | 'damaged' | 'lost';
  fine_amount: number;
  damage_charges: number;
  total_amount: number;
  amount_paid: number;
  payment_mode: 'cash' | 'card' | 'upi' | 'net_banking' | 'waived';
  remarks: string | null;
  returned_to: UserBasic | null;
}

export interface BookReturnListItem {
  id: number;
  book_issue: number;
  book_title: string;
  member_name: string;
  return_date: string;
  condition: string;
  fine_amount: number;
  damage_charges: number;
  total_amount: number;
  returned_to_name: string | null;
}

export interface BookReturnCreateInput {
  book_issue: number;
  return_date: string;
  condition: 'good' | 'fair' | 'damaged' | 'lost';
  fine_amount?: number;
  damage_charges?: number;
  amount_paid?: number;
  payment_mode: 'cash' | 'card' | 'upi' | 'net_banking' | 'waived';
  remarks?: string | null;
}

export interface BookReturnUpdateInput extends Partial<BookReturnCreateInput> {}

// ============================================================================
// LIBRARY STATISTICS TYPES
// ============================================================================

export interface LibraryStatistics {
  total_books: number;
  total_copies: number;
  available_copies: number;
  issued_copies: number;
  total_members: number;
  active_members: number;
  total_issues_today: number;
  total_returns_today: number;
  overdue_books: number;
  total_fines_collected: number;
  category_wise_books: {
    category: string;
    count: number;
  }[];
  popular_books: {
    book_id: number;
    title: string;
    issue_count: number;
  }[];
}

export interface MemberHistory {
  member: number;
  member_name: string;
  member_id: string;
  total_books_issued: number;
  currently_issued: number;
  total_fines_paid: number;
  issue_history: BookIssueListItem[];
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface BookFilters {
  page?: number;
  page_size?: number;
  college?: number;
  category?: string;
  language?: string;
  author?: string;
  publisher?: string;
  is_available?: boolean;
  is_active?: boolean;
  search?: string;
  ordering?: string;
}

export interface LibraryMemberFilters {
  page?: number;
  page_size?: number;
  college?: number;
  member_type?: string;
  is_blocked?: boolean;
  is_active?: boolean;
  search?: string;
  ordering?: string;
}

export interface BookIssueFilters {
  page?: number;
  page_size?: number;
  college?: number;
  book?: number;
  member?: number;
  status?: string;
  issue_date?: string;
  date_from?: string;
  date_to?: string;
  fine_paid?: boolean;
  search?: string;
  ordering?: string;
}

export interface BookReturnFilters {
  page?: number;
  page_size?: number;
  book_issue?: number;
  return_date?: string;
  date_from?: string;
  date_to?: string;
  condition?: string;
  search?: string;
  ordering?: string;
}
