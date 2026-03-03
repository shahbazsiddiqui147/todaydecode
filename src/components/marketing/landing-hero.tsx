import { ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GlobalRiskMap } from "@/components/maps/global-risk-map";

interface LandingHeroProps {
    regionData?: Record<string, number>;
}

export function LandingHero({ regionData = {} }: LandingHeroProps) {
    return (
        <section className="relative min-h-[70vh] flex flex-col items-center justify-center pt-16 pb-10 overflow-hidden bg-background">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(220,38,38,0.08)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="relative z-10 w-full flex flex-col items-center justify-center space-y-12 text-center">
                {/* Top Section: Heading */}
                <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-top-8 duration-1000 z-20 w-full px-4">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-foreground uppercase tracking-[0.05em] leading-none italic whitespace-nowrap">
                            Tomorrow's Risks Decoded Today.
                        </h1>
                        <p className="text-foreground text-lg md:text-2xl font-black uppercase tracking-[0.4em] leading-relaxed opacity-70">
                            Global Strategic Assessment
                        </p>
                    </div>
                </div>

                {/* Bottom Section: Huge Map */}
                <div className="relative w-full aspect-video animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 xl:pointer-events-auto overflow-visible">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[100%] lg:w-[130%] h-full opacity-60 xl:opacity-100 scale-110 lg:scale-125">
                            <GlobalRiskMap regionData={regionData} isBackdrop />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
