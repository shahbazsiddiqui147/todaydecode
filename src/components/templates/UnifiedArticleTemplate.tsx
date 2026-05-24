import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ContentRenderer } from "@/components/analysis/ContentRenderer";
import { QuickAnswers } from "@/components/aeo/quick-answers";
import { MethodologyBadge } from "@/components/intel/methodology-badge";
import { CitationTool } from "@/components/intel/citation-tool";
import { PaywallGate } from "@/components/monetization/paywall-gate";
import { AdUnit } from "@/components/monetization/AdUnit";

const FORMAT_LABELS: Record<string, string> = {
    POLICY_BRIEF:      "Policy Brief",
    STRATEGIC_REPORT:  "Strategic Report",
    COMMENTARY:        "Commentary",
    RISK_ASSESSMENT:   "Risk Assessment",
    SCENARIO_ANALYSIS: "Scenario Analysis",
    DATA_INSIGHT:      "Data Insight",
    ANNUAL_OUTLOOK:    "Annual Outlook",
    POLICY_TOOLKIT:    "Policy Toolkit",
    NEWS_BRIEF:        "News Brief",
    CURRENT_AFFAIRS:   "Current Affairs",
};

const RISK_COLOR = (score: number) =>
    score > 70 ? "text-accent-red" : score > 40 ? "text-yellow-400" : "text-emerald-400";
const RISK_BAR = (score: number) =>
    score > 70 ? "bg-accent-red" : score > 40 ? "bg-yellow-400" : "bg-emerald-400";

interface Props {
    article: any;
    formattedDate: string;
    readingTime: string;
    fullSiloPath?: string;
}

export const UnifiedArticleTemplate: React.FC<Props> = ({
    article,
    formattedDate,
    readingTime,
    fullSiloPath,
}) => {
    const structuredData = (article.structuredData as any) || {};
    const volatilityDrivers: string[] = Array.isArray(structuredData.volatilityDrivers)
        ? structuredData.volatilityDrivers
        : [];
    const affectedSectors: string[] = Array.isArray(structuredData.affectedSectors)
        ? structuredData.affectedSectors
        : [];

    const formatLabel = FORMAT_LABELS[article.format] || "Analysis";

    return (
        <div className="unified-article max-w-screen-2xl mx-auto pb-24">

            {/* ── HERO ── */}
            <div className={cn(
                "relative w-full overflow-hidden border-b border-border/10 bg-[#020617]",
                article.featuredImage ? "min-h-[60vh]" : "min-h-[44vh]"
            )}>
                {article.featuredImage && (
                    <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover opacity-35 grayscale"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-12 flex flex-col justify-end h-full">
                    {/* Badges */}
                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                        <Badge className="bg-accent-red/90 text-white rounded-sm px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                            {formatLabel}
                        </Badge>
                        <MethodologyBadge />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter leading-[1.1] max-w-4xl mb-8 normal-case">
                        {article.title}
                    </h1>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-white/10 border border-white/20 overflow-hidden relative shrink-0">
                                {article.author.image && (
                                    <Image src={article.author.image} alt={article.author.name} fill className="object-cover grayscale" />
                                )}
                            </div>
                            <div>
                                <div className="text-[11px] font-black uppercase tracking-widest text-white leading-none">
                                    {article.author.name}
                                </div>
                                <div className="text-[9px] text-[#22D3EE] font-bold uppercase tracking-widest mt-0.5 opacity-80">
                                    {article.author.role || "Research & Analysis Unit"}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Published <span className="text-white ml-1">{formattedDate}</span></span>
                            <span>{readingTime}</span>
                            <span className="text-[#22D3EE]">Verified Analysis</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── LEADERBOARD AD — after hero ── */}
            <div className="max-w-6xl mx-auto px-6 mt-8 flex justify-center">
                <AdUnit
                    placement="leaderboard"
                    adsenseSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD}
                    gamUnit={process.env.NEXT_PUBLIC_GAM_UNIT_LEADERBOARD}
                    ezoicId={101}
                />
            </div>

            {/* ── BODY GRID ── */}
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">

                {/* ── SIDEBAR ── */}
                <aside className="lg:col-span-3 order-2 lg:order-1">
                    <div className="sticky top-28 space-y-6">

                        {/* Risk & Impact */}
                        <div className="p-5 border border-white/8 rounded-2xl bg-white/[0.03] space-y-5">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-3">
                                Analytical Benchmarks
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Risk Intensity</span>
                                        <span className={cn("text-[11px] font-black", RISK_COLOR(article.riskScore))}>
                                            {article.riskScore}%
                                        </span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all", RISK_BAR(article.riskScore))}
                                            style={{ width: `${article.riskScore}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Strategic Impact</span>
                                        <span className="text-[11px] font-black text-[#22D3EE]">{article.impactScore}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#22D3EE] rounded-full transition-all"
                                            style={{ width: `${article.impactScore}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Key Drivers — only if present */}
                        {volatilityDrivers.length > 0 && (
                            <div className="p-5 border border-white/8 rounded-2xl bg-white/[0.03] space-y-4">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-3">
                                    Key Drivers
                                </h4>
                                <ul className="space-y-2.5">
                                    {volatilityDrivers.map((d, i) => (
                                        <li key={i} className="flex gap-2.5 items-start">
                                            <span className="text-[9px] font-black text-accent-red mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                                            <span className="text-[10px] font-medium text-slate-300 leading-snug">{d}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Affected Sectors — only if present */}
                        {affectedSectors.length > 0 && (
                            <div className="p-5 border border-white/8 rounded-2xl bg-white/[0.03] space-y-4">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-3">
                                    Affected Sectors
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {affectedSectors.map((s, i) => (
                                        <span key={i} className="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-white/5 border border-white/8 text-slate-400">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sidebar Ad */}
                        <AdUnit
                            placement="sidebar"
                            adsenseSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR}
                            gamUnit={process.env.NEXT_PUBLIC_GAM_UNIT_SIDEBAR}
                            ezoicId={103}
                        />
                    </div>
                </aside>

                {/* ── MAIN CONTENT ── */}
                <main className="lg:col-span-9 order-1 lg:order-2 space-y-10">

                    {/* Pull quote */}
                    {article.onPageLead && (
                        <blockquote className="border-l-4 border-[#22D3EE] pl-6 py-2">
                            <p className="text-xl md:text-2xl font-serif text-slate-200 leading-relaxed italic">
                                "{article.onPageLead}"
                            </p>
                        </blockquote>
                    )}

                    {/* Article body */}
                    <div className="prose prose-slate dark:prose-invert max-w-none
                        prose-p:text-[17px] prose-p:leading-[1.8] prose-p:text-slate-300
                        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white
                        prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                        prose-strong:text-white prose-strong:font-bold
                        prose-li:text-slate-300 prose-li:text-[17px]
                        prose-img:rounded-2xl">
                        <PaywallGate isPremium={article.isPremium}>
                            <ContentRenderer content={article.content} />
                        </PaywallGate>
                    </div>

                    {/* End-of-article Ad */}
                    <div className="flex justify-center pt-4">
                        <AdUnit
                            placement="footer"
                            adsenseSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER}
                            gamUnit={process.env.NEXT_PUBLIC_GAM_UNIT_FOOTER}
                            ezoicId={104}
                        />
                    </div>

                    {/* Citation Tool — full width below article */}
                    <div className="border-t border-white/8 pt-8">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">
                            Cite This Report
                        </h4>
                        <CitationTool
                            title={article.title}
                            author={article.author.name}
                            publishedDate={formattedDate}
                            category={fullSiloPath || article.category.name}
                            slug={article.slug}
                        />
                    </div>

                    {/* FAQ */}
                    <div className="pt-4">
                        <QuickAnswers faqData={(article.faqData as any) || []} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UnifiedArticleTemplate;
