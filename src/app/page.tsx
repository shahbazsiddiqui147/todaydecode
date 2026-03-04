import { getFeaturedArticles, getMapRegionData, getHomepageStats } from "@/lib/actions/public-actions";
import { getDashboardMetrics } from "@/lib/data-service";
import { LandingHero } from "@/components/marketing/landing-hero";
import { RiskGauge } from "@/components/metrics/risk-gauge";
import { GlobalRiskMap } from "@/components/maps/global-risk-map";
import { AnalysisCard } from "@/components/ui/analysis-card";
import { SiloSection } from "@/components/home/SiloSection";
import { ScenarioForecast } from "@/components/analysis/scenario-forecast";
import { ChevronRight, Globe, ShieldAlert, ShieldCheck, TrendingUp, Cpu, Zap, Activity, Layers } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  // 1. Concurrent fetching for maximum throughput
  const [fetchedRegionData, fetchedStats, categoriesWithArticles] = await Promise.all([
    getMapRegionData(),
    getHomepageStats(),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        articles: {
          where: { status: "PUBLISHED" as any },
          orderBy: { publishedAt: "desc" },
          take: 8,
        }
      }
    })
  ]);

  const metrics = await getDashboardMetrics();

  // Filter out categories with zero published articles
  const activeSilos = categoriesWithArticles.filter(cat => cat.articles.length > 0);

  return (
    <div className="flex flex-col w-full min-h-full bg-[#F8FAFC] dark:bg-[#0A0F1E] text-foreground">
      <LandingHero regionData={fetchedRegionData} />

      {/* Strategic Metrics Ribbon */}
      <div className="border-y border-[#1E293B] bg-secondary/80 backdrop-blur-md sticky top-[64px] z-20 w-full">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-cols md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-2">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Assessment Refresh: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()} // 04:00 UTC</span>
          </div>

          <div className="flex items-center space-x-12">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Global Risk Index</span>
              <span className="text-sm font-black text-foreground italic tracking-tighter">{metrics.risk.value < 0 ? '' : '+'}{metrics.risk.value}%</span>
            </div>
            <div className="flex flex-col border-l border-border pl-12">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Brent Crude Output</span>
              <span className="text-sm font-black text-foreground italic tracking-tighter">${metrics.oil.value}</span>
            </div>
            <div className="flex flex-col border-l border-border pl-12">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Reports Published</span>
              <span className="text-sm font-black text-foreground italic tracking-tighter">{fetchedStats.reportsCount || 0}</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/geopolitics/" className="p-2 rounded hover:bg-white/5 transition-colors group">
              <Globe className="h-4 w-4 text-muted-foreground group-hover:text-accent-red" />
            </Link>
            <Link href="/security/" className="p-2 rounded hover:bg-white/5 transition-colors group">
              <ShieldAlert className="h-4 w-4 text-muted-foreground group-hover:text-accent-red" />
            </Link>
            <Link href="/economy/" className="p-2 rounded hover:bg-white/5 transition-colors group">
              <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-accent-red" />
            </Link>
          </div>
        </div>
      </div>

      <main className="w-full flex flex-col items-center">
        <div className="max-w-7xl w-full px-6 py-12 space-y-32">
          {/* Core Metric & Action Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center gap-3 border-b border-[#1E293B] pb-6">
                <ShieldAlert className="h-5 w-5 text-accent-red" />
                <h2 className="text-sm font-black uppercase tracking-[0.25em] text-foreground italic">
                  Global Strategic Risk Index
                </h2>
              </div>
              <div className="p-8 rounded-3xl border border-[#1E293B] bg-card shadow-xl space-y-12 relative overflow-hidden group">
                <RiskGauge value={metrics.risk.value} label="AGGREGATE RISK RATING" />
                <div className="space-y-4 pt-8 border-t border-border/10">
                  <div className="flex items-start gap-4">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent-red mt-1.5 shrink-0" />
                    <p className="text-[11px] font-medium text-muted-foreground uppercase leading-relaxed tracking-tight">
                      Aggregated geopolitical volatility metrics indicate <span className="text-foreground font-bold">{metrics.risk.value > 60 ? 'elevated' : 'stable'} risk status</span> across core global sectors.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="p-8 rounded-3xl border border-[#1E293B] bg-accent-red shadow-2xl space-y-6 group cursor-pointer hover:bg-accent-red/90 transition-all">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Institutional Advisory</span>
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                  Private Strategic <br />Consultancy
                </h3>
                <button className="flex items-center text-[10px] font-black text-white uppercase tracking-[0.3em] gap-2 pt-2">
                  Request Briefing <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </section>

          {/* Strategic Silo Loop */}
          <div className="space-y-32">
            {activeSilos.map((silo) => (
              <SiloSection
                key={silo.id}
                title={silo.name}
                slug={silo.slug}
                articles={silo.articles}
              />
            ))}
          </div>

          {/* Institutional Blocks */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-slate-100 dark:bg-[#111827] p-12 rounded-[2.5rem] border border-[#1E293B] shadow-2xl relative overflow-hidden group">
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-2xl w-fit">
                  <Zap className="h-6 w-6 text-accent-red" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-[#F1F5F9] uppercase tracking-tighter leading-[0.9] italic">
                  Strategic <br />Scenario <br />Modeling
                </h2>
              </div>
              <p className="text-slate-600 dark:text-[#94A3B8] font-medium text-lg max-w-sm uppercase tracking-tight leading-relaxed">
                Access our proprietary quantitative forecasting engine. Predict institutional impact across multiple geopolitical timelines.
              </p>
            </div>
            <div className="lg:col-span-7 bg-white dark:bg-[#0A0F1E] rounded-3xl border border-[#1E293B] p-8 shadow-inner relative">
              <div className="grayscale group-hover:grayscale-0 transition-all duration-700">
                <ScenarioForecast
                  scenarios={{
                    best: { title: "Optimal Resolution", desc: "Stabilization through diplomatic protocols and economic incentives.", impact: 22 },
                    likely: { title: "Regulated Tension", desc: "Sustained competition within established international frameworks.", impact: 58 },
                    worst: { title: "Institutional Fracture", desc: "Complete breakdown of security architecture and supply chain decoupling.", impact: 92 }
                  }}
                  category="geopolitics"
                  slug="preview"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
