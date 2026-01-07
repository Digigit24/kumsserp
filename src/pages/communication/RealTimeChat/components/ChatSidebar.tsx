import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Chat } from '@/types/communication.types';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Plus, Search } from 'lucide-react';
import { useState } from 'react';

interface ChatSidebarProps {
    conversations: Chat[]; // Using Chat type conceptually as a conversation starter for now
    activeId: number | null;
    onSelect: (id: number) => void;
    onNewChat: () => void;
    isLoading?: boolean;
}

export const ChatSidebar = ({
    conversations,
    activeId,
    onSelect,
    onNewChat,
    isLoading
}: ChatSidebarProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Group chats by user (conceptually, backend should provide this, but we filter client-side for now)
    // Ideally, 'conversations' prop should be a list of distinct users with last message
    // For this MVP step, we'll assume the parent component passes a processed list

    const filtered = conversations.filter(c =>
        (c as any).display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.sender_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.receiver_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full h-full flex flex-col border-r bg-background">
            {/* Header */}
            <div className="p-4 border-b bg-background">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Chats</h2>
                    <Button size="icon" variant="ghost" onClick={onNewChat}>
                        <Plus className="w-5 h-5 text-gray-600" />
                    </Button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search or start new chat"
                        className="pl-9 bg-gray-100 border-none focus-visible:ring-1"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <ScrollArea className="flex-1">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8 text-gray-400">
                        Loading...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 mt-10">
                        <MessageSquare className="w-12 h-12 mb-2 text-gray-300" />
                        <p>No chats found</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {filtered.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => onSelect(chat.id)}
                                className={cn(
                                    "flex items-center gap-3 p-4 text-left transition-colors hover:bg-gray-100",
                                    activeId === chat.id && "bg-blue-50 hover:bg-blue-50 border-r-4 border-blue-500"
                                )}
                            >
                                <Avatar className="w-10 h-10 border shadow-sm">
                                    {/* Fallback to initials */}
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${(chat as any).display_name || chat.sender_name || 'User'}`} />
                                    <AvatarFallback>{((chat as any).display_name || chat.sender_name || 'U').charAt(0)}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="font-semibold text-gray-900 truncate">
                                            {(chat as any).display_name || chat.sender_name || 'Unknown User'}
                                        </span>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                            {formatDistanceToNow(new Date(chat.created_at), { addSuffix: false })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate pr-2">
                                        {chat.message}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};
