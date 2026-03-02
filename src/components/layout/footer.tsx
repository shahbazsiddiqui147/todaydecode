"use server";

import Link from "next/link";
import { getAdminPages } from "@/lib/actions/admin-actions";
import { Shield, Globe, Lock, FileText, ChevronRight } from "lucide-react";

export async function Footer() {
    let pages = [];
    try {
        pages = await getAdminPages() as any[];
    } catch (error) {
        console.error("Institutional Footer Sync Failed:", error);
    }

    return (
        <footer className="w-full bg-[#0A0F1E] border-t border-[#1E293B] pt-20 pb-10 px-6 mt-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-[#1E293B] pb-16">
                {/* Brand Identity */}
                <div className="md:col-span-1 space-y-6">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-white uppercase italic">
                        Today Decode
                    </Link>
                    <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-tight leading-relaxed max-w-xs">
                        A sovereign strategic advisory providing high-fidelity geopolitical intelligence and risk assessment for institutional decision-makers.
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-lg bg-[#111827] border border-[#1E293B] flex items-center justify-center">
                            <Shield className="h-4 w-4 text-accent-red" />
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-[#111827] border border-[#1E293B] flex items-center justify-center">
                            <Globe className="h-4 w-4 text-accent-green" />
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-[#111827] border border-[#1E293B] flex items-center justify-center">
                            <Lock className="h-4 w-4 text-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Institutional Framework */}
                <div className="md:col-span-1 space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Institutional</h4>
                    <nav className="flex flex-col gap-3">
                        {pages.map((page) => (
                            <Link
                                key={page.id}
                                href={`/${page.slug.replace(/^\/|\/$/g, '')}/`}
                                className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2 group"
                            >
                                <ChevronRight className="h-3 w-3 text-accent-red opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                {page.title}
                            </Link>
                        ))}
                        {pages.length === 0 && (
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter italic">Data Pending...</span>
                        )}
                    </nav>
                </div>

                {/* Intelligence Access */}
                <div className="md:col-span-1 space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Intelligence Hub</h4>
                    <nav className="flex flex-col gap-3">
                        <Link href="/geopolitics/" className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] hover:text-white transition-colors">Geopolitics</Link>
                        <Link href="/global-economy/" className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] hover:text-white transition-colors">Global Economy</Link>
                        <Link href="/security-defense/" className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] hover:text-white transition-colors">Security & Defense</Link>
                    </nav>
                </div>

                {/* System Integrity */}
                <div className="md:col-span-1 p-6 bg-[#111827] border border-[#1E293B] rounded-2xl space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-accent-green">Operational Matrix</span>
                    </div>
                    <p className="text-[10px] font-medium text-[#94A3B8] leading-relaxed">
                        The Strategic Archive is monitored by institutional AI. All data manifests are encrypted with sovereign-grade protocols.
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-white/5">
                        <span className="text-[8px] font-black text-slate-600 uppercase">Latency: 24ms</span>
                        <span className="text-[8px] font-black text-slate-600 uppercase">Uptime: 99.9%</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.1em]">
                    © {new Date().getFullYear()} TODAY DECODE STRATEGIC ADVISORY. ALL RIGHTS RESERVED.
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-[8px] font-black text-slate-700 uppercase tracking-tighter">System Version: 2.2.0-Alpha</span>
                    <span className="text-[8px] font-black text-slate-700 uppercase tracking-tighter">Encrypted Handshake: Active</span>
                </div>
            </div>
        </footer>
    );
}
