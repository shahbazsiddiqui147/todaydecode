import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
const SITE_URL = 'https://todaydecode.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let articles: any[] = [];
    let categories: any[] = [];

    try {
        // Fetch only PUBLISHED articles and visible categories
        articles = await prisma.article.findMany({
            where: { status: 'PUBLISHED' },
            select: {
                slug: true,
                publishedAt: true,
                updatedAt: true,
                category: { select: { slug: true } }
            },
        });

        categories = await prisma.category.findMany({
            where: { isVisible: true },
            select: { slug: true },
        });
    } catch (error) {
        console.error("Sitemap generation error: Database connection failed. Returning static routes only.", error);
    }

    const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
        url: `${SITE_URL}/${article.category.slug.replace(/^\/|\/$/g, '')}/${article.slug.replace(/^\/|\/$/g, '')}/`,
        lastModified: article.updatedAt || article.publishedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
        url: `${SITE_URL}/${category.slug.replace(/^\/|\/$/g, '')}/`,
        changeFrequency: 'daily',
        priority: 0.7,
    }));

    const staticPages = [
        { url: `${SITE_URL}/`, priority: 1.0, changeFrequency: 'daily' },
        { url: `${SITE_URL}/about/`, priority: 0.8, changeFrequency: 'monthly' },
        { url: `${SITE_URL}/contributors/`, priority: 0.7, changeFrequency: 'monthly' },
        { url: `${SITE_URL}/pricing/`, priority: 0.7, changeFrequency: 'monthly' },
        { url: `${SITE_URL}/methodology/`, priority: 0.6, changeFrequency: 'monthly' },
        { url: `${SITE_URL}/contact/`, priority: 0.5, changeFrequency: 'yearly' },
    ] as MetadataRoute.Sitemap;

    return [
        ...staticPages,
        ...categoryEntries,
        ...articleEntries,
    ];
}
