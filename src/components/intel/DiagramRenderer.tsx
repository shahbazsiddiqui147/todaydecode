"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { AlertCircle } from 'lucide-react';

interface DiagramRendererProps {
    code: string;
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({ code }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [mounted, setMounted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const renderDiagram = async () => {
        if (!code || !mounted) return;

        try {
            setError(null);

            // Institutional Branding Injection & Sanitization
            const sanitizedCode = code
                .replace(/\u00A0/g, ' ')
                .replace(/&nbsp;/g, ' ')
                .trim();

            const fullCode = `%%{init: {"theme": "base", "themeVariables": { "primaryColor": "#111827", "primaryBorderColor": "#22D3EE", "primaryTextColor": "#F1F5F9", "lineColor": "#22D3EE", "mainBkg": "#0A0F1E", "nodeBorder": "#22D3EE" }}}%%\n${sanitizedCode}`;

            mermaid.initialize({
                startOnLoad: false,
                theme: 'base',
                securityLevel: 'loose',
                fontFamily: 'Inter, sans-serif',
                flowchart: {
                    useMaxWidth: false,
                    htmlLabels: true,
                    curve: 'basis',
                    padding: 45,
                    nodeSpacing: 100,
                    rankSpacing: 80,
                },
                sequence: {
                    useMaxWidth: false,
                },
                gantt: {
                    useMaxWidth: false,
                }
            });

            const id = `diagram-${Math.random().toString(36).substr(2, 9)}`;
            const { svg: renderedSvg } = await mermaid.render(id, fullCode);
            setSvg(renderedSvg);
        } catch (err: any) {
            console.error('Institutional Diagram failure:', err);
            setError(err.message || "Structural Logic Regression detected.");
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        renderDiagram();
    }, [code, mounted]);

    if (!mounted) return null;

    return (
        <div className="my-16 relative group institutional-diagram-container -mx-4 md:-mx-8 lg:-mx-12 xl:-mx-16">
            <style dangerouslySetInnerHTML={{
                __html: `
                .label foreignObject { overflow: visible !important; }
                .label div { white-space: nowrap !important; width: max-content !important; text-align: center; }
                .node rect, .node circle, .node polygon { stroke-width: 2px !important; stroke: #22D3EE !important; }
                .custom-scrollbar::-webkit-scrollbar { height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #22D3EE; }
            `}} />
            {error ? (
                <div className="flex flex-col items-center justify-center py-12 px-8 bg-[#0A0000] border-2 border-[#FF4B4B]/30 rounded-3xl text-center space-y-4 shadow-2xl mx-4 md:mx-0">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-[#FF4B4B] animate-pulse" />
                        <span className="text-[10px] font-black text-[#FF4B4B] uppercase tracking-[0.3em] italic">Structural Logic Model Regression</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium max-w-md leading-relaxed">
                        {error}
                    </p>
                </div>
            ) : (
                <div className="relative">
                    <div className="absolute -top-4 left-12 px-4 py-1.5 bg-[#111827] border border-[#22D3EE]/30 rounded-full z-20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#22D3EE] italic">Structural Logic Model</span>
                    </div>
                    <div
                        ref={containerRef}
                        className="diagram-wrapper w-full overflow-x-auto overflow-y-hidden py-10 px-8 bg-[#0A0F1E] rounded-[2.5rem] border-2 border-[#1E293B] shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_100px_rgba(0,0,0,0.3)] relative z-10 mx-auto transition-all duration-700 group-hover:border-[#22D3EE]/20 custom-scrollbar"
                    >
                        <div className="min-w-[800px] flex justify-center" dangerouslySetInnerHTML={{ __html: svg }} />
                    </div>
                    <div className="absolute -bottom-3 right-12 px-3 py-1 bg-[#020617] border border-[#1E293B] rounded-full z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 shadow-lg">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">Today Decode // Institutional Visual Engine</span>
                    </div>
                </div>
            )}
        </div>
    );
};
