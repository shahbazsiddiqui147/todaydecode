"use client";

import React from 'react';
import parse, { domToReact, HTMLReactParserOptions, Element, Text } from 'html-react-parser';
import { MermaidRenderer } from '@/components/intel/MermaidRenderer';

interface ContentRendererProps {
    content: string;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
    // Recursive text extractor for TipTap nodes
    const extractText = (node: any): string => {
        if (!node) return '';
        if (node.type === 'text') return node.data || '';
        if (node.name === 'br') return '\n';
        if (Array.isArray(node.children)) {
            return node.children.map(extractText).join('');
        }
        return '';
    };

    const options: HTMLReactParserOptions = {
        replace: (domNode: any) => {
            // Priority 1: Semantic code blocks from Tiptap
            if (domNode instanceof Element && domNode.name === 'pre' && (domNode.attribs.class?.includes('mermaid') || domNode.attribs['data-type'] === 'mermaid')) {
                const code = extractText(domNode);
                return <MermaidRenderer code={code} />;
            }

            // Priority 2: Robust Regex Text Intercepts (Direct logic blocks)
            if (domNode instanceof Element && domNode.name === 'p') {
                const text = extractText(domNode).trim();

                const isMermaid = /^(graph|flowchart|sequenceDiagram|gantt|classDiagram|stateDiagram|erDiagram|journey|pie|gitGraph|requirementDiagram)($|[\s\n;])/i.test(text) ||
                    text.startsWith('%%{init');

                if (isMermaid) {
                    return <MermaidRenderer code={text} />;
                }
            }

            // Priority 3: List-to-Mermaid Merging (For when users accidentally use bullet points)
            if (domNode instanceof Element && (domNode.name === 'ul' || domNode.name === 'ol')) {
                const combinedText = domNode.children
                    .filter((child: any) => child.name === 'li')
                    .map((li: any) => extractText(li))
                    .join('\n').trim();

                const isMermaidList = /^(graph|flowchart|sequenceDiagram|gantt|classDiagram|stateDiagram|erDiagram|journey|pie|gitGraph|requirementDiagram)($|[\s\n;])/i.test(combinedText) ||
                    combinedText.startsWith('%%{init');

                if (isMermaidList) {
                    return <MermaidRenderer code={combinedText} />;
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
