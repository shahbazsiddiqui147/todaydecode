import { constructMetadata } from "@/lib/seo";
import { Share2, Bookmark } from "lucide-react";
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

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }) {
    const { category, slug } = await params;
    const article = await getPublicArticleBySlug(slug);

    if (!article) return constructMetadata({ title: "Intelligence Not Found" });

    return constructMetadata({
        title: `[Intelligence Report] ${article.title} | Today Decode`,
        description: article.metaDescription || `Strategic Risk Assessment [${article.riskScore}/100]. Risk Level: ${article.riskLevel}. Impact Score: ${article.impactScore}. Analyst-verified intelligence.`,
        path: `/${category}/${slug}/`,
    });
}

export default async function ArticlePage({
    params,
    searchParams
}: {
    params: Promise<{ category: string; slug: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { category, slug } = await params;
    const sParams = await searchParams;

    // Maintenance Guard with Bypass
    const isPreview = sParams.preview === 'true';
    const cookieStore = await cookies();
    const hasCookie = cookieStore.get('preview_access')?.value === 'true';

    if (!isPreview && !hasCookie) {
        const m1 = process.env.MAINTENANCE_MODE;
        const m2 = process.env.NEXT_PUBLIC_MAINTENANCE_MODE;
        const raw = String(m1 || m2 || '').toLowerCase();
        if (raw.includes('true') || raw === '1' || raw === 'on') {
            redirect('/coming-soon/');
        }
    }

    const article = await getPublicArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    // Process scenarios for the Forecast UI
    const rawScenarios = (article.scenarios as any) || {};
    const processedScenarios = {
        best: {
            title: rawScenarios.best?.title || "Strategic Convergence",
            desc: rawScenarios.best?.description || "No data provided.",
            impact: 10
        },
        likely: {
            title: rawScenarios.likely?.title || "Linear Tension",
            desc: rawScenarios.likely?.description || "No data provided.",
            impact: article.impactScore
        },
        worst: {
            title: rawScenarios.worst?.title || "Systemic Fragmentation",
            desc: rawScenarios.worst?.description || "No data provided.",
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
        <div className="relative min-h-screen bg-primary pb-20">
            <ReadingProgressBar />
            <JsonLd
                type="Article"
                data={{
                    title: article.title,
                    summary: article.summary,
                    publishedAt: article.publishedAt.toISOString(),
                    authorName: article.author.name,
                    image: "/images/intel-1.jpg",
                    faqData: (article.faqData as any) || []
                }}
            />

            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden border-b border-border-slate">
                <Image
                    src="/images/intel-1.jpg"
                    alt={article.title}
                    fill
                    className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
                    <div className="flex flex-col space-y-6">
                        <Breadcrumbs items={[
                            { label: 'Home', href: '/' },
                            { label: article.category.name, href: `/${article.category.slug}` },
                            { label: 'Strategic Analysis', href: '#' }
                        ]} />

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <span className="bg-accent-red/20 text-accent-red text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded border border-accent-red/30">
                                    {article.riskLevel} Risk
                                </span>
                                <MethodologyBadge />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none max-w-4xl">
                                {article.title}
                            </h1>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-white/10">
                            <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 rounded-full bg-slate-800 border border-border-slate overflow-hidden relative">
                                    {article.author.image && (
                                        <Image src={article.author.image} alt={article.author.name} fill className="object-cover" />
                                    )}
                                </div>
                                <div>
                                    <Link href={`/author/${article.author.slug}/`}>
                                        <div className="text-xs font-black uppercase tracking-widest text-white hover:text-accent-red transition-colors">{article.author.name}</div>
                                    </Link>
                                    <div className="text-[10px] text-slate-400 uppercase font-medium">{article.author.role}</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>{formattedDate}</span>
                                <span>{readingTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
                <aside className="lg:col-span-1 hidden lg:block">
                    <div className="sticky top-32 space-y-8 flex flex-col items-center">
                        <FollowDesk type="category" id={article.categoryId} label={article.category.name} />
                        <button className="p-3 bg-slate-900 border border-border-slate rounded-xl hover:border-white transition-all group">
                            <Share2 className="h-5 w-5 text-slate-400 group-hover:text-white" />
                        </button>
                        <button className="p-3 bg-slate-900 border border-border-slate rounded-xl hover:border-white transition-all group">
                            <Bookmark className="h-5 w-5 text-slate-400 group-hover:text-white" />
                        </button>
                        <CitationTool
                            title={article.title}
                            author={article.author.name}
                            publishedDate={formattedDate}
                            category={article.category.name}
                            slug={article.slug}
                        />
                    </div>
                </aside>

                <main className="lg:col-span-7 space-y-12 text-slate-200">
                    <div className="space-y-6">
                        {article.onPageLead && (
                            <p className="text-xl font-bold italic border-l-4 border-accent-red pl-6 py-2 text-white">
                                {article.onPageLead}
                            </p>
                        )}
                        <KeyTakeaways points={article.summary.split('\n').filter((p: string) => p.trim())} />
                    </div>

                    <div className="space-y-12">
                        <QuickAnswers faqData={(article.faqData as any) || []} />

                        <PaywallGate isPremium={article.isPremium}>
                            <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed text-lg font-serif">
                                {article.content.split('\n').map((para: string, i: number) => (
                                    para.trim() ? <p key={i}>{para}</p> : <br key={i} />
                                ))}
                            </div>
                        </PaywallGate>

                        <div className="space-y-12 pt-12 border-t border-border-slate">
                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase tracking-tight text-white">Visual Intelligence & Predictive Modeling</h3>
                                <p className="text-sm text-slate-400">Analysis-driven scenario mapping for the next fiscal cycle.</p>
                            </div>
                            <ScenarioForecast scenarios={processedScenarios} category={article.category.slug} slug={article.slug} />
                        </div>
                    </div>
                </main>

                <aside className="lg:col-span-4 space-y-8">
                    <div className="sticky top-32 space-y-8">
                        <RiskGauge score={article.riskScore} label={`${article.riskLevel} STRATEGIC RISK`} />

                        <div className="p-6 bg-slate-900/50 border border-border-slate rounded-2xl space-y-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-white">Related Intelligence</h4>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Sector: {article.category.name}</span>
                            </div>
                            <div className="space-y-6">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic animate-pulse">
                                    Fetching real-time data correlations...
                                </p>
                                <div className="text-xs text-slate-500 font-medium leading-relaxed">
                                    Detailed regional correlations and asset-class impacts are being mapped to our 2026 tactical grid.
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
