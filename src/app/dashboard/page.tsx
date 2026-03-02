import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { constructMetadata } from "@/lib/seo";
import { GlobalRiskMap } from "@/components/maps/global-risk-map";
import { AnalysisCard } from "@/components/ui/analysis-card";
import { Search, Filter, Settings, Bell, LayoutDashboard, Layers, Bookmark } from "lucide-react";
import Link from "next/link";
import { ManageSubscriptionButton } from "@/components/monetization/manage-subscription-button";

export async function generateMetadata() {
    return constructMetadata({
        title: "Institutional Dashboard | Today Decode Intelligence",
        description: "Your personalized intelligence command center.",
        path: "/dashboard/",
    });
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string, name?: string, email?: string, role?: string } | undefined;

    if (!user?.id) {
        redirect("/auth/signin/?callbackUrl=/dashboard/");
    }

    // 1. Fetch Followed Categories (Watchlists)
    const watchlists = await prisma.watchlist.findMany({
        where: { userId: user.id },
        include: { category: true }
    });

    const followedCategoryIds = watchlists
        .filter(w => w.categoryId)
        .map(w => w.categoryId as string);

    // 2. Fetch Latest Analysis from followed silos
    const followedArticles = followedCategoryIds.length > 0
        ? await prisma.article.findMany({
            where: {
                categoryId: { in: followedCategoryIds },
                status: "PUBLISHED" as any
            },
            include: { category: true },
            orderBy: { publishedAt: 'desc' },
            take: 6
        })
        : [];

    // 3. Fetch Bookmarked Reports
    const bookmarks = await prisma.savedAnalysis.findMany({
        where: { userId: user.id },
        include: {
            article: {
                include: { category: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    // 4. Aggregate data for the map (only followed regions if any, otherwise global)
    // For now, we reuse the global data but the component could be filtered
    const regionData: Record<string, number> = {};
    const aggregations = await prisma.article.groupBy({
        by: ["region"],
        where: { status: "PUBLISHED" as any },
        _avg: { riskScore: true }
    });
    aggregations.forEach((item) => {
        regionData[item.region] = Math.round(item._avg?.riskScore || 0);
    });

    return (
        <div className="space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border-slate">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-accent-red">
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Command</span>
                    </div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight uppercase">
                        Intelligence Desk
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">
                        Strategic Monitoring for <span className="text-foreground font-bold">{user.name || "Field Analyst"}</span> // {user.role || "ANALYST"}
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[9px] font-black text-accent-green uppercase tracking-widest">Handshake Verified</span>
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter italic">Uplink: Resilient</span>
                    </div>

                    {user.role === 'GUEST' ? (
                        <Link href="/pricing/">
                            <button className="px-4 py-2 bg-accent-red text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white hover:text-primary transition-all shadow-lg shadow-accent-red/20">
                                Upgrade to Institutional
                            </button>
                        </Link>
                    ) : (
                        <ManageSubscriptionButton />
                    )}

                    <Link href="/settings/">
                        <button className="p-2 bg-secondary border border-border-slate rounded-lg hover:text-foreground transition-colors">
                            <Settings className="h-4 w-4" />
                        </button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Personalized Map Section */}
                <div className="lg:col-span-8 space-y-12">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                <Layers className="h-4 w-4 text-accent-red" />
                                Regional Watchlist (Global View)
                            </h2>
                            <div className="flex items-center space-x-2">
                                <span className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Monitoring Active</span>
                            </div>
                        </div>
                        <div className="bg-secondary/50 dark:bg-slate-900/50 border border-border-slate rounded-2xl overflow-hidden p-8 backdrop-blur-sm shadow-2xl">
                            <GlobalRiskMap regionData={regionData} />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                                Prioritized Intelligence Briefs
                            </h2>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Based on Followed Desks</span>
                        </div>

                        {followedArticles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {followedArticles.map((article: any) => (
                                    <AnalysisCard
                                        key={article.id}
                                        id={article.id}
                                        title={article.title}
                                        category={article.category.name}
                                        slug={article.slug}
                                        image="/images/intel-1.jpg"
                                        riskLevel={article.riskLevel}
                                        riskScore={article.riskScore}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 border-2 border-dashed border-slate-800 rounded-2xl text-center bg-slate-900/20">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No active intelligence in followed silos.</p>
                                <p className="text-xs text-slate-600 mt-2 font-medium">Follow a Strategic Silo to populate your prioritized feed.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Desk Activity & Notifications */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Followed Desks Manifest */}
                    <div className="bg-secondary/50 dark:bg-slate-900/50 border border-border-slate rounded-xl p-6 space-y-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-foreground dark:text-white uppercase tracking-widest">
                                Your Followed Desks
                            </h3>
                            <span className="text-[10px] font-bold text-slate-600 uppercase italic">Manifest Active</span>
                        </div>

                        <div className="space-y-3">
                            {watchlists.length > 0 ? (
                                watchlists.map((w) => (
                                    <Link
                                        key={w.id}
                                        href={w.category ? `/${w.category.slug.replace(/^\/|\/$/g, '')}/` : '#'}
                                        className="flex items-center justify-between p-3 bg-card/50 dark:bg-slate-950/50 border border-border-slate rounded-lg group hover:border-accent-red/50 transition-all"
                                    >
                                        <span className="text-[10px] font-bold text-muted-foreground dark:text-slate-300 group-hover:text-foreground dark:group-hover:text-white uppercase tracking-widest">
                                            {w.category?.name || "Global Sector"}
                                        </span>
                                        <span className="text-[9px] font-black text-accent-red opacity-0 group-hover:opacity-100 transition-opacity">GO TO DESK</span>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-[9px] font-bold text-slate-600 uppercase italic">No silos followed.</p>
                            )}
                        </div>
                    </div>

                    {/* Saved Reports (Bookmarks) */}
                    <div className="bg-secondary/50 dark:bg-slate-900/50 border border-border-slate rounded-xl p-6 space-y-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-foreground dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <Bookmark className="h-3 w-3 text-accent-red" />
                                Saved Reports
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {bookmarks.length > 0 ? (
                                bookmarks.map((b) => (
                                    <Link
                                        key={b.id}
                                        href={`/${b.article.category.slug.replace(/^\/|\/$/g, '')}/${b.article.slug.replace(/^\/|\/$/g, '')}/`}
                                        className="block space-y-1 group"
                                    >
                                        <p className="text-[11px] font-black text-muted-foreground dark:text-slate-200 group-hover:text-foreground dark:group-hover:text-white transition-colors uppercase tracking-tight italic line-clamp-2">
                                            {b.article.title}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                                                {new Date(b.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="text-[8px] font-black text-accent-red uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">ACCESS READ</span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-[9px] font-bold text-slate-600 uppercase italic">No analysis bookmarked.</p>
                            )}
                        </div>
                    </div>

                    {/* System Integrity Notification */}
                    <div className="bg-accent-red/5 border border-accent-red/20 rounded-xl p-6 space-y-6 shadow-2xl shadow-accent-red/5">
                        <div className="flex items-center space-x-3">
                            <div className="bg-accent-red/20 p-2 rounded-lg">
                                <Bell className="h-4 w-4 text-accent-red" />
                            </div>
                            <h3 className="text-[10px] font-black text-foreground dark:text-white uppercase tracking-widest">Breaking Intel Alerts</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <span className="text-[10px] font-black text-accent-red uppercase">Critical</span>
                                    <span className="text-[10px] text-slate-500">SYSTEM // PULSE</span>
                                </div>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                                    Monitoring tactical indicators for your followed sectors. Real-time alerts will be delivered here.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
