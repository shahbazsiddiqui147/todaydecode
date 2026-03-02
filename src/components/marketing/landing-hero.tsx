import { ShieldCheck, Globe, Zap, Cpu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GlobalRiskMap } from "@/components/maps/global-risk-map";

interface LandingHeroProps {
    regionData?: Record<string, number>;
}

export function LandingHero({ regionData = {} }: LandingHeroProps) {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-background">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.08)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    {/* Left: Headline & CTAs */}
                    <div className="lg:col-span-7 flex flex-col space-y-10">
                        <div className="flex items-center space-x-3 w-fit px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
                            <ShieldCheck className="h-4 w-4 text-accent-red" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                Institutional Intelligence <span className="text-foreground italic">v4.0 Operational</span>
                            </span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-8xl font-black text-foreground uppercase tracking-tighter leading-[0.85] italic animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                                Tomorrow's Risks <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-accent-red">Decoded Today</span>
                            </h1>
                            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl uppercase tracking-tight leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                                The sovereign intelligence platform for geopolitical analysts, tactical responders, and global policy makers. High-fidelity foresight in a fragmented world.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 animate-in fade-in scale-in-95 duration-1000 delay-500">
                            <Link href="/auth/signup/">
                                <Button size="lg" className="h-14 px-10 text-sm font-black uppercase tracking-widest bg-foreground text-background hover:bg-muted-foreground rounded-2xl shadow-2xl">
                                    Join The Archive
                                </Button>
                            </Link>
                            <Link href="/geopolitics/">
                                <Button size="lg" variant="outline" className="h-14 px-10 text-sm font-black uppercase tracking-widest border-border hover:bg-secondary rounded-2xl">
                                    Personnel Entry
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Tactical Map integration */}
                    <div className="lg:col-span-5 relative group">
                        <div className="absolute -inset-4 bg-accent-red/5 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative rounded-3xl border border-border bg-card/30 backdrop-blur-sm overflow-hidden p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-1000 delay-400">
                            <GlobalRiskMap regionData={regionData} />
                        </div>

                        {/* Summary indicator */}
                        <div className="absolute -bottom-6 -right-6 bg-accent-red p-6 rounded-3xl border-4 border-background shadow-2xl animate-in slide-in-from-right-10 duration-1000 delay-700 hidden xl:block">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Global Risk Index</span>
                                <span className="text-4xl font-black text-white italic tracking-tighter tabular-nums">+72.4</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
