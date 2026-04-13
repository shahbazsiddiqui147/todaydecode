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
    Settings,
    ChevronUp,
    ChevronDown,
    Layers,
    Activity,
    Database,
    Binary
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RiskGauge } from "../metrics/risk-gauge";
import { useEffect, useState } from "react";

// Default icon mapping for dynamic categories
const ICON_MAP: Record<string, any> = {
    "geopolitics": Globe,
    "economy": TrendingUp,
    "security": ShieldAlert,
    "technology": Cpu,
    "energy": Zap,
    "global": Layers,
    "risk": Activity,
    "cyber": Binary,
    "data": Database
};

export function Sidebar({
    initialCategories = [],
    initialMetrics = null,
    navigationItems = []
}: {
    initialCategories?: any[],
    initialMetrics?: any,
    navigationItems?: any[]
}) {
    const pathname = usePathname();
    const [metrics, setMetrics] = useState<any>(initialMetrics);
    const [categories, setCategories] = useState<any[]>(initialCategories);
    const [curatedNav, setCuratedNav] = useState<any[]>(navigationItems);

    // Sync with props if they change (e.g. on navigation or revalidation)
    useEffect(() => {
        if (initialCategories.length > 0) setCategories(initialCategories);
        if (initialMetrics) setMetrics(initialMetrics);
        if (navigationItems.length > 0) setCuratedNav(navigationItems);
    }, [initialCategories, initialMetrics, navigationItems]);

    return (
        <div className="hidden md:flex w-72 flex-col bg-sidebar border-r border-border-slate overflow-y-auto overflow-x-hidden scrollbar-none">
            <div className="flex h-16 shrink-0 items-center px-6 border-b border-border-slate">
                <Link href="/" className="text-xl font-black tracking-tighter text-sidebar-foreground">
                    TODAY DECODE
                </Link>
            </div>

            <div className="flex flex-1 flex-col px-4 py-6 space-y-8">
                {/* Navigation */}
                <nav className="flex-1 space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2 mb-3">
                        Articles
                    </div>
                    {categories.filter(c => !c.parentId).map((silo) => {
                        const siloSlug = silo.slug.replace(/^\/|\/$/g, '');
                        const siloHref = `/${siloSlug}/`;
                        const isSiloActive = pathname.startsWith(siloHref);
                        const SiloIcon = ICON_MAP[silo.name.toLowerCase()] || ICON_MAP[siloSlug] || Globe;

                        return (
                            <div key={silo.id} className="space-y-1">
                                <div
                                    className={cn(
                                        "group flex items-center justify-between px-2 py-2.5 text-sm font-semibold rounded-md transition-all cursor-pointer",
                                        isSiloActive
                                            ? "bg-secondary/30 text-[#22D3EE]"
                                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                    )}
                                >
                                    <Link href={siloHref} className="flex items-center flex-1">
                                        <SiloIcon className={cn(
                                            "mr-3 h-5 w-5 shrink-0 transition-colors",
                                            isSiloActive ? "text-[#22D3EE]" : "group-hover:text-[#22D3EE]"
                                        )} />
                                        {silo.name}
                                    </Link>
                                    {silo.children && silo.children.length > 0 && (
                                        <ChevronDown className={cn(
                                            "h-4 w-4 transition-transform",
                                            isSiloActive ? "rotate-0 text-[#22D3EE]" : "-rotate-90 opacity-50"
                                        )} />
                                    )}
                                </div>

                                {isSiloActive && silo.children && silo.children.length > 0 && (
                                    <div className="ml-8 space-y-1 border-l border-border-slate/50 pl-2 mt-1">
                                        {silo.children.map((desk: any) => {
                                            const deskSlug = desk.slug.replace(/^\/|\/$/g, '');
                                            const deskHref = `/${siloSlug}/${deskSlug}/`;
                                            const isDeskActive = pathname === deskHref;

                                            return (
                                                <Link
                                                    key={desk.id}
                                                    href={deskHref}
                                                    className={cn(
                                                        "flex items-center px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-sm transition-colors",
                                                        isDeskActive
                                                            ? "bg-[#22D3EE]/10 text-slate-100"
                                                            : "text-slate-400 hover:bg-secondary/30 hover:text-slate-200"
                                                    )}
                                                >
                                                    {desk.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {categories.length === 0 && (
                        <div className="px-2 py-4 text-[10px] font-bold text-slate-600 uppercase italic tracking-widest">
                            Loading Categories...
                        </div>
                    )}
                </nav>

                {/* Power Dashboard Widgets */}
                <div className="space-y-4 pt-4 border-t border-border-slate">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2 mb-2">
                        Dashboard
                    </div>

                    <div className="grid grid-cols-2 gap-4 px-2">
                        <RiskGauge
                            value={metrics?.risk?.value || 0}
                            label="Global Risk"
                            size="sm"
                        />
                        <div className="flex flex-col justify-center space-y-3">
                            <div className="p-2 rounded bg-secondary/50 border border-border-slate">
                                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-1">
                                    Brent Crude
                                </div>
                                <div className="flex items-center justify-center space-x-1">
                                    <span className="text-xs font-bold text-foreground">${metrics?.oil?.value}</span>
                                    <div className="flex items-center text-[10px] text-accent-green font-bold">
                                        <ChevronUp className="h-2 w-2" />
                                        {metrics?.oil?.trend}%
                                    </div>
                                </div>
                            </div>
                            <div className="p-2 rounded bg-secondary/50 border border-border-slate">
                                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-1">
                                    Conflict Level
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent-red animate-pulse" />
                                    <span className="text-[10px] font-bold text-accent-red uppercase tracking-widest">
                                        {metrics?.conflict?.status === 'CRITICAL' ? 'STABLE' : 'STABLE'} 
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Administration */}
                <div className="pt-4 border-t border-border-slate">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2 mb-3">
                        Admin Dashboard
                    </div>
                    <Link
                        href="/admin/"
                        className="group flex items-center px-2 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-secondary/50 hover:text-foreground transition-colors"
                    >
                        <LayoutDashboard className="mr-3 h-4 w-4 shrink-0" />
                        Admin Panel
                    </Link>
                    <Link
                        href="/settings/"
                        className="group flex items-center px-2 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-secondary/50 hover:text-foreground transition-colors"
                    >
                        <Settings className="mr-3 h-4 w-4 shrink-0" />
                        Settings
                    </Link>
                </div>
            </div>

            {/* Footer Info */}
            <div className="p-6 border-t border-border-slate bg-muted/30">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse" />
                    <span className="text-[10px] text-accent-green font-black uppercase tracking-[0.2em]">
                        Live Feed
                    </span>
                </div>
                <p className="text-[9px] text-muted-foreground font-medium leading-relaxed uppercase tracking-tighter">
                    Connected // Latest updates
                </p>
            </div>
        </div>
    );
}
