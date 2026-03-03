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

            <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-2 gap-16 items-center w-full min-h-[60vh]">
                {/* Left Column: Text */}
                <div className="flex flex-col space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000 z-20">
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-6xl font-black text-foreground uppercase tracking-tighter leading-[0.85] italic">
                            Tomorrow's Risks <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-accent-red">Decoded Today</span>
                        </h1>
                        <p className="text-foreground text-lg md:text-xl font-black uppercase tracking-widest leading-relaxed">
                            Global Strategic Assessment
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start gap-6 pt-4">
                        <Link href="/auth/signup/">
                            <Button size="lg" className="h-14 px-10 text-sm font-black uppercase tracking-widest bg-foreground text-background hover:bg-muted-foreground rounded-2xl shadow-2xl cursor-pointer">
                                Join The Archive <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/strategic-archive/">
                            <Button size="lg" variant="outline" className="h-14 px-10 text-sm font-black uppercase tracking-widest border-border bg-background/50 backdrop-blur-sm hover:bg-secondary rounded-2xl cursor-pointer">
                                Personnel Entry
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Right Column: Huge Map */}
                <div className="relative w-full aspect-square md:aspect-video xl:aspect-square animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 xl:pointer-events-auto">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[140%] h-[140%] xl:w-[180%] xl:h-[180%] xl:-mr-60 opacity-40 xl:opacity-100">
                            <GlobalRiskMap regionData={regionData} isBackdrop />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
