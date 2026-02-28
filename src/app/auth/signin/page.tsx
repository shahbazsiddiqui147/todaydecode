"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
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
            setError("Authorization failed. Metadata mismatch.");
            setLoading(false);
        } else {
            router.push(callbackUrl);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0F172A] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900/10 via-transparent to-transparent">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-accent-red shadow-2xl shadow-accent-red/20 mb-4 scale-110">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                            Command <span className="text-accent-red text-shadow-glow">Access</span>
                        </h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">Institutional Verification Required</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-red to-transparent opacity-50" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Personnel Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="analyst@todaydecode.com"
                                    className="pl-11 bg-slate-50 dark:bg-white/5 border-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Protocol (Password)</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="pl-11 bg-slate-50 dark:bg-white/5 border-none"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-accent-red/10 border border-accent-red/20 rounded-xl flex items-center space-x-3 text-accent-red text-xs font-bold animate-in slide-in-from-top-2 duration-300">
                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-14 text-sm font-black uppercase tracking-widest bg-slate-900 text-white hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-all rounded-2xl group shadow-lg"
                            disabled={loading}
                        >
                            {loading ? "Decrypting..." : "Initialize Uplink"}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] opacity-50">
                    Strict Confidentiality — Unauthorized Access is Prohibited
                </p>
            </div>

            <style jsx global>{`
        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
        }
      `}</style>
        </div>
    );
}
