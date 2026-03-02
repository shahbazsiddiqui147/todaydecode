"use client";

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Layers, CheckCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFollowSilo, isFollowingSilo } from "@/lib/actions/user-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/components/providers/analytics-provider";

interface FollowSiloButtonProps {
    categoryId: string;
    categoryName: string;
}

export function FollowSiloButton({ categoryId, categoryName }: FollowSiloButtonProps) {
    const { data: session } = useSession();
    const { trackEvent } = useAnalytics();
    const [isPending, startTransition] = useTransition();
    const [following, setFollowing] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (session?.user) {
            checkStatus();
        } else {
            setChecking(false);
        }
    }, [session, categoryId]);

    const checkStatus = async () => {
        const status = await isFollowingSilo(categoryId);
        setFollowing(status);
        setChecking(false);
    };

    const handleToggle = () => {
        if (!session) {
            toast.error("Institutional access required to follow desks.");
            return;
        }

        startTransition(async () => {
            const res = await toggleFollowSilo(categoryId);
            if (res.error) {
                toast.error(res.error);
            } else {
                const isFollowed = res.action === "followed";
                setFollowing(isFollowed);

                trackEvent('silo_follow_toggle', {
                    category: categoryName,
                    action: res.action,
                    category_id: categoryId
                });

                toast.success(
                    isFollowed
                        ? `${categoryName} added to your Strategic Oversight.`
                        : `${categoryName} removed from Oversight.`
                );
            }
        });
    };

    if (checking) return <div className="h-10 w-32 bg-slate-900 animate-pulse rounded-xl" />;

    return (
        <Button
            onClick={handleToggle}
            disabled={isPending}
            variant={following ? "outline" : "default"}
            className={cn(
                "h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                following
                    ? "border-accent-green/30 bg-accent-green/5 text-accent-green hover:bg-accent-green/10"
                    : "bg-white text-[#0A0F1E] hover:bg-slate-200"
            )}
        >
            {isPending ? (
                "Syncing..."
            ) : following ? (
                <span className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5" /> Following Desk
                </span>
            ) : (
                <span className="flex items-center gap-2">
                    <PlusCircle className="h-3.5 w-3.5" /> Follow Desk
                </span>
            )}
        </Button>
    );
}
