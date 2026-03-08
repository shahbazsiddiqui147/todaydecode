import { prisma } from "./prisma";

export async function fetchShellCategories() {
    try {
        return await prisma.category.findMany({
            where: { isVisible: true },
            include: {
                children: {
                    where: { isVisible: true },
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { order: 'asc' as any }
        });
    } catch (error) {
        console.error("SHELL_FETCH_FAILURE [Categories]:", error);
        return [];
    }
}

export async function fetchShellMetrics() {
    try {
        // Direct fetching to avoid any "Action" metadata in data-service
        return {
            oil: {
                label: "Brent Crude Oil",
                value: 84.32,
                trend: 1.2,
                unit: "USD/bbl",
                status: 'MEDIUM'
            },
            risk: {
                label: "Global Risk Index",
                value: 72,
                trend: 4.5,
                status: 'HIGH'
            },
            conflict: {
                label: "Conflict Intensity",
                value: 85,
                trend: -2.1,
                status: 'CRITICAL'
            },
            inflation: {
                label: "Global Inflation",
                value: 3.4,
                trend: 0.1,
                unit: "%",
                status: 'LOW'
            }
        };
    } catch (error) {
        console.error("SHELL_FETCH_FAILURE [Metrics]:", error);
        return null;
    }
}

export async function fetchHighestRiskAlert() {
    try {
        return await prisma.article.findFirst({
            where: {
                status: "PUBLISHED" as any,
                riskScore: { gt: 80 }
            } as any,
            include: {
                category: {
                    select: { slug: true }
                }
            },
            orderBy: {
                publishedAt: 'desc'
            }
        });
    } catch (error) {
        console.error("SHELL_FETCH_FAILURE [Highest Risk Alert]:", error);
        return null;
    }
}

export async function fetchSideNavigation() {
    try {
        return await prisma.navigationItem.findMany({
            where: { type: "SIDEBAR" },
            orderBy: { order: "asc" }
        });
    } catch (error) {
        return [];
    }
}

export async function fetchHeaderNavigation() {
    try {
        return await prisma.navigationItem.findMany({
            where: { type: "HEADER" },
            orderBy: { order: "asc" }
        });
    } catch (error) {
        return [];
    }
}

export async function fetchSiteSettings() {
    try {
        let settings = await prisma.siteSettings.findUnique({ where: { id: "1" } });
        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: { id: "1", siteName: "Today Decode" }
            });
        }
        return settings;
    } catch (error) {
        return { siteName: "Today Decode", maintenanceMode: false };
    }
}
