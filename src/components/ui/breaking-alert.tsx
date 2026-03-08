"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';

interface AlertData {
    title: string;
    category: {
        slug: string;
    };
    slug: string;
    riskScore: number;
}

export function BreakingAlert({ initialAlert }: { initialAlert?: AlertData | null }) {
    const [isVisible, setIsVisible] = useState(true);

    if (!initialAlert || !isVisible) return null;

    const categorySlug = initialAlert.category.slug.replace(/^\/|\/$/g, '');
    const articleHref = `/${categorySlug}/${initialAlert.slug}/`;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="relative bg-accent-red text-white z-[100] overflow-hidden"
            >
                {/* Analytical Pulse Effect */}
                <motion.div
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-white"
                />

                <div className="absolute inset-0 bg-[url('/grid-light.svg')] opacity-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 sm:py-2.5 flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-3 sm:space-x-4 overflow-hidden">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="bg-white/20 p-1 rounded-full shrink-0"
                        >
                            <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </motion.div>

                        <div className="flex items-center space-x-2 text-[9px] sm:text-xs overflow-hidden">
                            <span className="font-black uppercase tracking-[0.2em] whitespace-nowrap shrink-0">
                                <span className="hidden xs:inline">Breaking Analysis </span>[{initialAlert.riskScore}]:
                            </span>
                            <div className="overflow-hidden whitespace-nowrap mask-fade-right">
                                <motion.span
                                    animate={{ x: [0, -20, 0] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="font-bold opacity-100 uppercase tracking-tight italic inline-block"
                                >
                                    {initialAlert.title}
                                </motion.span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
                        <Link
                            href={articleHref}
                            className="flex items-center space-x-1 text-[8px] sm:text-[10px] font-black uppercase tracking-widest bg-white text-accent-red hover:bg-slate-100 px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg transition-all shadow-xl shadow-black/20 shrink-0"
                        >
                            <span className="hidden xs:inline">Access Brief</span>
                            <span className="xs:hidden">Brief</span>
                            <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </Link>

                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors shrink-0"
                        >
                            <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </button>
                    </div>
                </div>

                {/* Research scanner line */}
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />
            </motion.div>
        </AnimatePresence>
    );
}
