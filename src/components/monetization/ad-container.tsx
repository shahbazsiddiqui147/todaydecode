"use client";

import React from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdContainerProps {
    className?: string;
    label?: string;
}

export function AdContainer({
    className,
    label = "PROMOTED ADVISORY"
}: AdContainerProps) {
    return (
        <div className={cn(
            "group relative p-8 rounded-3xl bg-secondary/20 border border-white/5 overflow-hidden transition-all hover:border-white/10",
            className
        )}>
            {/* Strategic Branding */}
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 italic">
                        {label}
                    </span>
                    <Info className="h-3 w-3 text-slate-600" />
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />
            </div>

            {/* Placeholder for actual Ad Script (AdSense/Carbon) */}
            <div className="flex flex-col items-center justify-center min-h-[250px] space-y-4 border border-dashed border-white/5 rounded-2xl bg-black/10">
                <div className="p-3 bg-white/5 rounded-full">
                    <ExternalLink className="h-5 w-5 text-slate-500 opacity-50" />
                </div>
                <div className="text-center space-y-1">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        External Resource Pending
                    </p>
                    <p className="text-[9px] text-slate-700 font-medium uppercase italic">
                        Partner Resource Integration
                    </p>
                </div>
            </div>

            {/* Micro-label at bottom */}
            <div className="mt-4 text-[8px] text-slate-700 font-bold uppercase tracking-tighter text-right">
                Partner Tier // v0.1
            </div>

            {/* Animated grain/noise overlay for texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('/noise.png')] mix-blend-soft-light" />
        </div>
    );
}
