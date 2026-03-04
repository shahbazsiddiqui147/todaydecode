"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
    code: string;
}

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ code }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        const renderDiagram = async () => {
            if (!code || isRendered) return;

            try {
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'base',
                    securityLevel: 'loose',
                    themeVariables: {
                        backgroundColor: 'transparent',
                        primaryColor: '#111827',
                        primaryBorderColor: '#1E293B',
                        primaryTextColor: '#F1F5F9',
                        lineColor: '#22D3EE',
                        secondaryColor: '#0A0F1E',
                        tertiaryColor: '#1e293b',
                        mainBkg: '#111827',
                        nodeBorder: '#1E293B',
                        nodeTextColor: '#F1F5F9',
                        fontSize: '14px',
                        fontFamily: 'Inter, sans-serif'
                    }
                });

                const id = `mermaid-render-${Math.random().toString(36).substr(2, 9)}`;
                const { svg: renderedSvg } = await mermaid.render(id, code);
                setSvg(renderedSvg);
                setIsRendered(true);
            } catch (error) {
                console.error('Mermaid render failure:', error);
            }
        };

        renderDiagram();
    }, [code, isRendered]);

    return (
        <div
            ref={containerRef}
            className="mermaid-wrapper w-full flex justify-center py-12 bg-[#111827] rounded-3xl border border-[#1E293B] my-12 overflow-hidden shadow-inner"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};
