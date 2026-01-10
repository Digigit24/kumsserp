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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useApprovalNotifications, useApprovalNotificationUnreadCount, useMarkNotificationAsRead } from "@/hooks/useApprovals";
import { useCollegeContext } from "@/contexts/HierarchicalContext";
import { usePermissions } from "@/contexts/PermissionsContext";
import { useContextColleges } from "@/hooks/useContextSelectors";
import SettingsIcon from "@mui/icons-material/Settings";
import { LogOut, Menu, User, Bell, ArrowRight, CheckCheck, FileText, Clock, Building2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ApprovalNotification } from "@/types/approvals.types";

interface HeaderProps {
  toggleSidebar: () => void;
}

// Priority color mapping
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'destructive';
    case 'high':
      return 'default';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'secondary';
  }
};

// Get icon for notification type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'approval':
    case 'approval_request':
      return <FileText className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // College context for global college selector
  const { selectedCollege, setSelectedCollege, colleges, isLoadingColleges } = useCollegeContext();
  const { permissions } = usePermissions();

  // Fetch colleges (hook updates context automatically)
  useContextColleges();

  // Fetch approval notifications
  const { data: approvalNotificationsData } = useApprovalNotifications({ page_size: 50 });
  const { data: approvalUnreadCountData } = useApprovalNotificationUnreadCount();
  const markNotificationAsReadMutation = useMarkNotificationAsRead();

  const notifications = approvalNotificationsData?.results || [];
  const unreadCount = approvalUnreadCountData?.unread_count || 0;

  const handleCollegeChange = (value: string) => {
    const collegeId = value ? Number(value) : null;
    setSelectedCollege(collegeId);
  };

  const handleNotificationClick = async (notification: ApprovalNotification) => {
    // Mark notification as read via API
    try {
      await markNotificationAsReadMutation.mutateAsync(notification.id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }

    // Navigate to approval detail page
    navigate(`/approvals/${notification.approval_request}`);
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

          {/* Middle - Global College Selector */}
          {permissions?.canChooseCollege && (
            <div className="flex-1 max-w-xs mx-4 hidden md:block">
              <Select
                value={selectedCollege ? String(selectedCollege) : undefined}
                onValueChange={handleCollegeChange}
                disabled={isLoadingColleges}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder={isLoadingColleges ? 'Loading colleges...' : 'Select College'} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem key={college.id} value={String(college.id)}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
                            !notification.is_read && "bg-accent/50"
                          )}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start gap-3 w-full">
                            <span className="text-2xl flex-shrink-0">
                              {getNotificationIcon(notification.request_type)}
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
                                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                </span>
                                <span className="text-xs text-primary font-medium flex items-center gap-1">
                                  Review
                                  <ArrowRight className="h-3 w-3" />
                                </span>
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
