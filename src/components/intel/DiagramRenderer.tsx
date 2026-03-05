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

            const fullCode = `%%{init: {"theme": "base", "themeVariables": { "primaryColor": "#111827", "mainBkg": "#0A0F1E", "textColor": "#F1F5F9", "lineColor": "#22D3EE", "nodeBorder": "#1E293B" }}}%%\n${sanitizedCode}`;

            mermaid.initialize({
                startOnLoad: false,
                theme: 'base',
                securityLevel: 'loose',
                fontFamily: 'Inter, sans-serif',
            });

            const id = `diagram-${Math.random().toString(36).substr(2, 9)}`;
            const { svg: renderedSvg } = await mermaid.render(id, fullCode);
            setSvg(renderedSvg);
        } catch (err: any) {
            console.error('Sovereign Diagram failure:', err);
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
        <div className="my-16 relative group">
            {error ? (
                <div className="flex flex-col items-center justify-center py-12 px-8 bg-[#0A0000] border-2 border-[#FF4B4B]/30 rounded-3xl text-center space-y-4 shadow-2xl">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-[#FF4B4B] animate-pulse" />
                        <span className="text-[10px] font-black text-[#FF4B4B] uppercase tracking-[0.3em] italic">Structural Logic Regression</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium max-w-md leading-relaxed">
                        {error}
                    </p>
                    <div className="w-full max-w-xl bg-black/40 rounded-xl p-6 overflow-x-auto border border-white/5">
                        <pre className="font-mono text-[10px] text-slate-500 text-left leading-tight">
                            {code.split('\n').map((line, i) => (
                                <div key={i} className="flex gap-4">
                                    <span className="opacity-20 select-none w-4">{i + 1}</span>
                                    <span>{line}</span>
                                </div>
                            ))}
                        </pre>
                    </div>
                </div>
            ) : (
                <div className="relative">
                    <div className="absolute -top-4 left-8 px-4 py-1 bg-[#22D3EE] rounded-full z-20 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#020617] italic">Structural Logic Model</span>
                    </div>
                    <div
                        ref={containerRef}
                        className="diagram-wrapper w-full flex justify-center py-16 bg-[#0A0F1E] rounded-[2.5rem] border border-[#1E293B] overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] relative z-10"
                        dangerouslySetInnerHTML={{ __html: svg }}
                    />
                    <div className="absolute -bottom-3 right-12 px-3 py-0.5 bg-[#111827] border border-[#1E293B] rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Powered by Sovereign Visual Engine</span>
                    </div>
                </div>
            )}
        </div>
    );
};
