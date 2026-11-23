"use client";

import { ReadingProgressBar } from "@/components/ui/reading-progress-bar";
import { ArticleJsonLd } from "@/components/seo/json-ld";
import { UnifiedArticleTemplate } from "@/components/templates/UnifiedArticleTemplate";

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

    const readingTime = `${Math.ceil((article.content?.length || 0) / 1000) + 2} min read`;

    return (
        <div className="relative min-h-screen bg-background pb-20">
            <ReadingProgressBar />
            <ArticleJsonLd
                data={{
                    title: article.title,
                    summary: article.summary,
                    format: article.format,
                    publishedAt: article.publishedAt,
                    updatedAt: article.updatedAt,
                    authorName: article.author?.name,
                    image: article.featuredImage,
                    categoryName: article.category?.name,
                    categorySlug: article.category?.slug,
                    articleSlug: article.slug,
                    fullSiloPath,
                    faqData: (article.faqData as any) || [],
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
