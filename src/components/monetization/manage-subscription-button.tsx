"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ManageSubscriptionButton() {
    const [loading, setLoading] = useState(false);

    const handlePortalRedirect = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/stripe/portal/", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to generate portal link");
            }

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Portal error:", error);
            toast.error("Institutional Link Failed", {
                description: "Could not establish a connection to the billing desk."
            });
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
            <span>Manage Portal</span>
        </button>
    );
}
