"use client";

import { cn } from "@/lib/utils";
import { RiskGauge, KeyTakeaways } from "@/components/ui/article-widgets";
import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { PolicyBriefTemplate } from "@/components/templates/PolicyBriefTemplate";
import { StrategicReportTemplate } from "@/components/templates/StrategicReportTemplate";
import { CommentaryTemplate } from "@/components/templates/CommentaryTemplate";
import { RiskAssessmentTemplate } from "@/components/templates/RiskAssessmentTemplate";
import { ScenarioAnalysisTemplate } from "@/components/templates/ScenarioAnalysisTemplate";
import { DataInsightTemplate } from "@/components/templates/DataInsightTemplate";
import { AnnualOutlookTemplate } from "@/components/templates/AnnualOutlookTemplate";
import { PolicyToolkitTemplate } from "@/components/templates/PolicyToolkitTemplate";

interface ArticleControllerProps {
    article: any;
    fullSiloPath?: string;
}

export default function ArticleController({
    article,
    fullSiloPath
}: ArticleControllerProps) {
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
            description: rawScenarios.worst?.description || "Critical system failure or breakdown of institutional frameworks.",
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
        const props = { article, formattedDate, readingTime, fullSiloPath };

        switch (article.format) {
            case 'POLICY_BRIEF':
                return <PolicyBriefTemplate {...props} />;
            case 'COMMENTARY':
                return <CommentaryTemplate {...props} />;
            case 'RISK_ASSESSMENT':
                return <RiskAssessmentTemplate {...props} />;
            case 'SCENARIO_ANALYSIS':
                return <ScenarioAnalysisTemplate {...props} processedScenarios={processedScenarios} />;
            case 'DATA_INSIGHT':
                return <DataInsightTemplate {...props} />;
            case 'ANNUAL_OUTLOOK':
                return <AnnualOutlookTemplate {...props} />;
            case 'POLICY_TOOLKIT':
                return <PolicyToolkitTemplate {...props} />;
            case 'STRATEGIC_REPORT':
            default:
                return <StrategicReportTemplate {...props} processedScenarios={processedScenarios} />;
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
            {renderTemplate()}
        </div>
    );
}
