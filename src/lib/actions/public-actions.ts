"use server";

import { prisma } from "@/lib/prisma";
import { Region, ArticleStatus } from "@prisma/client";
import { cache } from "react";

/**
 * High-fidelity article fetcher for public analysis pages.
 * Wrapped in React cache for per-request deduplication.
 */
export const getPublicArticleBySlug = cache(async (slug: string) => {
    try {
        const article = await prisma.article.findUnique({
            where: {
                slug,
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
 * Fetches featured intelligence reports for the homepage feed.
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
export const getPublicCategories = cache(async () => {
    try {
        return await prisma.category.findMany({
            where: { isVisible: true },
            orderBy: { order: 'asc' as any }
        });
    } catch (error) {
        console.error("Critical fetching error [Categories]:", error);
        return [];
    }
});

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
 * Fetches a public author profile and their latest intelligence reports.
 */
export const getPublicAuthorBySlug = cache(async (slug: string) => {
    try {
        return await prisma.author.findUnique({
            where: { slug },
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
 * Fetches intelligence reports filtered by category.
 */
export const getArticlesByCategory = cache(async (categorySlug: string, limit = 10) => {
    try {
        const category = await prisma.category.findUnique({
            where: { slug: categorySlug.endsWith('/') ? categorySlug : `${categorySlug}/` }
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
