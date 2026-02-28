import {
    Users,
    FileText,
    Database,
    ShieldCheck,
    TrendingUp,
    Clock,
    ArrowRight,
    Plus,
    Zap
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                        <Zap className="h-3 w-3 fill-current" />
                        <span>Operational Status: Optimal</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Management <span className="text-slate-500">Workspace</span></h1>
                    <p className="text-slate-500 font-medium border-l-2 border-slate-200 dark:border-slate-800 pl-4 py-1">Strategic oversight of global intelligence nodes and content manifests.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 dark:border-slate-800">Refresh Data</Button>
                    <Link href="/admin/articles/">
                        <Button className="rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 shadow-xl">
                            <Plus className="mr-2 h-4 w-4" /> New Article
                        </Button>
                    </Link>
                </div>
            </header>

            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Articles", value: "0", icon: FileText, color: "text-slate-900 dark:text-white" },
                    { label: "Pending Reviews", value: "0", icon: Clock, color: "text-slate-400" },
                    { label: "Personnel Count", value: "0", icon: Users, color: "text-slate-900 dark:text-white" },
                    { label: "Database Health", value: "100%", icon: Database, color: "text-slate-900 dark:text-white" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-white/5 ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                            </div>
                            <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">{stat.value}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Recent Activity Log</h2>
                        <Link href="/admin/logs/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center transition-colors">
                            Full Archive <ArrowRight className="ml-2 h-3 w-3" />
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800/50 flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-xs font-black text-white italic">SL</div>
                            <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Strategic Lead</div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Administrator</div>
                            </div>
                            <div className="ml-auto flex items-center space-x-2 text-[10px] font-black bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full text-slate-500">
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                <span>Session Active</span>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="p-12 text-center space-y-6">
                                <div className="inline-flex p-6 rounded-full bg-slate-50 dark:bg-white/5">
                                    <TrendingUp className="h-10 w-10 text-slate-200 dark:text-slate-800" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Deployment Successful</p>
                                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto font-medium">Platform initialized. Database connection established. Personnel databases are ready for indexing.</p>
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
                                <div className="text-2xl font-black tracking-tight uppercase leading-none italic">Sovereign <span className="text-slate-500">Enabled</span></div>
                                <div className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-widest">Phase 1 encryption active. Author and Category management controls initialized for institutional use.</div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: "Auth Provider", value: "NextAuth v4" },
                                    { label: "Data Engine", value: "Prisma Client" },
                                    { label: "Cache Policy", value: "Vercel Edge" },
                                    { label: "SSL Protocol", value: "Secure" }
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{row.label}</span>
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-200">{row.value}</span>
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
