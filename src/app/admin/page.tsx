import {
    Users,
    FileText,
    Database,
    ShieldAlert,
    ShieldCheck,
    TrendingUp,
    Clock,
    ArrowRight,
    Plus,
    Zap,
    Activity
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAdminDashboardStats } from "@/lib/actions/admin-actions";

export default async function AdminDashboard() {
    const res = await getAdminDashboardStats();

    const statsData = res.success && res.stats ? res.stats : {
        totalArticles: 0,
        pendingReviews: 0,
        totalUsers: 0,
        health: "OFFLINE"
    };

    const hasError = !res.success;
    const errorMessage = res.error || "Unknown Error";

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1E293B] dark:border-[#334155]">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-[#64748B] dark:text-[#94A3B8] text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                        <Activity className={cn("h-3 w-3", res.success ? "text-cyan-500" : "text-accent-red")} />
                        <span>Institutional Status: {res.success ? "Operational" : "Degraded Linkage"}</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 uppercase">Strategic <span className="text-[#64748B] dark:text-[#94A3B8] font-medium">Oversight</span></h1>
                    <p className="text-[#64748B] dark:text-[#94A3B8] font-medium border-l-2 border-[#CBD5E1] dark:border-[#1E293B] pl-4 py-1">Institutional management of global risk analysis and strategic repositories.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl border font-black uppercase tracking-widest text-[9px] shadow-sm transition-all",
                        res.success
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                            : "bg-accent-red/10 border-accent-red/20 text-accent-red animate-pulse"
                    )}>
                        <Database className="h-3 w-3" />
                        {res.success ? "Institutional Link Active" : "Archive Link Offline"}
                    </div>
                    <Button variant="outline" className="rounded-xl border-border hover:bg-muted font-black uppercase tracking-widest text-[10px]">Refresh Data</Button>
                    <Link href="/admin/articles/">
                        <Button className="rounded-xl font-black uppercase tracking-widest text-[10px] px-6 shadow-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-black dark:hover:bg-white/90">
                            <Plus className="mr-2 h-4 w-4" /> Create Report
                        </Button>
                    </Link>
                </div>
            </header>

            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Reports", value: statsData.totalArticles, icon: FileText, color: "text-slate-900 dark:text-slate-100" },
                    { label: "Pending Reviews", value: statsData.pendingReviews, icon: Clock, color: "text-[#64748B] dark:text-[#94A3B8]" },
                    { label: "Analyst Count", value: statsData.totalUsers, icon: Users, color: "text-slate-900 dark:text-slate-100" },
                    { label: "Database Health", value: statsData.health, icon: Database, color: statsData.health === "OFFLINE" ? "text-accent-red" : "text-emerald-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-card border border-[#E2E8F0] dark:border-[#1E293B] p-8 rounded-3xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-[#E2E8F0] dark:border-[#334155] ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="text-4xl font-black text-slate-900 dark:text-slate-100 mb-2">{stat.value}</div>
                            <div className="text-[10px] font-black text-[#64748B] dark:text-[#94A3B8] uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#64748B] dark:text-[#94A3B8]">Recent Activity Log</h2>
                        <Link href="/admin/logs/" className="text-[10px] font-black uppercase tracking-widest text-[#64748B] dark:text-[#94A3B8] hover:text-foreground flex items-center transition-colors">
                            Full Archive <ArrowRight className="ml-2 h-3 w-3" />
                        </Link>
                    </div>

                    <div className="bg-card border border-[#E2E8F0] dark:border-[#1E293B] rounded-[2rem] overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-[#E2E8F0] dark:border-[#1E293B] flex items-center space-x-4 bg-slate-50 dark:bg-white/5">
                            <div className="h-10 w-10 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-xs font-black text-white dark:text-slate-900 italic">SL</div>
                            <div>
                                <div className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Senior Analyst</div>
                                <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-black uppercase tracking-widest">Administrator</div>
                            </div>
                            <div className="ml-auto flex items-center space-x-2 text-[10px] font-black bg-white dark:bg-[#020617] border border-[#E2E8F0] dark:border-[#1E293B] px-3 py-1 rounded-full text-[#64748B] dark:text-[#94A3B8]">
                                <ShieldCheck className={cn("h-3 w-3 mr-1", res.success ? "text-emerald-500" : "text-accent-red")} />
                                <span>Session Active</span>
                            </div>
                        </div>

                        <div className="p-4 bg-card">
                            <div className="p-12 text-center space-y-6">
                                <div className="inline-flex p-6 rounded-full bg-muted/50">
                                    {res.success ? (
                                        <TrendingUp className="h-10 w-10 text-emerald-500" />
                                    ) : (
                                        <ShieldAlert className="h-10 w-10 text-accent-red" />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                                        {res.success ? "Strategic Synchronization Level: High" : "Security Protocol Breach"}
                                    </p>
                                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed max-w-xs mx-auto font-black uppercase tracking-widest">
                                        {res.success
                                            ? "Intelligence manifests are synchronized with the Neon Strategic Reservoir."
                                            : "System link failure. Archive data unreachable. Maintenance required."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Summary */}
                <div className="space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">System Parameters</h2>
                    <div className="bg-slate-900 dark:bg-black border border-slate-800 rounded-[2rem] p-8 text-white">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="text-2xl font-black tracking-tight uppercase leading-none italic text-white">Institutional <span className="text-slate-500">Protocols {res.success ? "Active" : "Compromised"}</span></div>
                                <div className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-widest">
                                    {res.success
                                        ? "Strategic management controls initialized for institutional advisory use."
                                        : "Protocol integrity check failed. Data linkage unavailable."}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: "Auth Provider", value: "NextAuth v4" },
                                    { label: "Data Engine", value: "Prisma Client" },
                                    { label: "Cache Policy", value: "Vercel Edge" },
                                    { label: "Session Integrity", value: res.success ? "Verified" : "Offline" }
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between pb-4 border-b border-primary-foreground/5 last:border-0 last:pb-0">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-primary-foreground/40">{row.label}</span>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-primary-foreground">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
