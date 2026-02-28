import { constructMetadata } from "@/lib/seo";
import { GlobalRiskMap } from "@/components/maps/global-risk-map";
import { AnalysisCard } from "@/components/ui/analysis-card";
import { Search, Filter, Settings, Bell, LayoutDashboard } from "lucide-react";

export async function generateMetadata() {
    return constructMetadata({
        title: "Institutional Dashboard | Today Decode Intelligence",
        description: "Your personalized intelligence command center.",
        path: "/dashboard/",
    });
}

export default function DashboardPage() {
    // Mock followed intelligence briefs
    const followedBriefs = [
        {
            title: "The Barents Gap: NATO's Silent Conflict in the High North",
            category: "Security",
            slug: "barents-gap-nato-conflict",
            image: "/images/intel-1.jpg",
            riskLevel: "HIGH" as const,
            riskScore: 82,
        },
        {
            title: "Northern Sea Route: China's Icebreaker Expansion Strategy",
            category: "Security",
            slug: "northern-sea-route-china-expansion",
            image: "/images/intel-3.jpg",
            riskLevel: "HIGH" as const,
            riskScore: 74,
        }
    ];

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border-slate">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-accent-red">
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Command</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase">
                        Intelligence Desk
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Strategic Monitoring for <span className="text-white font-bold">Dr. Elena Vance</span> // Analyst Level 4
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder="Search followed desks..."
                            className="bg-slate-900 border border-border-slate rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-accent-red transition-all w-64"
                        />
                    </div>
                    <button className="p-2 bg-slate-900 border border-border-slate rounded-lg hover:text-white transition-colors">
                        <Filter className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-slate-900 border border-border-slate rounded-lg hover:text-white transition-colors">
                        <Settings className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Personalized Map Section */}
                <div className="lg:col-span-8 space-y-12">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                                Regional Watchlist (Global View)
                            </h2>
                            <div className="flex items-center space-x-2">
                                <span className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Monitoring Active</span>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-border-slate rounded-2xl overflow-hidden p-8 backdrop-blur-sm shadow-2xl">
                            <GlobalRiskMap />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                            Prioritized Intelligence Briefs
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {followedBriefs.map((brief) => (
                                <AnalysisCard key={brief.slug} {...brief} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Desk Activity & Notifications */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-slate-900/50 border border-border-slate rounded-xl p-6 space-y-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">
                                Your Followed Desks
                            </h3>
                            <button className="text-[10px] font-bold text-accent-red uppercase hover:underline">Manage</button>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Security // High North', articles: '12 new' },
                                { label: 'Economy // G7 Energy', articles: '5 new' },
                                { label: 'Geopolitics // MENA', articles: 'Updated 2h ago' }
                            ].map((desk, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-950/50 border border-border-slate rounded-lg group hover:border-accent-red/50 transition-all cursor-pointer">
                                    <span className="text-[10px] font-bold text-slate-300 group-hover:text-white">{desk.label}</span>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{desk.articles}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-accent-red/5 border border-accent-red/20 rounded-xl p-6 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-accent-red/20 p-2 rounded-lg">
                                <Bell className="h-4 w-4 text-accent-red" />
                            </div>
                            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Breaking Intel Alerts</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <span className="text-[10px] font-black text-accent-red uppercase uppercase">Critical</span>
                                    <span className="text-[10px] text-slate-500">14:02 UTC</span>
                                </div>
                                <p className="text-xs text-white font-medium leading-relaxed">
                                    Sudden volatility detected in Brent Crude pricing corridor. Impacting G7 Energy desk.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
