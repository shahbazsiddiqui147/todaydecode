"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ManageSubscriptionButton() {
    const [loading, setLoading] = useState(false);

    const handlePortalRedirect = async () => {
        setLoading(true);
        try {
            toast.info("Institutional Desk Maintenance", {
                description: "The automated billing portal is currently offline for strategic upgrades."
            });
            setTimeout(() => {
                window.location.href = "/about/";
            }, 1500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePortalRedirect}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 border border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white hover:border-slate-700 transition-all rounded-lg group"
        >
            {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
                <CreditCard className="h-3.5 w-3.5 group-hover:text-accent-cyan transition-colors" />
            )}
            <span>Portal Offline</span>
        </button>
    );
}
