import { AnalysisCard } from "@/components/ui/analysis-card";
import { Globe, TrendingUp, ShieldAlert, Zap } from "lucide-react";
import { GlobalRiskMap } from "@/components/maps/global-risk-map";

const FEATURED_ARTICLES = [
  {
    title: "The Barents Gap: NATO's Silent Conflict in the High North",
    category: "Security",
    slug: "barents-gap-nato-silent-conflict",
    image: "/images/intel-1.jpg",
    riskLevel: "HIGH" as const,
    riskScore: 82,
  },
  {
    title: "Post-Petrodollar: The UAE's Pivot to AI and Quantum Supremacy",
    category: "Technology",
    slug: "post-petrodollar-uae-pivot-ai",
    image: "/images/intel-2.jpg",
    riskLevel: "MEDIUM" as const,
    riskScore: 45,
  },
  {
    title: "Strait of Hormuz: Energy Security and the 2026 Transit Forecast",
    category: "Energy",
    slug: "strait-of-hormuz-energy-security",
    image: "/images/intel-3.jpg",
    riskLevel: "CRITICAL" as const,
    riskScore: 94,
  },
  {
    title: "Global Supply Chains: The decoupling of APAC and Western Markets",
    category: "Economy",
    slug: "global-supply-chains-apac-decoupling",
    image: "/images/intel-4.jpg",
    riskLevel: "LOW" as const,
    riskScore: 28,
  },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Global Intelligence Briefing
            </h1>
            <p className="text-slate-500 text-sm max-w-2xl">
              Real-time strategic analysis of geopolitical risks and global shifts.
              Refreshed every 12 hours for strategic decision-making.
            </p>
          </div>
          <div className="hidden lg:flex items-center space-x-2 text-[10px] font-bold tracking-widest text-accent-red uppercase">
            <span className="h-2 w-2 rounded-full bg-accent-red animate-pulse" />
            <span>LIVE DATA: SECURE CONNECTION ESTABLISHED</span>
          </div>
        </div>
      </section>

      <div className="w-full">
        <GlobalRiskMap />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURED_ARTICLES.map((article) => (
          <AnalysisCard key={article.slug} {...article} />
        ))}
      </div>

      <section className="bg-primary/5 dark:bg-primary/40 border border-border-slate rounded-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="flex justify-center">
              <ShieldAlert className="h-8 w-8 text-accent-red" />
            </div>
            <div className="text-2xl font-bold">12 Active Hotspots</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Global Security Index</div>
          </div>
          <div className="space-y-2 border-x border-border-slate">
            <div className="flex justify-center">
              <TrendingUp className="h-8 w-8 text-accent-green" />
            </div>
            <div className="text-2xl font-bold">+4.2% Growth</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">MENA Economic Forecast</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center">
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold">Resilient</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Energy Grid Integrity</div>
          </div>
        </div>
      </section>
    </div>
  );
}
