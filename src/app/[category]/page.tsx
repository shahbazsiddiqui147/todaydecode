import { getArticlesByCategory, getPublicCategories } from "@/lib/actions/public-actions";
import { constructMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { AnalysisCard } from "@/components/ui/analysis-card";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { Zap, TrendingUp, ShieldAlert, BarChart3 } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
    const { category: categorySlug } = await params;
    const categories = await getPublicCategories();
    const category = categories.find(c => c.slug === categorySlug || c.slug === `${categorySlug}/`);

    if (!category) return constructMetadata({ title: "Sector Not Found" });

    return constructMetadata({
        title: `${category.name} | Strategic Sector Briefing`,
        description: `Deep-dive strategic analysis and geopolitical risk assessment for the ${category.name} sector.`,
        path: `/${categorySlug}/`,
    });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category: categorySlug } = await params;

    const [categories, articles] = await Promise.all([
        getPublicCategories(),
        getArticlesByCategory(categorySlug, 12)
    ]);

    const category = categories.find(c => c.slug === categorySlug || c.slug === `${categorySlug}/`);

    if (!category) notFound();

    return (
        <div className="min-h-screen bg-primary pb-20">
            {/* Sector Hero */}
            <div className="relative border-b border-border-slate py-16 bg-secondary/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent-red/5 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto px-8 relative z-10">
                    <Breadcrumbs items={[
                        { label: 'Home', href: '/' },
                        { label: 'Sectors', href: '#' },
                        { label: category.name, href: `/${category.slug}` }
                    ]} />

                    <div className="mt-10 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-border-slate flex items-center justify-center text-accent-red shadow-xl">
                                <Zap className="h-6 w-6 fill-current" />
                            </div>
                            <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">
                                Strategic Sector Manifest
                            </span>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                                {category.name}
                            </h1>
                            <p className="text-xl text-slate-400 font-medium max-w-3xl leading-relaxed">
                                {category.description || `Real-time intelligence aggregation and impact modeling for global ${category.name.toLowerCase()} trends.`}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-8 pt-6 border-t border-white/5">
                            <div className="flex items-center space-x-3">
                                <BarChart3 className="h-5 w-5 text-accent-green" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {articles.length} ACTIVE REPORTS
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <TrendingUp className="h-5 w-5 text-yellow-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    VOLATILITY: MODERATE
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <ShieldAlert className="h-5 w-5 text-accent-red" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    INTEGRITY: ANALYST VERIFIED
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-8 mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article: any) => (
                        <AnalysisCard
                            key={article.slug}
                            title={article.title}
                            category={article.category.name}
                            slug={article.slug}
                            image="/images/intel-1.jpg"
                            riskLevel={article.riskLevel}
                            riskScore={article.riskScore}
                        />
                    ))}
                </div>

                {articles.length === 0 && (
                    <div className="py-32 text-center border-2 border-dashed border-border-slate rounded-[3rem] bg-secondary/20">
                        <p className="text-slate-500 uppercase font-black tracking-widest text-sm italic">
                            No strategic dispatches currently indexed for this sector.
                        </p>
                        <p className="text-slate-600 text-xs mt-2 uppercase font-bold tracking-tight">
                            Scanning tactical grid for upcoming intelligence...
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
