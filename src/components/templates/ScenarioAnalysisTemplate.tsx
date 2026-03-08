import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock, Layers, GitBranch, Eye, Info, AlertCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ContentRenderer } from "@/components/analysis/ContentRenderer";
import { QuickAnswers } from "@/components/aeo/quick-answers";
import { MethodologyBadge } from "@/components/intel/methodology-badge";
import { ScenarioForecast } from "@/components/analysis/scenario-forecast";
import { PaywallGate } from "@/components/monetization/paywall-gate";

interface ScenarioAnalysisTemplateProps {
    article: any;
    formattedDate: string;
    readingTime: string;
    processedScenarios: any;
}

export const ScenarioAnalysisTemplate: React.FC<ScenarioAnalysisTemplateProps> = ({
    article,
    formattedDate,
    readingTime,
    processedScenarios
}) => {
    const structuredData = (article.structuredData as any) || {};
    const signals = Array.isArray(structuredData.signalsToWatch)
        ? structuredData.signalsToWatch
        : [];

    return (
        <div className="scenario-analysis-container max-w-screen-2xl mx-auto pb-20">
            {/* Predictive Hero */}
            <div className="p-12 border-b border-white/5 bg-[#020617] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22D3EE]/5 blur-[120px] rounded-full -mr-64 -mt-64" />

                <div className="relative z-10 max-w-7xl mx-auto space-y-10 text-center">
                    <div className="flex flex-col items-center gap-6">
                        <Badge className="bg-[#22D3EE] text-[#0F172A] rounded-none px-6 py-1 text-[10px] font-black uppercase tracking-[0.3em]">
                            SCENARIO ANALYSIS
                        </Badge>
                        <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.8] max-w-6xl">
                            {article.title}
                        </h1>
                    </div>

                    <div className="flex items-center justify-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                        <span className="flex items-center gap-2 text-[#22D3EE]"><TrendingUp className="h-4 w-4" /> Predictive Horizon: 12 Months</span>
                        <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {formattedDate}</span>
                        <span className="flex items-center gap-2"><Layers className="h-4 w-4" /> {readingTime}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-16">
                {/* Main Forecast Thread */}
                <main className="lg:col-span-8 space-y-20">
                    {/* The Centerpiece Modeling View */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="flex items-center gap-3">
                                <GitBranch className="h-6 w-6 text-[#22D3EE]" />
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-white italic">Modeling Outcome Divergence</h2>
                            </div>
                            <MethodologyBadge />
                        </div>
                        <ScenarioForecast scenarios={processedScenarios} category={article.category.slug} slug={article.slug} />
                    </div>

                    {/* Content Thread */}
                    <div className="space-y-12">
                        {article.onPageLead && (
                            <div className="text-2xl font-medium text-slate-300 leading-relaxed italic border-l-4 border-[#22D3EE] pl-10 py-4">
                                "{article.onPageLead}"
                            </div>
                        )}

                        <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-sm prose-headings:font-black prose-headings:text-slate-500 prose-headings:border-b prose-headings:border-white/5 prose-headings:pb-4">
                            <PaywallGate isPremium={article.isPremium}>
                                <ContentRenderer content={article.content} />
                            </PaywallGate>
                        </div>
                    </div>

                    {/* Outcome Divergence Logic Section */}
                    {structuredData.divergenceLogic && (
                        <div className="p-10 bg-[#111827] border border-white/5 rounded-3xl space-y-8">
                            <div className="flex items-center gap-3">
                                <Info className="h-5 w-5 text-[#22D3EE]" />
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Logic of Outcome Divergence</h3>
                            </div>
                            <p className="text-slate-400 text-lg leading-relaxed italic">
                                {structuredData.divergenceLogic}
                            </p>
                        </div>
                    )}

                    <QuickAnswers faqData={(article.faqData as any) || []} />
                </main>

                {/* Sidebar Specialization */}
                <aside className="lg:col-span-4 space-y-12">
                    <div className="sticky top-32 space-y-12">
                        {/* Signal Watch Hub */}
                        <div className="p-8 bg-[#020617] border-2 border-[#22D3EE] rounded-3xl space-y-8 relative overflow-hidden group hover:border-white transition-all duration-500">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Eye className="h-24 w-24 text-[#22D3EE]" />
                            </div>

                            <div className="space-y-2 relative z-10">
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#22D3EE]">Critical Signals to Watch</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                    Early-warning indicators determining scenario trajectory.
                                </p>
                            </div>

                            <div className="space-y-4 relative z-10">
                                {signals.length > 0 ? signals.map((signal: string, i: number) => (
                                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-[#22D3EE]">Indicator {i + 1}</span>
                                            <AlertCircle className="h-3 w-3 text-[#22D3EE]" />
                                        </div>
                                        <p className="text-[11px] font-bold text-white uppercase tracking-tight leading-tight">
                                            {signal}
                                        </p>
                                    </div>
                                )) : (
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic animate-pulse">
                                        Initializing signal processors...
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Analyst Meta */}
                        <div className="p-8 bg-black/20 border border-white/5 rounded-3xl space-y-6 grayscale transition-all hover:grayscale-0">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <div className="h-12 w-12 rounded-full border border-[#22D3EE] overflow-hidden relative">
                                    {article.author.image && (
                                        <Image src={article.author.image} alt={article.author.name} fill className="object-cover" />
                                    )}
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-white">{article.author.name}</div>
                                    <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{article.author.role}</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#22D3EE]">Scenario Auditor Verification</span>
                                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#22D3EE]" style={{ width: '100%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ScenarioAnalysisTemplate;
