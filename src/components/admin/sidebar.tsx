"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Users,
    Map,
    LayoutDashboard,
    Settings,
    LogOut,
    ChevronRight,
    ShieldCheck,
    FileText,
    Image as ImageIcon,
    FileEdit,
    UserCheck,
    Layers,
    BarChart3,
    History,
    Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const GROUPS = [
    {
        name: "Management",
        items: [
            { name: "Cockpit", icon: LayoutDashboard, href: "/admin/" },
        ]
    },
    {
        name: "Content",
        items: [
            { name: "Articles", icon: FileText, href: "/admin/articles/" },
            { name: "Drafts", icon: FileEdit, href: "/admin/drafts/" },
            { name: "Media Library", icon: ImageIcon, href: "/admin/media/" },
        ]
    },
    {
        name: "Identity",
        items: [
            { name: "Authors", icon: Users, href: "/admin/authors/" },
            { name: "Contributors", icon: UserCheck, href: "/admin/contributors/" },
        ]
    },
    {
        name: "Structure",
        items: [
            { name: "Categories", icon: Map, href: "/admin/categories/" },
            { name: "Navigation", icon: Layers, href: "/admin/navigation/" },
        ]
    },
    {
        name: "System",
        items: [
            { name: "Analytics", icon: BarChart3, href: "/admin/analytics/" },
            { name: "Audit Logs", icon: History, href: "/admin/logs/" },
            { name: "Settings", icon: Settings, href: "/admin/settings/" },
        ]
    }
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen sticky top-0 bg-[#F8FAFC] dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-300 overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 mb-4 bg-white dark:bg-[#0F172A]">
                <div className="flex items-center space-x-2.5">
                    <div className="bg-slate-900 dark:bg-white p-1.5 rounded-lg">
                        <ShieldCheck className="h-5 w-5 text-white dark:text-slate-900" />
                    </div>
                    <span className="font-bold tracking-tight text-lg text-slate-900 dark:text-white">
                        ADMIN <span className="text-slate-500 font-medium">WORKSPACE</span>
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 pb-6 space-y-8">
                {GROUPS.map((group) => (
                    <div key={group.name} className="space-y-1">
                        <h3 className="px-2 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                            {group.name}
                        </h3>
                        {group.items.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between group px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                                        isActive
                                            ? "bg-white dark:bg-white/5 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10"
                                            : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center space-x-3">
                                        <item.icon className={cn(
                                            "h-4 w-4 transition-colors",
                                            isActive ? "text-slate-900 dark:text-white" : "group-hover:text-slate-900 dark:group-hover:text-white"
                                        )} />
                                        <span>{item.name}</span>
                                    </div>
                                    {isActive && <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A]">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-semibold text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Exit Workspace</span>
                </button>
            </div>
        </aside>
    );
}
