"use client";

import { cn } from "@/lib/utils";

interface RiskGaugeProps {
    score: number;
    label: string;
}

export function RiskGauge({ score, label }: RiskGaugeProps) {
    const percentage = Math.min(Math.max(score, 0), 100);

    const getGradient = () => {
        if (score > 80) return "from-red-600 to-accent-red";
        if (score > 50) return "from-yellow-600 to-yellow-500";
        return "from-green-600 to-accent-green";
    };

    return (
        <div className="space-y-4 rounded-xl border border-border-slate bg-primary/40 p-6">
            <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Risk Power Index
                </h4>
                <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                    score > 80 ? "text-accent-red border-accent-red/20" : "text-accent-green border-accent-green/20"
                )}>
                    {label}
                </span>
            </div>

            <div className="flex items-end justify-between">
                <span className="text-4xl font-black text-white">{score}</span>
                <span className="text-xs text-slate-500 font-medium mb-1">/ 100</span>
            </div>

            <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-1000 bg-gradient-to-r", getGradient())}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed italic">
                * Based on current Conflict Intensity and Geographic Weighting.
            </p>
        </div>
    );
}

export function KeyTakeaways({ points }: { points: string[] }) {
    return (
        <div className="space-y-4 rounded-xl border border-border-slate bg-primary/40 p-6">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Quick Summary
            </h4>
            <ul className="space-y-3">
                {points.map((point, i) => (
                    <li key={i} className="flex items-start space-x-3 text-sm text-slate-300">
                        <div className="h-1 w-1 mt-2 shrink-0 rounded-full bg-accent-red" />
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
