import { BarChart3, TrendingUp, Users, Eye } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B] dark:border-[#1E293B]">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#22D3EE] dark:text-[#22D3EE] uppercase italic pb-1">Impact <span className="text-[#F1F5F9] dark:text-[#F1F5F9] not-italic">Analytics</span></h1>
                    <p className="text-[#64748B] dark:text-[#94A3B8] text-xs font-black uppercase tracking-widest">Monitor institutional reach and strategic engagement.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: "Total Reach", value: "0", icon: Users },
                    { label: "Engagement Rate", value: "0%", icon: TrendingUp },
                    { label: "Node Views", value: "0", icon: Eye },
                ].map((stat, i) => (
                    <div key={i} className="bg-card border border-[#1E293B] p-8 rounded-3xl">
                        <stat.icon className="h-6 w-6 text-muted-foreground mb-4" />
                        <div className="text-4xl font-black text-foreground mb-1">{stat.value}</div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-[#1E293B] rounded-[2.5rem] bg-card/50">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-black uppercase text-foreground italic">Awaiting Telemetry</h3>
                <p className="text-sm text-muted-foreground font-black uppercase tracking-widest mt-2 italic">Connect Google Analytics to visualize institutional impact.</p>
            </div>
        </div>
    );
}
