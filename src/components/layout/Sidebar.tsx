import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { SIDEBAR_GROUPS } from "@/config/sidebar.config"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export const Sidebar = () => {
  const location = useLocation()
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  return (
    <aside className="w-64 h-screen border-r bg-background overflow-y-auto">
      <div className="p-4 font-bold text-lg">Admin Panel</div>

      {SIDEBAR_GROUPS.map((group) => {
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
