"use client";

import { useState } from "react";
import { updateUserRole } from "@/lib/actions/admin-actions";
import {
    ChevronDown,
    UserCheck,
    ShieldAlert,
    UserPlus,
    UserMinus,
    Loader2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserRoleActionsProps {
    userId: string;
    currentRole: string;
}

export default function UserRoleActions({ userId, currentRole }: UserRoleActionsProps) {
    const [loading, setLoading] = useState(false);

    const roles = [
        { id: "ADMIN", label: "Master Administrator", icon: ShieldAlert },
        { id: "EDITOR", label: "Senior Editor", icon: UserCheck },
        { id: "AUTHOR", label: "Strategic Analyst / Fellow", icon: UserPlus },
        { id: "GUEST", label: "Institutional Guest", icon: UserMinus },
    ];

    const handleRoleUpdate = async (newRole: any) => {
        if (newRole === currentRole) return;

        setLoading(true);
        try {
            const result = await updateUserRole(userId, newRole);
            if (result.success) {
                toast.success(`Personnel clearance calibrated to ${newRole}`);
            } else {
                toast.error(result.error || "Calibration failed.");
            }
        } catch (error) {
            toast.error("Institutional link severed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={loading}
                    className="h-9 px-4 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-[#1E293B] rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-600 dark:text-slate-400 group"
                >
                    {loading ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    ) : (
                        <ChevronDown className="h-3 w-3 mr-2 group-hover:translate-y-0.5 transition-transform" />
                    )}
                    Calibrate Clearance
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-[#0D1425] border-slate-200 dark:border-[#1E293B] rounded-2xl shadow-2xl p-2">
                <div className="px-3 py-2 mb-1 border-b border-slate-100 dark:border-[#1E293B]">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Select Access Tier</span>
                </div>
                {roles.map((role) => (
                    <DropdownMenuItem
                        key={role.id}
                        onClick={() => handleRoleUpdate(role.id)}
                        disabled={loading || role.id === currentRole}
                        className={cn(
                            "flex items-center space-x-3 px-3 py-2.5 rounded-xl cursor-not-allowed transition-colors",
                            role.id === currentRole
                                ? "bg-slate-50 dark:bg-white/5 opacity-50"
                                : "cursor-pointer hover:bg-slate-50 dark:hover:bg-white/10"
                        )}
                    >
                        <role.icon className={cn(
                            "h-4 w-4",
                            role.id === 'ADMIN' ? 'text-[#22D3EE]' : 'text-slate-500'
                        )} />
                        <span className="text-xs font-black uppercase tracking-tight text-slate-700 dark:text-slate-300">
                            {role.label}
                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Minimal cn implementation to avoid import issues if utils.ts is missing
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
