import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock, Layers, FileText, Database, Activity, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ContentRenderer } from "@/components/analysis/ContentRenderer";
import { QuickAnswers } from "@/components/aeo/quick-answers";
import { MethodologyBadge } from "@/components/intel/methodology-badge";
import { CitationTool } from "@/components/intel/citation-tool";
import { ScenarioForecast } from "@/components/analysis/scenario-forecast";
import { PaywallGate } from "@/components/monetization/paywall-gate";

interface StrategicReportTemplateProps {
    article: any;
    formattedDate: string;
    readingTime: string;
    processedScenarios: any;
    fullSiloPath?: string;
}

export const StrategicReportTemplate: React.FC<StrategicReportTemplateProps> = ({
    article,
    formattedDate,
    readingTime,
    processedScenarios,
    fullSiloPath
}) => {
    const structuredData = (article.structuredData as any) || {};

    return (
        <div className="strategic-report-container max-w-screen-2xl mx-auto pb-20">
            {/* Academic Hero Section */}
            <div className="relative h-[70vh] w-full overflow-hidden border-b border-border/10 bg-[#020617]">
                <Image
                    src={article.featuredImage || "/images/intel-1.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover opacity-40 grayscale transition-all duration-1000 hover:opacity-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-12 max-w-7xl mx-auto">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <Badge className="bg-accent-red text-white rounded-none px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                                ANALYSIS REPORT
                            </Badge>
                            <MethodologyBadge />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] max-w-5xl italic">
                            {article.title}
                        </h1>

                        <div className="flex flex-col md:flex-row md:items-center justify-between pt-12 border-t border-white/10 gap-8">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 rounded-full border border-white/20 overflow-hidden relative grayscale">
                                    {article.author.image && (
                                        <Image src={article.author.image} alt={article.author.name} fill className="object-cover" />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-black uppercase tracking-widest text-white">{article.author.name}</div>
                                    <div className="text-[10px] text-[#22D3EE] font-black uppercase tracking-[0.2em]">{article.author.role}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-400">PUBLISHED</span>
                                    <span className="text-white flex items-center gap-2"><Clock className="h-3 w-3" /> {formattedDate}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-slate-400">READ TIME</span>
                                    <span className="text-white flex items-center gap-2"><Layers className="h-3 w-3" /> {readingTime}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[#22D3EE]">VERIFIED_ANALYSIS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-20">
                {/* Methodology & Context Sidebar */}
                <aside className="lg:col-span-3 space-y-10">
                    <div className="sticky top-32 space-y-10">
                        {structuredData.methodology && (
                            <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl space-y-4">
                                <div className="flex items-center gap-2 text-[#22D3EE]">
                                    <Activity className="h-4 w-4" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest">Research Methodology</h3>
                                </div>
                                <p className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
                                    {structuredData.methodology}
                                </p>
                            </div>
                        )}

                        <div className="p-6 border border-white/5 rounded-2xl space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5 pb-4">Analytical Benchmarks</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase text-slate-400">Risk Intensity</span>
                                    <span className="text-xs font-black text-accent-red">{article.riskScore}%</span>
                                </div>
                                <div className="h-1 w-full bg-slate-800 rounded-full">
                                    <div className="h-full bg-accent-red" style={{ width: `${article.riskScore}%` }} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase text-slate-400">Strategic Impact</span>
                                    <span className="text-xs font-black text-[#22D3EE]">{article.impactScore}%</span>
                                </div>
                                <div className="h-1 w-full bg-slate-800 rounded-full">
                                    <div className="h-full bg-[#22D3EE]" style={{ width: `${article.impactScore}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Analysis Thread */}
                <main className="lg:col-span-9 space-y-20">
                    {/* Abstract / Leads */}
                    <div className="space-y-8">
                        {article.onPageLead && (
                            <div className="p-10 bg-white/5 border-l-4 border-[#22D3EE] relative overflow-hidden">
                                <FileText className="absolute -right-4 -top-4 h-24 w-24 opacity-5" />
                                <p className="text-2xl font-serif text-slate-200 leading-relaxed italic">
                                    "{article.onPageLead}"
                                </p>
                            </div>
                        )}

                        {/* Evidence Core */}
                        {structuredData.evidence && (
                            <div className="p-10 bg-[#111827] border border-white/5 rounded-3xl space-y-6">
                                <div className="flex items-center gap-3">
                                    <Database className="h-5 w-5 text-[#22D3EE]" />
                                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Empirical Evidence Core</h2>
                                </div>
                                <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-line font-mono uppercase tracking-tight opacity-80">
                                    {structuredData.evidence}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Primary Analysis Content */}
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black prose-img:rounded-3xl">
                        <PaywallGate isPremium={article.isPremium}>
                            <ContentRenderer content={article.content} />
                        </PaywallGate>
                    </div>

                    {/* Scenario Models */}
                    <div className="space-y-10 py-16 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <GitBranch className="h-6 w-6 text-[#22D3EE]" />
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic">Analysis Outcome Models</h3>
                        </div>
                        <ScenarioForecast scenarios={processedScenarios} category={article.category.slug} slug={article.slug} />
                    </div>

                    <QuickAnswers faqData={(article.faqData as any) || []} />

                    {/* Sources & Citations */}
                    <div className="pt-16 border-t border-white/10 space-y-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Sources & Analytical References</h4>
                        <div className="p-8 bg-black/20 border border-white/5 rounded-2xl">
                            <CitationTool
                                title={article.title}
                                author={article.author.name}
                                publishedDate={formattedDate}
                                category={fullSiloPath || article.category.name}
                                slug={article.slug}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StrategicReportTemplate;
