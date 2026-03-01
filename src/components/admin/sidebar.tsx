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
        <aside className="w-64 h-screen sticky top-0 bg-sidebar border-r border-border flex flex-col transition-colors duration-300 overflow-y-auto">
            <div className="p-6 border-b border-border mb-4 bg-sidebar">
                <div className="flex items-center space-x-2.5">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <ShieldCheck className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold tracking-tight text-lg text-foreground">
                        ADMIN <span className="text-muted-foreground font-medium">WORKSPACE</span>
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 pb-6 space-y-8">
                {GROUPS.map((group) => (
                    <div key={group.name} className="space-y-1">
                        <h3 className="px-2 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
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
                                            ? "bg-secondary text-foreground shadow-sm border border-border"
                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                    )}
                                >
                                    <div className="flex items-center space-x-3">
                                        <item.icon className={cn(
                                            "h-4 w-4 transition-colors",
                                            isActive ? "text-foreground" : "group-hover:text-foreground"
                                        )} />
                                        <span>{item.name}</span>
                                    </div>
                                    {isActive && <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-border bg-sidebar">
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center justify-center space-x-3 px-3 py-3 text-[11px] font-black uppercase tracking-widest bg-destructive text-destructive-foreground hover:opacity-90 rounded-xl transition-all shadow-lg"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Exit Workspace</span>
                </button>
            </div>
        </aside>
    );
}
