

import Link from "next/link";
import { getAdminPages } from "@/lib/actions/admin-actions";
import { fetchSiteSettings } from "@/lib/fetchers";
import { prisma } from "@/lib/prisma";
import {
    Shield,
    Globe,
    Lock,
    ChevronRight,
    Twitter,
    Linkedin,
    Facebook,
    Instagram,
    PlusSquare as Pinterest
} from "lucide-react";

export async function Footer() {
    let pages: any[] = [];
    let settings: any = null;
    let categories: any[] = [];
    try {
        [pages, settings, categories] = await Promise.all([
            getAdminPages(),
            fetchSiteSettings(),
            prisma.category.findMany({
                where: { isVisible: true, parentId: null },
                select: { name: true, slug: true },
                orderBy: { order: 'asc' },
                take: 8
            })
        ]);
    } catch (error) {
        console.error("Institutional Footer Sync Failed:", error);
    }

    const socialLinks = settings?.socialLinks || {};
    const hasActiveLinks = Object.values(socialLinks).some((l: any) => l.url && l.enabled);

    return (
        <footer className="w-full bg-background border-t border-border pt-20 pb-10 px-6 mt-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-12 sm:gap-8 border-b border-border pb-16">
                {/* Brand Identity */}
                <div className="md:col-span-1 space-y-6">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-foreground uppercase italic dark:text-white">
                        Today Decode
                    </Link>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight leading-relaxed max-w-xs">
                        An independent think tank providing in-depth analysis and research on global affairs, policy, and geopolitical risk.
                    </p>
                    <div className="flex items-center gap-3">
                        {hasActiveLinks ? (
                            Object.entries(socialLinks).map(([id, link]: [string, any]) => {
                                if (!link.url || !link.enabled) return null;
                                let Icon = Globe;
                                if (id === 'x') Icon = Twitter;
                                if (id === 'linkedin') Icon = Linkedin;
                                if (id === 'facebook') Icon = Facebook;
                                if (id === 'instagram') Icon = Instagram;
                                if (id === 'pinterest') Icon = Pinterest;

                                return (
                                    <a
                                        key={id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-8 w-8 rounded-lg bg-secondary border border-border flex items-center justify-center hover:border-accent-red hover:bg-accent-red/5 transition-all group"
                                        title={`${id.toUpperCase()} Terminal`}
                                    >
                                        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-accent-red" />
                                    </a>
                                );
                            })
                        ) : (
                            <>
                                <div className="h-8 w-8 rounded-lg bg-secondary border border-border flex items-center justify-center">
                                    <Shield className="h-4 w-4 text-accent-red" />
                                </div>
                                <div className="h-8 w-8 rounded-lg bg-secondary border border-border flex items-center justify-center">
                                    <Globe className="h-4 w-4 text-accent-green" />
                                </div>
                                <div className="h-8 w-8 rounded-lg bg-secondary border border-border flex items-center justify-center">
                                    <Lock className="h-4 w-4 text-yellow-500" />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Institutional Framework */}
                <div className="md:col-span-1 space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground dark:text-white italic">About</h4>
                    <nav className="flex flex-col gap-3">
                        {pages.map((page) => (
                            <Link
                                key={page.id}
                                href={`/${page.slug.replace(/^\/|\/$/g, '')}/`}
                                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors flex items-center gap-2 group"
                            >
                                <ChevronRight className="h-3 w-3 text-accent-red opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                {page.title}
                            </Link>
                        ))}
                        {pages.length === 0 && (
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter italic">Coming soon</span>
                        )}
                    </nav>
                </div>

                {/* Topics — dynamic from DB */}
                <div className="md:col-span-1 space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground dark:text-white italic">Topics</h4>
                    <nav className="flex flex-col gap-3">
                        {categories.length > 0 ? categories.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/${cat.slug.replace(/^\/|\/$/g, '')}/`}
                                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors flex items-center gap-2 group"
                            >
                                <ChevronRight className="h-3 w-3 text-accent-red opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                {cat.name}
                            </Link>
                        )) : (
                            <>
                                <Link href="/geopolitics/" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Geopolitics</Link>
                                <Link href="/global-economy/" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Global Economy</Link>
                                <Link href="/security-defense/" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Security & Defense</Link>
                                <Link href="/conflict-crisis/" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">Conflict & Crisis</Link>
                            </>
                        )}
                    </nav>
                </div>

                {/* Contribute */}
                <div className="md:col-span-1 space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground dark:text-white italic">Contribute</h4>
                    <nav className="flex flex-col gap-3">
                        <Link href="/contributors/submit/" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors flex items-center gap-2 group">
                            <ChevronRight className="h-3 w-3 text-accent-red opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                            Become a Contributor
                        </Link>
                        <Link href="/about/" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors flex items-center gap-2 group">
                            <ChevronRight className="h-3 w-3 text-accent-red opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                            About Us
                        </Link>
                        <Link href="/contact/" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors flex items-center gap-2 group">
                            <ChevronRight className="h-3 w-3 text-accent-red opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                            Contact Us
                        </Link>
                        <Link href="/pricing/" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors flex items-center gap-2 group">
                            <ChevronRight className="h-3 w-3 text-accent-red opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                            Membership
                        </Link>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.1em]">
                    © {new Date().getFullYear()} TODAY DECODE. ALL RIGHTS RESERVED.
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-tighter">v2.3.0</span>
                </div>
            </div>
        </footer>
    );
}
