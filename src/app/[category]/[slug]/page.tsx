import { constructMetadata } from "@/lib/seo";
import { Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RiskGauge, KeyTakeaways } from "@/components/ui/article-widgets";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { JsonLd, QuickAnswer } from "@/components/seo/json-ld";
import { ScenarioForecast } from "@/components/analysis/scenario-forecast";
import { ForecastTrend } from "@/components/charts/forecast-trend";
import { TermDefinition } from "@/components/aeo/term-definition";
import { QuickAnswers } from "@/components/aeo/quick-answers";
import { MethodologyBadge } from "@/components/intel/methodology-badge";
import { CitationTool } from "@/components/intel/citation-tool";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { AnalysisCard } from "@/components/ui/analysis-card";
import { FollowDesk } from "@/components/user/follow-desk";
import { PaywallGate } from "@/components/monetization/paywall-gate";
import { AdContainer } from "@/components/monetization/ad-container";

export async function generateMetadata({ params }: { params: { category: string; slug: string } }) {
    const { category, slug } = params;

    // In production, fetch from DB
    const articleData = {
        title: "The Barents Gap: NATO's Silent Conflict in the High North",
        riskLevel: "HIGH",
        riskScore: 82,
        impactScore: 78
    };

    return constructMetadata({
        title: `[Intelligence Report] ${articleData.title} | Today Decode`,
        description: `Strategic Risk Assessment [${articleData.riskScore}/100]. Risk Level: ${articleData.riskLevel}. Impact Score: ${articleData.impactScore}. Analyst-verified intelligence for institutional subscribers.`,
        path: `/${category}/${slug}/`,
    });
}

export default function ArticlePage({ params }: { params: { category: string; slug: string } }) {
    // Mock data for the template demonstration
    const article = {
        title: "The Barents Gap: NATO's Silent Conflict in the High North",
        category: params.category,
        region: "High North",
        publishedAt: "February 28, 2026",
        readingTime: "12 min read",
        slug: params.slug,
        author: {
            name: "Dr. Elena Vance",
            role: "Strategic Analyst",
        },
        riskScore: 82,
        riskLevel: "HIGH" as const,
        isPremium: true,
        summary: [
            "NATO is increasing presence in the Barents Sea as Arctic melting opens new strategic corridors.",
            "The Barents Gap remains the most critical choke point for Russian Northern Fleet deployments.",
            "Intelligence suggests a shift towards hybrid underwater infrastructure interference in the corridor."
        ],
        faqData: [
            {
                question: "Why is the Barents Gap strategically significant?",
                answer: "It serves as the primary maritime corridor for the Russian Northern Fleet to reach the North Atlantic."
            }
        ],
        scenarios: {
            best: { title: "Arctic Cooperation", desc: "Diplomatic breakthrough leads to joint monitoring.", impact: 15 },
            likely: { title: "Steady Militarization", desc: "NATO and Russia continue incremental build-ups.", impact: 45 },
            worst: { title: "Direct Friction", desc: "Accidental naval collision triggers localized conflict.", impact: 85 }
        },
        forecastData: [
            { month: 'Mar', likely: 45, best: 40, worst: 50 },
            { month: 'Jun', likely: 52, best: 35, worst: 65 },
            { month: 'Sep', likely: 68, best: 30, worst: 80 },
            { month: 'Dec', likely: 75, best: 25, worst: 90 },
        ],
        content: "Draft content..."
    };

    return (
        <div className="relative min-h-screen bg-primary pb-20">
            <ReadingProgressBar />
            <JsonLd
                type="Article"
                data={{
                    title: article.title,
                    summary: article.summary[0],
                    publishedAt: article.publishedAt,
                    authorName: article.author.name,
                    image: "/images/high-north-intel.jpg",
                    faqData: article.faqData
                }}
            />

            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden border-b border-border-slate">
                <Image
                    src="/images/high-north-intel.jpg"
                    alt="Arctic Maritime Surveillance"
                    fill
                    className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
                    <div className="flex flex-col space-y-6">
                        <Breadcrumbs items={[
                            { label: 'Home', href: '/' },
                            { label: article.category, href: `/${article.category.toLowerCase()}/` },
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
                                <div className="h-10 w-10 rounded-full bg-slate-800 border border-border-slate" />
                                <div>
                                    <div className="text-xs font-black uppercase tracking-widest text-white">{article.author.name}</div>
                                    <div className="text-[10px] text-slate-400 uppercase font-medium">{article.author.role}</div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span>{article.publishedAt}</span>
                                <span>{article.readingTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
                {/* Fixed Action Sidebar */}
                <aside className="lg:col-span-1 hidden lg:block">
                    <div className="sticky top-32 space-y-8 flex flex-col items-center">
                        <FollowDesk type="category" id={article.category} label={article.category} />
                        <button className="p-3 bg-slate-900 border border-border-slate rounded-xl hover:border-white transition-all group">
                            <Share2 className="h-5 w-5 text-slate-400 group-hover:text-white" />
                        </button>
                        <button className="p-3 bg-slate-900 border border-border-slate rounded-xl hover:border-white transition-all group">
                            <Bookmark className="h-5 w-5 text-slate-400 group-hover:text-white" />
                        </button>
                        <CitationTool
                            title={article.title}
                            author={article.author.name}
                            publishedDate={article.publishedAt}
                            category={article.category}
                            slug={article.slug}
                        />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-7 space-y-12">
                    <KeyTakeaways points={article.summary} />

                    <div className="space-y-12">
                        <QuickAnswer points={article.summary} />

                        <PaywallGate isPremium={article.isPremium}>
                            <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed text-lg">
                                <p>
                                    The Barents Sea is no longer a frozen periphery. As the ice recedes, the geopolitical temperature rises.
                                    For decades, the <TermDefinition term="Barents Gap" definition="The maritime corridor between the North Cape and Bear Island, critical for naval transit.">Barents Gap</TermDefinition> has served as the silent highway
                                    for the Russian Northern Fleet's foray into the Atlantic.
                                </p>

                                <AdContainer slot="intel-mid-content" className="my-12" />

                                <p>
                                    Intelligence suggests a shift towards <TermDefinition term="Gray-Zone Warfare" definition="Competitive interactions among and within state and non-state actors that fall between the traditional war-and-peace duality.">Gray-Zone Warfare</TermDefinition>
                                    in this corridor, particularly targeting underwater infrastructure.
                                </p>
                            </div>
                        </PaywallGate>

                        {/* Visual Intelligence Section */}
                        <div className="space-y-12 pt-12 border-t border-border-slate">
                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase tracking-tight text-white">Visual Intelligence & Predictive Modeling</h3>
                                <p className="text-sm text-slate-400">Multi-variant scenario analysis based on current troop movements and ice-melt velocity.</p>
                            </div>

                            <ForecastTrend data={article.forecastData} />
                            <ScenarioForecast scenarios={article.scenarios} category={article.category} slug={article.slug} />
                        </div>
                    </div>
                </main>

                {/* Intelligence Sidepanel */}
                <aside className="lg:col-span-4 space-y-8">
                    <div className="sticky top-32 space-y-8">
                        <RiskGauge score={article.riskScore} label={article.riskLevel} />

                        <div className="p-6 bg-slate-900/50 border border-border-slate rounded-2xl space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-white">Related Intelligence</h4>
                            <div className="space-y-4">
                                {/* Mock Related */}
                                {[1, 2].map(i => (
                                    <Link key={i} href="#" className="block group">
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-bold text-accent-red uppercase">{article.category}</div>
                                            <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                                                Strategic Shifts in the Arctic Council {i}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
