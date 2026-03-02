"use client";

import { useState } from "react";
import { Check, Shield, Zap, Layers, Globe, Clock, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const plans = [
    {
        name: "Public Analysis",
        price: "$0",
        period: "Forever",
        description: "Essential geopolitical updates for general observation.",
        features: [
            "Access to non-premium reports",
            "Global Risk Map (High Level)",
            "Basic Search functionality",
            "Public Analytical briefs",
        ],
        cta: "Start Reading",
        href: "/",
        highlight: false,
    },
    {
        name: "Institutional Oversight",
        price: "$499",
        period: "per month",
        description: "Full strategic access for decision makers and institutions.",
        features: [
            "Full Access to Premium Reports",
            "Real-time Intel Pulse (Risk > 80)",
            "Deep-dive Scenario Forecasts",
            "Priority Analyst Queries",
            "Advanced Historical Vault Access",
            "Direct PDF Export for Briefings",
        ],
        cta: "Join the Advisory",
        href: "/api/stripe/checkout",
        highlight: true,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM || "price_premium_placeholder",
    }
];

export default function PricingPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const handleSubscribe = async (plan: typeof plans[0]) => {
        if (plan.name === "Public Analysis") {
            router.push(plan.href);
            return;
        }

        if (!session) {
            router.push("/auth/signin?callbackUrl=/pricing/");
            return;
        }

        setLoadingPlan(plan.name);
        try {
            const response = await fetch("/api/stripe/checkout/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId: plan.priceId }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Subscription error:", error);
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="min-h-screen bg-primary py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center space-y-4 mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <Shield className="h-3 w-3" />
                        <span>Advisory Access Control</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] italic"
                    >
                        Institutional <br /> <span className="text-accent-cyan">Intelligence Tiers</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-lg max-w-2xl mx-auto font-medium"
                    >
                        Equip your team with state-of-the-art geopolitical foresight. Choose the level of oversight required for your mission.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            className={cn(
                                "relative p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden group",
                                plan.highlight
                                    ? "bg-secondary border-accent-cyan/30 shadow-[0_0_50px_-12px_rgba(34,211,238,0.2)]"
                                    : "bg-secondary/50 border-white/5 hover:border-white/10"
                            )}
                        >
                            {plan.highlight && (
                                <>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 blur-[60px]" />
                                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent-cyan/20 rounded-full blur-[40px]" />
                                </>
                            )}

                            <div className="space-y-8 relative z-10">
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">
                                        {plan.name}
                                    </h3>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="flex items-baseline space-x-2">
                                    <span className="text-5xl font-black text-white">{plan.price}</span>
                                    <span className="text-sm text-slate-500 font-bold uppercase tracking-widest">{plan.period}</span>
                                </div>

                                <ul className="space-y-4 pt-12 border-t border-white/5">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center space-x-3 group/item">
                                            <div className={cn(
                                                "p-1 rounded-full",
                                                plan.highlight ? "bg-accent-cyan/10 text-accent-cyan" : "bg-white/5 text-slate-500"
                                            )}>
                                                <Check className="h-3 w-3" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-300 uppercase tracking-tight group-hover/item:text-white transition-colors">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={loadingPlan !== null}
                                    className={cn(
                                        "w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden",
                                        plan.highlight
                                            ? "bg-accent-cyan text-primary hover:bg-white shadow-[0_10px_20px_-10px_rgba(34,211,238,0.3)]"
                                            : "bg-white/5 text-white hover:bg-white hover:text-primary border border-white/5"
                                    )}
                                >
                                    {loadingPlan === plan.name ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="h-3 w-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                            <span>Initializing...</span>
                                        </div>
                                    ) : plan.cta}
                                </button>
                            </div>

                            {/* Tactical visual accents */}
                            <div className="absolute bottom-4 right-4 opacity-10">
                                {plan.highlight ? <Shield className="h-12 w-12 text-accent-cyan" /> : <Layers className="h-12 w-12 text-slate-500" />}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 text-center space-y-8">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                        Trusted by Institutional Decision Makers Worldwide
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale contrast-125">
                        <div className="h-4 w-24 bg-slate-500 rounded" />
                        <div className="h-4 w-32 bg-slate-500 rounded" />
                        <div className="h-4 w-20 bg-slate-500 rounded" />
                        <div className="h-4 w-28 bg-slate-500 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}
