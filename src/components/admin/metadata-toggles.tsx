"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface MetadataSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
}

export function MetadataSlider({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
}: MetadataSliderProps) {
    return (
        <div className="space-y-3 p-4 border border-border-slate rounded-lg bg-primary/20">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {label}
                </label>
                <span className="text-sm font-bold text-accent-red">
                    {value}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent-red"
            />
            <div className="flex justify-between text-[8px] text-slate-600 font-bold uppercase tracking-tighter">
                <span>Strategic Minimum</span>
                <span>Strategic Maximum</span>
            </div>
        </div>
    );
}
