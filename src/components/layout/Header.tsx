import SettingsDrawer from "@/components/SettingsDrawer";
import { Button } from "@/components/ui/button";
// import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import SettingsIcon from "@mui/icons-material/Settings";
import { LogOut, Menu, User } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  // const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [settingsOpen, setSettingsOpen] = useState(false);

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
            {/* Theme Toggle */}
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="relative"
            >
              <Sun
                className={`h-5 w-5 transition-all ${
                  theme === "dark"
                    ? "-rotate-90 scale-0"
                    : "rotate-0 scale-100"
                }`}
              />
              <Moon
                className={`absolute h-5 w-5 transition-all ${
                  theme === "dark"
                    ? "rotate-0 scale-100"
                    : "rotate-90 scale-0"
                }`}
              />
            </Button> */}

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
