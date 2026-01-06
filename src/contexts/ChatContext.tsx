import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { WS_CHAT_URL } from '../config/api.config';
import { toast } from 'sonner';

// Define types for chat messages
export interface ChatMessage {
  id?: number;
  type: 'chat_message';
  message: string;
  sender_id: number;
  sender_name?: string;
  recipient_id?: number;
  timestamp?: string;
}

interface ChatContextType {
  isConnected: boolean;
  messages: ChatMessage[];
  sendMessage: (recipientId: number, text: string) => void;
  sendTyping: (recipientId: number) => void;
  markAsRead: (senderId: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const token = localStorage.getItem('kumss_auth_token');

  const handleMessage = (data: any) => {
    // console.log('WS Message Received:', data);
    
    if (data.type === 'chat_message') {
      setMessages((prev) => [...prev, data]);
      // Only toast if we aren't currently focusing on this chat? 
      // For now, simpler is better: always toast or let the component handle it.
      // toast.info(`New message from ${data.sender_name}: ${data.message.substring(0, 20)}...`);
    } else if (data.type === 'error') {
      toast.error(data.message);
    }
  };

  const { isConnected, sendMessage: sendWsMessage } = useWebSocket({
    url: WS_CHAT_URL,
    onMessage: handleMessage,
    // Only connect if we have a token
    shouldConnect: !!token, 
  });

  const sendMessage = (recipientId: number, text: string) => {
    // Optimistic UI update could happen here, but we wait for server echo/ack for simplicity in V1
    const payload = {
      type: 'chat_message',
      recipient_id: recipientId,
      message: text,
    };
    sendWsMessage(payload);
  };

  const sendTyping = (recipientId: number) => {
    sendWsMessage({
      type: 'typing',
      recipient_id: recipientId,
    });
  };

  const markAsRead = (senderId: number) => {
    sendWsMessage({
        type: 'mark_read',
        sender_id: senderId
    })
  }

  return (
    <ChatContext.Provider value={{ isConnected, messages, sendMessage, sendTyping, markAsRead }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
