"use client";

import { ShieldCheck, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PendingVerificationPage() {
    return (
        <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-transparent to-transparent">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-700 text-center">
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white text-[#0A0F1E] shadow-2xl shadow-white/5 mb-4">
                    <ShieldCheck className="h-8 w-8" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
                        Identity <span className="text-accent-red">Registered</span>
                    </h1>
                    <div className="p-6 bg-[#111827] border border-slate-800 rounded-2xl space-y-4">
                        <div className="flex justify-center mb-4">
                            <Clock className="h-10 w-10 text-slate-500 animate-pulse" />
                        </div>
                        <h2 className="text-lg font-black uppercase tracking-widest text-white">Institutional Verification in Progress</h2>
                        <p className="text-sm text-slate-400 font-medium">
                            Your credentials have been securely logged. The Editorial Desk manually reviews all applications to ensure the highest standard of institutional integrity.
                        </p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest pt-4 border-t border-slate-800">
                            You will be granted system access upon approval.
                        </p>
                    </div>
                </div>

                <div className="pt-8">
                    <Link href="/">
                        <Button variant="ghost" className="text-slate-400 hover:text-white transition-colors group text-[10px] font-black uppercase tracking-widest">
                            <ArrowLeft className="h-3.5 w-3.5 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Return to Global Context
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
