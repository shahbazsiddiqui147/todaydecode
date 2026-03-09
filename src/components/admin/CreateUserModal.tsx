"use client";

import { useState } from "react";
import { createUser } from "@/lib/actions/admin-actions";
import {
    Plus,
    Loader2,
    ShieldAlert,
    UserPlus,
    UserCheck,
    UserMinus,
    Mail,
    Lock,
    User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CreateUserModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            role: formData.get("role") as any,
        };

        try {
            const result = await createUser(data);
            if (result?.success) {
                toast.success("Personnel Induction Successful.");
                setOpen(false);
            } else {
                toast.error(result?.error || "Induction failed.");
            }
        } catch {
            toast.error("Institutional link severed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className="h-11 px-6 bg-[#22D3EE] text-[#0F172A] hover:bg-[#06B6D4] text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all"
            >
                <Plus className="h-4 w-4 mr-2" />
                Induct Personnel
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="relative w-full max-w-[425px] bg-white dark:bg-[#0D1425] border border-slate-200 dark:border-[#1E293B] rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute right-6 top-6 text-[#64748B] hover:text-[#0F172A] dark:hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>

                        <div className="space-y-3 mb-6 text-center">
                            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-slate-100 dark:bg-white/5 mx-auto">
                                <UserPlus className="h-6 w-6 text-[#22D3EE]" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter italic text-[#0F172A] dark:text-white">
                                Induct <span className="text-[#22D3EE] not-italic">Identity</span>
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#475569] dark:text-[#94A3B8]">
                                Manually authorize institutional access.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0F172A] dark:text-[#F1F5F9] ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
                                    <Input
                                        name="name"
                                        required
                                        placeholder="Analyst Name"
                                        className="pl-11 h-12 bg-[#F8FAFC] dark:bg-[#020617] border border-[#CBD5E1] dark:border-[#1E293B] text-[#0F172A] dark:text-white rounded-xl focus-visible:ring-[#22D3EE] placeholder:text-[#64748B] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0F172A] dark:text-[#F1F5F9] ml-1">Institutional Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
                                    <Input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="analyst@example.com"
                                        className="pl-11 h-12 bg-[#F8FAFC] dark:bg-[#020617] border border-[#CBD5E1] dark:border-[#1E293B] text-[#0F172A] dark:text-white rounded-xl focus-visible:ring-[#22D3EE] placeholder:text-[#64748B] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0F172A] dark:text-[#F1F5F9] ml-1">Temporary Access Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#475569]" />
                                    <Input
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        minLength={8}
                                        className="pl-11 h-12 bg-[#F8FAFC] dark:bg-[#020617] border border-[#CBD5E1] dark:border-[#1E293B] text-[#0F172A] dark:text-white rounded-xl focus-visible:ring-[#22D3EE] placeholder:text-[#64748B] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#0F172A] dark:text-[#F1F5F9] ml-1">Clearance Level</label>
                                <div className="relative">
                                    <select
                                        name="role"
                                        defaultValue="AUTHOR"
                                        className="w-full h-12 pl-4 pr-10 bg-[#F8FAFC] dark:bg-[#020617] border border-[#CBD5E1] dark:border-[#1E293B] focus:border-[#22D3EE] text-[#0F172A] dark:text-white text-xs font-bold uppercase rounded-xl appearance-none outline-none transition-all"
                                    >
                                        <option value="AUTHOR">Strategic Analyst / Fellow</option>
                                        <option value="EDITOR">Senior Editor</option>
                                        <option value="ADMIN">Master Administrator</option>
                                        <option value="GUEST">Institutional Guest</option>
                                    </select>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-[#0F172A] hover:bg-black text-white dark:bg-[#22D3EE] dark:text-[#0F172A] dark:hover:bg-[#06B6D4] text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl transition-all"
                            >
                                {loading ? (
                                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
                                ) : (
                                    "Induct Personnel Identity"
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
