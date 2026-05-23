"use client";

import React from 'react';
import parse, { domToReact, HTMLReactParserOptions, Element, Text } from 'html-react-parser';
import { marked } from 'marked';
import { DiagramRenderer } from '@/components/intel/DiagramRenderer';

// Convert ALL-CAPS heading text to Title Case
// e.g. "THE CHINA SIDE" → "The China Side"
function toTitleCase(str: string): string {
    if (!str) return str;
    // Only convert if string is predominantly uppercase
    const upper = (str.match(/[A-Z]/g) || []).length;
    const lower = (str.match(/[a-z]/g) || []).length;
    if (upper <= lower) return str; // already mixed case, leave it
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

interface ContentRendererProps {
    content: string;
}

// Detect if content is markdown (contains ## headings or **bold**)
function isMarkdown(content: string): boolean {
    return /^#{1,6}\s/m.test(content) || /\*\*[^*]+\*\*/.test(content);
}

// Convert markdown to HTML synchronously
function markdownToHtml(content: string): string {
    marked.setOptions({ breaks: true });
    const result = marked.parse(content);
    // marked.parse can return a Promise if using async renderer, handle both
    if (typeof result === 'string') return result;
    return content;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
    // Pre-process: convert markdown to HTML if needed
    const processedContent = isMarkdown(content) ? markdownToHtml(content) : content;

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
            // Priority 0: Normalise heading case
            if (domNode instanceof Element && ['h1','h2','h3','h4','h5','h6'].includes(domNode.name)) {
                const Tag = domNode.name as any;
                const rawText = extractText(domNode);
                const fixedText = toTitleCase(rawText);
                // Only swap in fixed text if it actually changed
                if (fixedText !== rawText) {
                    return <Tag>{fixedText}</Tag>;
                }
            }

            // Priority 1: Institutional Diagram Block (Tiptap Custom Node)
            if (domNode instanceof Element && domNode.name === 'div' && domNode.attribs['data-type'] === 'diagram-block') {
                const code = domNode.attribs['data-code'] || "";
                return <DiagramRenderer code={code} />;
            }

            // Legacy Support: Semantic code blocks from Tiptap
            if (domNode instanceof Element && domNode.name === 'pre' && (domNode.attribs.class?.includes('mermaid') || domNode.attribs['data-type'] === 'mermaid')) {
                const code = extractText(domNode);
                return <DiagramRenderer code={code} />;
            }

            // Priority 2: Robust Regex Text Intercepts (Direct logic blocks)
            if (domNode instanceof Element && domNode.name === 'p') {
                const text = extractText(domNode).trim();

                const isMermaid = /^(graph|flowchart|sequenceDiagram|gantt|classDiagram|stateDiagram|erDiagram|journey|pie|gitGraph|requirementDiagram)($|[\s\n;])/i.test(text) ||
                    text.startsWith('%%{init');

                if (isMermaid) {
                    return <DiagramRenderer code={text} />;
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
                    return <DiagramRenderer code={combinedText} />;
                }
            }
        },
    };

    return (
        <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-[1.75] text-[1.125rem] font-medium tracking-tight">
            {parse(processedContent, options)}
        </div>
    );
};
