import React, { createContext, useContext } from "react"
import ReactDOM from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type SideDrawerSize = "sm" | "md" | "lg" | "xl" | "full"

interface SideDrawerContextValue {
    open: boolean
    onOpenChange?: (open: boolean) => void
}

const SideDrawerContext = createContext<SideDrawerContextValue>({
    open: false,
})

export interface SideDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
    open,
    onOpenChange,
    children,
}) => {
    return (
        <SideDrawerContext.Provider value={{ open, onOpenChange }}>
            {children}
        </SideDrawerContext.Provider>
    )
}

export const SideDrawerTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
    const { onOpenChange } = useContext(SideDrawerContext)
    return (
        <button
            ref={ref}
            onClick={(event) => {
                onClick?.(event)
                onOpenChange?.(true)
            }}
            {...props}
        />
    )
})
SideDrawerTrigger.displayName = "SideDrawerTrigger"

const SideDrawerPortal = ({ children }: { children: React.ReactNode }) => {
    if (typeof document === "undefined") return null
    return ReactDOM.createPortal(children, document.body)
}

export const SideDrawerOverlay = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out",
            className
        )}
        {...props}
    />
))
SideDrawerOverlay.displayName = "SideDrawerOverlay"

export interface SideDrawerContentProps
    extends React.HTMLAttributes<HTMLDivElement> {
    title?: string
    description?: string
    footer?: React.ReactNode
    size?: SideDrawerSize
    side?: "right" | "left"
    hideClose?: boolean
}

const sizeClassMap: Record<SideDrawerSize, string> = {
    sm: "sm:max-w-md",
    md: "sm:max-w-xl",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl",
    full: "sm:max-w-5xl",
}

export const SideDrawerContent = React.forwardRef<
    HTMLDivElement,
    SideDrawerContentProps
>(
    (
        {
            className,
            children,
            title,
            description,
            footer,
            size = "md",
            side = "right",
            hideClose,
            ...props
        },
        ref
    ) => {
        const { open, onOpenChange } = useContext(SideDrawerContext)

        if (!open) return null

        const sideClass =
            side === "right"
                ? "right-0 translate-x-0"
                : "left-0 translate-x-0"

        return (
            <SideDrawerPortal>
                <SideDrawerOverlay
                    data-state={open ? "open" : "closed"}
                    onClick={() => onOpenChange?.(false)}
                />
                <div
                    className={cn(
                        "fixed inset-y-0 z-50 flex w-full justify-end",
                        side === "left" && "justify-start"
                    )}
                >
                    <div
                        ref={ref}
                        data-state={open ? "open" : "closed"}
                        className={cn(
                            "pointer-events-auto relative flex h-full w-full transform flex-col border-l bg-background shadow-2xl transition-transform duration-300 ease-in-out sm:rounded-l-2xl",
                            sizeClassMap[size],
                            side === "left"
                                ? "border-l-0 border-r sm:rounded-l-none sm:rounded-r-2xl"
                                : "",
                            sideClass,
                            className
                        )}
                        {...props}
                    >
                        {(title || description || !hideClose) && (
                            <div className="flex items-start justify-between gap-3 border-b p-4">
                                <div className="space-y-1">
                                    {title && (
                                        <h3 className="text-lg font-semibold leading-6">
                                            {title}
                                        </h3>
                                    )}
                                    {description && (
                                        <p className="text-sm text-muted-foreground">
                                            {description}
                                        </p>
                                    )}
                                </div>
                                {!hideClose && (
                                    <button
                                        className="rounded-md p-2 text-muted-foreground transition hover:bg-muted"
                                        onClick={() => onOpenChange?.(false)}
                                    >
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Close</span>
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto p-4">
                            {children}
                        </div>

                        {footer && (
                            <div className="border-t bg-muted/40 p-4">
                                {footer}
                            </div>
                        )}
                    </div>
                </div>
            </SideDrawerPortal>
        )
    }
)
SideDrawerContent.displayName = "SideDrawerContent"

export const SideDrawerClose = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
    const { onOpenChange } = useContext(SideDrawerContext)
    return (
        <button
            ref={ref}
            onClick={(event) => {
                props.onClick?.(event)
                onOpenChange?.(false)
            }}
            {...props}
        />
    )
})
SideDrawerClose.displayName = "SideDrawerClose"

/**
 * Updated Sidebar Component with Role-Based Filtering
 * Works with your existing SideDrawer and sidebar config
 */

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getFilteredSidebarGroups } from '../../config/sidebar.config';

export function Sidebar() {
    const location = useLocation();
    const [expandedGroups, setExpandedGroups] = useState<string[]>(['Dashboard']);

    // Get user type from localStorage
    const getUserType = () => {
        try {
            const user = JSON.parse(localStorage.getItem('kumss_user') || '{}');
            return user.user_type || user.userType || 'student';
        } catch {
            return 'student';
        }
    };

    const userType = getUserType();

    // Get filtered sidebar based on role
    const sidebarGroups = getFilteredSidebarGroups(userType);

    const toggleGroup = (groupName: string) => {
        setExpandedGroups(prev =>
            prev.includes(groupName)
                ? prev.filter(g => g !== groupName)
                : [...prev, groupName]
        );
    };

    return (
        <aside className="w-64 bg-card border-r h-full overflow-y-auto">
            {/* Logo */}
            <div className="p-6 border-b">
                <h2 className="text-xl font-bold">KUMSS ERP</h2>
                <p className="text-xs text-muted-foreground mt-1 capitalize">
                    {userType.replace('_', ' ')} Portal
                </p>
            </div>

            {/* Navigation */}
            <nav className="p-3">
                {sidebarGroups.map((group) => (
                    <div key={group.group} className="mb-2">
                        {/* Group Header */}
                        <button
                            onClick={() => toggleGroup(group.group)}
                            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent rounded-md transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <group.icon className="h-4 w-4" />
                                <span>{group.group}</span>
                            </div>
                            <ChevronDown
                                className={cn(
                                    'h-4 w-4 transition-transform',
                                    expandedGroups.includes(group.group) ? 'rotate-180' : ''
                                )}
                            />
                        </button>

                        {/* Group Items */}
                        {expandedGroups.includes(group.group) && (
                            <div className="mt-1 ml-4 space-y-1">
                                {group.items.map((item) => {
                                    const isActive = location.pathname === item.href;

                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            className={cn(
                                                'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
                                                isActive
                                                    ? 'bg-primary text-primary-foreground font-medium'
                                                    : 'hover:bg-accent'
                                            )}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* User Info at Bottom */}
            <div className="p-4 border-t mt-auto">
                <div className="text-xs text-muted-foreground">
                    Logged in as: <span className="font-medium capitalize">{userType.replace('_', ' ')}</span>
                </div>
            </div>
        </aside>
    );
}
