"use client";

import { Node, NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import React, { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";
import { Zap, Play, Code, Eye, AlertCircle } from "lucide-react";

const DiagramComponent = ({ node, updateAttributes }: NodeViewProps) => {
    const [isEditing, setIsEditing] = useState(!node.attrs.code || node.attrs.code.includes("Unipolar Legacy"));
    const [previewSvg, setPreviewSvg] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const renderMermaid = async () => {
        if (!node.attrs.code) return;

        try {
            setError(null);

            // Institutional Branding Injection
            const fullCode = `%%{init: {"theme": "base", "themeVariables": { "primaryColor": "#111827", "mainBkg": "#0A0F1E", "textColor": "#F1F5F9", "lineColor": "#22D3EE", "nodeBorder": "#1E293B" }}}%%\n${node.attrs.code}`;

            mermaid.initialize({
                startOnLoad: false,
                theme: 'base',
                securityLevel: 'loose',
                fontFamily: 'Inter, sans-serif',
            });

            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            const { svg } = await mermaid.render(id, fullCode);
            setPreviewSvg(svg);
        } catch (e: any) {
            console.error("Mermaid Render Error:", e);
            setError(e.message || "Invalid structural logic. Please verify ASCII syntax.");
        }
    };

    useEffect(() => {
        if (!isEditing && node.attrs.code) {
            renderMermaid();
        }
    }, [isEditing, node.attrs.code]);

    return (
        <NodeViewWrapper className="diagram-block-node my-12">
            <div className="rounded-3xl border-2 border-[#22D3EE]/20 bg-[#020617] overflow-hidden shadow-[0_0_50px_-12px_rgba(34,211,238,0.1)]">
                <div className="flex items-center justify-between px-6 py-3 bg-[#0A0F1E] border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-[#22D3EE] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#22D3EE] italic">Structural Logic Model</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-[#22D3EE]/10 text-[9px] font-black uppercase tracking-widest text-[#22D3EE] transition-all border border-[#22D3EE]/20"
                    >
                        {isEditing ? <><Eye className="h-3.5 w-3.5" /> Preview Model</> : <><Code className="h-3.5 w-3.5" /> Edit Logic</>}
                    </button>
                </div>

                <div className="p-6">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Graph Logic Input</span>
                                <span className="text-[9px] font-medium text-slate-600 italic">Institutional Branding Auto-Injected</span>
                            </div>
                            <textarea
                                value={node.attrs.code}
                                onChange={(e) => updateAttributes({ code: e.target.value })}
                                placeholder="graph TD\n  A[Origin] --> B{Pivot}\n  B --> C[Outcome]"
                                className="w-full h-64 bg-black/40 border border-white/5 rounded-2xl p-6 text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#22D3EE]/50 resize-none leading-relaxed transition-colors"
                            />
                        </div>
                    ) : (
                        <div className="min-h-[200px] flex flex-col items-center justify-center bg-[#0A0F1E]/50 rounded-2xl p-8 relative overflow-hidden">
                            {error ? (
                                <div className="flex flex-col items-center gap-4 text-center max-w-md">
                                    <AlertCircle className="h-8 w-8 text-[#FF4B4B]" />
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FF4B4B]">Logic Regression Detected</span>
                                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{error}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="mt-2 text-[9px] font-black text-[#22D3EE] uppercase underline underline-offset-4"
                                    >
                                        Return to Source
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="w-full h-full flex justify-center diagram-preview-container"
                                    dangerouslySetInnerHTML={{ __html: previewSvg }}
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="px-6 py-2 bg-black/20 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">Sovereign Visual Engine v2.0</span>
                    <span className="text-[8px] font-medium text-slate-800 italic">Confidential Institutional Output</span>
                </div>
            </div>
        </NodeViewWrapper>
    );
};

export const DiagramBlock = Node.create({
    name: "diagramBlock",
    group: "block",
    content: "inline*", // Changed to allow some nesting if needed, though atom: true usually prevents it
    atom: true,
    selectable: true,
    draggable: true,

    addAttributes() {
        return {
            code: {
                default: "graph TD\n    A[2024: Current State] --> B{Strategic Pivot}\n    B --> C[Institutional Outcome]",
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="diagram-block"]',
                getAttrs: (element: HTMLElement) => ({
                    code: element.getAttribute('data-code'),
                }),
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', {
            'data-type': 'diagram-block',
            'data-code': HTMLAttributes.code,
            class: 'structural-logic-model'
        }];
    },

    addNodeView() {
        return ReactNodeViewRenderer(DiagramComponent);
    },
});
