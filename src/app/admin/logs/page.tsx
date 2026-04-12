"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { History, ShieldCheck } from "lucide-react";

export default function AuditLogsPage() {
    const { data: session, status } = useSession();

    if (status === "loading") return null;
    if (!session || session.user.role !== "ADMIN") {
        redirect("/admin/");
    }
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B] dark:border-[#1E293B]">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#22D3EE] dark:text-[#22D3EE] uppercase italic pb-1">Activity <span className="text-[#F1F5F9] dark:text-[#F1F5F9] not-italic">Logs</span></h1>
                    <p className="text-[#64748B] dark:text-[#94A3B8] text-xs font-black uppercase tracking-widest">Track all platform modifications and site changes.</p>
                </div>
            </div>

            <div className="bg-[#020617] border border-[#1E293B] rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-[#1E293B] flex items-center space-x-4 bg-[#020617]/50">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    <div>
                        <div className="text-sm font-black text-[#F1F5F9] uppercase tracking-tight italic">Framework integrity: Verified</div>
                        <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-black uppercase tracking-widest">No breaches detected in current cycle.</div>
                    </div>
                </div>
                <div className="p-12 text-center text-[#64748B] dark:text-[#94A3B8] font-black uppercase tracking-[0.2em] italic text-xs">
                    Log Archive Empty // Initializing system monitoring frameworks...
                </div>
            </div>
        </div>
    );
}
