import { getFeaturedArticles, getMapRegionData, getHomepageStats } from "@/lib/actions/public-actions";
import { getDashboardMetrics } from "@/lib/data-service";
import { LandingHero } from "@/components/marketing/landing-hero";
import { RiskGauge } from "@/components/metrics/risk-gauge";
import { GlobalRiskMap } from "@/components/maps/global-risk-map";
import { AnalysisCard } from "@/components/ui/analysis-card";
import { ScenarioForecast } from "@/components/analysis/scenario-forecast";
import { ChevronRight, Globe, ShieldAlert, TrendingUp, Cpu, Zap, Activity, Layers } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page() {
  // 1. Concurrent fetching for maximum throughput
  const [fetchedArticles, fetchedRegionData, fetchedStats] = await Promise.all([
    getFeaturedArticles(4),
    getMapRegionData(),
    getHomepageStats()
  ]);

  const metrics = await getDashboardMetrics();

  return (
    <div className="flex flex-col w-full bg-[#0A0F1E] text-[#F1F5F9] overflow-x-hidden">
      <LandingHero />

      {/* Strategic Metrics Ribbon */}
      <div className="border-y border-[#1E293B] bg-[#0F172A]/80 backdrop-blur-md sticky top-[64px] z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-8">
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="h-2 w-2 rounded-full bg-accent-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-red">System Synchronized</span>
          </div>

          <div className="flex items-center space-x-12">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest">Global Risk Index</span>
              <span className="text-sm font-black text-white italic tracking-tighter">{metrics.risk.value < 0 ? '' : '+'}{metrics.risk.value}%</span>
            </div>
            <div className="flex flex-col border-l border-[#1E293B] pl-12">
              <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest">Brent Crude Output</span>
              <span className="text-sm font-black text-white italic tracking-tighter">${metrics.oil.value}</span>
            </div>
            <div className="flex flex-col border-l border-[#1E293B] pl-12">
              <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest">Reports Synthesized</span>
              <span className="text-sm font-black text-white italic tracking-tighter">{fetchedStats.reportsCount || 0}</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/geopolitics/" className="p-2 rounded hover:bg-white/5 transition-colors group">
              <Globe className="h-4 w-4 text-[#94A3B8] group-hover:text-accent-red" />
            </Link>
            <Link href="/security/" className="p-2 rounded hover:bg-white/5 transition-colors group">
              <ShieldAlert className="h-4 w-4 text-[#94A3B8] group-hover:text-accent-red" />
            </Link>
            <Link href="/economy/" className="p-2 rounded hover:bg-white/5 transition-colors group">
              <TrendingUp className="h-4 w-4 text-[#94A3B8] group-hover:text-accent-red" />
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 w-full space-y-24">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-6">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-accent-red" />
                <h2 className="text-sm font-black uppercase tracking-[0.25em] text-[#F1F5F9] italic">
                  Global Hotspot Visualization
                </h2>
              </div>
            </div>
            <div className="rounded-3xl border border-[#1E293B] bg-[#111827] overflow-hidden p-2 shadow-2xl relative group">
              <GlobalRiskMap regionData={fetchedRegionData} />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3 border-b border-[#1E293B] pb-6">
              <ShieldAlert className="h-5 w-5 text-accent-red" />
              <h2 className="text-sm font-black uppercase tracking-[0.25em] text-[#F1F5F9] italic">
                Unified Risk Metric
              </h2>
            </div>
            <div className="p-8 rounded-3xl border border-[#1E293B] bg-[#111827] shadow-xl space-y-12 relative overflow-hidden group">
              <RiskGauge value={metrics.risk.value} label="CURRENT GLOBAL RISK" />
              <div className="space-y-4 pt-8 border-t border-white/5">
                <div className="flex items-start gap-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent-red mt-1.5 shrink-0" />
                  <p className="text-[11px] font-medium text-[#94A3B8] uppercase leading-relaxed tracking-tight">
                    Detecting elevated activity across <span className="text-white font-bold">{fetchedStats.hotspots || 0} critical hotspots</span>. High-impact geopolitical shifts are currently being synthesized.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl border border-[#1E293B] bg-accent-red shadow-2xl space-y-6 group cursor-pointer hover:bg-accent-red/90 transition-all">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Cpu className="h-5 w-5 text-white" />
                </div>
                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Institutional</span>
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                Request Private <br />Intelligence Session
              </h3>
              <button className="flex items-center text-[10px] font-black text-white uppercase tracking-[0.3em] gap-2 pt-2">
                Terminate Latency <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-12">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-6">
            <div className="flex items-center gap-3">
              <Layers className="h-5 w-5 text-accent-red" />
              <h2 className="text-sm font-black uppercase tracking-[0.25em] text-[#F1F5F9] italic">
                Latest Intelligence Briefings
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fetchedArticles.map((article: any) => (
              <AnalysisCard
                key={article.id}
                id={article.id}
                title={article.title}
                category={article.category.name}
                slug={article.slug}
                image="/images/intel-1.jpg"
                riskLevel={article.riskLevel}
                riskScore={article.riskScore}
              />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-[#0F172A] p-12 rounded-[2.5rem] border border-[#1E293B] shadow-2xl relative overflow-hidden group">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-2xl w-fit">
                <Zap className="h-6 w-6 text-accent-red" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] italic">
                Strategic <br />Scenario <br />Modeling
              </h2>
            </div>
            <p className="text-[#94A3B8] font-medium text-lg max-w-sm uppercase tracking-tight leading-relaxed">
              Access our proprietary quantitative forecasting engine. Predict institutional impact across multiple geopolitical timelines.
            </p>
          </div>
          <div className="lg:col-span-7 bg-[#0D121F] rounded-3xl border border-[#1E293B] p-8 shadow-inner relative">
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
      </main>

      <footer className="border-t border-[#1E293B] bg-primary py-24 px-6 mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-5 space-y-8">
            <div className="text-3xl font-black tracking-tighter text-white">TODAY DECODE</div>
            <div className="flex items-center space-x-6">
              <Link href="/about-us/" className="text-[10px] font-black text-white uppercase tracking-widest hover:text-accent-red transition-colors">Methodology</Link>
              <Link href="/privacy-policy/" className="text-[10px] font-black text-white uppercase tracking-widest hover:text-accent-red transition-colors">Privacy</Link>
              <Link href="/terms-of-service/" className="text-[10px] font-black text-white uppercase tracking-widest hover:text-accent-red transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
