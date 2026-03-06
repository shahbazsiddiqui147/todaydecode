"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from 'next-themes';

interface MermaidRendererProps {
    code: string;
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ code }) => {
    const { theme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [mounted, setMounted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!code || !mounted) return;

            try {
                setError(null);

                // 1. STRATEGIC PRE-PARSING: The 'Ghost Character' Purge & Quote Hardening
                const cleanCode = code
                    .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
                    .replace(/&nbsp;/g, ' ') // Handle HTML entities
                    .replace(/%%{init:[\s\S]*?}%%/g, (match) => {
                        return match.replace(/'/g, '"'); // Force double quotes in init block
                    })
                    .split('\n')
                    .map(line => line.trimEnd()) // Strip trailing whitespace
                    .join('\n')
                    .trim(); // Strip leading/trailing empty lines

                const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

                mermaid.initialize({
                    startOnLoad: false,
                    theme: isDark ? 'dark' : 'default',
                    securityLevel: 'loose',
                    fontFamily: 'Inter, sans-serif',
                    themeVariables: {
                        backgroundColor: 'transparent',
                        primaryColor: '#111827', // Institutional Grey
                        primaryBorderColor: '#1E293B',
                        primaryTextColor: '#F1F5F9',
                        lineColor: '#22D3EE', // Institutional Cyan
                        secondaryColor: '#0A0F1E',
                        tertiaryColor: '#1e293b',
                        mainBkg: '#0A0F1E', // Enforced Global Dark Standard
                        nodeBorder: '#1E293B',
                        nodeTextColor: '#F1F5F9',
                        fontSize: '14px',
                    }
                });

                const id = `mermaid-render-${Math.random().toString(36).substr(2, 9)}`;
                const { svg: renderedSvg } = await mermaid.render(id, cleanCode);
                setSvg(renderedSvg);
            } catch (err: any) {
                console.error('Mermaid render failure:', err);
                // Extract precise line info if available
                const errorMessage = err.message || err.str || "Unknown logic regression";
                setError(errorMessage);
            }
        };

        renderDiagram();
    }, [code, theme, mounted]);

    if (!mounted) return null;

    return (
        <div className="my-12 relative">
            {error ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 bg-[#111827] border-2 border-[#FF4B4B] rounded-3xl text-center space-y-4 shadow-2xl">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[#FF4B4B] animate-pulse" />
                        <span className="text-[10px] font-black text-[#FF4B4B] uppercase tracking-[0.3em] italic">Structural Logic Regression</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium max-w-md leading-relaxed border-b border-white/5 pb-4">
                        {error}
                    </p>
                    <div className="w-full max-w-lg bg-black/40 rounded-xl p-4 overflow-x-auto">
                        <pre className="font-mono text-[10px] text-slate-400 text-left leading-tight">
                            {code.split('\n').map((line, i) => (
                                <div key={i} className="flex gap-4">
                                    <span className="opacity-20 select-none w-4">{i + 1}</span>
                                    <span>{line}</span>
                                </div>
                            ))}
                        </pre>
                    </div>
                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Verify ASCII syntax and JSON quote formatting</span>
                </div>
            ) : (
                <div
                    ref={containerRef}
                    className="mermaid-wrapper w-full flex justify-center py-12 bg-[#F1F5F9] dark:bg-[#0A0F1E] rounded-3xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden shadow-inner relative z-10"
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
            )}
        </div>
    );
};
