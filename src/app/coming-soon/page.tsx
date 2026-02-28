"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Bell, Globe, Lock } from 'lucide-react';
import Image from 'next/image';

export default function ComingSoonPage() {
    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center p-6">
            {/* Background Grid & Ambient Glow */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-red/10 blur-[120px] rounded-full" />

            <div className="relative z-10 max-w-4xl w-full text-center space-y-12">
                {/* Brand Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center space-y-4"
                >
                    <div className="flex items-center space-x-3 text-accent-red">
                        <ShieldAlert className="h-10 w-10 animate-pulse" />
                        <span className="text-2xl font-black uppercase tracking-[0.3em]">Today Decode</span>
                    </div>
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-accent-red to-transparent" />
                </motion.div>

                {/* Main Heading */}
                <div className="space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none"
                    >
                        Intelligence Hub <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
                            Under Protocol
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto uppercase tracking-widest"
                    >
                        We are currently stabilizing global risk nodes and upgrading institutional access layers.
                    </motion.p>
                </div>

                {/* Status Dashboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
                >
                    {[
                        { label: "Core Infrastructure", status: "STABLE", icon: Lock, color: "text-accent-green" },
                        { label: "Predictive Engines", status: "CALIBRATING", icon: Globe, color: "text-yellow-500" },
                        { label: "Auth Protocols", status: "DEPLOYING", icon: Bell, color: "text-accent-red" },
                    ].map((item, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col items-center space-y-3">
                            <item.icon className={item.color} size={24} />
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</div>
                            <div className={`text-xs font-black uppercase tracking-wider ${item.color}`}>{item.status}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Action Area */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col items-center space-y-8"
                >
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
                        <input
                            type="email"
                            placeholder="Institutional Email"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:outline-none focus:border-accent-red transition-colors font-mono"
                        />
                        <button className="w-full sm:w-auto bg-white text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-accent-red hover:text-white transition-all whitespace-nowrap">
                            Notify on Launch
                        </button>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-red animate-pulse" />
                        <span>Expected Go-Live: March 2026</span>
                    </div>
                </motion.div>
            </div>

            {/* Floating Elements for Premium Feel */}
            <div className="absolute bottom-10 left-10 hidden lg:block opacity-20">
                <div className="text-[10px] font-mono space-y-1">
                    <div>LAT: 38.8951° N</div>
                    <div>LON: 77.0364° W</div>
                    <div>SIG: ENCRYPTED</div>
                </div>
            </div>

            <div className="absolute top-10 right-10 hidden lg:block opacity-20">
                <Image src="/logo.png" alt="Today Decode" width={40} height={40} className="grayscale" />
            </div>
        </div>
    );
}
