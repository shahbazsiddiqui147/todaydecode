"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Globe, ShieldAlert, TrendingUp, Zap, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
}

export function MobileNav({ isOpen, onClose, categories }: MobileNavProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#0A0F1E] border-l border-white/5 z-[101] flex flex-col shadow-2xl lg:hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-[#22D3EE] uppercase tracking-[0.3em] italic">Strategic Archive</span>
                                <span className="text-sm font-black text-[#F1F5F9] uppercase tracking-tighter">Institutional Navigator</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-10">
                            {/* Silos Section */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Research Departments</h4>
                                <nav className="space-y-1">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/${cat.slug.replace(/^\/|\/$/g, '')}/`}
                                            onClick={onClose}
                                            className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-slate-900 border border-white/5 rounded-lg group-hover:border-[#22D3EE]/30 transition-colors">
                                                    <Globe className="h-4 w-4 text-[#22D3EE]" />
                                                </div>
                                                <span className="text-xs font-black text-slate-300 uppercase tracking-widest group-hover:text-white transition-colors">
                                                    {cat.name}
                                                </span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-[#22D3EE] group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                            {/* User Access Section (Mobile Only) */}
                            <div className="space-y-4 pt-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Institutional Access</h4>
                                <Link
                                    href="/auth/signup/"
                                    onClick={onClose}
                                    className="flex items-center justify-center space-x-3 w-full bg-white text-[#0A0F1E] font-black uppercase text-[10px] tracking-[0.2em] py-5 rounded-2xl hover:bg-slate-200 transition-all shadow-xl shadow-black/40"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span>Join Archive</span>
                                </Link>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/5 bg-black/20">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse" />
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sovereign Grid Active</span>
                                </div>
                                <span className="text-[8px] font-black text-slate-600 uppercase">v2.4.0-Stable</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
