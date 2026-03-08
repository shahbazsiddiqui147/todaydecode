import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock, Layers, Globe, Shield, TrendingUp, Zap, ChevronRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ContentRenderer } from "@/components/analysis/ContentRenderer";
import { QuickAnswers } from "@/components/aeo/quick-answers";
import { MethodologyBadge } from "@/components/intel/methodology-badge";
import { CitationTool } from "@/components/intel/citation-tool";
import { PaywallGate } from "@/components/monetization/paywall-gate";

interface AnnualOutlookTemplateProps {
    article: any;
    formattedDate: string;
    readingTime: string;
}

export const AnnualOutlookTemplate: React.FC<AnnualOutlookTemplateProps> = ({
    article,
    formattedDate,
    readingTime
}) => {
    const structuredData = (article.structuredData as any) || {};
    const strategicThemes = Array.isArray(structuredData.strategicThemes) ? structuredData.strategicThemes : [];
    const regionalRisks = Array.isArray(structuredData.regionalRisks) ? structuredData.regionalRisks : [
        { region: "Global", risk: 65 },
        { region: "MENA", risk: 82 },
        { region: "Eurozone", risk: 45 },
        { region: "APAC", risk: 71 },
        { region: "Americas", risk: 38 },
        { region: "SS-Africa", risk: 59 }
    ];

    return (
        <div className="annual-outlook-container max-w-screen-2xl mx-auto pb-40">
            {/* Flagship Hero */}
            <div className="relative h-screen min-h-[900px] w-full border-b-8 border-accent-red overflow-hidden bg-slate-950">
                <Image
                    src={article.featuredImage || "/images/intel-1.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover opacity-30 grayscale saturate-0 transition-opacity duration-1000 scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent text-center" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-12">
                    <div className="space-y-6 flex flex-col items-center">
                        <Badge className="bg-white text-black dark:bg-white dark:text-black rounded-none px-8 py-2 text-xs font-black uppercase tracking-[0.5em] shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                            FLAGSHIP REPORT: {new Date().getFullYear()} OUTLOOK
                        </Badge>
                        <h1 className="text-7xl md:text-[10rem] font-black text-white uppercase tracking-tighter leading-[0.8] max-w-7xl drop-shadow-2xl italic">
                            {article.title}
                        </h1>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-white">STATUS</span>
                            <span className="p-1 px-3 bg-accent-red/20 text-accent-red border border-accent-red/30">UNCLASSIFIED</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-white">HORIZON</span>
                            <span>12-MONTH CYCLE</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-white">SYSTEM</span>
                            <span>ENCRYPTED_NODE</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-white">ISSUED</span>
                            <span>{formattedDate}</span>
                        </div>
                    </div>

                    <div className="animate-bounce pt-20">
                        <ChevronRight className="h-10 w-10 text-white rotate-90 opacity-40" />
                    </div>
                </div>
            </div>

            {/* Strategic Themes Grid */}
            <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {strategicThemes.length > 0 ? strategicThemes.map((theme: any, i: number) => (
                        <div key={i} className="p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-2xl space-y-6 hover:-translate-y-2 transition-transform duration-500">
                            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-accent-red">
                                {i === 0 ? <Zap className="h-6 w-6" /> : i === 1 ? <Shield className="h-6 w-6" /> : <TrendingUp className="h-6 w-6" />}
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white italic">{theme.title || `Theme 0${i + 1}`}</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tight">
                                {theme.description || "Synthesizing systemic volatility across multi-sector silos for 2026."}
                            </p>
                        </div>
                    )) : (
                        <div className="col-span-3 p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-2xl flex flex-col items-center gap-4">
                            <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white italic">Strategic Themes Grid</h3>
                            <p className="text-sm text-slate-500">Initializing macro-sector mapping...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Regional Risk Matrix */}
            <div className="max-w-7xl mx-auto px-6 py-32 space-y-12">
                <div className="flex flex-col items-center space-y-4">
                    <Badge className="bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500 rounded-none px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                        Global Intelligence Node
                    </Badge>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter dark:text-white italic text-center">Regional Volatility Matrix</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                    {regionalRisks.map((risk: any, i: number) => (
                        <div key={i} className="p-6 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 text-center space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{risk.region}</div>
                            <div className={cn(
                                "text-3xl font-black",
                                risk.risk > 75 ? "text-accent-red" : risk.risk > 40 ? "text-yellow-500" : "text-accent-green"
                            )}>{risk.risk}%</div>
                            <div className="h-1 w-full bg-slate-200 dark:bg-slate-800">
                                <div
                                    className={cn(
                                        "h-full transition-all duration-1000",
                                        risk.risk > 75 ? "bg-accent-red" : risk.risk > 40 ? "bg-yellow-500" : "bg-accent-green"
                                    )}
                                    style={{ width: `${risk.risk}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Multi-Silo */}
            <div className="max-w-4xl mx-auto px-6 space-y-20">
                <main className="prose prose-slate dark:prose-invert max-w-none prose-h2:text-4xl prose-h2:font-black prose-h2:uppercase prose-h2:tracking-tighter prose-h2:italic prose-h2:border-b-2 prose-h2:border-accent-red prose-h2:pb-4 prose-p:text-xl prose-p:leading-relaxed prose-p:text-slate-800 dark:prose-p:text-slate-300">
                    <PaywallGate isPremium={article.isPremium}>
                        <ContentRenderer content={article.content} />
                    </PaywallGate>
                </main>

                <div className="pt-20 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <CitationTool
                        title={article.title}
                        author={article.author.name}
                        publishedDate={formattedDate}
                        category={article.category.name}
                        slug={article.slug}
                    />
                    <div className="space-y-4 text-center md:text-right grayscale opacity-50">
                        <MethodologyBadge />
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Publication ID: TD-OUTLOOK-{article.id.substring(0, 4)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnualOutlookTemplate;
