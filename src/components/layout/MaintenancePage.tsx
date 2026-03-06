"use client";

import { Shield, Lock, Activity } from "lucide-react";
import Link from "next/link";

export function MaintenancePage() {
    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative">
            {/* Background Grid Ambience */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#22D3EE 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

            <div className="relative z-10 max-w-2xl w-full space-y-12 animate-in fade-in zoom-in duration-1000">
                {/* Institutional Logo/Identity */}
                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-6 opacity-80">
                        <div className="h-[2px] w-12 bg-[#22D3EE]/30" />
                        <Shield className="h-6 w-6 text-[#22D3EE] animate-pulse" />
                        <div className="h-[2px] w-12 bg-[#22D3EE]/30" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                        System Under <br />
                        <span className="text-[#22D3EE]">Maintenance</span>
                    </h1>
                </div>

                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />

                <div className="space-y-8">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-[#22D3EE]/20 bg-[#22D3EE]/5 text-[#22D3EE]">
                        <Activity className="h-4 w-4 animate-spin-slow" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Continuity in Progress</span>
                    </div>

                    <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md mx-auto">
                        The Strategic Discovery infrastructure is undergoing scheduled institutional hardening.
                        Sovereign access will be restored shortly.
                    </p>
                </div>

                <div className="pt-8 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-8 text-[#64748B]">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-widest italic">Integrity Check</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-[#22D3EE]" />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-widest italic">Data Sovereignty</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-[#22D3EE]" />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-widest italic">Secure Handshake</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-[#22D3EE]" />
                        </div>
                    </div>

                    <Link
                        href="/auth/signin"
                        className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#22D3EE] hover:text-white transition-colors pt-4"
                    >
                        <Lock className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                        Institutional Personnel Ingress
                    </Link>
                </div>
            </div>

            {/* Corner Decorative Elements */}
            <div className="absolute top-10 left-10 p-4 border-l border-t border-[#1E293B] opacity-40">
                <span className="text-[9px] font-mono text-[#64748B] uppercase tracking-tighter block">Status: Restricted</span>
            </div>
            <div className="absolute bottom-10 right-10 p-4 border-r border-b border-[#1E293B] opacity-40">
                <span className="text-[9px] font-mono text-[#64748B] uppercase tracking-tighter block">Code: TD-PROTOCOL-8</span>
            </div>
        </div>
    );
}
