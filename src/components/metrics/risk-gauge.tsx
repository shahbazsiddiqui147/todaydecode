"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RiskGaugeProps {
    value: number; // 0-100
    label: string;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
}

export function RiskGauge({
    value,
    label,
    size = 'md',
    showValue = true
}: RiskGaugeProps) {
    const sizeMap = {
        sm: { radius: 30, stroke: 4, text: "text-[10px]", valText: "text-xs" },
        md: { radius: 45, stroke: 8, text: "text-[10px]", valText: "text-lg" },
        lg: { radius: 60, stroke: 10, text: "text-xs", valText: "text-2xl" }
    };

    const { radius, stroke, text, valText } = sizeMap[size];
    const normalizedValue = Math.min(Math.max(value, 0), 100);
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (normalizedValue / 100) * circumference;

    const getColor = (val: number) => {
        if (val <= 40) return 'text-accent-green';
        if (val <= 70) return 'text-yellow-500';
        return 'text-accent-red';
    };

    const colorClass = getColor(normalizedValue);

    return (
        <div className="flex flex-col items-center justify-center space-y-3 w-full max-w-[200px] mx-auto">
            <div className="relative group transition-transform duration-500 hover:scale-105">
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${(radius + stroke) * 2} ${(radius + stroke) * 2}`}
                    className="transform -rotate-90 w-full h-full max-w-[150px]"
                >
                    {/* Background circle */}
                    <circle
                        cx={radius + stroke}
                        cy={radius + stroke}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={stroke}
                        fill="transparent"
                        className="text-border dark:text-white/5"
                    />
                    {/* Progress circle */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx={radius + stroke}
                        cy={radius + stroke}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={stroke}
                        fill="transparent"
                        strokeDasharray={circumference}
                        className={cn(colorClass, "drop-shadow-[0_0_8px_currentColor]")}
                    />
                </svg>
                {showValue && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={cn("font-black italic tracking-tighter", valText)}>
                            {normalizedValue}
                        </span>
                        <span className="text-[7px] font-black uppercase tracking-widest text-slate-500 opacity-60">Index</span>
                    </div>
                )}
            </div>
            <div className={cn("font-black uppercase tracking-[0.2em] text-center text-slate-500 italic", text)}>
                {label}
            </div>
        </div>
    );
}
