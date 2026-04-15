import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, Quote, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ContentRenderer } from "@/components/analysis/ContentRenderer";
import { QuickAnswers } from "@/components/aeo/quick-answers";
import { PaywallGate } from "@/components/monetization/paywall-gate";
import { CitationTool } from "@/components/intel/citation-tool";

interface CommentaryTemplateProps {
    article: any;
    formattedDate: string;
    readingTime: string;
    fullSiloPath?: string;
}

export const CommentaryTemplate: React.FC<CommentaryTemplateProps> = ({
    article,
    formattedDate,
    readingTime,
    fullSiloPath
}) => {
    return (
        <div className="commentary-template max-w-4xl mx-auto py-20 px-6">
            <div className="space-y-12">
                {/* Journalistic Header */}
                <div className="space-y-6 text-center">
                    <Badge className="bg-slate-900 text-white dark:bg-white dark:text-black rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                        COMMENTARY & OPINION
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight italic">
                        {article.title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>{formattedDate}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>{readingTime}</span>
                    </div>
                </div>

                {/* Author Spotlight */}
                <div className="flex flex-col items-center gap-4 py-8 border-y border-slate-100 dark:border-white/5">
                    <div className="h-20 w-20 rounded-full border-4 border-slate-50 dark:border-slate-900 overflow-hidden relative grayscale">
                        {article.author.image && (
                            <Image src={article.author.image} alt={article.author.name} fill className="object-cover" />
                        )}
                    </div>
                    <div className="text-center">
                        <div className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">{article.author.name}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{article.author.role}</div>
                    </div>
                </div>

                {/* Structured Data Sections */}
                {(() => {
                    const structuredData = (article.structuredData as any) || {};
                    const { thesis, evidence, implications, counterarguments } = structuredData;
                    return (
                        <div className="space-y-8">
                            {/* Thesis — Large italic pull-quote */}
                            {thesis && (
                                <div className="relative py-10 px-8 text-center">
                                    <Quote className="absolute left-1/2 top-0 -translate-x-1/2 h-20 w-20 text-slate-100 dark:text-white/5 -z-10" />
                                    <p className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100 leading-relaxed italic">
                                        &ldquo;{thesis}&rdquo;
                                    </p>
                                    <div className="mt-4 mx-auto w-12 h-0.5 bg-slate-300 dark:bg-white/20" />
                                </div>
                            )}

                            {/* Evidence — slate-50 bg with blue left border */}
                            {evidence && (
                                <div className="pl-6 pr-8 py-6 bg-slate-50 dark:bg-white/5 border-l-4 border-blue-500 rounded-r-2xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-3">Evidence</p>
                                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {evidence}
                                    </p>
                                </div>
                            )}

                            {/* Policy Implications — purple/pink gradient card */}
                            {implications && (
                                <div className="p-8 bg-gradient-to-br from-purple-950/30 to-pink-950/20 border border-purple-800/30 rounded-3xl space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">Policy Implications</p>
                                    <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                                        {implications}
                                    </p>
                                </div>
                            )}

                            {/* Counterarguments — orange warning card */}
                            {counterarguments && (
                                <div className="p-8 bg-orange-950/20 border border-orange-800/30 rounded-3xl space-y-3">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Counterarguments</p>
                                    </div>
                                    <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed">
                                        {counterarguments}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* Lead Content */}
                {article.onPageLead && (
                    <div className="relative">
                        <Quote className="absolute -left-8 -top-8 h-16 w-16 text-slate-100 dark:text-white/5 -z-10" />
                        <p className="text-2xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed italic text-center px-8">
                            {article.onPageLead}
                        </p>
                    </div>
                )}

                {/* Main Body */}
                <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-xl prose-p:leading-relaxed prose-blockquote:border-l-accent-red">
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

export default CommentaryTemplate;
