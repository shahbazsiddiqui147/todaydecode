import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock, Layers, Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ContentRenderer } from "@/components/analysis/ContentRenderer";
import { QuickAnswers } from "@/components/aeo/quick-answers";
import { MethodologyBadge } from "@/components/intel/methodology-badge";
import { CitationTool } from "@/components/intel/citation-tool";
import { PaywallGate } from "@/components/monetization/paywall-gate";

interface PolicyBriefTemplateProps {
    article: any;
    formattedDate: string;
    readingTime: string;
    fullSiloPath?: string;
}

export const PolicyBriefTemplate: React.FC<PolicyBriefTemplateProps> = ({
    article,
    formattedDate,
    readingTime,
    fullSiloPath
}) => {
    const structuredData = (article.structuredData as any) || {};
    const recommendations = Array.isArray(structuredData.recommendations)
        ? structuredData.recommendations
        : [];

    return (
        <div className="policy-brief-container max-w-4xl mx-auto bg-white dark:bg-[#0A0F1E] shadow-2xl min-h-screen border-x border-border/10">
            {/* Today Decode Letterhead */}
            <div className="p-8 border-b-4 border-[#111827] dark:border-[#22D3EE] flex justify-between items-end bg-[#F8FAFC] dark:bg-[#020617]">
                <div className="space-y-1">
                    <div className="text-2xl font-black uppercase tracking-tighter text-[#111827] dark:text-[#F1F5F9]">
                        TODAY <span className="text-accent-red">DECODE</span>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Platform Strategy & Geopolitical Analysis</div>
                </div>
                <div className="text-right space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#111827] dark:text-[#22D3EE]">Strategic Dispatch No. {article.id.substring(0, 8)}</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{formattedDate}</div>
                </div>
            </div>

            {/* Title Section */}
            <div className="p-12 space-y-6">
                <div className="flex items-center gap-3">
                    <Badge className="bg-[#111827] text-white dark:bg-[#22D3EE] dark:text-[#0F172A] rounded-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                        POLICY BRIEF
                    </Badge>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Restricted Circulation</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-[#111827] dark:text-white uppercase tracking-tighter leading-none py-4 border-y border-slate-100 dark:border-white/5">
                    {article.title}
                </h1>

                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2"><Clock className="h-3 w-3" /> {readingTime}</span>
                        <span className="flex items-center gap-2 font-bold text-[#111827] dark:text-[#22D3EE]">Verification: Expert Analysis</span>
                    </div>
                    <div className="flex items-center gap-2 italic">
                        Node ID: {article.slug}
                    </div>
                </div>
            </div>

            {/* Executive Summary Box */}
            <div className="mx-12 p-8 bg-[#111827] text-white dark:bg-[#111827] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Shield className="h-24 w-24" />
                </div>
                <div className="relative z-10 space-y-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#22D3EE]">EXECUTIVE SUMMARY</h2>
                    <p className="text-lg font-medium leading-relaxed italic opacity-90">
                        {article.onPageLead || article.summary}
                    </p>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="p-12 space-y-12">
                {/* Problem Definition */}
                {structuredData.problemDefinition && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#111827] dark:text-[#22D3EE]">
                            <AlertCircle className="h-4 w-4" />
                            <h3 className="text-xs font-black uppercase tracking-widest">Problem Definition</h3>
                        </div>
                        <div className="text-slate-700 dark:text-slate-300 leading-relaxed font-serif text-lg border-l-2 border-slate-200 dark:border-white/10 pl-6 py-2">
                            {structuredData.problemDefinition}
                        </div>
                    </div>
                )}

                {/* Strategic Context / Analysis */}
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black">
                    <PaywallGate isPremium={article.isPremium}>
                        <ContentRenderer content={article.content} />
                    </PaywallGate>
                </div>

                {/* Policy Recommendations */}
                {recommendations.length > 0 && (
                    <div className="p-8 border-2 border-[#22D3EE] dark:bg-[#111827]/50 space-y-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-[#22D3EE]" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#111827] dark:text-[#22D3EE]">Policy Recommendations & Directives</h3>
                        </div>
                        <ol className="space-y-4">
                            {recommendations.map((rec: string, i: number) => (
                                <li key={i} className="flex gap-4 items-start">
                                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-[#111827] text-white dark:bg-[#22D3EE] dark:text-[#0F172A] text-[10px] font-black">{i + 1}</span>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">{rec}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                <QuickAnswers faqData={(article.faqData as any) || []} />
            </div>

            {/* Footer / Analyst Attribution */}
            <div className="mt-12 p-12 bg-[#F8FAFC] dark:bg-[#020617] border-t border-border/10 flex flex-col md:flex-row justify-between gap-8">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-white/10 relative overflow-hidden grayscale">
                        {article.author.image && (
                            <Image src={article.author.image} alt={article.author.name} fill className="object-cover" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <div className="text-xs font-black uppercase tracking-widest text-[#111827] dark:text-white">Principal Analyst: {article.author.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{article.author.role}</div>
                    </div>
                </div>
                <div className="max-w-xs">
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Analysis Citation</div>
                    <div className="p-3 bg-white dark:bg-[#0A0F1E] border border-border/10">
                        <CitationTool
                            title={article.title}
                            author={article.author.name}
                            publishedDate={formattedDate}
                            category={fullSiloPath || article.category.name}
                            slug={article.slug}
                        />
                    </div>
                </div>
            </div>

            {/* High-density clinical summary */}
            <div className="p-4 bg-[#111827] text-center">
                <p className="text-[8px] font-black uppercase tracking-[0.5em] text-[#22D3EE]/60">
                    Today Decode analysis report - (C) 2026
                </p>
            </div>
        </div>
    );
};

export default PolicyBriefTemplate;
