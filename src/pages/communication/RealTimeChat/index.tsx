import { WS_CHAT_URL } from '@/config/api.config';
import { useAuth } from '@/hooks/useAuth';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useChats, useCreateChat } from '@/hooks/useCommunication';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatWindow } from './components/ChatWindow';
import { NewChatDialog } from './components/NewChatDialog';

export const RealTimeChat = () => {
    const { user, token } = useAuth();
    const { data: chatsData, refetch } = useChats({ page: 1, page_size: 100 });
    const createMutation = useCreateChat();
    const [activeChatId, setActiveChatId] = useState<number | null>(null);

    // New Chat State
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [draftReceiver, setDraftReceiver] = useState<any | null>(null);

    // WebSocket Integration (For receiving updates)
    const { status, lastMessage } = useChatSocket(WS_CHAT_URL, token);

    // Derived state for conversations...
    const rawConversations = chatsData?.results || [];

    // Group conversations by partner to prevent duplicates in sidebar
    const conversations = useMemo(() => {
        const groups = new Map();

        rawConversations.forEach((msg: any) => {
            const isMeSender = msg.sender === user?.username || msg.sender === (user as any)?.id;

            // Use Name as the primary grouping key because IDs can be inconsistent (Username vs UUID)
            const partnerName = isMeSender ? msg.receiver_name : msg.sender_name;
            const partnerId = isMeSender ? msg.receiver : msg.sender;

            // Normalize key to lower case and TRIM whitespace to prevent "Store 1 " vs "store 1" duplicates
            const groupKey = (partnerName || partnerId || '').toLowerCase().trim();

            // Check existing
            const existing = groups.get(groupKey);
            if (!existing || new Date(msg.created_at) > new Date(existing.created_at)) {
                groups.set(groupKey, msg);
            }
        });

        return Array.from(groups.values()).sort((a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }, [rawConversations, user]);

    // Determine Active Chat Object
    // Check existing or draft
    // We look in rawConversations to find the specific message if activeChatId is set
    let activeChatObj = rawConversations.find(c => c.id === activeChatId);

    // If not found in raw list (maybe it was from a grouped item that is stale?), 
    // try finding it in grouped list? No, grouped list items ARE from raw list.
    // However, if we selected a "Group" leader, it is a message ID.
    // Theoretically fine.

    if (!activeChatObj && draftReceiver) {
        activeChatObj = {
            id: -1, // Temp ID
            sender: user?.username || '',
            sender_name: (user as any)?.full_name || user?.username || 'Me',

            // Critical: Ensure we use the correct ID for the receiver
            receiver: draftReceiver.id,
            receiver_name: draftReceiver.full_name || draftReceiver.username,

            message: '',
            created_at: new Date().toISOString(),
            is_read: true
        } as any;
    }

    // Filter messages...
    // We filter by Partner Name to ensure we capture messages with different ID formats (UUID vs Username)
    const activeMessages = activeChatObj && activeChatObj.id !== -1
        ? rawConversations.filter(c => {
            const isMeSender = c.sender === user?.username || c.sender === (user as any)?.id;
            const cPartnerName = isMeSender ? c.receiver_name : c.sender_name;
            const cPartnerId = isMeSender ? c.receiver : c.sender;

            const activeIsMeSender = activeChatObj.sender === user?.username || activeChatObj.sender === (user as any)?.id;
            const activePartnerName = activeIsMeSender ? activeChatObj.receiver_name : activeChatObj.sender_name;
            const activePartnerId = activeIsMeSender ? activeChatObj.receiver : activeChatObj.sender;

            // Match by Name if available, otherwise by ID
            if (activePartnerName && cPartnerName) {
                return activePartnerName === cPartnerName;
            }
            return activePartnerId === cPartnerId;
        }).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        : [];

    // Real-time updates listener
    useEffect(() => {
        if (lastMessage) {
            refetch();
        }
    }, [lastMessage, refetch]);

    const handleSendMessage = async (text: string) => {
        if (!activeChatObj) return;

        // Determine correct receiver ID (assuming 'sender'/'receiver' are usernames or IDs)
        // If your API expects an ID, ensure activeChatObj has it. 
        // Based on existing code, we use 'receiver_id'.
        // Logic fix: if I am sender, receiver is receiver. If I am receiver, receiver is sender.
        // We must check if I am the sender using both username AND ID to be safe against API format variations.
        const isMeSender = activeChatObj.sender === user?.username || activeChatObj.sender === (user as any)?.id;

        const actualReceiver = (activeChatObj.id === -1)
            ? activeChatObj.receiver // Draft mode
            : (isMeSender ? activeChatObj.receiver : activeChatObj.sender); // Reply mode

        try {
            const response = await createMutation.mutateAsync({
                message: text,
                receiver: actualReceiver,
                sender: (user as any)?.id // Cast to any to access ID if type definition is lagging
            } as any);

            // Fetch latest data to ensure the new message is in our 'conversations' list
            await refetch();

            // If we have a valid response ID, switch to it as the active chat
            const data = (response as any).data || response;
            if (data && data.id) {
                setActiveChatId(data.id);
            }

            setDraftReceiver(null); // Now safe to clear draft state
        } catch (error) {
            toast.error('Failed to send message');
            console.error(error);
        }
    };

    const handleNewChat = () => {
        setIsNewChatOpen(true);
    };

    const handleUserSelect = (selectedUser: any) => {
        // logic to check existing
        const existingMsg = rawConversations.find(c =>
            (c.sender === user?.username && c.receiver === selectedUser.id) ||
            (c.sender === (user as any)?.id && c.receiver === selectedUser.id) ||
            (c.sender === selectedUser.id && c.receiver === user?.username) ||
            (c.sender === selectedUser.username && c.receiver === user?.username)
        );

        if (existingMsg) {
            setActiveChatId(existingMsg.id);
            setDraftReceiver(null);
        } else {
            setDraftReceiver(selectedUser);
            setActiveChatId(null);
        }
    };

    return (
        <>
            <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Sidebar - 35% width */}
                <div className="w-[350px] min-w-[300px] border-r flex-shrink-0">
                    <ChatSidebar
                        conversations={conversations}
                        activeId={activeChatId}
                        onSelect={(id) => { setActiveChatId(id); setDraftReceiver(null); }}
                        onNewChat={handleNewChat}
                        isLoading={!chatsData}
                    />
                </div>

                {/* Main Chat - Remaining width */}
                <div className="flex-1 min-w-0">
                    <ChatWindow
                        activeChat={activeChatObj || null}
                        messages={activeMessages}
                        currentUser={user as any}
                        onSendMessage={handleSendMessage}
                        status={status}
                    />
                </div>
            </div>

            <NewChatDialog
                open={isNewChatOpen}
                onOpenChange={setIsNewChatOpen}
                onUserSelect={handleUserSelect}
            />
        </>
    );
};

export default RealTimeChat;
