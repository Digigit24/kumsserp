/**
 * MessageInput Component
 * Input field for sending messages with attachment support
 */

import React, { useState, useRef } from 'react';
import { chatAPI, Message } from '../../api/chatService';
import { useTypingIndicator } from '../../hooks/useTypingIndicator';

interface MessageInputProps {
  receiverId: number;
  onMessageSent?: (message: Message) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ receiverId, onMessageSent }) => {
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { sendTyping, stopTyping } = useTypingIndicator(receiverId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() && !attachment) return;

    setSending(true);
    try {
      const sentMessage = await chatAPI.sendMessage(receiverId, message, attachment);

      setMessage('');
      setAttachment(null);
      stopTyping();

      if (onMessageSent) {
        onMessageSent(sentMessage);
      }
    } catch (error) {
      console.error('[MessageInput] Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File too large. Max 10MB.');
        return;
      }
      setAttachment(file);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    // Send typing indicator
    if (e.target.value.trim()) {
      sendTyping(true);
    }
  };

  const handleBlur = () => {
    stopTyping();
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form border-t border-gray-200 p-4">
      {/* Attachment Preview */}
      {attachment && (
        <div className="mb-2 flex items-center gap-2 p-2 bg-gray-100 rounded-md">
          <span className="text-sm text-gray-700 flex-1 truncate">{attachment.name}</span>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-center gap-2">
        {/* File Input (Hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          id="file-input"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          title="Attach file"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        {/* Message Input */}
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          onBlur={handleBlur}
          placeholder="Type a message..."
          disabled={sending}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={sending || (!message.trim() && !attachment)}
          className="flex-shrink-0 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
