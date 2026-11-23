import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";
import { publicPath } from "@/lib/paths";

// Rebuild hourly so newly published articles appear without a redeploy
export const revalidate = 3600;

function slugKey(slug: string) {
    return slug.replace(/^\/+|\/+$/g, "").toLowerCase();
}

const ALWAYS_CMS_PAGES: { key: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { key: "about-us", priority: 0.8, changeFrequency: "monthly" },
    { key: "methodology", priority: 0.6, changeFrequency: "monthly" },
    { key: "contact", priority: 0.5, changeFrequency: "yearly" },
];

const OPTIONAL_CMS_PAGES: { key: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { key: "editorial-standards", priority: 0.5, changeFrequency: "yearly" },
    { key: "submission-guidelines", priority: 0.5, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPages: MetadataRoute.Sitemap = [
        { url: `${SITE_URL}/`, priority: 1.0, changeFrequency: "daily" },
        { url: `${SITE_URL}/contributors/`, priority: 0.7, changeFrequency: "monthly" },
        { url: `${SITE_URL}/pricing/`, priority: 0.7, changeFrequency: "monthly" },
    ];

    let cmsPages: MetadataRoute.Sitemap = ALWAYS_CMS_PAGES.map((page) => ({
        url: `${SITE_URL}/${page.key}/`,
        priority: page.priority,
        changeFrequency: page.changeFrequency,
    }));
    let categoryEntries: MetadataRoute.Sitemap = [];
    let articleEntries: MetadataRoute.Sitemap = [];

    try {
        const [articles, categories, pages] = await Promise.all([
            prisma.article.findMany({
                where: { status: "PUBLISHED" },
                select: {
                    slug: true,
                    updatedAt: true,
                    category: { select: { slug: true } },
                },
            }),
            prisma.category.findMany({
                where: {
                    isVisible: true,
                    articles: { some: { status: "PUBLISHED" } },
                },
                select: {
                    slug: true,
                    articles: {
                        where: { status: "PUBLISHED" },
                        select: { updatedAt: true },
                        orderBy: { updatedAt: "desc" },
                        take: 1,
                    },
                },
            }),
            prisma.page.findMany({
                select: { slug: true, updatedAt: true },
            }),
        ]);

        const pageBySlug = new Map(pages.map((page) => [slugKey(page.slug), page]));

        const cmsFromDb = (entry: (typeof ALWAYS_CMS_PAGES)[number], required: boolean) => {
            const page = pageBySlug.get(entry.key);
            if (!page && !required) return null;
            return {
                url: `${SITE_URL}/${entry.key}/`,
                priority: entry.priority,
                changeFrequency: entry.changeFrequency,
                ...(page?.updatedAt ? { lastModified: page.updatedAt } : {}),
            };
        };

        cmsPages = [
            ...ALWAYS_CMS_PAGES.map((entry) => cmsFromDb(entry, true)).filter((entry): entry is NonNullable<typeof entry> => entry !== null),
            ...OPTIONAL_CMS_PAGES.map((entry) => cmsFromDb(entry, false)).filter((entry): entry is NonNullable<typeof entry> => entry !== null),
        ];

        categoryEntries = categories.map((category) => ({
            url: `${SITE_URL}${publicPath(category.slug)}`,
            lastModified: category.articles[0]?.updatedAt,
            changeFrequency: "daily",
            priority: 0.7,
        }));

        articleEntries = articles.map((article) => ({
            url: `${SITE_URL}${publicPath(article.category.slug, article.slug)}`,
            lastModified: article.updatedAt,
            changeFrequency: "weekly",
            priority: 0.8,
        }));
    } catch (error) {
        console.error("Sitemap generation error: Database connection failed. Returning static routes only.", error);
    }

    return [...staticPages, ...cmsPages, ...categoryEntries, ...articleEntries];
}
