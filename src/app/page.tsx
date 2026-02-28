import { AnalysisCard } from "@/components/ui/analysis-card";
import { TrendingUp, ShieldAlert, Zap } from "lucide-react";
import { GlobalRiskMap } from "@/components/maps/global-risk-map";
import { getFeaturedArticles, getMapRegionData } from "@/lib/actions/public-actions";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { constructMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return constructMetadata({
    title: "Today Decode — Global Intelligence & Geopolitical Risk",
    description: "Strategic analysis of Geopolitics, Economy, Security, and Global Shifts. Analyst-verified intelligence for institutional-grade decision making.",
    path: "/"
  });
}

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // 1. FAST-PATH MAINTENANCE CHECK
  const m1 = process.env.MAINTENANCE_MODE;
  const m2 = process.env.NEXT_PUBLIC_MAINTENANCE_MODE;
  const raw = String(m1 || m2 || '').toLowerCase();
  const isMaintenance = raw.includes('true') || raw === '1' || raw === 'on';

  const params = await searchParams;
  const isPreview = params.preview === 'true';
  const cookieStore = await cookies();
  const hasCookie = cookieStore.get('preview_access')?.value === 'true';

  if (isMaintenance && !isPreview && !hasCookie) {
    redirect('/coming-soon/');
  }

  // 2. FETCH PRODUCTION DATA
  const [featuredArticles, regionData] = await Promise.all([
    getFeaturedArticles(4),
    getMapRegionData()
  ]);

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl uppercase font-black">
              Global Intelligence Briefing
            </h1>
            <p className="text-slate-500 text-sm max-w-2xl font-medium uppercase tracking-tight">
              Real-time strategic analysis of geopolitical risks and global shifts.
              Refreshed dynamically from the Command Center.
            </p>
          </div>
          <div className="hidden lg:flex items-center space-x-2 text-[10px] font-bold tracking-widest text-accent-red uppercase">
            <span className="h-2 w-2 rounded-full bg-accent-red animate-pulse shadow-[0_0_8px_rgba(255,75,75,0.4)]" />
            <span>LIVE DATA: SECURE CONNECTION ESTABLISHED</span>
          </div>
        </div>
      </section>

      <div className="w-full">
        <GlobalRiskMap regionData={regionData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredArticles.map((article: any) => (
          <AnalysisCard
            key={article.slug}
            title={article.title}
            category={article.category.name}
            slug={article.slug}
            image="/images/intel-1.jpg" // In production, use article.image if available
            riskLevel={article.riskLevel}
            riskScore={article.riskScore}
          />
        ))}

        {featuredArticles.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-border-slate rounded-xl">
            <p className="text-slate-500 uppercase font-black tracking-widest text-xs">
              No active intelligence reports found in the grid.
            </p>
          </div>
        )}
      </div>

      <section className="bg-primary/5 dark:bg-primary/40 border border-border-slate rounded-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="flex justify-center">
              <ShieldAlert className="h-8 w-8 text-accent-red" />
            </div>
            <div className="text-2xl font-bold uppercase font-black tracking-tighter">12 Active Hotspots</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Global Security Index</div>
          </div>
          <div className="space-y-2 border-x border-border-slate">
            <div className="flex justify-center">
              <TrendingUp className="h-8 w-8 text-accent-green" />
            </div>
            <div className="text-2xl font-bold uppercase font-black tracking-tighter">+4.2% Growth</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">MENA Economic Forecast</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center">
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold uppercase font-black tracking-tighter">Resilient</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Energy Grid Integrity</div>
          </div>
        </div>
      </section>
    </div>
  );
}
