import { getCategoryBySlug, getPageBySlug, getPublicArticleBySlug } from "@/lib/actions/public-actions";
import { constructMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { FollowSiloButton } from "@/components/intel/FollowSiloButton";
import { AnalysisCard } from "@/components/ui/analysis-card";
import { Activity } from "lucide-react";
import ArticleController from "@/components/analysis/ArticleController";

export async function generateMetadata({ params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;

    // 1. Article Logic (path.length === 3) -> /silo/desk/article/
    if (path.length === 3) {
        const articleSlug = `/${path[2]}/`;
        const article = await getPublicArticleBySlug(articleSlug);
        if (article) {
            return constructMetadata({
                title: `[Strategic Analysis] ${article.title} | Today Decode`,
                description: article.metaDescription || article.summary.substring(0, 160),
                path: `/${path.join('/')}/`,
                articleFormat: article.format,
                riskScore: article.riskScore,
                impactScore: article.impactScore,
            });
        }
    }

    // 2. Desk Logic (path.length === 2) -> /silo/desk/
    if (path.length === 2) {
        const deskSlug = `/${path[1]}/`;
        const desk = await getCategoryBySlug(deskSlug);
        if (desk) {
            return constructMetadata({
                title: `${desk.name} | Strategic Desk`,
                description: desk.description || `Tactical reports and analytical vectors for ${desk.name}.`,
                path: `/${path.join('/')}/`,
            });
        }
    }

    // 3. Silo Logic (path.length === 1) -> /silo/
    if (path.length === 1) {
        const slug = `/${path[0]}/`;
        const silo = await getCategoryBySlug(slug);
        if (silo) {
            return constructMetadata({
                title: `${silo.name} | Strategic Analysis Silo`,
                description: silo.description || `Strategic oversight and analytical reports for ${silo.name}.`,
                path: slug,
            });
        }

        // Institutional Page Fallback
        const page = await getPageBySlug(slug);
        if (page) {
            return constructMetadata({
                title: page.metaTitle || `${page.title} | Institutional`,
                description: page.metaDescription || undefined,
                path: slug,
            });
        }
    }

    return constructMetadata({ title: "Document Not Found" });
}

export default async function CatchAllRoute({ params, searchParams }: {
    params: Promise<{ path: string[] }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { path } = await params;
    const sParams = await searchParams;

    // PATH 3: ARTICLE ASSESSMENT
    if (path.length === 3) {
        const articleSlug = `/${path[2]}/`; // Handshake normalization
        const article = await getPublicArticleBySlug(articleSlug);
        if (!article) notFound();

        return <ArticleController
            article={article}
            fullSiloPath={`/${path[0]}/${path[1]}/`}
        />;
    }

    // PATH 2: CHILD DESK INDEX
    if (path.length === 2) {
        const deskSlug = `/${path[1]}/`;
        const desk = await getCategoryBySlug(deskSlug);
        if (!desk) notFound();

        return <SiloDeskIndex silo={desk} parentPath={`/${path[0]}/`} />;
    }

    // PATH 1: PARENT SILO OR INSTITUTIONAL PAGE
    if (path.length === 1) {
        const slug = `/${path[0]}/`;
        const silo = await getCategoryBySlug(slug);
        if (silo) {
            return <SiloDeskIndex silo={silo} />;
        }

        const page = await getPageBySlug(slug);
        if (page) {
            return <InstitutionalPage page={page} />;
        }
    }

    notFound();
}

function SiloDeskIndex({ silo, parentPath }: { silo: any; parentPath?: string }) {
    const reports = silo.articles || [];
    const reportCount = reports.length;

    const breadcrumbItems = [
        { label: 'Home', href: '/' }
    ];

    if (parentPath) {
        // Find parent name if we have it (or we could fetch it, but keeping it simple for now)
        breadcrumbItems.push({ label: 'Silo', href: parentPath });
        breadcrumbItems.push({ label: silo.name, href: `${parentPath}${silo.slug.replace(/^\/|\/$/g, '')}/` });
    } else {
        breadcrumbItems.push({ label: silo.name, href: `/${silo.slug.replace(/^\/|\/$/g, '')}/` });
    }

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <div className="max-w-screen-2xl mx-auto px-6 py-20 space-y-12">
                <Breadcrumbs items={breadcrumbItems} />

                <div className="flex flex-col space-y-8 max-w-4xl">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground italic leading-none">
                            {silo.name}
                        </h1>
                        <p className="text-muted-foreground max-w-2xl text-xl font-medium uppercase tracking-tight leading-relaxed">
                            {silo.description || "Active research tracking and strategic risk assessment for this global sector."}
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <FollowSiloButton categoryId={silo.id} categoryName={silo.name} />
                    </div>
                </div>
            </div>

            <div className="max-w-screen-2xl mx-auto px-6 pb-32">
                <div className="flex items-center justify-between mb-16">
                    <h2 className="text-lg font-black uppercase tracking-[0.3em] text-foreground italic border-l-4 border-accent-red pl-4">
                        Strategic Analysis
                    </h2>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">
                        {reportCount} Assessments Filed
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {reports.map((article: any) => (
                        <AnalysisCard
                            key={article.id}
                            id={article.id}
                            title={article.title}
                            category={silo.name}
                            slug={article.slug}
                            image={article.featuredImage || "/images/intel-1.jpg"}
                            riskLevel={article.riskLevel}
                            riskScore={article.riskScore}
                        />
                    ))}
                </div>

                {reportCount === 0 && (
                    <div className="py-40 text-center border border-border rounded-none bg-card/30">
                        <div className="flex flex-col items-center space-y-8">
                            <Activity className="h-8 w-8 text-muted-foreground opacity-20" />
                            <div className="space-y-3">
                                <p className="text-2xl font-black uppercase tracking-[0.4em] text-foreground italic">Analysis Pending</p>
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.1em] max-w-md mx-auto leading-relaxed">
                                    Institutional data is being authorized for public release.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function InstitutionalPage({ page }: { page: any }) {
    return (
        <article className="min-h-screen bg-background text-foreground pb-32">
            <div className="max-w-5xl mx-auto px-6 py-20 space-y-16">
                <Breadcrumbs items={[
                    { label: 'Home', href: '/' },
                    { label: page.title, href: '#' }
                ]} />
                <div className="space-y-4">
                    <div className="h-1 w-20 bg-accent-red" />
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic text-foreground leading-[0.9]">
                        {page.title}
                    </h1>
                </div>
                <div
                    className="institutional-content prose prose-slate dark:prose-invert max-w-none 
                        prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black prose-headings:italic
                        prose-p:text-lg prose-p:font-medium prose-p:leading-relaxed prose-p:tracking-tight
                        border-t border-border pt-16"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        </article>
    );
}
