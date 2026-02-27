import { constructMetadata } from "@/lib/seo";
import { ChevronLeft, Share2, Bookmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RiskGauge, KeyTakeaways } from "@/components/ui/article-widgets";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const { slug } = params;
    return constructMetadata({
        title: `[Intelligence Report] The Barents Gap | Today Decode`,
        description: "Strategic analysis of NATO's silent conflict in the High North.",
        path: `/articles/${slug}/`,
    });
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
    // Mock data for the template demonstration
    const article = {
        title: "The Barents Gap: NATO's Silent Conflict in the High North",
        category: "Security",
        publishedAt: "February 28, 2026",
        readingTime: "12 min read",
        author: {
            name: "Dr. Elena Vance",
            role: "Strategic Analyst",
        },
        riskScore: 82,
        riskLevel: "HIGH",
        summary: [
            "NATO is increasing presence in the Barents Sea as Arctic melting opens new strategic corridors.",
            "The Barents Gap remains the most critical choke point for Russian Northern Fleet deployments.",
            "Intelligence suggests a shift towards hybrid underwater infrastructure interference in the corridor."
        ],
        content: "The Barents Sea is no longer a frozen periphery. As the ice recedes, the geopolitical temperature rises. For decades, the Barents Gap has served as the silent highway for the Russian Northern Fleet's foray into the Atlantic... [Content truncation for demo]"
    };

    return (
        <article className="relative min-h-screen">
            <ReadingProgressBar />

            <div className="mx-auto max-w-7xl">
                {/* Breadcrumbs & Actions */}
                <div className="flex items-center justify-between py-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="mr-1 h-3 w-3" />
                        Back to Command Center
                    </Link>
                    <div className="flex items-center space-x-4">
                        <button className="text-slate-500 hover:text-white"><Share2 className="h-4 w-4" /></button>
                        <button className="text-slate-500 hover:text-white"><Bookmark className="h-4 w-4" /></button>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="space-y-4">
                            <span className="text-xs font-bold text-accent-red uppercase tracking-widest">
                                {article.category} Intelligence Briefing
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight">
                                {article.title}
                            </h1>
                            <div className="flex items-center space-x-6 pt-4 border-t border-border-slate">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Analyst</span>
                                    <span className="text-sm font-bold text-white">{article.author.name}</span>
                                </div>
                                <div className="flex flex-col border-l border-border-slate pl-6">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Published</span>
                                    <span className="text-sm font-bold text-white">{article.publishedAt}</span>
                                </div>
                                <div className="flex flex-col border-l border-border-slate pl-6">
                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Time</span>
                                    <span className="text-sm font-bold text-white">{article.readingTime}</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border-slate shadow-2xl">
                            <Image
                                src="/images/intel-1.jpg"
                                alt={article.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <p className="text-xl font-medium text-slate-200 leading-snug max-w-2xl italic">
                                    "The strategic value of the Barents Sea has surpassed the GIUK gap for the first time in thirty years."
                                </p>
                            </div>
                        </div>

                        <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed space-y-6">
                            <p>{article.content}</p>
                            {/* More content would go here */}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <KeyTakeaways points={article.summary} />
                            <RiskGauge score={article.riskScore} label={article.riskLevel} />

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
