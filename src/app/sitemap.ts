import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
const SITE_URL = 'https://todaydecode.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let articles: any[] = [];
    let categories: any[] = [];

    try {
        // Fetch articles and categories from the database if URL exists
        articles = await prisma.article.findMany({
            select: {
                slug: true,
                publishedAt: true,
                category: { select: { slug: true } }
            },
        });

        categories = await prisma.category.findMany({
            select: { slug: true },
        });
    } catch (error) {
        console.error("Sitemap generation error: Database connection failed. Returning static routes only.", error);
    }

    const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
        url: `${SITE_URL}/${article.category.slug.replace(/^\/|\/$/g, '')}/${article.slug.replace(/^\/|\/$/g, '')}/`,
        lastModified: article.publishedAt,
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
        url: `${SITE_URL}/${category.slug.replace(/^\/|\/$/g, '')}/`,
        changeFrequency: 'weekly',
        priority: 0.5,
    }));

    const staticPages = [
        { url: `${SITE_URL}/`, priority: 1, changeFrequency: 'daily' },
        { url: `${SITE_URL}/pricing/`, priority: 0.7, changeFrequency: 'monthly' },
        { url: `${SITE_URL}/about-us/`, priority: 0.5, changeFrequency: 'monthly' },
    ] as MetadataRoute.Sitemap;

    return [
        ...staticPages,
        ...categoryEntries,
        ...articleEntries,
    ];
}
