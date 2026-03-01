import { getAdminArticleById, getAdminCategories, getAdminAuthors } from "@/lib/actions/admin-actions";
import ArticleEditor from "@/components/admin/article-editor";
import { notFound } from "next/navigation";

interface ArticlePageProps {
    params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { id } = await params;

    // Fetch dependencies in parallel for maximum speed
    const [categories, authors] = await Promise.all([
        getAdminCategories(),
        getAdminAuthors()
    ]);

    let article = null;

    if (id !== "new") {
        article = await getAdminArticleById(id);
        if (!article) {
            notFound();
        }
    }

    return (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ArticleEditor
                article={article}
                initialCategories={categories}
                initialAuthors={authors}
            />
        </div>
    );
}
