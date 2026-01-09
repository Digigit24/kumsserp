/**
 * ConversationsList Component
 * Displays list of all conversations with last message and unread count
 */

import React, { useState, useEffect } from 'react';
import { chatAPI, Conversation } from '../../api/chatService';

interface ConversationsListProps {
  onSelectConversation: (otherUser: Conversation['other_user']) => void;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatAPI.getConversations();
      setConversations(data);
    } catch (err) {
      setError('Failed to load conversations');
      console.error('[ConversationsList] Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-500">Loading conversations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-500">No conversations yet</div>
      </div>
    );
  }

  return (
    <div className="conversations-list divide-y divide-gray-200">
      {conversations.map((conv) => (
        <div
          key={conv.conversation_id}
          className="conversation-item flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => onSelectConversation(conv.other_user)}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={conv.other_user.avatar || '/default-avatar.png'}
              alt={conv.other_user.full_name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {conv.other_user.is_online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>

          {/* Conversation Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {conv.other_user.full_name}
              </h4>
              <span className="text-xs text-gray-500">
                {new Date(conv.last_message_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <p
              className={`text-sm truncate ${
                conv.unread_count > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'
              }`}
            >
              {conv.last_message_by_me && <span className="text-gray-500">You: </span>}
              {conv.last_message}
            </p>
          </div>

          {/* Unread Badge */}
          {conv.unread_count > 0 && (
            <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-blue-600 rounded-full">
              {conv.unread_count}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConversationsList;
