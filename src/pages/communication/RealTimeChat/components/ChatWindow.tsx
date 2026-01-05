import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { User } from '@/types/auth.types';
import type { Chat } from '@/types/communication.types';
import { MoreVertical, Paperclip, Phone, Send, Video } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
    activeChat: Chat | null; // The "active conversation" object
    messages: Chat[]; // Filtered messages for this conversation
    currentUser: User | null;
    onSendMessage: (text: string) => void;
    status: string;
}

export const ChatWindow = ({
    activeChat,
    messages,
    currentUser,
    onSendMessage,
    status
}: ChatWindowProps) => {
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;
        onSendMessage(inputValue);
        setInputValue('');
    };

    if (!activeChat) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#f0f2f5] border-l-4 border-green-500/20">
                <div className="text-center p-8 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Messages</h2>
                    <p className="text-gray-500">
                        Select a conversation from the sidebar to start chatting.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                        <span className={`w-2 h-2 rounded-full ${status === 'open' ? 'bg-green-500' : 'bg-red-500'}`} />
                        Status: {status}
                    </div>
                </div>
            </div>
        );
    }

    // Determine chat partner name
    // Determine chat partner name with robust 'isMe' check
    const senderStr = String(activeChat.sender || '');
    const validUsername = currentUser?.username ? String(currentUser.username) : null;
    const validUserId = (currentUser as any)?.id ? String((currentUser as any).id) : null;

    const isMeSender = (validUsername && senderStr === validUsername) ||
        (validUserId && senderStr === validUserId);

    const partnerName = isMeSender
        ? activeChat.receiver_name || activeChat.receiver
        : activeChat.sender_name || activeChat.sender;

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="flex items-center px-4 py-3 border-b shadow-sm z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <Avatar className="w-10 h-10 border cursor-pointer">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${partnerName}`} />
                    <AvatarFallback>{partnerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1 overflow-hidden">
                    <h3 className="font-semibold text-foreground truncate">{partnerName}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                        {status === 'open' ? 'Online' : 'Offline'}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="text-muted-foreground">
                        <Video className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-muted-foreground">
                        <Phone className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-muted-foreground">
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col justify-end min-h-full">
                    {messages.map((msg, index) => {
                        // We compare IDs or Usernames depending on what the API returns. 
                        // Using simple string comparison for safey.
                        // Robust "isMe" check to handle ID/Username mismatch and avoid undefined matches
                        const sender = String(msg.sender || '');
                        const validUsername = currentUser?.username ? String(currentUser.username) : null;
                        const validUserId = (currentUser as any)?.id ? String((currentUser as any).id) : null;

                        const isMe = Boolean((validUsername && sender === validUsername) ||
                            (validUserId && sender === validUserId));

                        return (
                            <MessageBubble
                                key={msg.id || index}
                                message={msg}
                                isMe={isMe}
                            />
                        );
                    })}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-3 border-t bg-background flex items-center gap-2">
                <Button size="icon" variant="ghost" className="text-muted-foreground">
                    <Paperclip className="w-5 h-5" />
                </Button>
                <form onSubmit={handleSend} className="flex-1 flex gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a message"
                        className="min-h-[42px]"
                    />
                    <Button type="submit" size="icon" className="rounded-full w-11 h-11 shrink-0">
                        <Send className="w-5 h-5 ml-0.5" />
                    </Button>
                </form>
            </div>
        </div>
    );
};
