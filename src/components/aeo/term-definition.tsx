"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TermDefinitionProps {
    term: string;
    definition: string;
    children: React.ReactNode;
}

export function TermDefinition({ term, definition, children }: TermDefinitionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <span
            className="relative inline-block"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <dfn
                className="cursor-help border-b border-dotted border-accent-red/50 hover:border-accent-red transition-colors font-semibold text-white not-italic"
                itemScope
                itemType="https://schema.org/DefinedTerm"
            >
                <meta itemProp="name" content={term} />
                <meta itemProp="description" content={definition} />
                {children}
            </dfn>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-slate-900 border border-border-slate rounded-xl shadow-2xl backdrop-blur-xl"
                    >
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-accent-red uppercase tracking-widest">
                                Intelligence Glossary
                            </span>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">
                                {term}
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {definition}
                            </p>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}
