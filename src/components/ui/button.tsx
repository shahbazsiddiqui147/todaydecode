import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const Button = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean; variant?: "default" | "outline" | "ghost" | "danger" }
>(({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
        <Comp
            className={cn(
                "inline-flex items-center justify-center rounded-xl text-sm font-bold ring-offset-white transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 px-5 py-2.5",
                variant === "default" && "bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-white dark:text-slate-900 dark:hover:bg-white/90 shadow-sm",
                variant === "outline" && "border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-900 dark:text-white",
                variant === "ghost" && "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white",
                variant === "danger" && "bg-accent-red/10 text-accent-red hover:bg-accent-red/20 border border-accent-red/20",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button }
