import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, Eye, TrendingUp } from "lucide-react";
import { ContentRenderer } from "@/components/analysis/ContentRenderer";
import { QuickAnswers } from "@/components/aeo/quick-answers";
import { PaywallGate } from "@/components/monetization/paywall-gate";
import { CitationTool } from "@/components/intel/citation-tool";

interface NewsBriefTemplateProps {
    article: any;
    formattedDate: string;
    readingTime: string;
    fullSiloPath?: string;
}

export const NewsBriefTemplate: React.FC<NewsBriefTemplateProps> = ({
    article,
    formattedDate,
    readingTime,
    fullSiloPath
}) => {
    const structuredData = (article.structuredData as any) || {};
    const { summary, keyDevelopments, context, outlook } = structuredData;

    return (
        <div className="news-brief-template max-w-4xl mx-auto py-20 px-6">
            <div className="space-y-12">

                {/* Breaking News Header */}
                <div className="space-y-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                        </span>
                        <Badge className="bg-red-600 text-white rounded-none px-4 py-1 text-[10px] font-black uppercase tracking-[0.25em] border-0">
                            NEWS BRIEF
                        </Badge>
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
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

                {/* Featured Image */}
                {article.featuredImage && (
                    <div className="w-full aspect-video rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
                        <img
                            src={article.featuredImage}
                            alt={article.featuredImageAlt || article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Summary Card — Red accent */}
                {article.onPageLead && (
                    <div className="relative p-8 bg-red-950/20 border border-red-900/40 rounded-3xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-600 rounded-l-3xl" />
                        <div className="flex items-start gap-4">
                            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-3">Summary</p>
                                <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                                    {article.onPageLead}
                                </p>
                            </div>
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

export default NewsBriefTemplate;
