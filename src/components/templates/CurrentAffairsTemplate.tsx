import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock, Globe, Users, TrendingUp } from "lucide-react";
import { ContentRenderer } from "@/components/analysis/ContentRenderer";
import { QuickAnswers } from "@/components/aeo/quick-answers";
import { PaywallGate } from "@/components/monetization/paywall-gate";
import { CitationTool } from "@/components/intel/citation-tool";

interface CurrentAffairsTemplateProps {
    article: any;
    formattedDate: string;
    readingTime: string;
    fullSiloPath?: string;
}

export const CurrentAffairsTemplate: React.FC<CurrentAffairsTemplateProps> = ({
    article,
    formattedDate,
    readingTime,
    fullSiloPath
}) => {
    const structuredData = (article.structuredData as any) || {};
    const { situation, analysis, stakeholders, implications } = structuredData;

    return (
        <div className="current-affairs-template max-w-4xl mx-auto py-20 px-6">
            <div className="space-y-12">

                {/* Editorial Header */}
                <div className="space-y-6 text-center">
                    <Badge className="bg-blue-600 text-white rounded-full px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] border-0">
                        CURRENT AFFAIRS ANALYSIS
                    </Badge>

                    <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                        {article.title}
                    </h1>

                    <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {formattedDate}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>{readingTime}</span>
                    </div>
                </div>

                {/* Situation — Blue gradient card */}
                {situation && (
                    <div className="p-8 bg-gradient-to-br from-blue-950/40 to-cyan-950/20 border border-blue-800/30 rounded-3xl space-y-4">
                        <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 text-blue-400" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Situation</p>
                        </div>
                        <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                            {situation}
                        </p>
                    </div>
                )}

                {/* 2-Column Grid: analysis + stakeholders */}
                {(analysis || stakeholders) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {analysis && (
                            <div className="p-8 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-3xl space-y-4 hover:border-purple-500/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="h-5 w-5 text-purple-500" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-500">Analysis</p>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {analysis}
                                </p>
                            </div>
                        )}
                        {stakeholders && (
                            <div className="p-8 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-3xl space-y-4 hover:border-orange-500/30 transition-all">
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-orange-500" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Stakeholders</p>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {stakeholders}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Implications — Dark gradient banner with cyan accent */}
                {implications && (
                    <div className="relative p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black border border-white/10 rounded-3xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-t-3xl" />
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Implications</p>
                            <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                {implications}
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Body */}
                <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-xl prose-p:leading-relaxed pt-8 border-t border-slate-100 dark:border-white/5">
                    <PaywallGate isPremium={article.isPremium}>
                        <ContentRenderer content={article.content} />
                    </PaywallGate>
                </div>

                <QuickAnswers faqData={(article.faqData as any) || []} />

                <div className="pt-12 border-t border-slate-100 dark:border-white/5 opacity-50 hover:opacity-100 transition-opacity">
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
    );
};

export default CurrentAffairsTemplate;
