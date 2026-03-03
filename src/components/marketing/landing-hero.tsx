import { ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GlobalRiskMap } from "@/components/maps/global-risk-map";

interface LandingHeroProps {
    regionData?: Record<string, number>;
}

export function LandingHero({ regionData = {} }: LandingHeroProps) {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-background">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.08)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center justify-center space-y-16 w-full min-h-[80vh] py-20 text-center">
                {/* Top Section: Heading */}
                <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-top-8 duration-1000 z-20 max-w-4xl">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground uppercase tracking-tighter leading-tight italic">
                            Tomorrow's Risks Decoded Today
                        </h1>
                        <p className="text-foreground text-lg md:text-xl font-black uppercase tracking-[0.3em] leading-relaxed opacity-80">
                            Global Strategic Assessment
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                        <Link
                            href="/categories/"
                            className="group relative flex items-center space-x-3 px-8 py-4 bg-foreground text-background rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl"
                        >
                            <span className="relative z-10 text-xs font-black uppercase tracking-widest">Join the Archive</span>
                            <ChevronRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>

                        <Link
                            href="/admin/"
                            className="px-8 py-4 border border-border bg-background/40 backdrop-blur-md text-foreground rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-secondary transition-all active:scale-95 shadow-xl"
                        >
                            Personnel Entry
                        </Link>
                    </div>
                </div>

                {/* Bottom Section: Huge Map */}
                <div className="relative w-full aspect-video animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 xl:pointer-events-auto">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[120%] md:w-[100%] lg:w-[120%] h-full opacity-60 xl:opacity-100">
                            <GlobalRiskMap regionData={regionData} isBackdrop />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
