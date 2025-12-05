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

