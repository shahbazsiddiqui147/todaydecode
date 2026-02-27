"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Globe,
    TrendingUp,
    ShieldAlert,
    Cpu,
    Zap,
    LayoutDashboard,
    Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Geopolitics", href: "/geopolitics/", icon: Globe },
    { name: "Global Economy", href: "/economy/", icon: TrendingUp },
    { name: "Security", href: "/security/", icon: ShieldAlert },
    { name: "Technology", href: "/technology/", icon: Cpu },
    { name: "Energy", href: "/energy/", icon: Zap },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex w-64 flex-col bg-primary border-r border-border-slate">
            <div className="flex h-16 shrink-0 items-center px-6">
                <Link href="/" className="text-xl font-bold tracking-tighter text-white">
                    TODAY DECODE
                </Link>
            </div>
            <nav className="flex flex-1 flex-col px-4 py-4 space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
                    Intelligence Categories
                </div>
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                            )}
                        >
                            <item.icon className="mr-3 h-5 w-5 shrink-0" aria-hidden="true" />
                            {item.name}
                        </Link>
                    );
                })}

                <div className="pt-8">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
                        System
                    </div>
                    <Link
                        href="/admin/"
                        className="group flex items-center px-2 py-2 text-sm font-medium text-slate-400 rounded-md hover:bg-slate-800/50 hover:text-white transition-colors"
                    >
                        <LayoutDashboard className="mr-3 h-5 w-5 shrink-0" />
                        Admin Panel
                    </Link>
                    <Link
                        href="/settings/"
                        className="group flex items-center px-2 py-2 text-sm font-medium text-slate-400 rounded-md hover:bg-slate-800/50 hover:text-white transition-colors"
                    >
                        <Settings className="mr-3 h-5 w-5 shrink-0" />
                        Settings
                    </Link>
                </div>
            </nav>
            <div className="p-4 border-t border-border-slate">
                <div className="flex items-center space-x-3 px-2">
                    <div className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
                    <span className="text-xs text-slate-400 font-medium tracking-wide">
                        LIVE INTEL STREAM
                    </span>
                </div>
            </div>
        </div>
    );
}
