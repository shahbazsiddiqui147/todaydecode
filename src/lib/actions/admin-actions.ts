"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { slugify } from "@/lib/slugify";

// --- Validation Schemas ---

const CategorySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Name must be at least 2 characters."),
    slug: z.string().min(2, "Slug must be at least 2 characters."),
    description: z.string().optional().nullable(),
    order: z.number().int().default(0),
    isVisible: z.boolean().default(true),
    icon: z.string().optional().nullable(),
    leadAnalyst: z.string().optional().nullable(),
});

const AuthorSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Full name required."),
    slug: z.string().min(2, "Slug required."),
    role: z.string().min(2, "Designation required."),
    bio: z.string().min(10, "Bio must be at least 10 characters."),
    image: z.union([z.string().url("Valid image URL required."), z.literal("")]).optional().nullable(),
    expertise: z.array(z.string()).default([]),
    socialLinks: z.record(z.string(), z.string()).optional().nullable(),
});

const ArticleSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, "Title is too short."),
    slug: z.string().optional().nullable(), // Allow optional for auto-gen
    onPageLead: z.string().optional().nullable(),
    summary: z.string().min(10, "Institutional Brief is too short."),
    content: z.string().min(10, "Strategic report analysis is required."),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
    isFeatured: z.boolean().default(false),
    isFeaturedScenario: z.boolean().default(false),
    region: z.enum(["GLOBAL", "MENA", "APAC", "EUROPE", "AMERICAS", "AFRICA"]).default("GLOBAL"),
    riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
    riskScore: z.number().int().min(0).max(100).default(50),
    impactScore: z.number().int().min(0).max(100).default(50),
    scenarios: z.object({
        best: z.object({ title: z.string().default("Best Case"), description: z.string().default("") }),
        likely: z.object({ title: z.string().default("Most Likely"), description: z.string().default("") }),
        worst: z.object({ title: z.string().default("Worst Case"), description: z.string().default("") }),
    }).optional().nullable(),
    faqData: z.array(z.object({
        question: z.string(),
        answer: z.string()
    })).optional().nullable(),
    metaTitle: z.string().optional().nullable(),
    metaDescription: z.string().optional().nullable(),
    authorId: z.string().min(1, "Lead Analyst selection required."),
    categoryId: z.string().min(1, "Strategic Silo selection required."),
    isPremium: z.boolean().default(false),
    publishedAt: z.date().optional().nullable(),
    featuredImage: z.string().optional().nullable(),
});

const PageSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(2, "Title must be at least 2 characters."),
    slug: z.string().min(2, "Slug must be at least 2 characters."),
    content: z.string().min(10, "Content must be at least 10 characters."),
    metaTitle: z.string().optional().nullable(),
    metaDescription: z.string().optional().nullable(),
});

const SiteSettingsSchema = z.object({
    siteName: z.string().min(2, "Site name required."),
    logoUrl: z.string().optional().nullable(),
    faviconUrl: z.string().optional().nullable(),
    socialLinks: z.record(z.string(), z.string().url().or(z.literal(""))).optional().nullable(),
    maintenanceMode: z.boolean().default(false),
});

const NavigationItemSchema = z.object({
    id: z.string().optional(),
    label: z.string().min(2, "Label required."),
    href: z.string().min(1, "Link required."),
    order: z.number().int().default(0),
    type: z.enum(["HEADER", "SIDEBAR", "FOOTER"]).default("HEADER"),
});

// --- Utilities ---

// --- Utilities (Deprecated in favor of central slugify) ---

// --- Category Actions ---

export async function upsertCategory(data: z.infer<typeof CategorySchema>) {
    try {
        const validated = CategorySchema.parse(data);
        const slug = slugify(validated.slug || validated.name);

        const category = await prisma.category.upsert({
            where: { id: validated.id || "new-category" },
            update: {
                name: validated.name,
                slug: slug as any,
                description: validated.description as any,
                order: validated.order as any,
                isVisible: validated.isVisible,
                icon: validated.icon,
                leadAnalyst: validated.leadAnalyst,
            },
            create: {
                name: validated.name,
                slug: slug as any,
                description: validated.description as any,
                order: validated.order as any,
                isVisible: validated.isVisible,
                icon: validated.icon,
                leadAnalyst: validated.leadAnalyst,
            },
        });

        revalidatePath("/admin/categories/");
        revalidatePath("/"); // Update navigation
        return { success: true, data: category };
    } catch (error: any) {
        console.error("Category Action Error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0]?.message || "Validation failed." };
        }
        if (error.code === 'P2002') {
            return { success: false, error: "URL path (slug) already exists." };
        }
        return { success: false, error: "Institutional reconciliation failed." };
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({ where: { id } });
        revalidatePath("/admin/categories/");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Silo decommission failed." };
    }
}

// --- Author Actions ---

export async function upsertAuthor(data: z.infer<typeof AuthorSchema>) {
    try {
        const validated = AuthorSchema.parse(data);
        const slug = slugify(validated.slug || validated.name);

        const author = await prisma.author.upsert({
            where: { id: validated.id || "new-author" },
            update: {
                name: validated.name,
                slug: slug as any,
                role: validated.role,
                bio: validated.bio,
                image: validated.image,
                expertise: validated.expertise,
                socialLinks: (validated.socialLinks || {}) as any,
            },
            create: {
                name: validated.name,
                slug: slug as any,
                role: validated.role,
                bio: validated.bio,
                image: validated.image,
                expertise: validated.expertise,
                socialLinks: (validated.socialLinks || {}) as any,
            },
        });

        revalidatePath("/admin/authors/");
        return { success: true, data: author };
    } catch (error: any) {
        console.error("Author Action Error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0]?.message || "Validation failed." };
        }
        if (error.code === 'P2002') {
            return { success: false, error: "Analyst ID (slug) must be unique." };
        }
        return { success: false, error: "Analyst reconciliation failed." };
    }
}

export async function deleteAuthor(id: string) {
    try {
        await prisma.author.delete({ where: { id } });
        revalidatePath("/admin/authors/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Analyst de-authorization failed." };
    }
}

// --- Article Actions ---

export async function upsertArticle(data: z.infer<typeof ArticleSchema>) {
    try {
        const validated = ArticleSchema.parse(data);

        let slug = slugify(validated.slug || validated.title);

        // Duplicate Protection (Collision Detection)
        let uniqueSlug = slug;
        let counter = 1;
        while (true) {
            const existing = await prisma.article.findFirst({
                where: {
                    slug: uniqueSlug,
                    NOT: { id: validated.id || "new-article" }
                }
            });
            if (!existing) break;
            counter++;
            uniqueSlug = slug.replace(/\/$/, `-${counter}/`);
        }
        slug = uniqueSlug;

        const article = await prisma.article.upsert({
            where: { id: validated.id || "new-article" },
            update: {
                title: validated.title,
                slug,
                onPageLead: validated.onPageLead as any,
                summary: validated.summary,
                content: validated.content,
                status: validated.status as any,
                isFeatured: validated.isFeatured as any,
                isFeaturedScenario: validated.isFeaturedScenario as any,
                region: validated.region as any,
                riskLevel: validated.riskLevel as any,
                riskScore: validated.riskScore,
                impactScore: validated.impactScore,
                scenarios: (validated.scenarios || {}) as any,
                faqData: (validated.faqData || []) as any,
                metaTitle: validated.metaTitle,
                metaDescription: validated.metaDescription,
                authorId: validated.authorId,
                categoryId: validated.categoryId,
                isPremium: validated.isPremium,
                publishedAt: (validated.status === "PUBLISHED" && !validated.publishedAt) ? new Date() : (validated.publishedAt || undefined),
                featuredImage: validated.featuredImage,
            },
            create: {
                title: validated.title,
                slug,
                onPageLead: validated.onPageLead as any,
                summary: validated.summary,
                content: validated.content,
                status: validated.status as any,
                isFeatured: validated.isFeatured as any,
                isFeaturedScenario: validated.isFeaturedScenario as any,
                region: validated.region as any,
                riskLevel: validated.riskLevel as any,
                riskScore: validated.riskScore,
                impactScore: validated.impactScore,
                scenarios: (validated.scenarios || {}) as any,
                faqData: (validated.faqData || []) as any,
                metaTitle: validated.metaTitle,
                metaDescription: validated.metaDescription,
                authorId: validated.authorId,
                categoryId: validated.categoryId,
                isPremium: validated.isPremium,
                publishedAt: validated.status === "PUBLISHED" ? new Date() : (validated.publishedAt || undefined),
                featuredImage: validated.featuredImage,
            },
        });

        // Revalidation Sequence
        revalidatePath("/admin/articles/");
        revalidatePath("/");

        // Revalidate specific analysis paths
        const category = await prisma.category.findUnique({ where: { id: validated.categoryId } });
        if (category) {
            const categorySlug = category.slug.replace(/^\/|\/$/g, '');
            const articleSlug = slug.replace(/^\/|\/$/g, '');
            revalidatePath(`/${categorySlug}`);
            revalidatePath(`/${categorySlug}/${articleSlug}`);
        }

        return { success: true, data: article };
    } catch (error: any) {
        console.error("Article Action Error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0]?.message || "Validation failed." };
        }
        if (error.code === 'P2002') {
            return { success: false, error: "Report path (slug) already exists." };
        }
        return { success: false, error: "Analysis reconciliation failed." };
    }
}

export async function deleteArticle(id: string) {
    try {
        await prisma.article.delete({ where: { id } });
        revalidatePath("/admin/articles/");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Analysis decommission failed." };
    }
}

// --- Page Actions (Institutional CMS) ---

export async function upsertPage(data: z.infer<typeof PageSchema>) {
    try {
        const validated = PageSchema.parse(data);
        const slug = slugify(validated.slug || validated.title);

        const page = await prisma.page.upsert({
            where: { id: validated.id || "new-page" },
            update: {
                title: validated.title,
                slug: slug as any,
                content: validated.content,
                metaTitle: validated.metaTitle,
                metaDescription: validated.metaDescription,
            },
            create: {
                title: validated.title,
                slug: slug as any,
                content: validated.content,
                metaTitle: validated.metaTitle,
                metaDescription: validated.metaDescription,
            },
        });

        revalidatePath("/admin/pages/");
        revalidatePath(`/${slug}`);
        return { success: true, data: page };
    } catch (error: any) {
        console.error("Page Action Error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0]?.message || "Validation failed." };
        }
        if (error.code === 'P2002') {
            return { success: false, error: "Page path (slug) already exists." };
        }
        return { success: false, error: "Institutional page reconciliation failed." };
    }
}

export async function deletePage(id: string) {
    try {
        const page = await prisma.page.findUnique({ where: { id } });
        await prisma.page.delete({ where: { id } });
        if (page) revalidatePath(`/${page.slug}`);
        revalidatePath("/admin/pages/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Institutional document decommissioning failed." };
    }
}

// --- Data Fetchers (Shared) ---

export async function getAdminCategories() {
    return await prisma.category.findMany({ orderBy: { order: "asc" as any } });
}

export async function getAdminAuthors() {
    return await prisma.author.findMany({ orderBy: { name: "asc" } });
}

export async function getAdminArticles() {
    return await prisma.article.findMany({
        include: {
            author: { select: { name: true } },
            category: { select: { name: true, slug: true } }
        },
        orderBy: { publishedAt: "desc" }
    });
}

export async function getAdminArticleById(id: string) {
    return await prisma.article.findUnique({
        where: { id },
        include: {
            author: true,
            category: true
        }
    });
}

export async function getAdminPages() {
    return await prisma.page.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAdminPageById(id: string) {
    return await prisma.page.findUnique({ where: { id } });
}

// --- Site Settings Actions ---

export async function getSiteSettings() {
    let settings = await prisma.siteSettings.findUnique({ where: { id: "1" } });
    if (!settings) {
        settings = await prisma.siteSettings.create({
            data: { id: "1", siteName: "Today Decode" }
        });
    }
    return settings;
}

export async function upsertSiteSettings(data: z.infer<typeof SiteSettingsSchema>) {
    try {
        const validated = SiteSettingsSchema.parse(data);
        const settings = await prisma.siteSettings.upsert({
            where: { id: "1" },
            update: {
                siteName: validated.siteName,
                logoUrl: validated.logoUrl,
                faviconUrl: validated.faviconUrl,
                socialLinks: validated.socialLinks as any,
                maintenanceMode: validated.maintenanceMode,
            },
            create: {
                id: "1",
                siteName: validated.siteName,
                logoUrl: validated.logoUrl,
                faviconUrl: validated.faviconUrl,
                socialLinks: validated.socialLinks as any,
                maintenanceMode: validated.maintenanceMode,
            },
        });
        revalidatePath("/");
        return { success: true, data: settings };
    } catch (error: any) {
        return { success: false, error: "Settings reconciliation failed." };
    }
}

// --- Navigation Actions ---

export async function getNavigationItems() {
    return await prisma.navigationItem.findMany({ orderBy: { order: "asc" } });
}

export async function upsertNavigationItem(data: z.infer<typeof NavigationItemSchema>) {
    try {
        const validated = NavigationItemSchema.parse(data);
        // Trailing slash enforcement
        if (validated.href !== "/" && !validated.href.endsWith("/") && !validated.href.startsWith("http")) {
            validated.href = `${validated.href}/`;
        }

        const nav = await prisma.navigationItem.upsert({
            where: { id: validated.id || "new-nav" },
            update: {
                label: validated.label,
                href: validated.href,
                order: validated.order,
                type: validated.type,
            },
            create: {
                label: validated.label,
                href: validated.href,
                order: validated.order,
                type: validated.type,
            },
        });
        revalidatePath("/");
        return { success: true, data: nav };
    } catch (error) {
        return { success: false, error: "Navigation reconciliation failed." };
    }
}

export async function deleteNavigationItem(id: string) {
    try {
        await prisma.navigationItem.delete({ where: { id } });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Link removal failed." };
    }
}

// --- Contributor/Analyst Pipeline Actions ---

export async function getPendingAnalysts() {
    return await prisma.user.findMany({
        where: { role: "GUEST" },
        orderBy: { email: "asc" }
    });
}

export async function approveAnalyst(userId: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: "ANALYST" }
        });
        revalidatePath("/admin/contributors/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Authorization failed." };
    }
}

/**
 * Aggregates institutional-grade analytics for the Admin Dashboard.
 */
export async function getAdminDashboardStats() {
    try {
        const [totalArticles, pendingReviews, totalUsers] = await Promise.all([
            prisma.article.count(),
            prisma.article.count({ where: { status: "DRAFT" as any } }),
            prisma.user.count(),
        ]);

        return {
            success: true,
            stats: {
                totalArticles,
                pendingReviews,
                totalUsers,
                health: "100%"
            }
        };
    } catch (error: any) {
        console.error("Critical error fetching admin stats:", error);
        return {
            success: false,
            error: error.message || "Archive linkage failed."
        };
    }
}
