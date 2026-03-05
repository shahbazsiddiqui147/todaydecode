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
                const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

                mermaid.initialize({
                    startOnLoad: false,
                    theme: isDark ? 'dark' : 'default',
                    securityLevel: 'loose',
                    fontFamily: 'Inter, sans-serif',
                    themeVariables: {
                        backgroundColor: 'transparent',
                        primaryColor: isDark ? '#111827' : '#F1F5F9',
                        primaryBorderColor: isDark ? '#1E293B' : '#E2E8F0',
                        primaryTextColor: isDark ? '#F1F5F9' : '#0F172A',
                        lineColor: '#22D3EE',
                        secondaryColor: isDark ? '#0A0F1E' : '#FFFFFF',
                        tertiaryColor: isDark ? '#1e293b' : '#f8fafc',
                        mainBkg: isDark ? '#111827' : '#F8FAFC',
                        nodeBorder: '#1E293B',
                        nodeTextColor: isDark ? '#F1F5F9' : '#0F172A',
                        fontSize: '14px',
                    }
                });

                const id = `mermaid-render-${Math.random().toString(36).substr(2, 9)}`;
                const { svg: renderedSvg } = await mermaid.render(id, code);
                setSvg(renderedSvg);
            } catch (err: any) {
                console.error('Mermaid render failure:', err);
                setError("Strategic Diagram Syntax Error. Please verify ASCII logic.");
            }
        };

        renderDiagram();
    }, [code, theme, mounted]);

    if (!mounted) return null;

    return (
        <div className="my-12 relative">
            {error ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 bg-red-500/5 border border-red-500/20 rounded-3xl text-center space-y-3">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] italic">Structural Logic Regression</span>
                    <p className="text-xs text-red-400 font-medium">{error}</p>
                    <div className="p-3 bg-red-950/20 font-mono text-[10px] text-red-300 w-full max-w-lg overflow-x-auto rounded-xl">
                        {code}
                    </div>
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
