"use client";

import React from 'react';
import parse, { domToReact, HTMLReactParserOptions, Element, Text } from 'html-react-parser';
import { MermaidRenderer } from '@/components/intel/MermaidRenderer';

interface ContentRendererProps {
    content: string;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
    const options: HTMLReactParserOptions = {
        replace: (domNode: any) => {
            // Priority 1: Semantic code blocks from Tiptap
            if (domNode instanceof Element && domNode.name === 'pre' && (domNode.attribs.class?.includes('mermaid') || domNode.attribs['data-type'] === 'mermaid')) {
                const code = (domNode.children[0] as Text)?.data || domNode.children.map((c: any) => c.data).join('') || '';
                return <MermaidRenderer code={code} />;
            }

            // Priority 2: Robust Regex Text Intercepts (Direct logic blocks)
            if (domNode instanceof Element && domNode.name === 'p') {
                const text = domNode.children.map((c: any) => {
                    if (c.type === 'text') return c.data;
                    if (c.name === 'br') return '\n';
                    return '';
                }).join('').trim();

                // Detection: Keywords at start of text, case-insensitive, followed by mandatory break (space, newline, or separator)
                const isMermaid = /^(graph|flowchart|sequenceDiagram|gantt|classDiagram|stateDiagram|erDiagram|journey|pie|gitGraph|requirementDiagram)($|[\s\n;])/i.test(text) ||
                    text.startsWith('%%{init');

                if (isMermaid) {
                    return <MermaidRenderer code={text} />;
                }
            }
        },
    };

    return (
        <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-[1.75] text-[1.125rem] font-medium tracking-tight">
            {parse(content, options)}
        </div>
    );
};
