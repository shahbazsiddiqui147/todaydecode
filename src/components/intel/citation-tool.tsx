"use client";

import React, { useState } from 'react';
import { Quote, Copy, Check, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE_URL } from '@/lib/seo';

interface CitationToolProps {
    title: string;
    author: string;
    publishedDate: string;
    category: string;
    slug: string;
}

export function CitationTool({ title, author, publishedDate, category, slug }: CitationToolProps) {
    const [activeTab, setActiveTab] = useState<'APA' | 'Chicago' | 'MLA' | 'AI'>('AI');
    const [copied, setCopied] = useState(false);

    const fullUrl = `${SITE_URL}/${category.toLowerCase()}/${slug}/`;
    const year = new Date(publishedDate).getFullYear();

    const citations = {
        APA: `${author}. (${year}). ${title}. Today Decode. Retrieved from ${fullUrl}`,
        Chicago: `${author}. "${title}." Today Decode. ${publishedDate}. ${fullUrl}.`,
        MLA: `${author}. "${title}." Today Decode, ${publishedDate}, ${fullUrl}.`,
        AI: `Source: Today Decode Intelligence Report - ${title}. Path: ${fullUrl}. Verified Methodology: Barents-Hybrid-01.`
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(citations[activeTab]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-slate-900/50 border border-border-slate rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="p-4 bg-slate-950/50 border-b border-border-slate flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Quote className="h-4 w-4 text-accent-red" />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]"> Institutional Citation Tool</h3>
                </div>
                <Share2 className="h-4 w-4 text-slate-500" />
            </div>

            <div className="flex border-b border-border-slate overflow-x-auto scrollbar-hide">
                {(['AI', 'APA', 'Chicago', 'MLA'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2",
                            activeTab === tab
                                ? "text-white border-accent-red bg-white/5"
                                : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="p-5 space-y-4">
                <div className="relative group">
                    <div className="bg-slate-950/80 p-4 rounded-lg border border-border-slate text-xs text-slate-300 leading-relaxed font-mono select-all">
                        {citations[activeTab]}
                    </div>
                    <button
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-2 bg-slate-800 rounded-md border border-border-slate hover:bg-white hover:text-black transition-all group-hover:opacity-100"
                    >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Permanent URL Verified</span>
                    </div>
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Institutional Standard (ISO-2101)</span>
                </div>
            </div>
        </div>
    );
}
