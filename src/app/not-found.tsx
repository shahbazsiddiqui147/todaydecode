import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Page Not Found",
    description: "This address is not a published analysis, topic, or institutional page.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {
    return (
        <div className="min-h-[70vh] bg-background text-foreground flex items-center">
            <div className="max-w-3xl mx-auto px-6 py-24 space-y-8">
                <div className="h-1 w-20 bg-accent-red" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-red">404</p>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.9]">
                    Page not found
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl">
                    This address is not a published analysis, topic, or institutional page.
                </p>
                <Link
                    href="/"
                    className="inline-flex text-[10px] font-black uppercase tracking-[0.3em] text-foreground border border-border px-6 py-4 hover:border-accent-red hover:text-accent-red transition-colors"
                >
                    Return home
                </Link>
            </div>
        </div>
    );
}
