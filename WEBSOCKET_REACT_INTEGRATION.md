# WebSocket React Integration Guide

This guide explains how to integrate the WebSocket API into the React frontend using the custom `useWebSocket` hook or Context.

## 1. Helper Hook: `useWebSocket`

Create a reusable hook to manage connection state, auto-reconnection, and message handling.

### `src/hooks/useWebSocket.ts`

```typescript
import { useEffect, useRef, useState, useCallback } from "react";
import { WS_CHAT_URL, WS_NOTIFICATIONS_URL } from "../config/api.config";

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

    const token = localStorage.getItem("kumss_auth_token");
    if (!token) {
      console.warn("WebSocket: No auth token found.");
      return;
    }

    // Append token to URL
    const wsUrl = `${url}?token=${token}`;
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

    ws.onclose = () => {
      console.log(`WS Disconnected: ${url}`);
      setIsConnected(false);
      wsRef.current = null;
      onClose?.();

      // Auto-reconnect after 3 seconds if we should still be connected
      if (shouldConnect) {
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      }
    };

    ws.onerror = (error) => {
      console.error("WS Error:", error);
      ws.close();
    };

    wsRef.current = ws;
  }, [url, shouldConnect, onMessage, onOpen, onClose]);

  useEffect(() => {
    if (shouldConnect) {
      connect();
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
  }, [shouldConnect, connect]);

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn("WS Not Connected: Message dropped", data);
    }
  }, []);

  return { isConnected, sendMessage };
};
```

## 2. Integration Example: Global Chat Provider

To keep the chat connection alive across pages, wrap your app (or layout) in a Context Provider.

### `src/contexts/ChatContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { WS_CHAT_URL } from "../config/api.config";
import { toast } from "sonner";

interface ChatContextType {
  isConnected: boolean;
  messages: any[];
  sendMessage: (recipientId: number, text: string) => void;
  sendTyping: (recipientId: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<any[]>([]);

  const handleMessage = (data: any) => {
    if (data.type === "chat_message") {
      setMessages((prev) => [...prev, data]);
      toast.info(`New message from ${data.sender_name}`);
    }
  };

  const { isConnected, sendMessage: sendWsMessage } = useWebSocket({
    url: WS_CHAT_URL,
    onMessage: handleMessage,
    shouldConnect: !!localStorage.getItem("kumss_auth_token"),
  });

  const sendMessage = (recipientId: number, text: string) => {
    sendWsMessage({
      type: "chat_message",
      recipient_id: recipientId,
      message: text,
    });
  };

  const sendTyping = (recipientId: number) => {
    sendWsMessage({
      type: "typing",
      recipient_id: recipientId,
    });
  };

  return (
    <ChatContext.Provider
      value={{ isConnected, messages, sendMessage, sendTyping }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
```

## 3. Usage in components

```tsx
import { useChat } from "../contexts/ChatContext";

const ChatWindow = ({ recipientId }) => {
  const { messages, sendMessage, isConnected } = useChat();
  const [text, setText] = useState("");

  const handleSend = () => {
    sendMessage(recipientId, text);
    setText("");
  };

  const myMessages = messages.filter(
    (m) => m.sender_id === recipientId || m.recipient_id === recipientId
  );

  return (
    <div>
      <div className="status">{isConnected ? "Online" : "Reconnecting..."}</div>

      <div className="messages">
        {myMessages.map((msg) => (
          <div key={msg.id}>{msg.message}</div>
        ))}
      </div>

      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};
```
