import { constructMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getPublicArticleBySlug } from "@/lib/actions/public-actions";
import ArticleController from "@/components/analysis/ArticleController";

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
}: {
    params: Promise<{ category: string; articleSlug: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { category, articleSlug } = await params;
    const article = await getPublicArticleBySlug(articleSlug);

    if (!article) notFound();

    return (
        <ArticleController
            article={article}
            fullSiloPath={`/${category}/`}
        />
    );
}
