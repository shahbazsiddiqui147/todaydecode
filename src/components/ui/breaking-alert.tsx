"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';

interface AlertData {
    title: string;
    category: string;
    slug: string;
    riskScore: number;
}

export function BreakingAlert() {
    const [alert, setAlert] = useState<AlertData | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Mock fetching highest risk article
        // In production, this would be a call to /api/intel/highest-risk
        const mockHighestRisk = {
            title: "Sudden Volatility in Brent Crude Corridor",
            category: "Economy",
            slug: "brent-crude-volatility-alert",
            riskScore: 92,
        };

        if (mockHighestRisk.riskScore > 80) {
            setAlert(mockHighestRisk);
        }
    }, []);

    if (!alert || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="relative bg-accent-red text-white z-[100] overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('/grid-light.svg')] opacity-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between relative">
                    <div className="flex items-center space-x-4">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="bg-white/20 p-1.5 rounded-full"
                        >
                            <AlertTriangle className="h-3.5 w-3.5" />
                        </motion.div>

                        <div className="flex items-center space-x-2 text-[10px] sm:text-xs">
                            <span className="font-black uppercase tracking-widest whitespace-nowrap">
                                Critical Alert [{alert.riskScore}/100]:
                            </span>
                            <span className="font-medium opacity-90 truncate max-w-[200px] sm:max-w-md">
                                {alert.title}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            href={`/${alert.category.toLowerCase()}/${alert.slug}/`}
                            className="flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors"
                        >
                            <span>View Brief</span>
                            <ChevronRight className="h-3 w-3" />
                        </Link>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>

                {/* Pulsing progress line at bottom */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/30 origin-left"
                />
            </motion.div>
        </AnimatePresence>
    );
}
