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
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const MENU_ITEMS = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin/" },
    { name: "Authors", icon: Users, href: "/admin/authors/" },
    { name: "Categories", icon: Map, href: "/admin/categories/" },
    { name: "Settings", icon: Settings, href: "/admin/settings/" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-72 h-screen sticky top-0 bg-white dark:bg-[#0D1425] border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 transition-colors duration-300">
            <div className="flex items-center space-x-3 mb-10 px-2">
                <div className="bg-accent-red p-1.5 rounded-lg shadow-lg shadow-accent-red/20">
                    <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <span className="font-black tracking-tighter text-xl uppercase italic">
                    Admin <span className="text-accent-red">Hub</span>
                </span>
            </div>

            <nav className="flex-1 space-y-1.5">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between group px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                                isActive
                                    ? "bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon className={cn(
                                    "h-5 w-5 transition-colors",
                                    isActive ? "text-accent-red" : "group-hover:text-accent-red"
                                )} />
                                <span>{item.name}</span>
                            </div>
                            <ChevronRight className={cn(
                                "h-4 w-4 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0",
                                isActive && "opacity-100 translate-x-0"
                            )} />
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-bold text-slate-500 hover:text-accent-red hover:bg-accent-red/5 rounded-xl transition-all"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Terminate Session</span>
                </button>
            </div>
        </aside>
    );
}
