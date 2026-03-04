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

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!code || !mounted) return;

            try {
                const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

                mermaid.initialize({
                    startOnLoad: false,
                    theme: isDark ? 'dark' : 'default',
                    securityLevel: 'loose',
                    themeVariables: {
                        backgroundColor: 'transparent',
                        primaryColor: isDark ? '#111827' : '#F1F5F9',
                        primaryBorderColor: isDark ? '#1E293B' : '#E2E8F0',
                        primaryTextColor: isDark ? '#F1F5F9' : '#0F172A',
                        lineColor: '#22D3EE',
                        secondaryColor: isDark ? '#0A0F1E' : '#FFFFFF',
                        tertiaryColor: isDark ? '#1e293b' : '#f8fafc',
                        mainBkg: isDark ? '#111827' : '#F8FAFC',
                        nodeBorder: isDark ? '#1E293B' : '#E2E8F0',
                        nodeTextColor: isDark ? '#F1F5F9' : '#0F172A',
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif'
                    }
                });

                const id = `mermaid-render-${Math.random().toString(36).substr(2, 9)}`;
                const { svg: renderedSvg } = await mermaid.render(id, code);
                setSvg(renderedSvg);
            } catch (error) {
                console.error('Mermaid render failure:', error);
            }
        };

        renderDiagram();
    }, [code, theme, mounted]);

    if (!mounted) return null;

    return (
        <div
            ref={containerRef}
            className="mermaid-wrapper w-full flex justify-center py-12 bg-[#F1F5F9] dark:bg-[#111827] rounded-3xl border border-[#E2E8F0] dark:border-[#1E293B] my-12 overflow-hidden shadow-inner relative z-10"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};
