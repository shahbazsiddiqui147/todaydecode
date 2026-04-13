"use client";

import { useState } from "react";
import { Check, Shield, Zap, Layers, Globe, Clock, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAnalytics } from "@/components/providers/analytics-provider";

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
        name: "Editorial Oversight",
        price: "$499",
        period: "per month",
        description: "Full strategic access for decision makers and institutions.",
        features: [
            "Full Access to Premium Reports",
            "Real-time Assessment Insight (Risk > 80)",
            "Deep-dive Scenario Forecasts",
            "Priority Analyst Queries",
            "Advanced Historical Vault Access",
            "Direct PDF Export for Briefings",
        ],
        cta: "Join Waitlist",
        href: "/about/",
        highlight: true,
    }
];

export default function PricingPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { trackEvent } = useAnalytics();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const handleSubscribe = async (plan: typeof plans[0]) => {
        if (plan.name === "Public Analysis") {
            trackEvent('public_tier_select');
            router.push(plan.href);
            return;
        }

        trackEvent('waitlist_initiate', { plan: plan.name, source: 'pricing_page' });
        router.push("/about/");
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
                        Institutional <br /> <span className="text-accent-cyan">Strategic Tiers</span>
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
                                "relative p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden group",
                                plan.highlight
                                    ? "bg-foreground dark:bg-slate-900 border-accent-cyan/30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_-12px_rgba(34,211,238,0.2)]"
                                    : "bg-secondary dark:bg-secondary/50 border-border dark:border-white/5 hover:border-accent-cyan/20"
                            )}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/10 blur-[100px] pointer-events-none" />
                            )}

                            <div className="space-y-8 relative z-10">
                                <div className="space-y-4">
                                    <h3 className={cn(
                                        "text-3xl font-black uppercase tracking-tight italic",
                                        plan.highlight ? "text-white" : "text-foreground"
                                    )}>
                                        {plan.name}
                                    </h3>
                                    <p className={cn(
                                        "text-sm font-medium leading-relaxed",
                                        plan.highlight ? "text-slate-300" : "text-muted-foreground"
                                    )}>
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="flex items-baseline space-x-2">
                                    <span className={cn(
                                        "text-6xl font-black tracking-tighter",
                                        plan.highlight ? "text-white" : "text-foreground"
                                    )}>{plan.price}</span>
                                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{plan.period}</span>
                                </div>

                                <ul className="space-y-4 pt-10 border-t border-white/10 dark:border-white/5">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center space-x-3 group/item">
                                            <div className={cn(
                                                "p-1 rounded-full",
                                                plan.highlight ? "bg-accent-cyan/20 text-accent-cyan" : "bg-slate-200 dark:bg-white/5 text-slate-500"
                                            )}>
                                                <Check className="h-3 w-3" />
                                            </div>
                                            <span className={cn(
                                                "text-xs font-bold uppercase tracking-tight",
                                                plan.highlight ? "text-slate-200 group-hover/item:text-white" : "text-muted-foreground group-hover/item:text-foreground"
                                            )}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={loadingPlan !== null}
                                    className={cn(
                                        "w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden active:scale-95",
                                        plan.highlight
                                            ? "bg-accent-cyan text-primary hover:bg-white shadow-xl shadow-accent-cyan/20"
                                            : "bg-slate-100 dark:bg-white/5 text-foreground dark:text-white hover:bg-foreground hover:text-white dark:hover:bg-white dark:hover:text-primary"
                                    )}
                                >
                                    {loadingPlan === plan.name ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="h-3 w-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                            <span>INITIALIZING UPLINK...</span>
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
