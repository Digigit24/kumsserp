import { useEffect, useRef, useState, useCallback } from "react";
import ReconnectingWebSocket from "../utils/ReconnectingWebSocket";
import { WS_CHAT_URL } from "../config/api.config";

export interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  message: string;
  attachment: string | null;
  timestamp: string;
}

export const useChatWebSocket = (token: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<ReconnectingWebSocket | null>(null);

  useEffect(() => {
    if (!token) return;

    // Clean up URL construction
    const baseUrl = WS_CHAT_URL.replace(/\/$/, "");
    const wsUrl = `${baseUrl}/?token=${token}`;

    const socket = new ReconnectingWebSocket(wsUrl);

    socket.addEventListener("open", () => {
      setIsConnected(true);
    });

    socket.addEventListener("message", (event: any) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "chat_message":
            setMessages((prev) => [
              ...prev,
              {
                id: data.id,
                senderId: data.sender_id,
                senderName: data.sender_name,
                message: data.message,
                attachment: data.attachment,
                timestamp: data.timestamp,
              },
            ]);
            break;

          case "message_sent":
            console.log("Message delivered:", data.id);
            break;

          case "error":
            console.error("WebSocket error:", data.error);
            break;
        }
      } catch (err) {
        console.error("WebSocket parse error", err);
      }
    });

    socket.addEventListener("close", () => {
      setIsConnected(false);
    });

    socket.addEventListener("error", (event: any) => {
      // Silent
    });

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [token]);

  const sendMessage = useCallback(
    (
      receiverId: number | string,
      message: string,
      attachment: string | null = null
    ) => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(
          JSON.stringify({
            receiver_id: receiverId,
            message: message,
            attachment: attachment,
          })
        );
      } else {
        console.warn("Chat WS not ready");
      }
    },
    []
  );

  return { messages, isConnected, sendMessage };
};
