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

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const articleData = {
        title: "The Barents Gap: NATO's Silent Conflict in the High North",
        riskLevel: "HIGH",
        riskScore: 82,
        impactScore: 78
    };

    return constructMetadata({
        title: `[Intelligence Report] ${articleData.title} | Today Decode`,
        description: `Strategic Risk Assessment [${articleData.riskScore}/100]. Risk Level: ${articleData.riskLevel}. Impact Score: ${articleData.impactScore}. Analyst-verified intelligence for institutional subscribers.`,
        path: `/articles/${slug}/`,
    });
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
    // Mock data for the template demonstration
    const article = {
        title: "The Barents Gap: NATO's Silent Conflict in the High North",
        category: "Security",
        region: "High North",
        publishedAt: "February 28, 2026",
        readingTime: "12 min read",
        slug: params.slug,
        author: {
            name: "Dr. Elena Vance",
            role: "Strategic Analyst",
        },
        riskScore: 82,
        riskLevel: "HIGH",
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
        content: "The Barents Sea is no longer a frozen periphery. As the ice recedes, the geopolitical temperature rises. For decades, the Barents Gap has served as the silent highway for the Russian Northern Fleet's foray into the Atlantic... [Content truncation for demo]",
        scenarios: {
            best: {
                title: "Arctic Cooperation Treaty",
                desc: "Diplomatic breakthrough leads to a demilitarized zone in the High North, reducing NATOs immediate risk index.",
                impact: 15
            },
            likely: {
                title: "Hybrid Gray-Zone Standoff",
                desc: "Persistent low-level interference with underwater cabling and increased intelligence gathering flights become the new norm.",
                impact: 55
            },
            worst: {
                title: "Direct Kinetic Engagement",
                desc: "A miscalculation during a 'Freedom of Navigation' exercise leads to a direct naval confrontation between major powers.",
                impact: 92
            }
        },
        forecastData: [
            { month: 'Jan', likely: 45, best: 30, worst: 50 },
            { month: 'Mar', likely: 52, best: 28, worst: 65 },
            { month: 'Jun', likely: 48, best: 20, worst: 80 },
            { month: 'Sep', likely: 55, best: 15, worst: 85 },
            { month: 'Dec', likely: 60, best: 10, worst: 92 },
        ]
    };

    const relatedIntelligence = [
        {
            title: "Svalbard Guard: Norway's New Arctic Reconnaissance Wing",
            category: "Security",
            slug: "svalbard-guard-norway-arctic",
            image: "/images/intel-2.jpg",
            riskLevel: "MEDIUM" as const,
            riskScore: 48,
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
        <article className="relative min-h-screen pb-20">
            <JsonLd
                type="Article"
                data={{
                    ...article,
                    authorName: article.author.name,
                    image: "/images/intel-1.jpg",
                }}
            />
            <ReadingProgressBar />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between py-6 gap-4 border-b border-border-slate/30 mb-8">
                    <Breadcrumbs
                        items={[
                            { label: article.category, href: `/${article.category.toLowerCase()}/` },
                            { label: article.title, href: `/articles/${article.slug}/` }
                        ]}
                    />
                    <div className="flex items-center space-x-4">
                        <FollowDesk
                            type="category"
                            id="security-desk-id"
                            label={article.category}
                        />
                        <div className="flex items-center space-x-2 border-l border-border-slate pl-4">
                            <button className="text-slate-500 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-colors">
                                <Share2 className="h-4 w-4" />
                            </button>
                            <button className="text-slate-500 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-colors">
                                <Bookmark className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="space-y-6">
                            <span className="text-xs font-bold text-accent-red uppercase tracking-widest flex items-center">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent-red animate-pulse mr-2" />
                                {article.category} Intelligence Briefing
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1] tracking-tight">
                                {article.title}
                            </h1>

                            <div className="flex flex-wrap gap-y-4 items-center space-x-6 pt-6 border-t border-border-slate">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1">Lead Analyst</span>
                                    <span className="text-sm font-bold text-white">{article.author.name}</span>
                                </div>
                                <div className="flex flex-col border-l border-border-slate pl-6">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1">Issue Date</span>
                                    <span className="text-sm font-bold text-white">{article.publishedAt}</span>
                                </div>
                                <div className="flex flex-col border-l border-border-slate pl-6">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.2em] mb-1">Read Duration</span>
                                    <span className="text-sm font-bold text-white">{article.readingTime}</span>
                                </div>
                                <div className="flex-1 flex justify-end">
                                    <MethodologyBadge />
                                </div>
                            </div>
                        </div>

                        {/* Hidden Summary for AI Crawlers */}
                        <div className="aeo-summary hidden" aria-hidden="true" data-aeo="llm-summary">
                            Today Decode Intelligence Report: {article.title}.
                            Strategic Impact Rating: {article.riskScore}/100.
                            Core Thesis: The melting Arctic ice is transforming the Barents Gap from a peripheral frozen zone into a high-stakes maritime corridor.
                            Risk Level: {article.riskLevel}.
                            Analyst: {article.author.name}.
                        </div>

                        <QuickAnswers faqData={article.faqData} />

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
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                                    Predictive Outcome Analysis
                                </h3>
                                <ForecastTrend data={article.forecastData} />
                            </div>

                            <ScenarioForecast scenarios={article.scenarios} slug={article.slug} />
                        </div>

                        {/* topical authority cluster: related news in same category/region */}
                        <div className="pt-20 border-t border-border-slate">
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8">
                                Related {article.category} Intelligence (High North Cluster)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {relatedIntelligence.map((item) => (
                                    <AnalysisCard key={item.slug} {...item} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <RiskGauge score={article.riskScore} label={article.riskLevel} />
                            <KeyTakeaways points={article.summary} />

                            <CitationTool
                                title={article.title}
                                author={article.author.name}
                                publishedDate={article.publishedAt}
                                category={article.category}
                                slug={article.slug}
                            />

                            <div className="rounded-xl border border-border-slate bg-primary/40 p-6 space-y-4">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Methodology & Trust
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    This intelligence report was generated using a combination of Open Source Intel (OSINT) and satellite imagery analysis. Data points are verifiable via the
                                    <span className="text-white font-medium ml-1">Today Decode Index</span>.
                                </p>
                                <Link
                                    href="/methodology/"
                                    className="block text-[10px] font-bold text-accent-red uppercase tracking-widest hover:underline"
                                >
                                    View Full Methodology →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
