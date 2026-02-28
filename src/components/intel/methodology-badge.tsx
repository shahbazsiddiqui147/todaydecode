"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MethodologyBadge() {
    const [isOpen, setIsOpen] = useState(false);

    const verificationPoints = [
        { title: "OSINT Verification", desc: "Cross-referenced data from open-source satellite imagery and localized reports." },
        { title: "Financial Modeling", desc: "Live-streamed economic indicators correlated with regional instability scores." },
        { title: "Geopolitical Sentiment", desc: "AI-driven analysis of official state communications and diplomatic cables." },
        { title: "Corridor Analysis", desc: "Physical chokepoint monitoring via AIS and maritime tracking systems." },
        { title: "Analyst Audit", desc: "Final human intelligence (HUMINT) review by senior strategic specialists." }
    ];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center space-x-1.5 px-2 py-1 rounded bg-accent-green/10 border border-accent-green/20 text-[10px] font-bold text-accent-green uppercase tracking-widest hover:bg-accent-green/20 transition-all group"
            >
                <ShieldCheck className="h-3 w-3" />
                <span>Verified Methodology</span>
                <Info className="h-2.5 w-2.5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-slate-900 border border-border-slate rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-border-slate bg-slate-950/50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                                        Intelligence Methodology
                                    </h3>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">
                                        Today Decode E-E-A-T Framework
                                    </p>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-accent-green pl-4">
                                    "Today Decode prioritizes technical transparency. Our risk scores are reached through a five-point algorithmic verification process designed for high-trust institutional decision-making."
                                </p>

                                <div className="space-y-6">
                                    {verificationPoints.map((point, i) => (
                                        <div key={i} className="flex space-x-4">
                                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-accent-green border border-accent-green/20">
                                                0{i + 1}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-xs font-black text-white uppercase tracking-tight">
                                                    {point.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 leading-normal">
                                                    {point.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-slate-950/50 border-t border-border-slate flex justify-center">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    Confirm Understanding
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
