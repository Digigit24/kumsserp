import { useState, useMemo } from "react"
import { Link, useLocation } from "react-router-dom"
import { getFilteredSidebarGroups } from "@/config/sidebar.config"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

export const Sidebar = () => {
  const location = useLocation()
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const { user } = useAuth()

  // Get user type from auth store or localStorage
  const userType = useMemo(() => {
    if (user?.user_type) return user.user_type

    try {
      const storedUser = JSON.parse(localStorage.getItem('kumss_user') || '{}')
      return storedUser.user_type || storedUser.userType || 'student'
    } catch {
      return 'student'
    }
  }, [user])

  // Get user permissions from auth store or localStorage
  const userPermissions = useMemo(() => {
    // First check if user object has permissions from backend
    if (user?.permissions && Array.isArray(user.permissions)) {
      return user.permissions
    }

    // Try to get from localStorage
    try {
      const storedUser = JSON.parse(localStorage.getItem('kumss_user') || '{}')
      if (storedUser.permissions && Array.isArray(storedUser.permissions)) {
        return storedUser.permissions
      }
    } catch {
      // Ignore parse errors
    }

    // No permissions found - return empty array
    // The sidebar will fallback to role-based filtering
    return []
  }, [user])

  // Filter sidebar groups based on user type AND permissions
  const filteredGroups = useMemo(() => {
    return getFilteredSidebarGroups(userType, userPermissions)
  }, [userType, userPermissions])

  // Determine panel title based on user type
  const panelTitle = useMemo(() => {
    if (userType === 'teacher') return 'Teacher Portal'
    if (userType === 'student') return 'Student Portal'
    if (userType === 'college_admin') return 'College Admin'
    if (userType === 'super_admin') return 'Super Admin'
    if (userType === 'parent') return 'Parent Portal'
    return 'Portal'
  }, [userType])

  return (
    <aside className="w-64 h-screen border-r bg-background overflow-y-auto">
      <div className="p-4 font-bold text-lg">{panelTitle}</div>

      {filteredGroups.map((group) => {
        const GroupIcon = group.icon
        const isOpen = openGroup === group.group

        return (
          <div key={group.group}>
            <button
              onClick={() => setOpenGroup(isOpen ? null : group.group)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted"
            >
              <GroupIcon className="h-5 w-5" />
              <span className="flex-1 text-left">{group.group}</span>
              {isOpen ? <ChevronDown /> : <ChevronRight />}
            </button>

            {isOpen && (
              <div className="ml-8 space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = location.pathname === item.href

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm rounded",
                        active && "bg-primary text-primary-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </aside>
  )
}
