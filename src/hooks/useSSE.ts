/**
 * useSSE Hook - Server-Sent Events Connection
 * Handles real-time communication via SSE
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { getAuthToken } from '../api/auth';

const SSE_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * SSE Event types
 */
export interface SSEEvent {
  event: 'connected' | 'message' | 'typing' | 'read_receipt' | 'notification' | 'heartbeat' | 'disconnected';
  data: any;
}

/**
 * Message event data
 */
export interface MessageEventData {
  id: number;
  sender_id: number;
  sender_name: string;
  receiver_id: number;
  message: string;
  attachment: string | null;
  attachment_type: string | null;
  timestamp: string;
  is_read: boolean;
  conversation_id: number;
}

/**
 * Typing event data
 */
export interface TypingEventData {
  sender_id: number;
  sender_name: string;
  is_typing: boolean;
}

/**
 * Read receipt event data
 */
export interface ReadReceiptEventData {
  message_id: number;
  reader_id: number;
  reader_name: string;
  read_at: string;
}

/**
 * Notification event data
 */
export interface NotificationEventData {
  title: string;
  message: string;
  notification_type: string;
  [key: string]: any;
}

/**
 * Heartbeat event data
 */
export interface HeartbeatEventData {
  timestamp: number;
}

/**
 * SSE Hook return type
 */
export interface UseSSEReturn {
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
}

/**
 * useSSE Hook
 * @param onMessage - Callback function to handle SSE events
 * @param enabled - Whether SSE connection is enabled
 */
export const useSSE = (
  onMessage: (event: SSEEvent) => void,
  enabled: boolean = true
): UseSSEReturn => {
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    if (!enabled) {
      console.log('[useSSE] SSE disabled');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      setError('No auth token');
      console.error('[useSSE] Cannot connect to SSE: No auth token');
      return;
    }

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = `${SSE_BASE_URL}/communication/sse/events/?token=${token}`;
    console.log('[useSSE] Connecting to SSE:', url);

    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      console.log('[useSSE] SSE Connected');
      setIsConnected(true);
      setError(null);
    };

    eventSource.onerror = (err) => {
      console.error('[useSSE] SSE Error:', err);
      setIsConnected(false);
      setError('Connection error');

      // Close the connection
      eventSource.close();

      // Auto-reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('[useSSE] Reconnecting to SSE...');
        connect();
      }, 5000);
    };

    // Handle all event types
    const eventTypes = [
      'connected',
      'message',
      'typing',
      'read_receipt',
      'notification',
      'heartbeat',
      'disconnected',
    ];

    eventTypes.forEach((eventType) => {
      eventSource.addEventListener(eventType, (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          console.log(`[useSSE] SSE Event [${eventType}]:`, data);
          onMessage({ event: eventType as any, data });
        } catch (err) {
          console.error('[useSSE] Failed to parse SSE data:', err, event.data);
        }
      });
    });

    eventSourceRef.current = eventSource;
  }, [enabled, onMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    error,
    reconnect: connect,
  };
};

export default useSSE;
