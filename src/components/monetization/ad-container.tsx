"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AdContainerProps {
    slot: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    className?: string;
}

/**
 * Non-intrusive, professional Ad container for Institutional tiers.
 * Compliant with Google AdSense standards.
 */
export function AdContainer({ slot, format = 'auto', className }: AdContainerProps) {
    return (
        <div className={cn(
            "relative bg-slate-900/40 border border-border-slate/50 rounded-xl overflow-hidden py-8 px-4 text-center group transition-all hover:border-border-slate",
            className
        )}>
            <div className="absolute top-2 left-1/2 -translate-x-1/2">
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                    Institutional Sponsor
                </span>
            </div>

            {/* Ad Placeholder / Script Injector */}
            <div className="min-h-[100px] flex items-center justify-center">
                <div className="space-y-2">
                    <div className="h-4 w-48 bg-slate-800 rounded animate-pulse mx-auto" />
                    <div className="h-3 w-32 bg-slate-800/50 rounded animate-pulse mx-auto" />
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border-slate/30">
                <button className="text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                    About Today Decode Partnerships
                </button>
            </div>

            {/* Analytics Hook */}
            <div className="hidden" data-ad-slot={slot} data-ad-format={format} />
        </div>
    );
}
