"use client";

import React from 'react';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAnalytics } from '@/components/providers/analytics-provider';
import { useEffect } from 'react';

interface PaywallGateProps {
    children: React.ReactNode;
    isPremium?: boolean;
}

export function PaywallGate({ children, isPremium = false }: PaywallGateProps) {
    const { data: session, status } = useSession();
    const { trackEvent } = useAnalytics();

    // Hardened Role Logic: Clear elevated tiers for premium research
    const userRole = (session?.user as any)?.role;
    const hasAccess = status === 'authenticated' && ['AUTHOR', 'EDITOR', 'ADMIN'].includes(userRole);

    useEffect(() => {
        if (isPremium && !hasAccess) {
            trackEvent('paywall_view', {
                is_authenticated: status === 'authenticated'
            });
        }
    }, [isPremium, hasAccess]);

    if (hasAccess) {
        return <>{children}</>;
    }

    return (
        <div className="relative group/paywall">
            {/* Blurred Preview Content */}
            <div className="relative pointer-events-none select-none overflow-hidden h-[500px]">
                <div className="blur-2xl opacity-20 grayscale">
                    {children}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/95 to-transparent" />

                {/* Institutional grid overlay over blur */}
                <div className="absolute inset-0 bg-[url('/grid-light.svg')] opacity-5" />
            </div>

            {/* Paywall Overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-12 -mt-20">
                <div className="max-w-xl w-full mx-4 sm:mx-auto bg-secondary/80 border border-white/10 rounded-[2.5rem] p-8 sm:p-12 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] text-center space-y-8 relative overflow-hidden">
                    {/* Urgency background element */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-red/10 blur-[60px] rounded-full" />

                    <div className="mx-auto w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10 relative">
                        <Lock className="h-7 w-7 text-accent-red" />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                            Institutional Access Required
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed font-medium max-w-sm mx-auto">
                            This strategic analysis is reserved for authorized advisors and institutional partners.
                            Upgrade to <span className="text-white font-bold italic">STRATEGIC ANALYST TIER</span> to unlock full geopolitical insights.
                        </p>
                    </div>

                    <div className="space-y-5 pt-4">
                        <Link
                            href="/about/"
                            onClick={() => trackEvent('waitlist_initiate', { source: 'paywall' })}
                            className="flex items-center justify-center space-x-3 w-full bg-accent-red hover:bg-red-600 text-white font-black uppercase text-xs py-5 rounded-2xl transition-all shadow-2xl shadow-accent-red/30 group/btn"
                        >
                            <span className="tracking-[0.2em]">Request Institutional Access</span>
                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>

                        <div className="flex items-center justify-center space-x-6 text-slate-500">
                            <div className="flex items-center space-x-2">
                                <ShieldCheck className="h-3.5 w-3.5 opacity-50 text-accent-cyan" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent-cyan animate-pulse">Subscriptions Opening Soon</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pt-4 border-t border-white/5">
                        Existing Credential? <Link href="/auth/signin/" className="text-white hover:text-accent-red transition-colors underline decoration-accent-red/50 underline-offset-4">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
