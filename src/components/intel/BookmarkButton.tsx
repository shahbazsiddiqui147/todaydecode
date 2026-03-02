"use client";

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toggleBookmarkArticle, isBookmarkedArticle } from "@/lib/actions/user-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
    articleId: string;
    className?: string;
}

export function BookmarkButton({ articleId, className }: BookmarkButtonProps) {
    const { data: session } = useSession();
    const [isPending, startTransition] = useTransition();
    const [bookmarked, setBookmarked] = useState(false);

    useEffect(() => {
        if (session?.user) {
            isBookmarkedArticle(articleId).then(setBookmarked);
        }
    }, [session, articleId]);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            toast.error("Institutional access required to save reports.");
            return;
        }

        startTransition(async () => {
            const res = await toggleBookmarkArticle(articleId);
            if (res.error) {
                toast.error(res.error);
            } else {
                setBookmarked(res.action === "bookmarked");
                toast.success(
                    res.action === "bookmarked"
                        ? "Analysis saved to your Strategic Manifest."
                        : "Analysis removed from Manifest."
                );
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={cn(
                "p-2 rounded-lg transition-all",
                bookmarked
                    ? "bg-accent-red/10 text-accent-red border border-accent-red/20 shadow-lg shadow-accent-red/5"
                    : "bg-slate-900 text-slate-500 hover:text-white border border-slate-800",
                className
            )}
            title={bookmarked ? "Remove from Manifest" : "Save to Manifest"}
        >
            {bookmarked ? (
                <BookmarkCheck className={cn("h-4 w-4", isPending && "animate-pulse")} />
            ) : (
                <Bookmark className={cn("h-4 w-4", isPending && "animate-pulse")} />
            )}
        </button>
    );
}
