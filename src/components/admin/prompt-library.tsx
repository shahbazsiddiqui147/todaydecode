"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Terminal, Cpu, Zap, Share2, Globe, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PromptSectionProps {
    title: string;
    content: string;
    icon: any;
    color: string;
}

function PromptSection({ title, content, icon: Icon, color }: PromptSectionProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        toast.success(`${title} instructions copied to clipboard.`);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-4 p-6 bg-slate-950/50 border border-white/5 rounded-3xl group relative overflow-hidden">
            <div className={cn("absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-10", color.replace('text-', 'bg-'))} />

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl bg-white/5 border border-white/10", color)}>
                        <Icon className="h-4 w-4" />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">
                        {title}
                    </h4>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                >
                    {copied ? <Check className="h-3 w-3 text-accent-green" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
            </div>

            <div className="relative">
                <pre className="text-[11px] text-slate-400 font-medium leading-relaxed font-mono whitespace-pre-wrap line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                    {content}
                </pre>
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-950/50 to-transparent group-hover:opacity-0 transition-opacity" />
            </div>
        </div>
    );
}

interface PromptLibraryProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PromptLibrary({ isOpen, onClose }: PromptLibraryProps) {
    const masterPrompt = {
        system: `Act as a Senior Geopolitical Risk Analyst. Write a Strategic Analysis on: [TOPIC]\n\nRULES:\n1. TONE: Clinical, academic, forward-looking. Avoid fluff.\n2. URLS: Use /[category]/[slug]/ and end with a slash /.\n3. STRUCTURE:\n   - Headline: Institutional & Sharp.\n   - Sovereign Intro: 2-sentence hook.\n   - Executive Summary: 100-word brief.\n   - Deep Analysis: 1000+ words with H2/H3 headers.\n   - Scenario Modeling: Best, Likely, and Worst cases (Title + 2 sentences).\n   - Risk Score: 0-100.\n   - FAQ Data: 3 Q&As (150 chars max) for Google SGE.\n   - Social: Generate captions for LinkedIn, X, FB, and Instagram focused on "Strategic Oversight."`,
        analysis: `# ANALYSIS SPECIFICATIONS\n- Use quantitative indicators where possible (Index values, output percentages).\n- Structure with: THE CATALYST, SYSTEMIC IMPACT, STRATEGIC FRICTION, and OUTLOOK.\n- Maintain high-fidelity technical vocabulary (e.g., 'supply chain decoupling', 'bilateral fragmentation').`,
        seo: `# SEO & INDEXING RULES\n- Primary Keyword: Geopolitical Risk [Topic]\n- Secondary: Strategic Analysis, Institutional Intelligence.\n- Meta Description: Start with [URGENCY RATING]. Ensure it fits within 155 chars.\n- URL: slug must be alphanumeric, lowercase, hyphenated.`,
        social: `# SOCIAL MEDIA STRATEGY\n- Focus on "Strategic Oversight" and "Institutional Authority".\n- X: Use bullet points for high-risk indicators. One link to todaydecode.com.\n- LinkedIn: Frame as a briefing for executive decision-makers.`
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-xl bg-secondary border-l border-white/5 z-[101] overflow-y-auto"
                    >
                        <div className="p-8 space-y-12">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-accent-red">
                                        <Cpu className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Foundry Engine</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                                        Prompt <span className="text-accent-red">Library</span>
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 hover:bg-white/5 rounded-full transition-colors group"
                                >
                                    <X className="h-6 w-6 text-slate-500 group-hover:text-white" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="p-6 bg-accent-red/5 border border-accent-red/10 rounded-3xl space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Terminal className="h-4 w-4 text-accent-red" />
                                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Master System Instructions</h3>
                                    </div>
                                    <pre className="text-[11px] text-slate-300 font-medium leading-relaxed font-mono whitespace-pre-wrap bg-primary/50 p-4 rounded-xl border border-white/5">
                                        {masterPrompt.system}
                                    </pre>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(masterPrompt.system);
                                            toast.success("Master Prompt copied.");
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-accent-red text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-all"
                                    >
                                        <Copy className="h-3 w-3" />
                                        <span>Copy Master Instructions</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <PromptSection
                                        title="Detailed Analysis Spec"
                                        content={masterPrompt.analysis}
                                        icon={Zap}
                                        color="text-yellow-500"
                                    />
                                    <PromptSection
                                        title="SEO & Authority Rules"
                                        content={masterPrompt.seo}
                                        icon={Search}
                                        color="text-accent-cyan"
                                    />
                                    <PromptSection
                                        title="Social Distribution"
                                        content={masterPrompt.social}
                                        icon={Share2}
                                        color="text-accent-green"
                                    />
                                </div>
                            </div>

                            <div className="pt-12 border-t border-white/5">
                                <div className="flex items-center gap-4 text-slate-500">
                                    <Globe className="h-5 w-5 opacity-30" />
                                    <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                                        Today Decode Institutional Intelligence // <br />
                                        Copyright © 2026 Sovereign Analytics Group
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
