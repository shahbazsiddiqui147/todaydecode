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
        <div className="bg-card/50 border border-border rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-border bg-secondary/30">
                <h2 className="text-xl font-black text-foreground tracking-tight uppercase mb-1">
                    Strategic Scenario Forecast
                </h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Predictive Outcome Modeling // 12-Month Outlook
                </p>
            </div>

            <div className="flex border-b border-border">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={cn(
                            "flex-1 flex items-center justify-center space-x-2 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative",
                            activeTab === tab.id
                                ? "text-foreground bg-secondary"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        )}
                    >
                        <tab.icon className={cn("h-3 w-3", activeTab === tab.id ? tab.color : "text-slate-600")} />
                        <span>{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className={cn(
                                    "absolute bottom-0 left-0 right-0 h-0.5",
                                    tab.id === 'best' ? 'bg-accent-green' : tab.id === 'likely' ? 'bg-yellow-500' : 'bg-accent-red'
                                )}
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
                                <h3 className={cn("text-2xl font-black tracking-tight", tabs.find(t => t.id === activeTab)?.color)}>
                                    {activeData.title}
                                </h3>
                                <p className="text-muted-foreground text-base leading-relaxed">
                                    {activeData.desc}
                                </p>
                            </div>
                            <div className="bg-background/50 p-4 rounded-xl border border-border min-w-[120px] text-center">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                                    Impact Score
                                </div>
                                <div className={cn("text-4xl font-black tabular-nums", tabs.find(t => t.id === activeTab)?.color)}>
                                    {activeData.impact}%
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <span>Outcome Severity</span>
                                <span>{activeData.impact}% Scale</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden p-[1px]">
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

                        <div className="pt-6 border-t border-border/50">
                            <Link
                                href={`/${category.toLowerCase()}/${slug}/risk-assessment/`}
                                className="inline-flex items-center text-[10px] font-black text-foreground uppercase tracking-[0.2em] group bg-foreground/5 border border-border px-6 py-4 rounded-lg hover:bg-foreground hover:text-background transition-all"
                            >
                                Open Full Strategic Assessment
                                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
