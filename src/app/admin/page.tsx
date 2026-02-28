import {
    Users,
    Map,
    FileText,
    TrendingUp,
    Activity,
    ArrowUpRight
} from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-10">
            <header className="space-y-1">
                <h1 className="text-4xl font-black tracking-tighter uppercase">Intelligence <span className="text-accent-red">Command</span></h1>
                <p className="text-slate-500 font-medium tracking-wide">Strategic oversight of global intelligence nodes.</p>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Articles", value: "0", icon: FileText, color: "text-blue-500" },
                    { label: "Active Authors", value: "0", icon: Users, color: "text-purple-500" },
                    { label: "Hotspot Categories", value: "0", icon: Map, color: "text-orange-500" },
                    { label: "Global Presence", value: "100%", icon: Activity, color: "text-accent-green" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-xl bg-slate-50 dark:bg-white/5 ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-white transition-colors" />
                        </div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Feed Activity */}
                <section className="lg:col-span-8 bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <TrendingUp className="h-24 w-24 text-slate-100 dark:text-white/5" />
                    </div>
                    <div className="relative">
                        <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center space-x-2">
                            <span className="h-2 w-2 rounded-full bg-accent-red animate-pulse" />
                            <span>System Operations</span>
                        </h2>
                        <div className="space-y-6">
                            <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
                                <p className="text-slate-500 text-sm font-medium italic">Database initialization complete. Platform is ready for administration.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Global Status Panel */}
                <section className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white relative h-full">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Security Protocol</h3>
                                <span className="bg-accent-green/20 text-accent-green text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded border border-accent-green/30">Active</span>
                            </div>
                            <div className="space-y-2">
                                <div className="text-2xl font-black tracking-tighter uppercase leading-none">Administrative Sovereignty</div>
                                <div className="text-xs text-slate-400 leading-relaxed font-medium">Phase 1 encryption active. Author and Category management controls initialized.</div>
                            </div>
                            <div className="pt-6 border-t border-white/10 space-y-4">
                                {[
                                    { label: "SSL Status", status: "Secure" },
                                    { label: "Prisma Cloud", status: "Synced" },
                                    { label: "Vercel Edge", status: "Live" }
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest">
                                        <span className="text-slate-500">{row.label}</span>
                                        <span className="text-slate-200">{row.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
