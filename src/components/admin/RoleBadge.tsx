import { cn } from "@/lib/utils";

interface RoleBadgeProps {
    role: string;
}

export default function RoleBadge({ role }: RoleBadgeProps) {
    const config: Record<string, { label: string; className: string }> = {
        ADMIN: {
            label: "Master Administrator",
            className: "bg-[#0F172A] text-[#22D3EE] border-[#22D3EE]/30"
        },
        EDITOR: {
            label: "Senior Editor",
            className: "bg-slate-100 text-slate-900 border-slate-200 dark:bg-white/5 dark:text-slate-300 dark:border-white/10"
        },
        AUTHOR: {
            label: "Strategic Analyst",
            className: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
        },
        GUEST: {
            label: "Institutional Guest",
            className: "bg-slate-50 text-slate-500 border-slate-100 dark:bg-white/5 dark:text-slate-500 dark:border-white/5"
        }
    };

    const style = config[role] || config.GUEST;

    return (
        <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
            style.className
        )}>
            {style.label}
        </span>
    );
}
