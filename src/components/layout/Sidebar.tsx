import React, { useState } from 'react';
import {
  Home,
  Settings,
  X,
  Building2,
  Calendar,
  GraduationCap,
  PartyPopper,
  CalendarOff,
  Cog,
  Bell,
  History,
  ChevronDown,
  ChevronRight,
  Users,
  Shield,
  UserCog,
  Building,
  UserCircle,
  School,
  Grid,
  UserPlus,
  MapPin,
  FileText,
  Heart,
  BookOpen,
  TrendingUp,
  Award,
  CreditCard,
  Bug
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
}

interface NavigationGroup {
  name: string;
  icon: any;
  items: NavigationItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [coreModuleOpen, setCoreModuleOpen] = useState(true);
  const [accountsModuleOpen, setAccountsModuleOpen] = useState(true);
  const [studentsModuleOpen, setStudentsModuleOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
  ];

  const coreModuleNavigation: NavigationGroup = {
    name: 'Core Module',
    icon: Building2,
    items: [
      { name: 'Colleges', href: '/core/colleges', icon: Building2 },
      { name: 'Academic Years', href: '/core/academic-years', icon: Calendar },
      { name: 'Academic Sessions', href: '/core/academic-sessions', icon: GraduationCap },
      { name: 'Holidays', href: '/core/holidays', icon: PartyPopper },
      { name: 'Weekends', href: '/core/weekends', icon: CalendarOff },
      { name: 'System Settings', href: '/core/system-settings', icon: Cog },
      { name: 'Notification Settings', href: '/core/notification-settings', icon: Bell },
      { name: 'Activity Logs', href: '/core/activity-logs', icon: History },
    ]
  };

  const accountsModuleNavigation: NavigationGroup = {
    name: 'Accounts Module',
    icon: Users,
    items: [
      { name: 'Users', href: '/accounts/users', icon: Users },
      { name: 'Roles', href: '/accounts/roles', icon: Shield },
      { name: 'User Roles', href: '/accounts/user-roles', icon: UserCog },
      { name: 'Departments', href: '/accounts/departments', icon: Building },
      { name: 'User Profiles', href: '/accounts/user-profiles', icon: UserCircle },
    ]
  };

  const studentsModuleNavigation: NavigationGroup = {
    name: 'Students Module',
    icon: School,
    items: [
      { name: 'Students', href: '/students/list', icon: School },
      { name: 'Categories', href: '/students/categories', icon: Grid },
      { name: 'Groups', href: '/students/groups', icon: Users },
     
    ]
  };

  const bottomNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Debug', href: '/debug', icon: Bug },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen transition-transform duration-300 ease-in-out",
          "bg-card border-r border-border",
          "lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full w-64">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {/* Main Navigation */}
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setIsOpen(false);
                    }
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}

            {/* Core Module Section */}
            <div className="pt-2">
              <button
                onClick={() => setCoreModuleOpen(!coreModuleOpen)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Building2 className="h-5 w-5" />
                <span className="flex-1 text-left">{coreModuleNavigation.name}</span>
                {coreModuleOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* Core Module Items */}
              {coreModuleOpen && (
                <div className="mt-1 space-y-1">
                  {coreModuleNavigation.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 pl-11 pr-3 py-2 rounded-md text-sm transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            setIsOpen(false);
                          }
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Accounts Module Section */}
            <div className="pt-2">
              <button
                onClick={() => setAccountsModuleOpen(!accountsModuleOpen)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Users className="h-5 w-5" />
                <span className="flex-1 text-left">{accountsModuleNavigation.name}</span>
                {accountsModuleOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* Accounts Module Items */}
              {accountsModuleOpen && (
                <div className="mt-1 space-y-1">
                  {accountsModuleNavigation.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 pl-11 pr-3 py-2 rounded-md text-sm transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            setIsOpen(false);
                          }
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Students Module Section */}
            <div className="pt-2">
              <button
                onClick={() => setStudentsModuleOpen(!studentsModuleOpen)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <School className="h-5 w-5" />
                <span className="flex-1 text-left">{studentsModuleNavigation.name}</span>
                {studentsModuleOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* Students Module Items */}
              {studentsModuleOpen && (
                <div className="mt-1 space-y-1">
                  {studentsModuleNavigation.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 pl-11 pr-3 py-2 rounded-md text-sm transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            setIsOpen(false);
                          }
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Navigation */}
            <div className="pt-2 mt-2 border-t border-border">
              {bottomNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setIsOpen(false);
                      }
                    }}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Version 1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
