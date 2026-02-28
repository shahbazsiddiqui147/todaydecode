import { getAdminArticleById } from "@/lib/actions/admin-actions";
import ArticleEditor from "@/components/admin/article-editor";
import { notFound } from "next/navigation";

interface EditArticleProps {
    params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticleProps) {
    const { id } = await params;
    const article = await getAdminArticleById(id);

    if (!article) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto">
            <ArticleEditor article={article} />
        </div>
    );
}
