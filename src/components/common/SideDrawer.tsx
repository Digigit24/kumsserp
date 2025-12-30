import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import ReactDOM from "react-dom"
import { X, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

type SideDrawerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full"

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

// Size to pixel mapping
const SIZE_MAP: Record<SideDrawerSize, number> = {
    sm: 384,
    md: 512,
    lg: 672,
    xl: 768,
    "2xl": 896,
    full: 1200,
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
            "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out",
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
    resizable?: boolean
    minWidth?: number
    maxWidth?: number
    storageKey?: string
    showBackButton?: boolean
    mode?: "view" | "edit" | "create"
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
            size = "lg",
            side = "right",
            hideClose,
            resizable = true,
            minWidth = 320,
            maxWidth = 1200,
            storageKey,
            showBackButton = true,
            mode,
            ...props
        },
        ref
    ) => {
        const { open, onOpenChange } = useContext(SideDrawerContext)

        // Get storage key with fallback
        const effectiveStorageKey = storageKey || `sidedrawer-width-${title?.toLowerCase().replace(/\s+/g, '-') || 'default'}`

        // Initialize width from localStorage or default size
        const [drawerWidth, setDrawerWidth] = useState<number>(() => {
            if (typeof window === "undefined") return SIZE_MAP[size]

            try {
                const saved = localStorage.getItem(effectiveStorageKey)
                if (saved) {
                    const parsed = parseInt(saved, 10)
                    if (parsed >= minWidth && parsed <= maxWidth) {
                        return parsed
                    }
                }
            } catch (e) {
                console.warn("Failed to load drawer width from localStorage:", e)
            }

            return SIZE_MAP[size]
        })

        const [isResizing, setIsResizing] = useState(false)
        const [isMobile, setIsMobile] = useState(false)

        // Detect mobile
        useEffect(() => {
            const checkMobile = () => {
                setIsMobile(window.innerWidth < 640)
            }

            checkMobile()
            window.addEventListener("resize", checkMobile)
            return () => window.removeEventListener("resize", checkMobile)
        }, [])

        // Save width to localStorage
        const saveWidth = useCallback((width: number) => {
            try {
                localStorage.setItem(effectiveStorageKey, width.toString())
            } catch (e) {
                console.warn("Failed to save drawer width to localStorage:", e)
            }
        }, [effectiveStorageKey])

        // Handle resize
        const handleMouseDown = useCallback((e: React.MouseEvent) => {
            if (!resizable || isMobile) return

            e.preventDefault()
            setIsResizing(true)

            const startX = e.clientX
            const startWidth = drawerWidth

            const handleMouseMove = (e: MouseEvent) => {
                const delta = startX - e.clientX
                const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + delta))
                setDrawerWidth(newWidth)
            }

            const handleMouseUp = () => {
                setIsResizing(false)
                saveWidth(drawerWidth)
                document.removeEventListener("mousemove", handleMouseMove)
                document.removeEventListener("mouseup", handleMouseUp)
            }

            document.addEventListener("mousemove", handleMouseMove)
            document.addEventListener("mouseup", handleMouseUp)
        }, [resizable, isMobile, drawerWidth, minWidth, maxWidth, saveWidth])

        if (!open) return null

        const sideClass = side === "right" ? "right-0" : "left-0"

        return (
            <SideDrawerPortal>
                <SideDrawerOverlay
                    data-state={open ? "open" : "closed"}
                    onClick={() => onOpenChange?.(false)}
                />
                <div
                    className={cn(
                        "fixed inset-y-0 z-50 flex w-full",
                        side === "right" ? "justify-end" : "justify-start"
                    )}
                >
                    <div
                        ref={ref}
                        data-state={open ? "open" : "closed"}
                        className={cn(
                            "pointer-events-auto relative flex h-full transform flex-col",
                            "bg-white/95 dark:bg-gray-950/95",
                            "backdrop-blur-xl backdrop-saturate-200",
                            "border-l border-white/20 dark:border-white/10",
                            "shadow-2xl shadow-black/10",
                            "transition-transform duration-300 ease-out",
                            side === "left" && "border-l-0 border-r border-white/20 dark:border-white/10",
                            sideClass,
                            className
                        )}
                        style={{
                            width: isMobile ? "100%" : `${drawerWidth}px`,
                            maxWidth: isMobile ? "100%" : `${drawerWidth}px`,
                            transition: isResizing ? "none" : "transform 0.3s ease-out",
                        }}
                        {...props}
                    >
                        {/* Resize Handle */}
                        {resizable && !isMobile && (
                            <div
                                className={cn(
                                    "absolute top-0 bottom-0 w-1.5 cursor-col-resize z-50",
                                    "hover:bg-primary/30 active:bg-primary/50",
                                    "transition-colors duration-200",
                                    "group",
                                    side === "right" ? "left-0" : "right-0",
                                    isResizing && "bg-primary/50"
                                )}
                                onMouseDown={handleMouseDown}
                            >
                                <div className={cn(
                                    "absolute top-1/2 -translate-y-1/2 w-1.5 h-20",
                                    "bg-gradient-to-b from-primary/60 to-primary/40",
                                    "rounded-full opacity-0 group-hover:opacity-100",
                                    "transition-opacity duration-200",
                                    side === "right" ? "left-0" : "right-0"
                                )} />
                            </div>
                        )}

                        {/* Enhanced Header */}
                        {(title || description || !hideClose) && (
                            <div className={cn(
                                "flex-shrink-0 border-b border-white/20 dark:border-white/10",
                                "bg-gradient-to-r from-white/60 to-white/40",
                                "dark:from-gray-950/60 dark:to-gray-900/40",
                                "backdrop-blur-sm"
                            )}>
                                <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-start justify-between gap-3">
                                    {/* Left Side: Back/Close + Title */}
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        {/* Close/Back Button */}
                                        {!hideClose && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => onOpenChange?.(false)}
                                                className={cn(
                                                    "h-8 w-8 flex-shrink-0 rounded-xl",
                                                    "hover:bg-gradient-to-br hover:from-primary/10 hover:to-purple-500/10",
                                                    "dark:hover:from-primary/20 dark:hover:to-purple-500/20",
                                                    "hover:shadow-lg hover:shadow-primary/20",
                                                    "transition-all duration-300 hover:scale-110 active:scale-95"
                                                )}
                                            >
                                                {showBackButton && isMobile ? (
                                                    <ChevronLeft className="h-4 w-4" />
                                                ) : (
                                                    <X className="h-4 w-4" />
                                                )}
                                            </Button>
                                        )}

                                        {/* Title Section */}
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {title && (
                                                    <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                                        {title}
                                                    </h3>
                                                )}

                                                {mode && (
                                                    <span
                                                        className={cn(
                                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                                            "ring-1 ring-inset backdrop-blur-sm",
                                                            mode === "create" &&
                                                                "bg-green-50/80 text-green-700 ring-green-600/30 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/30",
                                                            mode === "edit" &&
                                                                "bg-blue-50/80 text-blue-700 ring-blue-600/30 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/30",
                                                            mode === "view" &&
                                                                "bg-gray-50/80 text-gray-700 ring-gray-600/30 dark:bg-gray-500/10 dark:text-gray-400 dark:ring-gray-500/30"
                                                        )}
                                                    >
                                                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                                    </span>
                                                )}
                                            </div>

                                            {description && (
                                                <p className="text-xs sm:text-sm text-muted-foreground">
                                                    {description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content Area with ScrollArea */}
                        <ScrollArea className="flex-1">
                            <div className="px-4 sm:px-6 py-4 sm:py-6">
                                {children}
                            </div>
                        </ScrollArea>

                        {/* Enhanced Footer */}
                        {footer && (
                            <div className={cn(
                                "flex-shrink-0 border-t border-white/20 dark:border-white/10",
                                "bg-gradient-to-r from-white/60 to-white/40",
                                "dark:from-gray-950/60 dark:to-gray-900/40",
                                "backdrop-blur-sm"
                            )}>
                                <div className="px-4 sm:px-6 py-3 sm:py-4">
                                    {footer}
                                </div>
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
