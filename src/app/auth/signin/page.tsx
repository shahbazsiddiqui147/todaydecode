"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";

function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/admin/";
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Authorization failed. Institutional metadata mismatch.");
            setLoading(false);
        } else {
            router.push(callbackUrl);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0A0F1E] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-200 dark:from-slate-900/20 via-transparent to-transparent">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
                {/* Institutional Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-[#0F172A] dark:bg-white shadow-2xl mb-4 group transition-transform hover:scale-105">
                        <ShieldCheck className="h-8 w-8 text-white dark:text-[#0F172A]" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">
                            <span className="text-[#0F172A] dark:text-[#22D3EE] dark:text-shadow-institutional">Research</span> <span className="text-[#0F172A] dark:text-[#F1F5F9]">Portal</span>
                        </h1>
                        <p className="text-slate-700 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] italic">Institutional Credentials Required</p>
                    </div>
                </div>

                {/* Secure Entry Card */}
                <div className="bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-[#1E293B] p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent opacity-50" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        {/* Professional Email */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#0F172A] dark:text-[#F1F5F9] ml-1">Professional Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569] dark:text-[#94A3B8]" />
                                <Input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="analyst@todaydecode.com"
                                    className="pl-11 h-12 bg-[#F8FAFC] dark:bg-[#020617] border border-[#CBD5E1] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] dark:placeholder:text-[#475569] rounded-xl focus-visible:ring-[#22D3EE] outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Secure Access Key */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#0F172A] dark:text-[#F1F5F9] ml-1">Secure Access Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569] dark:text-[#94A3B8]" />
                                <Input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="pl-11 h-12 bg-[#F8FAFC] dark:bg-[#020617] border border-[#CBD5E1] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] dark:placeholder:text-[#475569] rounded-xl focus-visible:ring-[#22D3EE] outline-none transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center space-x-3 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2 duration-300 italic">
                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Authorize Session Button */}
                        <Button
                            type="submit"
                            className="w-full h-14 text-[11px] font-black uppercase tracking-[0.3em] bg-[#0F172A] text-white hover:bg-black dark:bg-white dark:text-[#0F172A] dark:hover:bg-slate-100 transition-all rounded-2xl group shadow-lg flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? "Reconciling..." : (
                                <>
                                    Authorize Session
                                    <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Strategic Footer */}
                <p className="text-center text-[9px] text-slate-800 dark:text-slate-500 font-black uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto">
                    For Authorized Institutional Use Only — <br /> Systemic Integrity Framework Active
                </p>
            </div>

            <style jsx global>{`
                .text-shadow-institutional {
                    text-shadow: 0 0 30px rgba(34, 211, 238, 0.3);
                }
            `}</style>
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center space-y-6">
                    <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20" />
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] italic">Institutional Handshake...</span>
                </div>
            </div>
        }>
            <SignInContent />
        </Suspense>
    );
}
