"use client";

import React from 'react';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface PaywallGateProps {
    children: React.ReactNode;
    isPremium?: boolean;
}

export function PaywallGate({ children, isPremium = false }: PaywallGateProps) {
    const { data: session, status } = useSession();

    if (!isPremium) return <>{children}</>;

    // If user is authenticated and is an analyst/admin, show content
    if (status === 'authenticated') {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            {/* Blurred Preview Content */}
            <div className="relative pointer-events-none select-none overflow-hidden h-[400px]">
                <div className="blur-xl opacity-30">
                    {children}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
            </div>

            {/* Paywall Overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-900/90 border border-border-slate rounded-2xl p-8 backdrop-blur-md shadow-2xl text-center space-y-6">
                    <div className="mx-auto w-12 h-12 bg-accent-red/10 rounded-xl flex items-center justify-center mb-4">
                        <Lock className="h-6 w-6 text-accent-red" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">
                            Institutional Access Required
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            This strategic analysis is reserved for premium analysts and institutional partners.
                            Upgrade your status to unlock full geopolitical intelligence.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <Link
                            href="/auth/signin/"
                            className="flex items-center justify-center space-x-2 w-full bg-accent-red hover:bg-red-600 text-white font-black uppercase text-xs py-4 rounded-xl transition-all shadow-lg shadow-accent-red/20 group"
                        >
                            <span>Unlock Professional Tier</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <div className="flex items-center justify-center space-x-4">
                            <div className="flex items-center space-x-1.5 grayscale opacity-50">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Bank-Grade Security</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-500 font-medium">
                        Already have professional access? <Link href="/auth/signin/" className="text-white hover:underline">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
