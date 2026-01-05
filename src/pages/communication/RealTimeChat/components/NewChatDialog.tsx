
import api from "@/api/apiClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_ENDPOINTS } from "@/config/api.config";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

// Basic user type for selection
interface SelectableUser {
    id: string; // or number depending on your backend
    username: string;
    first_name: string;
    last_name: string;
    full_name: string; // Add full_name
}

interface NewChatDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUserSelect: (user: any) => void;
}

export const NewChatDialog = ({ open, onOpenChange, onUserSelect }: NewChatDialogProps) => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<SelectableUser[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch users when dialog opens
    useEffect(() => {
        if (open) {
            fetchUsers("");
        }
    }, [open]);

    const fetchUsers = async (query: string) => {
        setLoading(true);
        try {
            // Using the users list endpoint. You might need to adjust params for search
            const response = await api.get(API_ENDPOINTS.users.list, {
                params: { search: query, page_size: 20 }
            });
            // Adjust based on your actual API response structure (e.g. response.data.results)
            setUsers(response.data.results || response.data || []);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        // Debounce could be added here
        fetchUsers(val);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden bg-white">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>New Chat</DialogTitle>
                </DialogHeader>

                <div className="p-4 border-b bg-gray-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search users..."
                            className="pl-9 bg-white border-gray-200"
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <ScrollArea className="h-[400px]">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
                    ) : users.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">No users found</div>
                    ) : (
                        <div className="flex flex-col">
                            {users.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => {
                                        onUserSelect(user);
                                        onOpenChange(false);
                                    }}
                                    className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-0"
                                >
                                    <Avatar className="w-10 h-10 border">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
                                        <AvatarFallback>{(user.first_name?.[0] || user.username?.[0])?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {user.full_name || `${user.first_name} ${user.last_name}` || user.username}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {user.username}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
