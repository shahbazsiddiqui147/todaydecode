"use client";

import { useState } from "react";
import {
    Shield,
    Zap,
    FileText,
    MessageSquare,
    TrendingUp,
    Database,
    Globe,
    Activity,
    ChevronRight,
    Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type PublicationFormat =
    | "POLICY_BRIEF"
    | "STRATEGIC_REPORT"
    | "COMMENTARY"
    | "SCENARIO_ANALYSIS"
    | "RISK_ASSESSMENT"
    | "DATA_INSIGHT"
    | "ANNUAL_OUTLOOK"
    | "POLICY_TOOLKIT"
    | "NEWS_BRIEF"
    | "CURRENT_AFFAIRS";

interface Protocol {
    id: PublicationFormat;
    name: string;
    description: string;
    icon: any;
    color: string;
}

const PROTOCOLS: Protocol[] = [
    {
        id: "POLICY_BRIEF",
        name: "Policy Brief",
        description: "Decision-oriented summaries for executive leadership.",
        icon: Shield,
        color: "text-blue-500 bg-blue-500/10"
    },
    {
        id: "STRATEGIC_REPORT",
        name: "Strategic Report",
        description: "Deep-dive geopolitical and economic analysis.",
        icon: FileText,
        color: "text-emerald-500 bg-emerald-500/10"
    },
    {
        id: "COMMENTARY",
        name: "Commentary",
        description: "Expert-led perspective on shifting global currents.",
        icon: MessageSquare,
        color: "text-purple-500 bg-purple-500/10"
    },
    {
        id: "SCENARIO_ANALYSIS",
        name: "Scenario Analysis",
        description: "Multi-path outcome forecasting for strategic planning.",
        icon: TrendingUp,
        color: "text-cyan-500 bg-cyan-500/10"
    },
    {
        id: "RISK_ASSESSMENT",
        name: "Risk Assessment",
        description: "Quantitative evaluation of regional and sectoral volatility.",
        icon: Activity,
        color: "text-red-500 bg-red-500/10"
    },
    {
        id: "DATA_INSIGHT",
        name: "Data Insight",
        description: "Empirical analysis driven by proprietary metric tracking.",
        icon: Database,
        color: "text-orange-500 bg-orange-500/10"
    },
    {
        id: "ANNUAL_OUTLOOK",
        name: "Annual Outlook",
        description: "High-level institutional forecasting for the coming year.",
        icon: Globe,
        color: "text-indigo-500 bg-indigo-500/10"
    },
    {
        id: "POLICY_TOOLKIT",
        name: "Policy Toolkit",
        description: "Frameworks and methodologies for operational response.",
        icon: Zap,
        color: "text-yellow-500 bg-yellow-500/10"
    },
    {
        id: "NEWS_BRIEF",
        name: "News Brief",
        description: "Concise reporting on breaking developments and key events.",
        icon: Zap,
        color: "text-rose-500 bg-rose-500/10"
    },
    {
        id: "CURRENT_AFFAIRS",
        name: "Current Affairs",
        description: "Timely analysis of evolving global developments.",
        icon: Globe,
        color: "text-teal-500 bg-teal-500/10"
    }
];

interface ProtocolSelectionPortalProps {
    isOpen: boolean;
    onSelect: (format: PublicationFormat) => void;
}

export function ProtocolSelectionPortal({ isOpen, onSelect }: ProtocolSelectionPortalProps) {
    const [selected, setSelected] = useState<PublicationFormat | null>(null);

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-md animate-in fade-in duration-300">
            <div className="max-w-4xl w-full bg-[#0F172A] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-slate-950/50 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-cyan-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500">Article Setup</span>
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                            Choose Article Format
                        </h2>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status: Ready</p>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PROTOCOLS.map((protocol) => (
                        <button
                            key={protocol.id}
                            onClick={() => setSelected(protocol.id)}
                            className={cn(
                                "group text-left p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden",
                                selected === protocol.id
                                    ? "bg-white/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10"
                                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <div className={cn("p-3 rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-500", protocol.color)}>
                                    <protocol.icon className="h-6 w-6" />
                                </div>
                                <div className="space-y-1 pr-8">
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">
                                        {protocol.name}
                                    </h3>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                        {protocol.description}
                                    </p>
                                </div>
                                <ChevronRight className={cn(
                                    "absolute top-1/2 -translate-y-1/2 right-6 h-5 w-5 transition-all duration-300",
                                    selected === protocol.id ? "text-cyan-500 translate-x-0 opacity-100" : "text-slate-600 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                                )} />
                            </div>
                        </button>
                    ))}
                </div>

                <div className="p-8 bg-slate-950/50 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-relaxed max-w-md text-center sm:text-left italic">
                        Select a format to get started. This determines the article structure and metadata fields.
                    </p>
                    <Button
                        onClick={() => selected && onSelect(selected)}
                        disabled={!selected}
                        className="w-full sm:w-auto px-12 py-7 rounded-2xl bg-white text-[#0F172A] hover:bg-white/90 font-black uppercase italic tracking-tighter text-sm active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-white/5"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
}
