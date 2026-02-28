"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- Validation Schemas ---

const CategorySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Name must be at least 2 characters."),
    slug: z.string().min(2, "Slug must be at least 2 characters."),
    description: z.string().optional().nullable(),
    order: z.number().int().default(0),
    isVisible: z.boolean().default(true),
    icon: z.string().optional().nullable(),
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
    slug: z.string().min(2, "Slug is required."),
    onPageLead: z.string().optional().nullable(),
    summary: z.string().min(10, "Summary is too short."),
    content: z.string().min(10, "Content is required."),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
    isFeatured: z.boolean().default(false),
    region: z.enum(["GLOBAL", "MENA", "APAC", "EUROPE", "AMERICAS", "AFRICA"]).default("GLOBAL"),
    riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
    riskScore: z.number().int().min(0).max(100),
    impactScore: z.number().int().min(0).max(100),
    scenarios: z.any().optional().nullable(),
    faqData: z.any().optional().nullable(),
    metaTitle: z.string().optional().nullable(),
    metaDescription: z.string().optional().nullable(),
    authorId: z.string().min(1, "Author selection required."),
    categoryId: z.string().min(1, "Category selection required."),
    isPremium: z.boolean().default(false),
    publishedAt: z.date().optional(),
});

// --- Utilities ---

function normalizeSlug(slug: string): string {
    let s = slug.toLowerCase().trim().replace(/^\/+/, '');
    if (s && !s.endsWith('/')) {
        s += '/';
    }
    return s || "/";
}

// --- Category Actions ---

export async function upsertCategory(data: z.infer<typeof CategorySchema>) {
    try {
        const validated = CategorySchema.parse(data);
        const slug = normalizeSlug(validated.slug || validated.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));

        const category = await prisma.category.upsert({
            where: { id: validated.id || "new-category" },
            update: {
                name: validated.name,
                slug: slug as any,
                description: validated.description as any,
                order: validated.order as any,
                isVisible: validated.isVisible,
                icon: validated.icon,
            },
            create: {
                name: validated.name,
                slug: slug as any,
                description: validated.description as any,
                order: validated.order as any,
                isVisible: validated.isVisible,
                icon: validated.icon,
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
            return { success: false, error: "Protocol path (slug) already exists." };
        }
        return { success: false, error: "Structural synchronization failed." };
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({ where: { id } });
        revalidatePath("/admin/categories/");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Node purge failed." };
    }
}

// --- Author Actions ---

export async function upsertAuthor(data: z.infer<typeof AuthorSchema>) {
    try {
        const validated = AuthorSchema.parse(data);
        const slug = normalizeSlug(validated.slug || validated.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));

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
            return { success: false, error: "Personnel handshake (slug) must be unique." };
        }
        return { success: false, error: "Personnel initialization failed." };
    }
}

export async function deleteAuthor(id: string) {
    try {
        await prisma.author.delete({ where: { id } });
        revalidatePath("/admin/authors/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Personnel record purge failed." };
    }
}

// --- Article Actions ---

export async function upsertArticle(data: z.infer<typeof ArticleSchema>) {
    try {
        const validated = ArticleSchema.parse(data);
        const slug = normalizeSlug(validated.slug);

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
                region: validated.region as any,
                riskLevel: validated.riskLevel as any,
                riskScore: validated.riskScore,
                impactScore: validated.impactScore,
                scenarios: validated.scenarios || {},
                faqData: validated.faqData || {},
                metaTitle: validated.metaTitle,
                metaDescription: validated.metaDescription,
                authorId: validated.authorId,
                categoryId: validated.categoryId,
                isPremium: validated.isPremium,
                publishedAt: validated.publishedAt,
            },
            create: {
                title: validated.title,
                slug,
                onPageLead: validated.onPageLead as any,
                summary: validated.summary,
                content: validated.content,
                status: validated.status as any,
                isFeatured: validated.isFeatured as any,
                region: validated.region as any,
                riskLevel: validated.riskLevel as any,
                riskScore: validated.riskScore,
                impactScore: validated.impactScore,
                scenarios: validated.scenarios || {},
                faqData: validated.faqData || {},
                metaTitle: validated.metaTitle,
                metaDescription: validated.metaDescription,
                authorId: validated.authorId,
                categoryId: validated.categoryId,
                isPremium: validated.isPremium,
                publishedAt: validated.publishedAt || new Date(),
            },
        });

        revalidatePath("/admin/articles/");
        revalidatePath("/");
        // Also revalidate the specific article path if published
        if (validated.status === "PUBLISHED") {
            const category = await prisma.category.findUnique({ where: { id: validated.categoryId } });
            if (category) {
                revalidatePath(`/${category.slug}${slug}`);
            }
        }

        return { success: true, data: article };
    } catch (error: any) {
        console.error("Article Action Error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0]?.message || "Validation failed." };
        }
        if (error.code === 'P2002') {
            return { success: false, error: "Intelligence path (slug) already exists." };
        }
        return { success: false, error: "Report synchronization failed." };
    }
}

export async function deleteArticle(id: string) {
    try {
        await prisma.article.delete({ where: { id } });
        revalidatePath("/admin/articles/");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Report purge failed." };
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
