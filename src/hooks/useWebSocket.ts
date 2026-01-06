import { useEffect, useRef, useState, useCallback } from "react";

type MessageHandler = (data: any) => void;

interface UseWebSocketOptions {
  url: string;
  onMessage?: MessageHandler;
  onOpen?: () => void;
  onClose?: () => void;
  shouldConnect?: boolean;
}

export const useWebSocket = ({
  url,
  onMessage,
  onOpen,
  onClose,
  shouldConnect = true,
}: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    // Prevent multiple connections
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    // Don't connect if we shouldn't
    if (!shouldConnect) return;

    const token = localStorage.getItem("kumss_auth_token");
    if (!token) {
      console.warn("WebSocket: No auth token found.");
      return;
    }

    // Append token to URL
    // Handle case where url might already have params
    const wsUrl = url.includes("?")
      ? `${url}&token=${token}`
      : `${url}?token=${token}`;

    console.log(`Connecting to WS: ${wsUrl}`);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WS Connected: ${url}`);
      setIsConnected(true);
      onOpen?.();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage?.(data);
      } catch (err) {
        console.error("WS Parse Error:", err);
      }
    };

    ws.onclose = (event) => {
      console.log(`WS Disconnected: ${url}`, event.code, event.reason);
      setIsConnected(false);
      wsRef.current = null;
      onClose?.();

      // Auto-reconnect after 3 seconds if we should still be connected
      // Don't reconnect if the close was clean/intentional or if auth failed (4003)
      if (shouldConnect && event.code !== 1000 && event.code !== 4003) {
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      }
    };

    ws.onerror = (error) => {
      console.error("WS Error:", error);
      // ws.close() will be called automatically or manually, triggering onclose
    };

    wsRef.current = ws;
  }, [url, shouldConnect, onMessage, onOpen, onClose]);

  useEffect(() => {
    if (shouldConnect) {
      connect();
    } else {
      // proper cleanup if we toggle shouldConnect to false
      if (wsRef.current) {
        wsRef.current.close();
      }
    }

    return () => {
      // Cleanup on unmount
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [shouldConnect, connect]); // Dependencies controlled by useCallback

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn("WS Not Connected: Message dropped", data);
    }
  }, []);

  return { isConnected, sendMessage };
};
