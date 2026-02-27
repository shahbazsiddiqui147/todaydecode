"use client";

import { useState } from "react";
import { MetadataSlider } from "@/components/admin/metadata-toggles";
import {
    Save,
    Eye,
    Image as ImageIcon,
    Type,
    List,
    Quote
} from "lucide-react";

export default function AdminPage() {
    const [riskScore, setRiskScore] = useState(72);
    const [impactScore, setImpactScore] = useState(85);

    return (
        <div className="space-y-8 pb-20">
            <header className="flex items-center justify-between border-b border-border-slate pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Intelligence CMS
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Create and deploy global intelligence reports.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="inline-flex items-center px-4 py-2 rounded-md border border-border-slate bg-transparent text-sm font-bold text-slate-400 hover:text-white transition-colors">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                    </button>
                    <button className="inline-flex items-center px-4 py-2 rounded-md bg-accent-red text-sm font-bold text-white hover:bg-red-600 transition-colors">
                        <Save className="mr-2 h-4 w-4" />
                        Deploy Intel
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Report Title
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Middle East Escalation | Today Decode"
                            className="w-full bg-transparent border-b border-border-slate py-2 text-3xl font-bold focus:outline-none focus:border-accent-red transition-colors"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Intel Content
                        </label>
                        <div className="min-h-[400px] border border-border-slate rounded-xl bg-primary/20 overflow-hidden flex flex-col">
                            <div className="flex items-center space-x-2 border-b border-border-slate p-2 bg-slate-900/50">
                                <button className="p-2 hover:bg-slate-800 rounded text-slate-400"><Type className="h-4 w-4" /></button>
                                <button className="p-2 hover:bg-slate-800 rounded text-slate-400"><List className="h-4 w-4" /></button>
                                <button className="p-2 hover:bg-slate-800 rounded text-slate-400"><Quote className="h-4 w-4" /></button>
                                <div className="h-4 w-[1px] bg-border-slate mx-1" />
                                <button className="p-2 hover:bg-slate-800 rounded text-slate-400"><ImageIcon className="h-4 w-4" /></button>
                                <button className="ml-auto px-3 py-1 rounded border border-border-slate text-[10px] font-bold text-accent-red uppercase tracking-widest">
                                    Auto-Convert to WebP
                                </button>
                            </div>
                            <textarea
                                className="flex-1 bg-transparent p-6 text-slate-300 outline-none resize-none font-serif text-lg leading-relaxed"
                                placeholder="Begin strategic briefing..."
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold border-l-2 border-accent-red pl-3 uppercase tracking-wider">
                            Intelligence Metadata
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Strategic Region
                                </label>
                                <select className="w-full bg-slate-900 border border-border-slate rounded-md px-3 py-2 text-sm text-slate-300 outline-none focus:border-accent-red">
                                    <option>Global</option>
                                    <option>MENA</option>
                                    <option>APAC</option>
                                    <option>Europe</option>
                                    <option>Americas</option>
                                    <option>Africa</option>
                                </select>
                            </div>

                            <MetadataSlider
                                label="Conflict Intensity Index"
                                value={riskScore}
                                onChange={setRiskScore}
                            />

                            <MetadataSlider
                                label="Strategic Impact Score"
                                value={impactScore}
                                onChange={setImpactScore}
                            />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-bold border-l-2 border-accent-red pl-3 uppercase tracking-wider">
                            AEO / SEO Configuration
                        </h3>
                        <div className="space-y-4 bg-primary/40 p-4 border border-border-slate rounded-lg">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Quick Answer (AIO Optimized)
                                </label>
                                <textarea
                                    className="w-full bg-slate-900 border border-border-slate rounded-md p-3 text-xs text-slate-400 outline-none focus:border-accent-red h-24"
                                    placeholder="Summarize in 3 bullet points for AI crawlers..."
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
