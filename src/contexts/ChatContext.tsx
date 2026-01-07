import React, { createContext, useContext, useState, useEffect } from 'react';
import { useChatWebSocket } from '../hooks/useChatWebSocket';

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
  const token = localStorage.getItem('kumss_auth_token');
  const { messages: wsMessages, isConnected, sendMessage: rawSendMessage } = useChatWebSocket(token);

  // Map messages from hook (camelCase) to Context (snake_case)
  const messages: ChatMessage[] = wsMessages.map(msg => ({
    id: msg.id,
    type: 'chat_message',
    message: msg.message,
    sender_id: msg.senderId,
    sender_name: msg.senderName,
    timestamp: msg.timestamp,
    // recipient_id: not provided by hook for incoming messages usually
  }));

  const sendMessage = (recipientId: number, text: string) => {
    rawSendMessage(recipientId, text);
  };

  const sendTyping = (recipientId: number) => {
    // Not supported by current API spec
    // console.warn('Typing indicators not supported in V1 API');
  };

  const markAsRead = (senderId: number) => {
    // Not supported by current API spec
    // console.warn('Read receipts not supported in V1 API');
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
