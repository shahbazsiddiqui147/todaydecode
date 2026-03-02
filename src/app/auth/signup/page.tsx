"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, User, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/actions/auth-actions";
import { toast } from "sonner";
import Link from "next/link";

export default function SignUpPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const res = await signUp(formData);

        if (res.error) {
            setError(res.error);
            setLoading(false);
        } else {
            toast.success("Identity initialized. Please sign in.");
            router.push("/auth/signin/");
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-transparent to-transparent">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white text-[#0A0F1E] shadow-2xl shadow-white/5 mb-4 scale-110">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                            Initialize <span className="text-accent-red">Identity</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Institutional Analyst Enrollment</p>
                    </div>
                </div>

                <div className="bg-[#111827] border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-red to-transparent opacity-50" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Analyst Name"
                                    className="pl-11 bg-slate-950 border-slate-800 focus:border-accent-red text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Institutional Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="analyst@todaydecode.com"
                                    className="pl-11 bg-slate-950 border-slate-800 focus:border-accent-red text-white"
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
                                    className="pl-11 bg-slate-950 border-slate-800 focus:border-accent-red text-white"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-accent-red/10 border border-accent-red/20 rounded-xl flex items-center space-x-3 text-accent-red text-[10px] font-black uppercase slide-in-from-top-2 duration-300">
                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-14 text-[10px] font-black uppercase tracking-widest bg-white text-[#0A0F1E] hover:bg-slate-200 transition-all rounded-2xl group shadow-lg"
                            disabled={loading}
                        >
                            {loading ? "Initializing..." : "Register Identity"}
                        </Button>
                    </form>
                </div>

                <div className="text-center">
                    <Link
                        href="/auth/signin/"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2 group"
                    >
                        Already registered? Sign In <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] opacity-30">
                    Strict Confidentiality — Institutional Rules Apply
                </p>
            </div>
        </div>
    );
}
