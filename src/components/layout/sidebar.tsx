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
    ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RiskGauge } from "../metrics/risk-gauge";
import { useEffect, useState } from "react";
import { getDashboardMetrics, LiveMetric } from "@/lib/data-service";

const navigation = [
    { name: "Geopolitics", href: "/geopolitics/", icon: Globe },
    { name: "Global Economy", href: "/economy/", icon: TrendingUp },
    { name: "Security", href: "/security/", icon: ShieldAlert },
    { name: "Technology", href: "/technology/", icon: Cpu },
    { name: "Energy", href: "/energy/", icon: Zap },
];

export function Sidebar() {
    const pathname = usePathname();
    const [metrics, setMetrics] = useState<{ oil?: LiveMetric; risk?: LiveMetric; conflict?: LiveMetric } | null>(null);

    useEffect(() => {
        getDashboardMetrics().then(data => setMetrics(data));
    }, []);

    return (
        <div className="hidden md:flex w-72 flex-col bg-primary border-r border-border-slate overflow-y-auto overflow-x-hidden scrollbar-none">
            <div className="flex h-16 shrink-0 items-center px-6 border-b border-border-slate">
                <Link href="/" className="text-xl font-black tracking-tighter text-white">
                    TODAY DECODE
                </Link>
            </div>

            <div className="flex flex-1 flex-col px-4 py-6 space-y-8">
                {/* Navigation */}
                <nav className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2 mb-3">
                        Intelligence Vault
                    </div>
                    {navigation.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center px-2 py-2.5 text-sm font-medium rounded-md transition-all",
                                    isActive
                                        ? "bg-slate-800 text-white shadow-lg shadow-black/20"
                                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                                )}
                            >
                                <item.icon className={cn(
                                    "mr-3 h-5 w-5 shrink-0 transition-colors",
                                    isActive ? "text-accent-red" : "group-hover:text-accent-red"
                                )} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Power Dashboard Widgets */}
                <div className="space-y-4 pt-4 border-t border-border-slate">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2 mb-2">
                        Power Dashboard
                    </div>

                    <div className="grid grid-cols-2 gap-4 px-2">
                        <RiskGauge
                            value={metrics?.risk?.value || 0}
                            label="Global Risk"
                            size="sm"
                        />
                        <div className="flex flex-col justify-center space-y-3">
                            <div className="p-2 rounded bg-slate-900/50 border border-border-slate">
                                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest text-center mb-1">
                                    Brent Crude
                                </div>
                                <div className="flex items-center justify-center space-x-1">
                                    <span className="text-xs font-bold text-white">${metrics?.oil?.value}</span>
                                    <div className="flex items-center text-[10px] text-accent-green font-bold">
                                        <ChevronUp className="h-2 w-2" />
                                        {metrics?.oil?.trend}%
                                    </div>
                                </div>
                            </div>
                            <div className="p-2 rounded bg-slate-900/50 border border-border-slate">
                                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest text-center mb-1">
                                    Conflict Level
                                </div>
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent-red animate-pulse" />
                                    <span className="text-[10px] font-bold text-accent-red uppercase tracking-widest">
                                        {metrics?.conflict?.status === 'CRITICAL' ? 'RED ZONE' : 'STABLE'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Administration */}
                <div className="pt-4 border-t border-border-slate">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2 mb-3">
                        Mission Control
                    </div>
                    <Link
                        href="/admin/"
                        className="group flex items-center px-2 py-2 text-sm font-medium text-slate-400 rounded-md hover:bg-slate-800/50 hover:text-white transition-colors"
                    >
                        <LayoutDashboard className="mr-3 h-4 w-4 shrink-0" />
                        Admin Panel
                    </Link>
                    <Link
                        href="/settings/"
                        className="group flex items-center px-2 py-2 text-sm font-medium text-slate-400 rounded-md hover:bg-slate-800/50 hover:text-white transition-colors"
                    >
                        <Settings className="mr-3 h-4 w-4 shrink-0" />
                        Settings
                    </Link>
                </div>
            </div>

            {/* Footer Info */}
            <div className="p-6 border-t border-border-slate bg-slate-950/30">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse" />
                    <span className="text-[10px] text-accent-green font-black uppercase tracking-[0.2em]">
                        LIVE INTEL STREAM
                    </span>
                </div>
                <p className="text-[9px] text-slate-500 font-medium leading-relaxed uppercase tracking-tighter">
                    SECURE CONNECTION: 04:52 UTC // BRENT {metrics?.oil?.trend && metrics.oil.trend > 0 ? '+' : ''}{metrics?.oil?.trend}% // NATO-X7 DETECTED
                </p>
            </div>
        </div>
    );
}
