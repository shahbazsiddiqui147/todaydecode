import { Badge } from "@/components/ui/badge";
import { constructMetadata } from "@/lib/seo";
import { Share2, Bookmark, Clock, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { RiskGauge, KeyTakeaways } from "@/components/ui/article-widgets";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { ScenarioForecast } from "@/components/analysis/scenario-forecast";
import { QuickAnswers } from "@/components/aeo/quick-answers";
import { MethodologyBadge } from "@/components/intel/methodology-badge";
import { CitationTool } from "@/components/intel/citation-tool";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { FollowDesk } from "@/components/user/follow-desk";
import { PaywallGate } from "@/components/monetization/paywall-gate";
import { notFound, redirect } from "next/navigation";
import { getPublicArticleBySlug } from "@/lib/actions/public-actions";
import { cookies } from "next/headers";
import { AdContainer } from "@/components/monetization/ad-container";
import { ContentRenderer } from "@/components/analysis/ContentRenderer";
import { PolicyBriefTemplate } from "@/components/templates/PolicyBriefTemplate";
import { StrategicReportTemplate } from "@/components/templates/StrategicReportTemplate";
import { CommentaryTemplate } from "@/components/templates/CommentaryTemplate";
import { RiskAssessmentTemplate } from "@/components/templates/RiskAssessmentTemplate";
import { ScenarioAnalysisTemplate } from "@/components/templates/ScenarioAnalysisTemplate";
import { DataInsightTemplate } from "@/components/templates/DataInsightTemplate";
import { AnnualOutlookTemplate } from "@/components/templates/AnnualOutlookTemplate";
import { PolicyToolkitTemplate } from "@/components/templates/PolicyToolkitTemplate";
import { NewsBriefTemplate } from "@/components/templates/NewsBriefTemplate";
import { CurrentAffairsTemplate } from "@/components/templates/CurrentAffairsTemplate";

export async function generateMetadata({ params }: { params: Promise<{ category: string; articleSlug: string }> }) {
    const { category, articleSlug } = await params;
    const article = await getPublicArticleBySlug(articleSlug);

    if (!article) return constructMetadata({ title: "Analysis Not Found" });

    return constructMetadata({
        title: `${article.title} | Today Decode`,
        description: article.metaDescription || article.summary.substring(0, 160),
        path: `/${category}/${articleSlug}/`,
        riskScore: article.riskScore,
        impactScore: article.impactScore,
    });
}

export default async function ArticlePage({
    params,
    searchParams
}: {
    params: Promise<{ category: string; articleSlug: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { category, articleSlug } = await params;
    const sParams = await searchParams;

    // Strategic Preview Authentication (Recognizes HTTP-only cookie)
    const isPreview = sParams.preview === 'true';
    const cookieStore = await cookies();
    const hasCookie = cookieStore.get('TD_PREVIEW_ACCESS')?.value === 'true';

    const article = await getPublicArticleBySlug(articleSlug);

    if (!article) {
        notFound();
    }

    // Process scenarios for the Forecast UI
    const rawScenarios = (article.scenarios as any) || {};
    const processedScenarios = {
        best: {
            title: rawScenarios.best?.title || "Strategic Convergence",
            description: rawScenarios.best?.description || "No specific data provided for this scenario outcome.",
            impact: rawScenarios.best?.impact ?? 10
        },
        likely: {
            title: rawScenarios.likely?.title || "Linear Tension",
            description: rawScenarios.likely?.description || "Baseline trajectory based on current analytical indicators.",
            impact: rawScenarios.likely?.impact ?? article.impactScore
        },
        worst: {
            title: rawScenarios.worst?.title || "Systemic Fragmentation",
            description: rawScenarios.worst?.description || "Critical system failure or breakdown of key frameworks.",
            impact: rawScenarios.worst?.impact ?? 90
        }
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(article.publishedAt));

    const readingTime = `${Math.ceil(article.content.length / 1000) + 2} min read`;

    // Template Switcher Logic
    const renderTemplate = () => {
        switch (article.format) {
            case 'POLICY_BRIEF':
                return <PolicyBriefTemplate
                    article={article}
                    formattedDate={formattedDate}
                    readingTime={readingTime}
                />;

            case 'COMMENTARY':
                return <CommentaryTemplate
                    article={article}
                    formattedDate={formattedDate}
                    readingTime={readingTime}
                />;

            case 'RISK_ASSESSMENT':
                return <RiskAssessmentTemplate
                    article={article}
                    formattedDate={formattedDate}
                    readingTime={readingTime}
                />;

            case 'SCENARIO_ANALYSIS':
                return <ScenarioAnalysisTemplate
                    article={article}
                    formattedDate={formattedDate}
                    readingTime={readingTime}
                    processedScenarios={processedScenarios}
                />;

            case 'DATA_INSIGHT':
                return <DataInsightTemplate
                    article={article}
                    formattedDate={formattedDate}
                    readingTime={readingTime}
                />;

            case 'ANNUAL_OUTLOOK':
                return <AnnualOutlookTemplate
                    article={article}
                    formattedDate={formattedDate}
                    readingTime={readingTime}
                />;

            case 'POLICY_TOOLKIT':
                return <PolicyToolkitTemplate
                    article={article}
                    formattedDate={formattedDate}
                    readingTime={readingTime}
                />;

            case 'NEWS_BRIEF':
                return <NewsBriefTemplate
                    article={article}
                    formattedDate={formattedDate}
                    readingTime={readingTime}
                />;

            case 'CURRENT_AFFAIRS':
                return <CurrentAffairsTemplate
                    article={article}
                    formattedDate={formattedDate}
                    readingTime={readingTime}
                />;

            case 'STRATEGIC_REPORT':
            default:
                return <StrategicReportTemplate
                    article={article}
                    formattedDate={formattedDate}
                    readingTime={readingTime}
                    processedScenarios={processedScenarios}
                />;
        }
    };

    return (
        <div className="relative min-h-screen bg-background pb-20">
            <ReadingProgressBar />
            <JsonLd
                type={
                    article.format === 'POLICY_BRIEF' ? 'Report' :
                        article.format === 'STRATEGIC_REPORT' ? 'ScholarlyArticle' :
                            article.format === 'COMMENTARY' ? 'OpinionNewsArticle' :
                                article.format === 'RISK_ASSESSMENT' ? 'AnalysisNewsArticle' :
                                    article.format === 'SCENARIO_ANALYSIS' ? 'Report' :
                                        article.format === 'DATA_INSIGHT' ? 'TechArticle' :
                                            article.format === 'ANNUAL_OUTLOOK' ? 'Report' :
                                                article.format === 'POLICY_TOOLKIT' ? 'Guide' :
                                                    'Article'
                }
                data={{
                    title: article.title,
                    summary: article.summary,
                    publishedAt: article.publishedAt.toISOString(),
                    authorName: article.author.name,
                    image: article.featuredImage || "/images/intel-1.jpg",
                    faqData: (article.faqData as any) || []
                }}
            />

            {/* Template Rendering Core */}
            {renderTemplate()}
        </div>
    );
}
