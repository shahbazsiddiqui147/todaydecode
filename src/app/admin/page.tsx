import {
    Users,
    FileText,
    Database,
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

export default function AdminDashboard() {
    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-[#1E293B] dark:text-[#94A3B8] text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                        <Activity className="h-3 w-3 text-cyan-500" />
                        <span>Institutional Status: Operational</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-[#0F172A] dark:text-[#F1F5F9] uppercase">Strategic <span className="text-muted-foreground/60">Oversight</span></h1>
                    <p className="text-[#1E293B] dark:text-[#94A3B8] font-medium border-l-2 border-[#CBD5E1] dark:border-[#1E293B] pl-4 py-1">Institutional management of global risk analysis and strategic repositories.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-border hover:bg-muted font-black uppercase tracking-widest text-[10px]">Refresh Data</Button>
                    <Link href="/admin/articles/">
                        <Button className="rounded-xl font-black uppercase tracking-widest text-[10px] px-6 shadow-xl bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] hover:bg-black dark:hover:bg-white/90">
                            <Plus className="mr-2 h-4 w-4" /> Create Report
                        </Button>
                    </Link>
                </div>
            </header>

            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Reports", value: "0", icon: FileText, color: "text-[#0F172A] dark:text-[#F1F5F9]" },
                    { label: "Pending Reviews", value: "0", icon: Clock, color: "text-[#64748B]" },
                    { label: "Analyst Count", value: "0", icon: Users, color: "text-[#0F172A] dark:text-[#F1F5F9]" },
                    { label: "Database Health", value: "100%", icon: Database, color: "text-emerald-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-card border border-border p-8 rounded-3xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-3 rounded-2xl bg-muted/50 ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="text-4xl font-black text-foreground mb-2">{stat.value}</div>
                            <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Recent Activity Log</h2>
                        <Link href="/admin/logs/" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-foreground flex items-center transition-colors">
                            Full Archive <ArrowRight className="ml-2 h-3 w-3" />
                        </Link>
                    </div>

                    <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-border/50 flex items-center space-x-4 bg-muted/20">
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-xs font-black text-primary-foreground italic">SL</div>
                            <div>
                                <div className="text-sm font-black text-[#0F172A] dark:text-[#F1F5F9] uppercase tracking-tight">Senior Analyst</div>
                                <div className="text-[10px] text-[#64748B] font-black uppercase tracking-widest">Administrator</div>
                            </div>
                            <div className="ml-auto flex items-center space-x-2 text-[10px] font-black bg-muted border border-border px-3 py-1 rounded-full text-muted-foreground/60">
                                <ShieldCheck className="h-3 w-3 mr-1 text-brand-stability" />
                                <span>Session Active</span>
                            </div>
                        </div>

                        <div className="p-4 bg-card">
                            <div className="p-12 text-center space-y-6">
                                <div className="inline-flex p-6 rounded-full bg-muted/50">
                                    <TrendingUp className="h-10 w-10 text-muted-foreground/20" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-black text-foreground uppercase tracking-tight">Deployment Successful</p>
                                    <p className="text-xs text-muted-foreground/60 leading-relaxed max-w-xs mx-auto font-black uppercase tracking-widest">Platform initialized. Database connection established.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Summary */}
                <div className="space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">System Parameters</h2>
                    <div className="bg-slate-900 dark:bg-black border border-slate-800 rounded-[2rem] p-8 text-white h-full">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="text-2xl font-black tracking-tight uppercase leading-none italic text-white">Institutional <span className="text-slate-500">Protocols Active</span></div>
                                <div className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-widest">Strategic management controls initialized for institutional advisory use.</div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: "Auth Provider", value: "NextAuth v4" },
                                    { label: "Data Engine", value: "Prisma Client" },
                                    { label: "Cache Policy", value: "Vercel Edge" },
                                    { label: "SSL Protocol", value: "Secure" }
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
