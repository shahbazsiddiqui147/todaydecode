"use client";

import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { UnifiedArticleTemplate } from "@/components/templates/UnifiedArticleTemplate";

const FORMAT_JSON_LD_TYPE: Record<string, string> = {
    POLICY_BRIEF:      'Report',
    STRATEGIC_REPORT:  'ScholarlyArticle',
    COMMENTARY:        'OpinionNewsArticle',
    RISK_ASSESSMENT:   'AnalysisNewsArticle',
    SCENARIO_ANALYSIS: 'Report',
    DATA_INSIGHT:      'TechArticle',
    ANNUAL_OUTLOOK:    'Report',
    POLICY_TOOLKIT:    'Guide',
};

interface ArticleControllerProps {
    article: any;
    fullSiloPath?: string;
}

export default function ArticleController({
    article,
    fullSiloPath
}: ArticleControllerProps) {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(article.publishedAt));

    const readingTime = `${Math.ceil(article.content.length / 1000) + 2} min read`;

    return (
        <div className="relative min-h-screen bg-background pb-20">
            <ReadingProgressBar />
            <JsonLd
                type={(FORMAT_JSON_LD_TYPE[article.format] || 'Article') as any}
                data={{
                    title: article.title,
                    summary: article.summary,
                    publishedAt: article.publishedAt.toISOString(),
                    authorName: article.author.name,
                    image: article.featuredImage || "/images/intel-1.jpg",
                    faqData: (article.faqData as any) || []
                }}
            />
            <UnifiedArticleTemplate
                article={article}
                formattedDate={formattedDate}
                readingTime={readingTime}
                fullSiloPath={fullSiloPath}
            />
        </div>
    );
}
