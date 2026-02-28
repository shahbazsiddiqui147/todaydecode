"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Bell } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface FollowDeskProps {
    type: 'category' | 'region' | 'article';
    id: string;
    label: string;
    className?: string;
}

export function FollowDesk({ type, id, label, className }: FollowDeskProps) {
    const { data: session } = useSession();
    const [isFollowing, setIsFollowing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleFollow = () => {
        if (!session) {
            // In a real app, redirect to sign-in or show modal
            alert("Please sign in to follow this intelligence desk.");
            return;
        }
        setIsFollowing(!isFollowing);
    };

    return (
        <div className={cn("relative group", className)}>
            <motion.button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleFollow}
                className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                    isFollowing
                        ? "bg-accent-red/20 border-accent-red text-white shadow-[0_0_15px_rgba(255,75,75,0.3)]"
                        : "bg-slate-900 border-border-slate text-slate-400 hover:border-slate-500 hover:text-white"
                )}
            >
                {isFollowing ? (
                    <>
                        <Check className="h-3 w-3" />
                        <span>Following Desk</span>
                    </>
                ) : (
                    <>
                        <Plus className="h-3 w-3" />
                        <span>Follow {label} Desk</span>
                    </>
                )}
            </motion.button>

            {/* Glow Effect in Dark Mode */}
            {isFollowing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 0.6 : 0.3 }}
                    className="absolute -inset-1 bg-accent-red/20 blur-lg rounded-xl z-[-1]"
                />
            )}

            {isFollowing && (
                <div className="absolute -top-1 -right-1">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-red opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-red"></span>
                    </span>
                </div>
            )}
        </div>
    );
}
