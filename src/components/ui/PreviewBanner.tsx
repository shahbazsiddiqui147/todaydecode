"use client";

import { useState, useEffect } from "react";
import { Eye, ShieldCheck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function PreviewBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check for the institutional cookie on the client side
        const hasCookie = document.cookie.split('; ').some(row => row.startsWith('TD_PREVIEW_ACCESS=authorized'));
        setIsVisible(hasCookie);
    }, []);

    const handleDeauthorize = () => {
        // Clear the persistence cookie
        document.cookie = "TD_PREVIEW_ACCESS=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        // Flush the cache and return to the root
        window.location.href = "/";
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#0A0F1E] border border-cyan-400/30 rounded-full px-6 py-3 flex items-center gap-6 shadow-[0_0_30px_rgba(34,211,238,0.15)] backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Eye className="h-4 w-4 text-cyan-400 animate-pulse" />
                        <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 italic whitespace-nowrap">
                        Preview Mode Active // Strategic Oversight Enabled
                    </span>
                </div>

                <div className="h-4 w-px bg-white/10" />

                <button
                    onClick={handleDeauthorize}
                    className="flex items-center gap-2 group transition-all"
                >
                    <XCircle className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                        Deauthorize
                    </span>
                </button>
            </div>
        </div>
    );
}
