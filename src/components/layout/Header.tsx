import SettingsDrawer from "@/components/SettingsDrawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import { useApprovalNotifications, useApprovalNotificationUnreadCount, useMarkNotificationAsRead } from "@/hooks/useApprovals";
import SettingsIcon from "@mui/icons-material/Settings";
import { LogOut, Menu, User, Bell, ArrowRight, CheckCheck } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  getNotificationsByRole,
  getUnreadCount,
  getPriorityColor,
  getNotificationIcon,
  formatTimestamp,
  type UserRole,
  type Notification,
} from "@/data/notificationsMockData";
import { formatDistanceToNow } from "date-fns";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  // const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch approval notifications
  const { data: approvalNotificationsData } = useApprovalNotifications({ page_size: 50 });
  const { data: approvalUnreadCountData } = useApprovalNotificationUnreadCount();
  const markNotificationAsReadMutation = useMarkNotificationAsRead();

  // Get user role
  const getUserRole = (): UserRole => {
    const storedUser = localStorage.getItem('kumss_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        return userData.user_type || 'college_admin';
      } catch {
        return 'college_admin';
      }
    }
    return 'college_admin';
  };

  // Load notifications based on user role and merge with approval notifications
  React.useEffect(() => {
    const userRole = getUserRole();
    const mockNotifications = getNotificationsByRole(userRole, false); // Only unread

    // Convert approval notifications to Notification format
    const approvalNotifications: Notification[] = (approvalNotificationsData?.results || [])
      .filter(n => !n.is_read)
      .map(approval => ({
        id: `approval-${approval.id}`,
        type: 'approval' as const,
        priority: approval.priority,
        title: approval.title,
        message: approval.message,
        timestamp: approval.created_at,
        read: approval.is_read,
        actionUrl: `/approvals/${approval.approval_request}`,
        actionText: 'Review',
        roles: ['super_admin', 'college_admin'] as UserRole[],
        metadata: approval.metadata,
        _approvalId: approval.id, // Store original approval notification ID
      }));

    // Merge notifications
    const allNotifications = [...approvalNotifications, ...mockNotifications];
    setNotifications(allNotifications);

    // Calculate total unread count
    const mockUnreadCount = getUnreadCount(userRole);
    const approvalUnreadCount = approvalUnreadCountData?.unread_count || 0;
    setUnreadCount(mockUnreadCount + approvalUnreadCount);
  }, [approvalNotificationsData, approvalUnreadCountData]);

  const handleNotificationClick = async (notification: Notification & { _approvalId?: number }) => {
    // If it's an approval notification, mark it as read via API
    if (notification._approvalId) {
      try {
        await markNotificationAsReadMutation.mutateAsync(notification._approvalId);
      } catch (error) {
        console.error('Failed to mark approval notification as read:', error);
      }
    } else {
      // Mark mock notifications as read locally
      setNotifications(notifications.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const markAllAsRead = () => {
    // Mark mock notifications as read
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    // Note: For approval notifications, we'd need a bulk mark as read endpoint
    // For now, they'll be marked as read when clicked individually
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>

            <h1 className="text-xl font-semibold hidden sm:block">
              Dashboard
            </h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[380px] max-w-[calc(100vw-2rem)]">
                <div className="flex items-center justify-between px-3 py-2">
                  <DropdownMenuLabel className="p-0">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({unreadCount} unread)
                      </span>
                    )}
                  </DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={markAllAsRead}
                    >
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Mark all read
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[400px]">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Bell className="h-12 w-12 text-muted-foreground/50 mb-2" />
                      <p className="text-sm text-muted-foreground">No new notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-1 p-1">
                      {notifications.map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className={cn(
                            "flex flex-col items-start gap-2 p-3 cursor-pointer",
                            !notification.read && "bg-accent/50"
                          )}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3 w-full">
                            <span className="text-2xl flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="flex-1 space-y-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium leading-tight">
                                  {notification.title}
                                </p>
                                <Badge
                                  variant={getPriorityColor(notification.priority) as any}
                                  className="text-xs flex-shrink-0"
                                >
                                  {notification.priority}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {formatTimestamp(notification.timestamp)}
                                </span>
                                {notification.actionText && (
                                  <span className="text-xs text-primary font-medium flex items-center gap-1">
                                    {notification.actionText}
                                    <ArrowRight className="h-3 w-3" />
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              title="Settings"
            >
              <SettingsIcon fontSize="small" />
            </Button>

            {/* User */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {user?.username || user?.email || "User"}
              </span>
            </div>

            {/* Logout */}
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* SETTINGS DRAWER (IMPORTANT: OUTSIDE HEADER DOM) */}
      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};
