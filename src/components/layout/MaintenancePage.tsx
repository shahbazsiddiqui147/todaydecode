"use client";

import { Shield, Lock, Activity, ChevronRight } from "lucide-react";
import Link from "next/link";

export function MaintenancePage() {
    return (
        <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative">
            {/* Background Grid Ambience - Anti-Grey Shield */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#22D3EE 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

            <div className="relative z-10 max-w-2xl w-full space-y-12 animate-in fade-in zoom-in duration-1000">
                {/* Institutional Identity */}
                <div className="space-y-6">
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-[1px] w-16 bg-[#22D3EE]/20" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">Today Decode</span>
                        <div className="h-[1px] w-16 bg-[#22D3EE]/20" />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                        <span className="text-[#22D3EE]">Strategic Archive</span> <br />
                        <span className="text-[#F1F5F9]">Offline</span>
                    </h1>
                </div>

                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />

                <div className="space-y-10">
                    <div className="inline-flex items-center gap-3 px-8 py-2.5 rounded-full border border-[#22D3EE]/20 bg-[#22D3EE]/5 text-[#22D3EE]">
                        <Activity className="h-4 w-4 animate-spin-slow" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Strategic Alignment in Progress</span>
                    </div>

                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-lg mx-auto uppercase tracking-tight">
                        The Research Archive is currently undergoing scheduled <br className="hidden md:block" />
                        framework optimization and data verification. Access to our <br className="hidden md:block" />
                        latest strategic assessments will be restored shortly.
                    </p>
                </div>

                <div className="pt-12 flex flex-col items-center gap-10">
                    {/* Status Indicators */}
                    <div className="flex items-center gap-12 text-[#64748B]">
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">Peer Review</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">Data Verification</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">Institutional Alignment</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
                        </div>
                    </div>

                    {/* Access Link */}
                    <Link
                        href="/auth/signin"
                        className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#22D3EE] hover:text-white transition-all pt-8 border-t border-white/5 w-full justify-center"
                    >
                        <Lock className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100 group-hover:text-white transition-opacity" />
                        Research Fellow Entrance
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                </div>
            </div>

            {/* Corner Decorative Elements */}
            <div className="absolute top-12 left-12 p-4 border-l border-t border-white/5 opacity-20">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter block">Vault_Tier: Restricted</span>
            </div>
            <div className="absolute bottom-12 right-12 p-4 border-r border-b border-white/5 opacity-20 text-right">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter block">Framework: V2.4-Institutional</span>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter block mt-1">© {new Date().getFullYear()} TD_Institutional</span>
            </div>
        </div>
    );
}
