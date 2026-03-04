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
            if (domNode instanceof Element && domNode.name === 'pre' && domNode.attribs.class === 'mermaid') {
                const code = (domNode.children[0] as Text)?.data || '';
                return <MermaidRenderer code={code} />;
            }
        },
    };

    return (
        <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-[1.75] text-[1.125rem] font-medium tracking-tight">
            {parse(content, options)}
        </div>
    );
};
