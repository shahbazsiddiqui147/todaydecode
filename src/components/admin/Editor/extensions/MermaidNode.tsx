"use client";

import { Node, NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import React, { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";
import { Zap, Play, Code, Eye } from "lucide-react";

const MermaidComponent = ({ node, updateAttributes }: NodeViewProps) => {
    const [isEditing, setIsEditing] = useState(!node.attrs.code);
    const [previewSvg, setPreviewSvg] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isEditing && node.attrs.code) {
            renderMermaid();
        }
    }, [isEditing, node.attrs.code]);

    const renderMermaid = async () => {
        try {
            setError(null);
            mermaid.initialize({
                startOnLoad: false,
                theme: 'base',
                themeVariables: {
                    backgroundColor: '#0A0F1E',
                    primaryColor: '#111827',
                    primaryBorderColor: '#1E293B',
                    primaryTextColor: '#F1F5F9',
                    lineColor: '#22D3EE',
                    tertiaryColor: '#1e293b',
                    edgeLabelBackground: '#111827',
                    clusterBkg: '#020617',
                    clusterBorder: '#1E293B',
                }
            });

            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            const { svg } = await mermaid.render(id, node.attrs.code);
            setPreviewSvg(svg);
        } catch (e: any) {
            console.error("Mermaid Render Error:", e);
            setError("Invalid strategic diagram logic. Please verify ASCII syntax.");
        }
    };

    return (
        <NodeViewWrapper className="mermaid-node-view my-8">
            <div className="rounded-2xl border border-border-slate bg-[#020617] overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-border-slate">
                    <div className="flex items-center gap-2">
                        <Zap className="h-3 w-3 text-[#22D3EE]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Structural Analysis Block</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[9px] font-bold uppercase tracking-widest text-[#22D3EE] transition-all"
                        >
                            {isEditing ? <><Eye className="h-3 w-3" /> Preview</> : <><Code className="h-3 w-3" /> Edit Code</>}
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    {isEditing ? (
                        <textarea
                            value={node.attrs.code}
                            onChange={(e) => updateAttributes({ code: e.target.value })}
                            placeholder="graph TD\n  A[Inflow] --> B{Process}"
                            className="w-full h-48 bg-black/40 border border-white/5 rounded-xl p-4 text-xs font-mono text-[#F1F5F9] focus:outline-none focus:border-[#22D3EE]/30 resize-none"
                        />
                    ) : (
                        <div className="min-h-[100px] flex flex-col items-center justify-center bg-slate-950/30 rounded-xl p-6">
                            {error ? (
                                <div className="text-accent-red text-[10px] font-black uppercase tracking-tighter flex items-center gap-2">
                                    <Code className="h-4 w-4" />
                                    {error}
                                </div>
                            ) : (
                                <div
                                    className="w-full h-full flex justify-center mermaid-preview"
                                    dangerouslySetInnerHTML={{ __html: previewSvg }}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </NodeViewWrapper>
    );
};

export const MermaidBlock = Node.create({
    name: "mermaidBlock",
    group: "block",
    atom: true,

    addAttributes() {
        return {
            code: {
                default: "graph TD\n    A[2024: Unipolar Legacy] --> B{The Pivot}\n    B --> C[Silo A: Western Tech-Fiscal Bloc]\n    B --> D[Silo B: BRICS+ Resource-Settlement Bloc]\n    B --> E[Silo C: Non-Aligned Tech Hubs - UAE/India]\n    C --> F[2027: Sovereign AI Integration]\n    D --> F\n    E --> F\n    F --> G[2030: Multipolar Systemic Integrity]\n    style B fill:#111827,stroke:#22D3EE,stroke-width:2px,color:#F1F5F9\n    style G fill:#10B981,stroke:#333,stroke-width:2px,color:#000",
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'pre',
                getAttrs: (element: HTMLElement) => {
                    if (element.classList.contains('mermaid')) {
                        return { code: element.innerText };
                    }
                    return false;
                },
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['pre', { class: 'mermaid' }, HTMLAttributes.code || ""];
    },

    addNodeView() {
        return ReactNodeViewRenderer(MermaidComponent);
    },
});
