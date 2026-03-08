import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock, Layers, ShieldCheck, ClipboardList, ArrowRight, BookOpen, ExternalLink, Table } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ContentRenderer } from "@/components/analysis/ContentRenderer";
import { QuickAnswers } from "@/components/aeo/quick-answers";
import { MethodologyBadge } from "@/components/intel/methodology-badge";
import { CitationTool } from "@/components/intel/citation-tool";
import { PaywallGate } from "@/components/monetization/paywall-gate";

interface PolicyToolkitTemplateProps {
    article: any;
    formattedDate: string;
    readingTime: string;
}

export const PolicyToolkitTemplate: React.FC<PolicyToolkitTemplateProps> = ({
    article,
    formattedDate,
    readingTime
}) => {
    const structuredData = (article.structuredData as any) || {};
    const implementationSteps = Array.isArray(structuredData.implementationStrategy) ? structuredData.implementationStrategy : [];
    const comparativeAnalysis = Array.isArray(structuredData.comparativeAnalysis) ? structuredData.comparativeAnalysis : [];

    return (
        <div className="policy-toolkit-container max-w-7xl mx-auto px-6 py-12">
            {/* Operational Header */}
            <div className="p-10 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-3xl space-y-6">
                <div className="flex items-center gap-4">
                    <Badge className="bg-slate-900 text-white dark:bg-white dark:text-black rounded-none px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                        POLICY TOOLKIT
                    </Badge>
                    <MethodologyBadge />
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight italic">
                    {article.title}
                </h1>

                <div className="flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <div className="flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Operational Manual</div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {formattedDate}</div>
                    <div className="flex items-center gap-2"><Layers className="h-4 w-4" /> {readingTime}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-16">
                <main className="lg:col-span-8 space-y-20">
                    {/* Implementation Strategy Framework */}
                    <div className="space-y-10">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <ShieldCheck className="h-6 w-6 text-accent-green" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white italic">Implementation Strategy</h2>
                        </div>

                        <div className="space-y-6">
                            {implementationSteps.length > 0 ? implementationSteps.map((step: any, i: number) => (
                                <div key={i} className="flex gap-6 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl group hover:border-accent-green/30 transition-all">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-100 dark:bg-accent-green/10 text-slate-900 dark:text-accent-green flex items-center justify-center font-black text-sm">
                                        {i + 1}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-black uppercase tracking-tight dark:text-white">{step.title || `Phase ${i + 1}`}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tight">
                                            {step.description || "Synthesizing mitigation protocols for high-volatility environments."}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 bg-slate-100 dark:bg-white/5 rounded-2xl text-center">
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest italic leading-relaxed">
                                        No specific implementation steps identified in this toolkit...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comparative Analysis Table */}
                    {comparativeAnalysis.length > 0 && (
                        <div className="space-y-10">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                <Table className="h-6 w-6 text-[#22D3EE]" />
                                <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white italic">Comparative Framework Analysis</h2>
                            </div>

                            <div className="overflow-hidden border border-slate-200 dark:border-white/5 rounded-3xl">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 dark:bg-white/5">
                                        <tr>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-white/5">Parameter</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-white/5 font-mono">Legacy Approach</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-accent-green border-b border-slate-200 dark:border-white/5 font-mono">TodayDecode Framework</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {comparativeAnalysis.map((item: any, i: number) => (
                                            <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                                <td className="p-6 text-xs font-black uppercase tracking-tight dark:text-white">{item.parameter}</td>
                                                <td className="p-6 text-xs text-slate-500 dark:text-slate-400 font-mono italic opacity-60">{item.legacy}</td>
                                                <td className="p-6 text-xs text-slate-900 dark:text-white font-bold">{item.recommended}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed pt-12 border-t border-white/5">
                        <PaywallGate isPremium={article.isPremium}>
                            <ContentRenderer content={article.content} />
                        </PaywallGate>
                    </div>

                    <QuickAnswers faqData={(article.faqData as any) || []} />
                </main>

                {/* Operational Sidebar */}
                <aside className="lg:col-span-4 space-y-10">
                    <div className="sticky top-32 space-y-10">
                        <div className="p-8 bg-slate-900/90 border-t-4 border-accent-green rounded-3xl space-y-8">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">Resource Manifest</h4>
                                <BookOpen className="h-4 w-4 text-accent-green" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer group">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">Data Manifest Node</span>
                                    <ExternalLink className="h-3 w-3 text-slate-500" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer group">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">Risk Inventory .CSV</span>
                                    <ExternalLink className="h-3 w-3 text-slate-500" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-pointer group">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">Protocol Checklist</span>
                                    <ExternalLink className="h-3 w-3 text-slate-500" />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-secondary/30 border border-border/10 rounded-3xl grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                            <CitationTool
                                title={article.title}
                                author={article.author.name}
                                publishedDate={formattedDate}
                                category={article.category.name}
                                slug={article.slug}
                            />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PolicyToolkitTemplate;
