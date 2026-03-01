import { getCategoryBySlug } from "@/lib/actions/public-actions";
import { constructMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { AnalysisCard } from "@/components/ui/analysis-card";
import { RiskGauge } from "@/components/metrics/risk-gauge";
import { Globe, ShieldAlert, Zap, TrendingUp, Layers } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
    const { category: slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) return constructMetadata({ title: "Silo Not Found" });

    return constructMetadata({
        title: `${category.name} | Strategic Intelligence Silo`,
        description: category.description || `Tactical oversight and strategic reports for ${category.name}. Sector Risk: ${category.avgRisk}/100.`,
        path: `/${slug}/`,
    });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category: slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const reportCount = category.articles?.length || 0;

    return (
        <div className="space-y-12 pb-20">
            {/* Header Section */}
            <div className="relative p-8 rounded-3xl bg-secondary/50 border border-border-slate overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-red/5 blur-[100px]" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-6">
                        <Breadcrumbs items={[
                            { label: 'Home', href: '/' },
                            { label: category.name, href: '#' }
                        ]} />

                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-accent-red animate-pulse shadow-[0_0_8px_rgba(255,75,75,0.4)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-red">Live Silo Monitoring</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
                                {category.name}
                            </h1>
                            <p className="text-slate-400 max-w-xl text-sm font-medium uppercase tracking-tight leading-relaxed">
                                {category.description || "Active intelligence tracking and strategic risk assessment for this global sector."}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 bg-black/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <RiskGauge value={category.avgRisk} label="Sector Risk" size="sm" />
                        <div className="space-y-4">
                            <div className="space-y-0.5">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reports Filed</div>
                                <div className="text-2xl font-black text-white italic">{reportCount}</div>
                            </div>
                            <div className="space-y-0.5">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</div>
                                <div className="text-[10px] font-black text-accent-green uppercase tracking-widest border border-accent-green/20 px-2 py-0.5 rounded">Operational</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reports Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 italic flex items-center gap-2">
                        <Layers className="h-4 w-4" /> Intelligence Manifests
                    </h2>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Ordered by: Recency</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.articles?.map((article: any) => (
                        <AnalysisCard
                            key={article.id}
                            title={article.title}
                            category={category.name}
                            slug={article.slug}
                            image="/images/intel-1.jpg"
                            riskLevel={article.riskLevel}
                            riskScore={article.riskScore}
                        />
                    ))}
                </div>

                {reportCount === 0 && (
                    <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <div className="flex flex-col items-center space-y-4">
                            <ShieldAlert className="h-12 w-12 text-slate-800" />
                            <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-600">No Authorized Reports</p>
                                <p className="text-[10px] text-slate-500 font-medium italic">Scanning encrypted archives for sector data...</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
