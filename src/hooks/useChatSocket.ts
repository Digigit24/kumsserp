import { useCallback, useEffect, useRef, useState } from 'react';
import WebSocketService, { WebSocketStatus } from '../services/websocket/WebSocketService';

export const useChatSocket = (url: string, token?: string | null) => {
  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const [lastMessage, setLastMessage] = useState<any>(null);
  const socketRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    if (!url) return;

    // Append token if present
    const wsUrl = token ? `${url}?token=${token}` : url;
    console.log('[useChatSocket] Connecting to:', wsUrl, 'Token present:', !!token);
    const socket = new WebSocketService(wsUrl);
    socketRef.current = socket;

    const handleStatusChange = (newStatus: WebSocketStatus) => {
      setStatus(newStatus);
    };

    const handleMessage = (data: any) => {
      setLastMessage(data);
    };

    socket.onStatusChange(handleStatusChange);
    socket.addMessageHandler(handleMessage);

    socket.connect();

    return () => {
      socket.offStatusChange(handleStatusChange);
      socket.removeMessageHandler(handleMessage);
      socket.disconnect();
    };
  }, [url, token]);

  const sendMessage = useCallback((data: any) => {
    socketRef.current?.send(data);
  }, []);

  return {
    status,
    lastMessage,
    sendMessage,
    connect: () => socketRef.current?.connect(),
    disconnect: () => socketRef.current?.disconnect(),
  };
};
