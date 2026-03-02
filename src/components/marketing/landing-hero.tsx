"use client";

import { ShieldCheck, Globe, Zap, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LandingHero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-[#0A0F1E]">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.08)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center text-center space-y-10">
                    <div className="flex items-center space-x-3 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
                        <ShieldCheck className="h-4 w-4 text-accent-red" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            Institutional Intelligence <span className="text-white">v4.0 Operational</span>
                        </span>
                    </div>

                    <div className="space-y-6 max-w-5xl">
                        <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] italic animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                            Tomorrow's Risks <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-red">Decoded Today</span>
                        </h1>
                        <p className="text-[#94A3B8] text-lg md:text-xl font-medium max-w-3xl mx-auto uppercase tracking-tight leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                            The sovereign intelligence platform for geopolitical analysts, tactical responders, and global policy makers. High-fidelity foresight in a fragmented world.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 animate-in fade-in scale-in-95 duration-1000 delay-500">
                        <Link href="/auth/signup/">
                            <Button size="lg" className="h-14 px-10 text-sm font-black uppercase tracking-widest bg-white text-primary hover:bg-slate-200 rounded-2xl shadow-2xl">
                                Join The Archive
                            </Button>
                        </Link>
                        <Link href="/geopolitics/">
                            <Button size="lg" variant="outline" className="h-14 px-10 text-sm font-black uppercase tracking-widest border-white/10 hover:bg-white/5 rounded-2xl">
                                Personnel Entry
                            </Button>
                        </Link>
                    </div>

                    {/* Trust/Capabilities */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-white/5 w-full max-w-4xl animate-in fade-in duration-1000 delay-700">
                        <div className="flex flex-col items-center gap-2">
                            <Globe className="h-5 w-5 text-slate-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#64748B]">Global Hotspots</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Zap className="h-5 w-5 text-slate-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#64748B]">Real-time Sync</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Cpu className="h-5 w-5 text-slate-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#64748B]">Scenario Modeling</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-slate-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#64748B]">Verified Intel</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
