import { getCategoryBySlug, getPageBySlug } from "@/lib/actions/public-actions";
import { constructMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { AnalysisCard } from "@/components/ui/analysis-card";
import { RiskGauge } from "@/components/metrics/risk-gauge";
import { ShieldAlert, Layers, Activity } from "lucide-react";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { FollowSiloButton } from "@/components/intel/FollowSiloButton";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const normalizedSlug = `/${category.replace(/\/$/, '')}/`;

    // Strategy 1: Normalized slug search
    let silo = await getCategoryBySlug(normalizedSlug);

    // Strategy 2: Raw param fallback
    if (!silo) silo = await getCategoryBySlug(category);

    if (silo) {
        return constructMetadata({
            title: `${silo.name} | Strategic Analysis Silo`,
            description: silo.description || `Tactical oversight and strategic reports for ${silo.name}.`,
            path: normalizedSlug,
        });
    }

    let page = await getPageBySlug(normalizedSlug);
    if (!page) page = await getPageBySlug(category);

    if (page) {
        return constructMetadata({
            title: page.metaTitle || `${page.title} | Institutional`,
            description: page.metaDescription || undefined,
            path: normalizedSlug,
        });
    }

    return constructMetadata({ title: "Document Not Found" });
}

export default async function CatchAllSlugPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const normalizedSlug = `/${category.replace(/\/$/, '')}/`;

    console.log(`[Strategic Handshake] Attempting to resolve Silo/Page: ${normalizedSlug}`);

    // Unified Data Retrieval
    let silo = await getCategoryBySlug(normalizedSlug);
    if (!silo) silo = await getCategoryBySlug(category);

    if (silo) {
        return <CategoryDesk silo={silo} />;
    }

    let page = await getPageBySlug(normalizedSlug);
    if (!page) page = await getPageBySlug(category);

    if (page) {
        return <InstitutionalPage page={page} />;
    }

    notFound();
}

// Internal Components (since I don't want to break the file structure if they weren't separate)
function CategoryDesk({ silo }: { silo: any }) {
    const reports = silo.articles || [];
    const reportCount = reports.length;

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Structural Header */}
            <div className="w-full border-b border-border bg-secondary/30 backdrop-blur-sm">
                <div className="max-w-screen-2xl mx-auto px-6 py-12 space-y-8">
                    <Breadcrumbs items={[
                        { label: 'Home', href: '/' },
                        { label: silo.name, href: `/${silo.slug.replace(/^\/|\/$/g, '')}/` }
                    ]} />

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1 bg-accent-red/10 border border-accent-red/20 rounded-full">
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent-red animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-red">Live Silo Monitoring</span>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Lead Analyst: {silo.leadAnalyst || "Strategic Oversight Group"}</span>
                            </div>

                            <div className="space-y-3">
                                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-foreground italic">
                                    {silo.name}
                                </h1>
                                <p className="text-muted-foreground max-w-2xl text-base font-medium uppercase tracking-tight leading-relaxed">
                                    {silo.description || "Active research tracking and strategic risk assessment for this global sector."}
                                </p>
                            </div>

                            <div className="pt-2">
                                <FollowSiloButton categoryId={silo.id} categoryName={silo.name} />
                            </div>
                        </div>

                        <div className="flex items-center gap-10 p-8 rounded-2xl bg-card border border-border shadow-2xl">
                            <RiskGauge value={silo.avgRisk} label="Sector Risk" size="sm" />
                            <div className="h-12 w-px bg-border" />
                            <div className="flex flex-col gap-4">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Intel Reports</div>
                                    <div className="text-3xl font-black text-foreground italic tracking-tighter">{reportCount}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse" />
                                    <span className="text-[9px] font-black text-accent-green uppercase tracking-widest">System Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategic Grid */}
            <div className="max-w-screen-2xl mx-auto px-6 py-20 bg-transparent">
                <div className="flex items-center justify-between mb-12 border-b border-border pb-6">
                    <div className="flex items-center gap-3">
                        <Layers className="h-5 w-5 text-accent-red" />
                        <h2 className="text-sm font-black uppercase tracking-[0.25em] text-foreground italic">
                            Strategic Manifests
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Integrity: Verified</span>
                        <div className="h-4 w-px bg-border" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">{new Date().getUTCFullYear()} Archive</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {reports.map((article: any) => (
                        <AnalysisCard
                            key={article.id}
                            id={article.id}
                            title={article.title}
                            category={silo.name}
                            slug={article.slug}
                            image="/images/intel-1.jpg"
                            riskLevel={article.riskLevel}
                            riskScore={article.riskScore}
                        />
                    ))}
                </div>

                {reportCount === 0 && (
                    <div className="py-40 text-center border-2 border-dashed border-border rounded-3xl bg-muted/30">
                        <div className="flex flex-col items-center space-y-6">
                            <Activity className="h-16 w-16 text-muted-foreground animate-pulse" />
                            <div className="space-y-2">
                                <p className="text-lg font-black uppercase tracking-[0.4em] text-foreground italic">Strategic Analysis Pending</p>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.1em] max-w-md mx-auto leading-relaxed">
                                    Silo data is being authorized. Strategic analysts are mapping tactical indicators for institutional uplink.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function InstitutionalPage({ page }: { page: any }) {
    return (
        <article className="min-h-screen bg-background text-foreground pb-32">
            <div className="max-w-5xl mx-auto px-6 py-20 space-y-16">
                <div className="space-y-8">
                    <Breadcrumbs items={[
                        { label: 'Home', href: '/' },
                        { label: page.title, href: '#' }
                    ]} />
                    <div className="space-y-4">
                        <div className="h-1 w-20 bg-accent-red" />
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic text-foreground leading-[0.9]">
                            {page.title}
                        </h1>
                    </div>
                </div>

                <div
                    className="institutional-content prose prose-slate dark:prose-invert max-w-none 
                        prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black prose-headings:italic
                        prose-p:text-lg prose-p:font-medium prose-p:leading-relaxed prose-p:tracking-tight
                        prose-strong:text-foreground prose-strong:font-black
                        prose-a:text-accent-red prose-a:no-underline hover:prose-a:underline
                        border-t border-border pt-16"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        </article>
    );
}
