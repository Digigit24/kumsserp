// Communication Module Type Definitions

// ============================================================================
// BULK MESSAGES TYPES
// ============================================================================

export interface BulkMessage {
  id: number;
  is_active: boolean;
  title: string;
  message_type: string;
  recipient_type: string;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  college: number;
  template: number | null;
}

export interface BulkMessageCreateInput {
  is_active?: boolean;
  title: string;
  message_type: string;
  recipient_type: string;
  total_recipients?: number;
  sent_count?: number;
  failed_count?: number;
  status?: string;
  scheduled_at?: string | null;
  sent_at?: string | null;
  created_by?: string;
  updated_by?: string;
  college?: number;
  template?: number | null;
}

export interface BulkMessageUpdateInput {
  is_active?: boolean;
  title?: string;
  message_type?: string;
  recipient_type?: string;
  total_recipients?: number;
  sent_count?: number;
  failed_count?: number;
  status?: string;
  scheduled_at?: string | null;
  sent_at?: string | null;
  updated_by?: string;
  college?: number;
  template?: number | null;
}

export interface BulkMessageFilters {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
  message_type?: string;
  recipient_type?: string;
  status?: string;
  college?: number;
  created_by?: string;
}

// ============================================================================
// CHATS TYPES
// ============================================================================

export interface Chat {
  id: number;
  is_active: boolean;
  message: string;
  attachment: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  sender: string;
  receiver: string;
}

export interface ChatCreateInput {
  is_active?: boolean;
  message: string;
  attachment?: string | null;
  is_read?: boolean;
  read_at?: string | null;
  created_by?: string;
  updated_by?: string;
  sender: string;
  receiver: string;
}

export interface ChatUpdateInput {
  is_active?: boolean;
  message?: string;
  attachment?: string | null;
  is_read?: boolean;
  read_at?: string | null;
  updated_by?: string;
  sender?: string;
  receiver?: string;
}

export interface ChatFilters {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
  is_read?: boolean;
  sender?: string;
  receiver?: string;
}

// ============================================================================
// EVENTS TYPES
// ============================================================================

export interface Event {
  id: number;
  is_active: boolean;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  organizer: string;
  max_participants: number;
  registration_required: boolean;
  registration_deadline: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  college: number;
}

export interface EventCreateInput {
  is_active?: boolean;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  venue: string;
  organizer: string;
  max_participants: number;
  registration_required?: boolean;
  registration_deadline?: string;
  image?: string | null;
  created_by?: string;
  updated_by?: string;
  college?: number;
}

export interface EventUpdateInput {
  is_active?: boolean;
  title?: string;
  description?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  venue?: string;
  organizer?: string;
  max_participants?: number;
  registration_required?: boolean;
  registration_deadline?: string;
  image?: string | null;
  updated_by?: string;
  college?: number;
}

export interface EventFilters {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
  event_date?: string;
  registration_required?: boolean;
  college?: number;
}

// ============================================================================
// EVENT REGISTRATIONS TYPES
// ============================================================================

export interface EventRegistration {
  id: number;
  is_active: boolean;
  registration_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  event: number;
  user: string;
}

export interface EventRegistrationCreateInput {
  is_active?: boolean;
  registration_date?: string;
  status?: string;
  created_by?: string;
  updated_by?: string;
  event: number;
  user: string;
}

export interface EventRegistrationUpdateInput {
  is_active?: boolean;
  registration_date?: string;
  status?: string;
  updated_by?: string;
  event?: number;
  user?: string;
}

export interface EventRegistrationFilters {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
  status?: string;
  event?: number;
  user?: string;
}

// ============================================================================
// SHARED TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Message Types
export type MessageType = 'sms' | 'email' | 'push' | 'notification' | 'all';

// Recipient Types
export type RecipientType = 'student' | 'guardian' | 'teacher' | 'staff' | 'all' | 'custom';

// Message Status
export type MessageStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'delivered';

// Event Registration Status
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled' | 'attended' | 'no_show';

// ============================================================================
// MESSAGE LOGS TYPES
// ============================================================================

export interface MessageLog {
  id: number;
  is_active: boolean;
  message_type: string;
  phone_email: string;
  message: string;
  status: string;
  sent_at: string | null;
  delivered_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  bulk_message: number | null;
  recipient: string;
}

export interface MessageLogCreateInput {
  is_active?: boolean;
  message_type: string;
  phone_email: string;
  message: string;
  status?: string;
  sent_at?: string | null;
  delivered_at?: string | null;
  error_message?: string | null;
  created_by?: string;
  updated_by?: string;
  bulk_message?: number | null;
  recipient: string;
}

export interface MessageLogUpdateInput {
  is_active?: boolean;
  message_type?: string;
  phone_email?: string;
  message?: string;
  status?: string;
  sent_at?: string | null;
  delivered_at?: string | null;
  error_message?: string | null;
  updated_by?: string;
  bulk_message?: number | null;
  recipient?: string;
}

export interface MessageLogFilters {
  page?: number;
  page_size?: number;
  search?: string;
  is_active?: boolean;
  message_type?: string;
  status?: string;
  bulk_message?: number;
  recipient?: string;
}
