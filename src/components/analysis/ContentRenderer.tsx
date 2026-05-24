"use client";

import React from 'react';
import parse, { domToReact, HTMLReactParserOptions, Element, Text } from 'html-react-parser';
import { marked } from 'marked';
import { DiagramRenderer } from '@/components/intel/DiagramRenderer';
import { AdUnit } from '@/components/monetization/AdUnit';

// Convert ALL-CAPS heading text to Title Case
// e.g. "THE CHINA SIDE" → "The China Side"
function toTitleCase(str: string): string {
    if (!str) return str;
    const upper = (str.match(/[A-Z]/g) || []).length;
    const lower = (str.match(/[a-z]/g) || []).length;
    if (upper <= lower) return str;
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

interface ContentRendererProps {
    content: string;
    /** Show in-content ads after every Nth paragraph. Default: 4. Set 0 to disable. */
    adEvery?: number;
}

function isMarkdown(content: string): boolean {
    return /^#{1,6}\s/m.test(content) || /\*\*[^*]+\*\*/.test(content);
}

function markdownToHtml(content: string): string {
    marked.setOptions({ breaks: true });
    const result = marked.parse(content);
    if (typeof result === 'string') return result;
    return content;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({ content, adEvery = 4 }) => {
    const processedContent = isMarkdown(content) ? markdownToHtml(content) : content;

    // Counter for paragraphs — mutable ref in closure (safe: runs once per render)
    let paragraphCount = 0;

    const extractText = (node: any): string => {
        if (!node) return '';
        if (node.type === 'text') return node.data || '';
        if (node.name === 'br') return '\n';
        if (Array.isArray(node.children)) return node.children.map(extractText).join('');
        return '';
    };

    const options: HTMLReactParserOptions = {
        replace: (domNode: any) => {
            // Priority 0: Normalise heading case
            if (domNode instanceof Element && ['h1','h2','h3','h4','h5','h6'].includes(domNode.name)) {
                const Tag = domNode.name as any;
                const rawText = extractText(domNode);
                const fixedText = toTitleCase(rawText);
                if (fixedText !== rawText) {
                    return <Tag>{fixedText}</Tag>;
                }
            }

            // Priority 1: Diagram block
            if (domNode instanceof Element && domNode.name === 'div' && domNode.attribs['data-type'] === 'diagram-block') {
                return <DiagramRenderer code={domNode.attribs['data-code'] || ""} />;
            }

            // Legacy mermaid code block
            if (domNode instanceof Element && domNode.name === 'pre' && (domNode.attribs.class?.includes('mermaid') || domNode.attribs['data-type'] === 'mermaid')) {
                return <DiagramRenderer code={extractText(domNode)} />;
            }

            // Priority 2: Paragraph — mermaid detection + ad injection
            if (domNode instanceof Element && domNode.name === 'p') {
                const text = extractText(domNode).trim();
                const isMermaid = /^(graph|flowchart|sequenceDiagram|gantt|classDiagram|stateDiagram|erDiagram|journey|pie|gitGraph|requirementDiagram)($|[\s\n;])/i.test(text) || text.startsWith('%%{init');
                if (isMermaid) return <DiagramRenderer code={text} />;

                // Count this paragraph and inject ad after every Nth
                if (adEvery > 0) {
                    paragraphCount++;
                    if (paragraphCount % adEvery === 0) {
                        const adKey = `ad-p-${paragraphCount}`;
                        return (
                            <>
                                <p>{domToReact(domNode.children as any, options)}</p>
                                <div key={adKey} className="my-6 flex justify-center not-prose">
                                    <AdUnit
                                        placement="in-content"
                                        adsenseSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT}
                                        gamUnit={process.env.NEXT_PUBLIC_GAM_UNIT_INCONTENT}
                                        ezoicId={102}
                                    />
                                </div>
                            </>
                        );
                    }
                }
            }

            // Priority 3: Mermaid from list
            if (domNode instanceof Element && (domNode.name === 'ul' || domNode.name === 'ol')) {
                const combinedText = domNode.children
                    .filter((child: any) => child.name === 'li')
                    .map((li: any) => extractText(li))
                    .join('\n').trim();
                const isMermaidList = /^(graph|flowchart|sequenceDiagram|gantt|classDiagram|stateDiagram|erDiagram|journey|pie|gitGraph|requirementDiagram)($|[\s\n;])/i.test(combinedText) || combinedText.startsWith('%%{init');
                if (isMermaidList) return <DiagramRenderer code={combinedText} />;
            }
        },
    };

    return (
        <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-[1.75] text-[1.125rem] font-medium tracking-tight">
            {parse(processedContent, options)}
        </div>
    );
};
