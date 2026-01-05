import { cn } from '@/lib/utils';
import type { Chat } from '@/types/communication.types';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
    message: Chat;
    isMe: boolean;
}

export const MessageBubble = ({ message, isMe }: MessageBubbleProps) => {
    return (
        <div className={cn("flex w-full mb-4", isMe ? "justify-end" : "justify-start")}>
            <div
                className={cn(
                    "relative max-w-[70%] px-4 py-2 rounded-lg shadow-sm text-sm",
                    isMe
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-foreground rounded-tl-none border"
                )}
            >
                {/* Message Content */}
                <p className="whitespace-pre-wrap break-words pr-8 pb-3 min-w-[80px]">
                    {message.message}
                </p>

                {/* Timestamp & Status */}
                <div className="absolute bottom-1 right-2 flex items-center gap-1">
                    <span className="text-[10px] text-gray-500">
                        {format(new Date(message.created_at), 'p')}
                    </span>
                    {isMe && (
                        <span className={cn(
                            "flex items-center",
                            message.is_read ? "text-blue-500" : "text-gray-400"
                        )}>
                            {message.is_read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
