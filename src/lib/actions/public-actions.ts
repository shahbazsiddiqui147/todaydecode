

import { prisma } from "@/lib/prisma";
import { Region, ArticleStatus } from "@prisma/client";
import { cache } from "react";

/**
 * High-fidelity article fetcher for public analysis pages.
 * Wrapped in React cache for per-request deduplication.
 */
export const getPublicArticleBySlug = cache(async (slug: string) => {
    try {
        // Normalize slug for institutional database consistency (mandatory /.../ format)
        const normalizedSlug = `/${slug.replace(/^\/|\/$/g, '')}/`;

        const article = await prisma.article.findUnique({
            where: {
                slug: normalizedSlug,
                status: "PUBLISHED" as any
            } as any,
            include: {
                author: true,
                category: true,
            },
        });
        return article as any;
    } catch (error) {
        console.error("Critical fetching error [Article]:", error);
        return null;
    }
});

/**
 * Aggregates average risk scores by Region for the Global Risk Map.
 */
export const getMapRegionData = cache(async () => {
    try {
        const aggregations = await prisma.article.groupBy({
            by: ["region"],
            where: {
                status: "PUBLISHED" as any
            } as any,
            _avg: {
                riskScore: true
            }
        });

        // Transform into a Record for easier frontend mapping
        const regionMapping: Record<string, number> = {};
        aggregations.forEach((item: any) => {
            regionMapping[item.region] = Math.round(item._avg?.riskScore || 0);
        });

        return regionMapping;
    } catch (error) {
        console.error("Critical aggregation error [Map]:", error);
        return {};
    }
});

/**
 * Fetches featured strategic reports for the homepage feed.
 */
export const getFeaturedArticles = cache(async (limit = 4) => {
    try {
        return await prisma.article.findMany({
            where: {
                status: "PUBLISHED" as any,
                isFeatured: true
            } as any,
            include: {
                category: true,
                author: true,
            },
            orderBy: {
                publishedAt: 'desc'
            },
            take: limit
        }) as any[];
    } catch (error) {
        console.error("Critical fetching error [Featured]:", error);
        return [];
    }
});

/**
 * Fetches the latest reports for a specific region hotspot.
 */
export const getLatestReportsByRegion = cache(async (region: string, limit = 3) => {
    try {
        return await prisma.article.findMany({
            where: {
                region: region as any,
                status: "PUBLISHED" as any
            } as any,
            orderBy: {
                publishedAt: 'desc'
            },
            take: limit
        }) as any[];
    } catch (error) {
        console.error("Critical fetching error [Region Hotspot]:", error);
        return [];
    }
});

/**
 * Fetches all visible categories for dynamic navigation.
 */
export async function getPublicCategories() {
    try {
        return await prisma.category.findMany({
            where: { isVisible: true },
            orderBy: { order: 'asc' as any }
        });
    } catch (error) {
        console.error("Critical fetching error [Categories]:", error);
        return [];
    }
}

/**
 * Aggregates high-level system metrics for the homepage dashboard.
 */
export const getHomepageStats = cache(async () => {
    try {
        const [hotspots, reportsCount] = await Promise.all([
            prisma.article.count({
                where: {
                    status: "PUBLISHED" as any,
                    riskLevel: { in: ["HIGH", "CRITICAL"] as any }
                }
            }),
            prisma.article.count({
                where: { status: "PUBLISHED" as any }
            })
        ]);

        return {
            hotspots,
            reportsCount,
            integrity: "Resilient"
        };
    } catch (error) {
        console.error("Critical fetching error [Homepage Stats]:", error);
        return { hotspots: 0, reportsCount: 0, integrity: "Offline" };
    }
});

/**
 * Fetches a public author profile and their latest strategic reports.
 */
export const getPublicAuthorBySlug = cache(async (slug: string) => {
    try {
        // Normalize slug for institutional database consistency (mandatory /.../ format)
        const normalizedSlug = `/${slug.replace(/^\/|\/$/g, '')}/`;

        return await prisma.author.findUnique({
            where: { slug: normalizedSlug },
            include: {
                articles: {
                    where: { status: "PUBLISHED" as any },
                    include: { category: true, author: true },
                    orderBy: { publishedAt: 'desc' },
                    take: 10
                }
            }
        }) as any;
    } catch (error) {
        console.error("Critical fetching error [Author Profile]:", error);
        return null;
    }
});

/**
 * Fetches a full Category object by its slug for the silo landing pages.
 */
export const getCategoryBySlug = cache(async (slug: string) => {
    try {
        const normalizedSlug = `/${slug.replace(/^\/|\/$/g, '')}/`;
        const category = await prisma.category.findUnique({
            where: { slug: normalizedSlug },
            include: {
                articles: {
                    where: { status: "PUBLISHED" as any },
                    include: { author: true, category: true },
                    orderBy: { publishedAt: 'desc' }
                }
            }
        });

        if (!category) return null;

        // Calculate silo-specific risk average
        const articles = category.articles;
        const avgRisk = articles.length > 0
            ? Math.round(articles.reduce((acc, curr) => acc + curr.riskScore, 0) / articles.length)
            : 0;

        return {
            ...category,
            avgRisk
        };
    } catch (error) {
        console.error("Critical fetching error [Category Details]:", error);
        return null;
    }
});

/**
 * Fetches strategic reports filtered by category.
 */
export const getArticlesByCategory = cache(async (categorySlug: string, limit = 10) => {
    try {
        const normalizedSlug = `/${categorySlug.replace(/^\/|\/$/g, '')}/`;
        const category = await prisma.category.findUnique({
            where: { slug: normalizedSlug }
        });

        if (!category) return [];

        return await prisma.article.findMany({
            where: {
                categoryId: category.id,
                status: "PUBLISHED" as any
            } as any,
            include: {
                author: true,
                category: true
            },
            orderBy: { publishedAt: 'desc' },
            take: limit
        }) as any[];
    } catch (error) {
        console.error("Critical fetching error [Category Articles]:", error);
        return [];
    }
});

/**
 * Fetches an institutional page by its slug.
 */
export const getPageBySlug = cache(async (slug: string) => {
    try {
        const normalizedSlug = `/${slug.replace(/^\/|\/$/g, '')}/`;
        return await prisma.page.findUnique({
            where: { slug: normalizedSlug }
        });
    } catch (error) {
        console.error("Critical fetching error [Institutional Page]:", error);
        return null;
    }
});
/**
 * Fetches the latest published article with a riskScore > 80 for the Breaking Alert banner.
 * Wrapped in React cache for per-request deduplication.
 */
export const getHighestRiskAlert = cache(async () => {
    try {
        return await prisma.article.findFirst({
            where: {
                status: "PUBLISHED" as any,
                riskScore: { gt: 80 }
            } as any,
            include: {
                category: true
            },
            orderBy: {
                publishedAt: 'desc'
            }
        }) as any;
    } catch (error) {
        console.error("Critical fetching error [Highest Risk Alert]:", error);
        return null;
    }
});

/**
 * Fetches institutional metrics for a specific country by ISO-A3 code.
 */
export const getCountryMetric = cache(async (countryCode: string) => {
    try {
        return await prisma.countryMetric.findUnique({
            where: { countryCode }
        });
    } catch (error) {
        console.error("Critical fetching error [Country Metric]:", error);
        return null;
    }
});
/**
 * Performs a high-density global search across articles, categories, and authors.
 * Resolves full hierarchical paths for the new catch-all routing system.
 */
export async function globalSearch(query: string) {
    if (!query || query.length < 2) return { articles: [], categories: [], authors: [] };

    try {
        const [articles, categories, authors] = await Promise.all([
            prisma.article.findMany({
                where: {
                    status: "PUBLISHED" as any,
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { summary: { contains: query, mode: 'insensitive' } },
                        { content: { contains: query, mode: 'insensitive' } },
                        { directAnswer: { contains: query, mode: 'insensitive' } },
                    ]
                } as any,
                include: {
                    category: {
                        include: { parent: true }
                    }
                },
                take: 8
            }),
            prisma.category.findMany({
                where: {
                    isVisible: true,
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                    ]
                },
                include: { parent: true },
                take: 5
            }),
            prisma.author.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { role: { contains: query, mode: 'insensitive' } },
                    ]
                },
                take: 5
            })
        ]);

        return {
            articles: articles.map((a: any) => {
                const category = a.category;
                let fullPath = "/";

                if (category.parent) {
                    // It's a Desk (Child): /silo/desk/slug/
                    const siloSlug = category.parent.slug.replace(/^\/|\/$/g, '');
                    const deskSlug = category.slug.replace(/^\/|\/$/g, '');
                    const articleSlug = a.slug.replace(/^\/|\/$/g, '');
                    fullPath = `/${siloSlug}/${deskSlug}/${articleSlug}/`;
                } else {
                    // It's a top-level Silo (shouldn't happen for articles usually but for safety): /silo/article/ (fallback)
                    const siloSlug = category.slug.replace(/^\/|\/$/g, '');
                    const articleSlug = a.slug.replace(/^\/|\/$/g, '');
                    fullPath = `/${siloSlug}/${articleSlug}/`;
                }

                return {
                    id: a.id,
                    title: a.title,
                    fullPath,
                    riskScore: a.riskScore,
                    format: a.format
                };
            }),
            categories: categories.map((c: any) => {
                let fullPath = "/";
                const slug = c.slug.replace(/^\/|\/$/g, '');

                if (c.parent) {
                    const parentSlug = c.parent.slug.replace(/^\/|\/$/g, '');
                    fullPath = `/${parentSlug}/${slug}/`;
                } else {
                    fullPath = `/${slug}/`;
                }

                return {
                    id: c.id,
                    name: c.name,
                    fullPath,
                    isSilo: !c.parentId
                };
            }),
            authors: authors.map((au: any) => ({
                id: au.id,
                name: au.name,
                role: au.role,
                fullPath: `/author/${au.slug.replace(/^\/|\/$/g, '')}/`
            }))
        };
    } catch (error) {
        console.error("Critical error during [Global Search]:", error);
        return { articles: [], categories: [], authors: [] };
    }
}
