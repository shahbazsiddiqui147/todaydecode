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
    const radius = size === 'sm' ? 30 : size === 'md' ? 45 : 60;
    const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 8 : 10;
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
        <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative">
                <svg
                    width={radius * 2 + strokeWidth * 2}
                    height={radius * 2 + strokeWidth * 2}
                    className="transform -rotate-90"
                >
                    {/* Background circle */}
                    <circle
                        cx={radius + strokeWidth}
                        cy={radius + strokeWidth}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        className="text-slate-800"
                    />
                    {/* Progress circle */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx={radius + strokeWidth}
                        cy={radius + strokeWidth}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        className={cn(colorClass)}
                    />
                </svg>
                {showValue && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={cn(
                            "font-bold",
                            size === 'sm' ? "text-sm" : size === 'md' ? "text-lg" : "text-2xl"
                        )}>
                            {normalizedValue}
                        </span>
                    </div>
                )}
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
                {label}
            </div>
        </div>
    );
}
