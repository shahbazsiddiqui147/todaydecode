import { articlePageMetadata } from "@/lib/seo";
import { publicPath } from "@/lib/paths";
import { notFound } from "next/navigation";
import { getPublicArticleBySlug } from "@/lib/actions/public-actions";
import ArticleController from "@/components/analysis/ArticleController";

export async function generateMetadata({ params }: { params: Promise<{ category: string; articleSlug: string }> }) {
    const { category, articleSlug } = await params;
    const article = await getPublicArticleBySlug(articleSlug);

    if (!article) notFound();

    return articlePageMetadata(article, publicPath(category, articleSlug));
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
            fullSiloPath={publicPath(category)}
        />
    );
}
