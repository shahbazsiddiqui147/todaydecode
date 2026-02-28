import { MetadataRoute } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SITE_URL = 'https://todaydecode.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let articles: any[] = [];
    let categories: any[] = [];

    try {
        if (process.env.DATABASE_URL) {
            // Fetch articles and categories from the database if URL exists
            articles = await prisma.article.findMany({
                select: { slug: true, publishedAt: true },
            });

            categories = await prisma.category.findMany({
                select: { slug: true },
            });
        }
    } catch (error) {
        console.error("Sitemap generation error: Database connection failed.", error);
    }

    const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
        url: `${SITE_URL}/articles/${article.slug}/`,
        lastModified: article.publishedAt,
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
        url: `${SITE_URL}/${category.slug}/`,
        changeFrequency: 'weekly',
        priority: 0.5,
    }));

    return [
        {
            url: `${SITE_URL}/`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...categoryEntries,
        ...articleEntries,
    ];
}
