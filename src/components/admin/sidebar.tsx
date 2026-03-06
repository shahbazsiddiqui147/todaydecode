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
        name: "Oversight",
        items: [
            { name: "Executive Oversight", icon: LayoutDashboard, href: "/admin/" },
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
            { name: "Pages", icon: Layers, href: "/admin/pages/" },
            { name: "Strategic Assessment Map", icon: Database, href: "/admin/map-data/" },
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

import { useSession } from "next-auth/react";

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = session?.user?.role || "GUEST";

    const getGroups = () => {
        const groups: any[] = [];

        // 1. Oversight Group
        groups.push({
            name: "Oversight",
            items: [
                { name: "Strategic Overview", icon: LayoutDashboard, href: "/admin/" },
            ]
        });

        // 2. Content / Research Group
        const contentItems = [];
        if (role === "AUTHOR") {
            contentItems.push({ name: "My Reports", icon: FileText, href: "/admin/articles/" });
        } else if (role === "EDITOR" || role === "ADMIN") {
            contentItems.push({ name: "Research Desk", icon: FileText, href: "/admin/articles/" });
            contentItems.push({ name: "Draft Archive", icon: FileEdit, href: "/admin/drafts/" });
        }

        if (contentItems.length > 0) {
            groups.push({ name: "Analysis", items: contentItems });
        }

        // 3. Structure / Strategic Silos
        if (role === "EDITOR" || role === "ADMIN") {
            groups.push({
                name: "Architecture",
                items: [
                    { name: "Strategic Silos", icon: Map, href: "/admin/categories/" },
                    { name: "Institutional Pages", icon: Layers, href: "/admin/pages/" },
                    { name: "Strategic Assessment Map", icon: Database, href: "/admin/map-data/" },
                ]
            });
        }

        // 4. Analysis Profiles
        if (role === "EDITOR" || role === "ADMIN") {
            groups.push({
                name: "Analysis",
                items: [
                    { name: "Analyst Profiles", icon: Users, href: "/admin/authors/" },
                    { name: "Access Requests", icon: UserCheck, href: "/admin/contributors/" },
                ]
            });
        }

        // 5. System Parameters (Master Admin Only)
        if (role === "ADMIN") {
            groups.push({
                name: "Institutional Parameters",
                items: [
                    { name: "Institutional Access Registry", icon: Users, href: "/admin/users/" },
                    { name: "Audit Logs", icon: History, href: "/admin/logs/" },
                    { name: "Platform Parameters", icon: Settings, href: "/admin/settings/" },
                ]
            });
        }

        return groups;
    };

    const activeGroups = getGroups();

    return (
        <aside className="w-64 h-screen sticky top-0 bg-sidebar border-r border-border flex flex-col transition-colors duration-300 overflow-y-auto">
            <div className="p-6 border-b border-border mb-4 bg-sidebar">
                <div className="flex items-center space-x-2.5">
                    <div className="flex items-center space-x-3">
                        <div className="border border-border dark:border-[#1E293B] p-2 rounded-xl bg-[#0F172A] dark:bg-[#020617] shadow-sm">
                            <ShieldCheck className="h-5 w-5 text-[#22D3EE] dark:text-[#22D3EE]" />
                        </div>
                        <span className="font-black uppercase tracking-tighter text-base text-[#22D3EE] dark:text-[#22D3EE] italic leading-none">
                            Research <span className="text-[#F1F5F9] dark:text-[#F1F5F9] not-italic font-medium">Desk</span>
                        </span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 pb-6 space-y-8">
                {activeGroups.map((group) => (
                    <div key={group.name} className="space-y-1">
                        <h3 className="px-2 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#1E293B] dark:text-[#94A3B8]">
                            {group.name}
                        </h3>
                        {group.items.map((item: any) => {
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
                    className="w-full h-12 flex items-center justify-center space-x-3 px-3 py-3 text-[10px] font-black uppercase tracking-widest bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] hover:bg-black dark:hover:bg-white/90 rounded-xl transition-all shadow-xl border border-transparent"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Return to Dashboard</span>
                </button>
            </div>
        </aside>
    );
}
