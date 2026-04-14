"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ContributorCTA() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                <Link href="/contributors/submit/">
                    <Button className="h-16 px-12 bg-accent-red text-white hover:bg-accent-red/90 rounded-2xl font-black uppercase tracking-widest italic text-sm shadow-xl active:scale-95 transition-all">
                        Submit an Article
                    </Button>
                </Link>
                <Link href="/submission-guidelines/">
                    <Button variant="outline" className="h-16 px-12 border-border hover:bg-secondary rounded-2xl font-black uppercase tracking-widest italic text-sm shadow-xl active:scale-95 transition-all">
                        Read Guidelines
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
            <Link href="/auth/signup/">
                <Button className="h-16 px-12 bg-accent-red text-white hover:bg-accent-red/90 rounded-2xl font-black uppercase tracking-widest italic text-sm shadow-xl active:scale-95 transition-all">
                    Create Account
                </Button>
            </Link>
            <Link href="/submission-guidelines/">
                <Button variant="outline" className="h-16 px-12 border-border hover:bg-secondary rounded-2xl font-black uppercase tracking-widest italic text-sm shadow-xl active:scale-95 transition-all">
                    Read Guidelines
                </Button>
            </Link>
        </div>
    );
}
