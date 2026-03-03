import { ShieldCheck, Globe, Zap, Cpu, ChevronRight } from "lucide-react";
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

            {/* Immersive Map Backdrop */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 dark:opacity-30 fade-in duration-1000 mt-20">
                <div className="w-[200%] md:w-[150%] lg:w-[120%] scale-150 lg:scale-125 xl:scale-110">
                    <GlobalRiskMap regionData={regionData} isBackdrop />
                </div>
            </div>

            {/* Background gradient overlays to blend map edges and increase text readability */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/80 via-transparent to-background" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center flex flex-col items-center space-y-10 mt-10 pointer-events-none">
                <div className="pointer-events-auto flex items-center space-x-3 w-fit px-4 py-2 rounded-full border border-border bg-card/60 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-top-4 duration-1000">
                    <ShieldCheck className="h-4 w-4 text-accent-red" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">
                        Institutional Strategic Advisory <span className="text-muted-foreground italic">v4.0 Operational</span>
                    </span>
                </div>

                <div className="space-y-6 max-w-5xl pointer-events-auto">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-foreground uppercase tracking-tighter leading-[0.85] italic animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                        Tomorrow's Risks <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-accent-red">Decoded Today</span>
                    </h1>
                    <p className="text-foreground text-xl md:text-2xl font-black uppercase tracking-widest leading-relaxed drop-shadow-md animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                        GLOBAL STRATEGIC ASSESSMENT // INSTITUTIONAL RISK ARCHIVE
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in scale-in-95 duration-1000 delay-500 pointer-events-auto">
                    <Link href="/auth/signup/">
                        <Button size="lg" className="h-14 px-10 text-sm font-black uppercase tracking-widest bg-foreground text-background hover:bg-muted-foreground rounded-2xl shadow-2xl">
                            Join The Archive
                        </Button>
                    </Link>
                    <Link href="/geopolitics/">
                        <Button size="lg" variant="outline" className="h-14 px-10 text-sm font-black uppercase tracking-widest border-border bg-background/50 backdrop-blur-sm hover:bg-secondary rounded-2xl">
                            Personnel Entry
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Global Risk Index Summary */}
            <div className="absolute bottom-10 right-10 z-20 bg-accent-red p-6 rounded-3xl border-4 border-background shadow-2xl animate-in slide-in-from-right-10 duration-1000 delay-700 hidden xl:flex flex-col items-center">
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Global Risk Index</span>
                <span className="text-4xl font-black text-white italic tracking-tighter tabular-nums">+72.4</span>
            </div>
        </section>
    );
}
