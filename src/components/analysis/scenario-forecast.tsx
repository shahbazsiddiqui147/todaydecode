"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useAnalytics } from '@/components/providers/analytics-provider';

interface Scenario {
    title: string;
    desc: string;
    impact: number;
}

interface Scenarios {
    best: Scenario;
    likely: Scenario;
    worst: Scenario;
}

interface ScenarioForecastProps {
    scenarios: Scenarios;
    category: string;
    slug: string;
}

export function ScenarioForecast({ scenarios, category, slug }: ScenarioForecastProps) {
    const [activeTab, setActiveTab] = useState<keyof Scenarios>('likely');
    const { trackEvent } = useAnalytics();

    const tabs = [
        { id: 'best', label: 'Best Case', icon: ShieldCheck, color: 'text-accent-green' },
        { id: 'likely', label: 'Most Likely', icon: TrendingUp, color: 'text-yellow-500' },
        { id: 'worst', label: 'Worst Case', icon: AlertTriangle, color: 'text-accent-red' },
    ] as const;

    const handleTabChange = (tabId: keyof Scenarios) => {
        setActiveTab(tabId);
        trackEvent('scenario_toggle_click', {
            scenario: tabId,
            article_slug: slug,
            category: category
        });
    };

    const activeData = scenarios[activeTab];

    return (
        <div className="bg-background/40 border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-secondary/30">
                <h2 className="text-xl font-black text-[#0F172A] dark:text-[#F1F5F9] tracking-tight uppercase mb-1">
                    Scenario Synthesis Desk
                </h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Predictive Outcome Modeling // 12-Month Outlook
                </p>
            </div>

            <div className="flex border-b border-[#E2E8F0] dark:border-[#1E293B]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={cn(
                            "flex-1 flex items-center justify-center space-x-2 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative",
                            activeTab === tab.id
                                ? "text-[#22D3EE] bg-secondary/50"
                                : "text-slate-500 hover:text-[#22D3EE] hover:bg-secondary/30"
                        )}
                    >
                        <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-[#22D3EE]" : "text-slate-400")} />
                        <span className="md:inline hidden">{tab.label}</span>
                        <span className="md:hidden inline">{tab.id.charAt(0).toUpperCase()}</span>
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#22D3EE]"
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="space-y-4 max-w-xl">
                                <h3 className={cn("text-2xl font-black tracking-tight text-[#22D3EE]")}>
                                    {activeData.title}
                                </h3>
                                <p className="text-slate-300 text-base leading-relaxed">
                                    {activeData.desc}
                                </p>
                            </div>
                            <div className="bg-background/50 p-4 rounded-xl border border-slate-800 min-w-[120px] text-center">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Impact Score
                                </div>
                                <div className={cn("text-4xl font-black tabular-nums shadow-[0_0_20px_rgba(34,211,238,0.1)]", tabs.find(t => t.id === activeTab)?.color)}>
                                    {activeData.impact}%
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <span>Outcome Severity</span>
                                <span>{activeData.impact}% Scale</span>
                            </div>
                            <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-[1px] border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${activeData.impact}%` }}
                                    className={cn(
                                        "h-full rounded-full",
                                        activeData.impact > 80 ? "bg-accent-red shadow-[0_0_15px_rgba(255,75,75,0.4)]" :
                                            activeData.impact > 40 ? "bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]" :
                                                "bg-accent-green shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                                    )}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <Link
                                href={`/${category.toLowerCase()}/${slug.replace(/^\/|\/$/g, '')}/`}
                                className="inline-flex items-center text-[11px] font-black text-[#22D3EE] uppercase tracking-[0.25em] group bg-[#22D3EE]/10 border-2 border-[#22D3EE]/30 px-8 py-5 rounded-xl hover:bg-[#22D3EE] hover:text-[#020617] transition-all shadow-lg shadow-cyan-500/10 active:scale-95"
                            >
                                <span className="drop-shadow-sm">Assessment Finalized // Data Reconciled</span>
                                <ChevronRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
