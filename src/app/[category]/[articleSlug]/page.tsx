import { Badge } from "@/components/ui/badge";
import { constructMetadata } from "@/lib/seo";
import { Share2, Bookmark, Clock, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { RiskGauge, KeyTakeaways } from "@/components/ui/article-widgets";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { ScenarioForecast } from "@/components/analysis/scenario-forecast";
import { QuickAnswers } from "@/components/aeo/quick-answers";
import { MethodologyBadge } from "@/components/intel/methodology-badge";
import { CitationTool } from "@/components/intel/citation-tool";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { FollowDesk } from "@/components/user/follow-desk";
import { PaywallGate } from "@/components/monetization/paywall-gate";
import { notFound, redirect } from "next/navigation";
import { getPublicArticleBySlug } from "@/lib/actions/public-actions";
import { cookies } from "next/headers";
import { AdContainer } from "@/components/monetization/ad-container";
import { ContentRenderer } from "@/components/analysis/ContentRenderer";

export async function generateMetadata({ params }: { params: Promise<{ category: string; articleSlug: string }> }) {
    const { category, articleSlug } = await params;
    const article = await getPublicArticleBySlug(articleSlug);

    if (!article) return constructMetadata({ title: "Analysis Not Found" });

    return constructMetadata({
        title: `[Strategic Analysis] ${article.title} | Today Decode`,
        description: article.metaDescription || article.summary.substring(0, 160),
        path: `/${category}/${articleSlug}/`,
        riskScore: article.riskScore,
        impactScore: article.impactScore,
    });
}

export default async function ArticlePage({
    params,
    searchParams
}: {
    params: Promise<{ category: string; articleSlug: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { category, articleSlug } = await params;
    const sParams = await searchParams;

    // Strategic Preview Authentication (Recognizes HTTP-only cookie)
    const isPreview = sParams.preview === 'true';
    const cookieStore = await cookies();
    const hasCookie = cookieStore.get('TD_PREVIEW_ACCESS')?.value === 'true';

    // Maintenance Guard removed for public site

    const article = await getPublicArticleBySlug(articleSlug);

    if (!article) {
        notFound();
    }

    // Process scenarios for the Forecast UI
    const rawScenarios = (article.scenarios as any) || {};
    const processedScenarios = {
        best: {
            title: rawScenarios.best?.title || "Strategic Convergence",
            desc: rawScenarios.best?.description || "No specific data provided for this scenario outcome.",
            impact: 10
        },
        likely: {
            title: rawScenarios.likely?.title || "Linear Tension",
            desc: rawScenarios.likely?.description || "Baseline trajectory based on current analytical indicators.",
            impact: article.impactScore
        },
        worst: {
            title: rawScenarios.worst?.title || "Systemic Fragmentation",
            desc: rawScenarios.worst?.description || "Critical system failure or breakdown of institutional protocols.",
            impact: 90
        }
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(article.publishedAt));

    const readingTime = `${Math.ceil(article.content.length / 1000) + 2} min read`;

    return (
        <div className="relative min-h-screen bg-background pb-20">
            <ReadingProgressBar />
            <JsonLd
                type="Article"
                data={{
                    title: article.title,
                    summary: article.summary,
                    publishedAt: article.publishedAt.toISOString(),
                    authorName: article.author.name,
                    image: article.featuredImage || "/images/intel-1.jpg",
                    faqData: (article.faqData as any) || []
                }}
            />

            {/* Hero Section */}
            <div className="relative h-[65vh] w-full overflow-hidden border-b border-border-slate">
                <Image
                    src={article.featuredImage || "/images/intel-1.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover opacity-60 grayscale hover:grayscale-0 transition-opacity duration-1000"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
                    <div className="flex flex-col space-y-6">
                        <Breadcrumbs items={[
                            { label: 'Home', href: '/' },
                            { label: article.category.name, href: `/${article.category.slug.replace(/^\/|\/$/g, '')}/` },
                            { label: 'Strategic Analysis', href: '#' }
                        ]} />

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded border leading-none",
                                    article.riskLevel === 'CRITICAL' ? "bg-accent-red/10 text-accent-red border-accent-red/20" :
                                        article.riskLevel === 'HIGH' ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                                            "bg-accent-green/10 text-accent-green border-accent-green/20"
                                )}>
                                    {article.riskLevel} Risk
                                </span>
                                <MethodologyBadge />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[1.1] max-w-5xl">
                                {article.title}
                            </h1>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between pt-8 border-t border-white/5 gap-6">
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-full bg-slate-900 border border-border-slate overflow-hidden relative grayscale hover:grayscale-0 transition-all">
                                    {article.author.image ? (
                                        <Image src={article.author.image} alt={article.author.name} fill className="object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black bg-slate-800 text-slate-500">ID</div>
                                    )}
                                </div>
                                <div className="space-y-0.5">
                                    <Link href={`/author/${article.author.slug.replace(/^\/|\/$/g, '')}/`}>
                                        <div className="text-xs font-black uppercase tracking-widest text-white hover:text-accent-red transition-colors cursor-pointer">{article.author.name}</div>
                                    </Link>
                                    <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{article.author.role}</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-8 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                <span className="flex items-center"><Clock className="h-3 w-3 mr-2 opacity-50" /> {formattedDate}</span>
                                <span className="flex items-center"><Layers className="h-3 w-3 mr-2 opacity-50" /> {readingTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-16">
                <aside className="lg:col-span-1 hidden lg:block">
                    <div className="sticky top-32 space-y-8 flex flex-col items-center">
                        <FollowDesk type="category" id={article.categoryId} label={article.category.name} />
                        <div className="h-px w-8 bg-white/5" />
                        <button className="p-3 bg-slate-900/50 border border-white/5 rounded-2xl hover:border-accent-red transition-all group">
                            <Share2 className="h-5 w-5 text-slate-500 group-hover:text-white" />
                        </button>
                        <button className="p-3 bg-slate-900/50 border border-white/5 rounded-2xl hover:border-accent-red transition-all group">
                            <Bookmark className="h-5 w-5 text-slate-500 group-hover:text-white" />
                        </button>
                    </div>
                </aside>

                <main className="lg:col-span-7 space-y-16">
                    <div className="space-y-8">
                        {article.onPageLead && (
                            <div className="relative p-8 rounded-3xl bg-secondary/30 border border-white/5 overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-accent-red" />
                                <p className="text-2xl font-black italic text-white leading-snug tracking-tight">
                                    "{article.onPageLead}"
                                </p>
                            </div>
                        )}
                        <KeyTakeaways points={article.summary.split('\n').filter((p: string) => p.trim())} />
                    </div>

                    <div className="space-y-16">
                        <QuickAnswers faqData={(article.faqData as any) || []} />

                        <PaywallGate isPremium={article.isPremium}>
                            <ContentRenderer content={article.content} />
                        </PaywallGate>

                        <div className="space-y-10 pt-16 border-t border-white/5">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black uppercase tracking-tighter text-white italic">Quantitative Scenarios</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model Fidelity: High (institutional-grade mapping)</p>
                            </div>
                            <ScenarioForecast scenarios={processedScenarios} category={article.category.slug} slug={article.slug} />
                        </div>
                    </div>
                </main>

                <aside className="lg:col-span-4 space-y-12">
                    <div className="sticky top-32 space-y-12">
                        {/* Related Research - Priority Pos 1 */}
                        <div className="p-8 bg-secondary/30 border border-border rounded-3xl space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-red/5 blur-[50px]" />
                            <div className="flex items-center justify-between border-b border-border/10 pb-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Related Research Desk</h4>
                                <span className="text-[9px] font-black text-accent-red uppercase tracking-tighter">Live Sync</span>
                            </div>
                            <div className="space-y-6">
                                <div className="p-4 rounded-2xl bg-black/20 border border-border/10 space-y-3">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic animate-pulse">
                                        Mapping Correlated Hotspots...
                                    </p>
                                    <div className="text-[11px] text-slate-510 font-medium leading-relaxed uppercase tracking-tight">
                                        Analyzing cross-sector contagion and regional volatility indexes for the {article.category.name} silo.
                                    </div>
                                </div>
                                <CitationTool
                                    title={article.title}
                                    author={article.author.name}
                                    publishedDate={formattedDate}
                                    category={article.category.name}
                                    slug={article.slug}
                                />
                            </div>
                        </div>

                        {/* Risk Metrics - Pos 2 */}
                        <RiskGauge score={article.riskScore} label={`${article.riskLevel} STRATEGIC RISK`} />

                        {/* Promoted Advisory - Pos 3 */}
                        <div className="space-y-4">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 pl-4">Promoted Advisory</h4>
                            <AdContainer />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
