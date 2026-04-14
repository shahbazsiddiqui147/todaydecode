"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { slugify } from "@/lib/slugify";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { SubmissionStatus } from "@prisma/client";

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
    affiliation: z.string().optional().nullable(),
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
    format: z.enum([
        "POLICY_BRIEF",
        "STRATEGIC_REPORT",
        "COMMENTARY",
        "SCENARIO_ANALYSIS",
        "RISK_ASSESSMENT",
        "DATA_INSIGHT",
        "ANNUAL_OUTLOOK",
        "POLICY_TOOLKIT"
    ]).default("STRATEGIC_REPORT"),
    isFeatured: z.boolean().default(false),
    isFeaturedScenario: z.boolean().default(false),
    region: z.enum(["GLOBAL", "MENA", "APAC", "EUROPE", "AMERICAS", "AFRICA"]).default("GLOBAL"),
    riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
    riskScore: z.number().int().min(0).max(100).default(50),
    impactScore: z.number().int().min(0).max(100).default(50),
    scenarios: z.object({
        best: z.object({
            title: z.string().default("Best Case"),
            description: z.string().default(""),
            impact: z.number().int().min(0).max(100).default(10)
        }),
        likely: z.object({
            title: z.string().default("Most Likely"),
            description: z.string().default(""),
            impact: z.number().int().min(0).max(100).default(50)
        }),
        worst: z.object({
            title: z.string().default("Worst Case"),
            description: z.string().default(""),
            impact: z.number().int().min(0).max(100).default(90)
        }),
    }).optional().nullable(),
    faqData: z.array(z.object({
        question: z.string(),
        answer: z.string()
    })).optional().nullable(),
    metaTitle: z.string().optional().nullable(),
    metaDescription: z.string().optional().nullable(),
    auditNodes: z.string().optional().nullable(),
    researchArchive: z.string().optional().nullable(),
    authorId: z.string().min(1, "Lead Analyst selection required."),
    categoryId: z.string().min(1, "Strategic Silo selection required."),
    isPremium: z.boolean().default(false),
    publishedAt: z.date().optional().nullable(),
    featuredImage: z.string().optional().nullable(),
    structuredData: z.any().optional().nullable(),
    directAnswer: z.string().optional().nullable(),
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
    socialLinks: z.record(z.string(), z.any()).optional().nullable(), // Store as flexible Json
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
                affiliation: validated.affiliation,
                bio: validated.bio,
                image: validated.image,
                expertise: validated.expertise,
                socialLinks: (validated.socialLinks || {}) as any,
            },
            create: {
                name: validated.name,
                slug: slug as any,
                role: validated.role,
                affiliation: validated.affiliation,
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
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !["ADMIN", "EDITOR", "AUTHOR"].includes(session.user.role)) {
            return { success: false, error: "Unauthorized access: Insufficient clearance." };
        }

        const validated = ArticleSchema.parse(data);

        // AUTHOR PROTECTION: Verify ownership
        if (session.user.role === "AUTHOR" && validated.id && validated.id !== "new-article") {
            const article = await prisma.article.findUnique({ where: { id: validated.id } });
            if (article && article.authorId !== session.user.id) {
                return { success: false, error: "Access Denied: Institutional access integrity breach." };
            }
        }

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
                onPageLead: validated.onPageLead,
                summary: validated.summary,
                content: validated.content,
                status: validated.status,
                isFeatured: validated.isFeatured,
                isFeaturedScenario: validated.isFeaturedScenario,
                region: validated.region,
                riskLevel: validated.riskLevel,
                riskScore: validated.riskScore,
                impactScore: validated.impactScore,
                scenarios: (validated.scenarios || {}) as any,
                faqData: (validated.faqData || []) as any,
                metaTitle: validated.metaTitle,
                metaDescription: validated.metaDescription,
                auditNodes: validated.auditNodes,
                researchArchive: validated.researchArchive,
                authorId: validated.authorId,
                categoryId: validated.categoryId,
                isPremium: validated.isPremium,
                format: validated.format as any,
                structuredData: validated.structuredData as any,
                directAnswer: validated.directAnswer,
                publishedAt: (validated.status === "PUBLISHED" && !validated.publishedAt) ? new Date() : (validated.publishedAt || undefined),
                featuredImage: validated.featuredImage,
            },
            create: {
                title: validated.title,
                slug,
                onPageLead: validated.onPageLead,
                summary: validated.summary,
                content: validated.content,
                status: validated.status,
                isFeatured: validated.isFeatured,
                isFeaturedScenario: validated.isFeaturedScenario,
                region: validated.region,
                riskLevel: validated.riskLevel,
                riskScore: validated.riskScore,
                impactScore: validated.impactScore,
                scenarios: (validated.scenarios || {}) as any,
                faqData: (validated.faqData || []) as any,
                metaTitle: validated.metaTitle,
                metaDescription: validated.metaDescription,
                auditNodes: validated.auditNodes,
                researchArchive: validated.researchArchive,
                authorId: validated.authorId,
                categoryId: validated.categoryId,
                isPremium: validated.isPremium,
                format: validated.format as any,
                structuredData: validated.structuredData as any,
                directAnswer: validated.directAnswer,
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
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Unauthorized access.");
    }

    const where: any = {};
    if (session.user.role === "AUTHOR") {
        where.authorId = session.user.id;
    }

    return await prisma.article.findMany({
        where,
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
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return { success: false, error: "Unauthorized access: Master Admin clearance required." };
        }
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
            data: { role: "AUTHOR" }
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
// --- User Management (Personnel Registry) ---

export async function getAdminUsers() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        throw new Error("Master Admin clearance required.");
    }
    return await prisma.user.findMany({
        orderBy: { email: "asc" }
    });
}

export async function updateUserRole(userId: string, role: "GUEST" | "AUTHOR" | "EDITOR" | "ADMIN") {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return { success: false, error: "Master Admin clearance required." };
        }

        await prisma.user.update({
            where: { id: userId },
            data: { role: role as any }
        });

        revalidatePath("/admin/users/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Role calibration failed." };
    }
}

export async function approveUser(userId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return { success: false, error: "Master Admin clearance required." };
        }

        await prisma.user.update({
            where: { id: userId },
            data: { isApproved: true }
        });

        revalidatePath("/admin/users/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Identity authorization failed." };
    }
}

export async function deleteUser(userId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return { success: false, error: "Master Admin clearance required." };
        }

        await prisma.user.delete({
            where: { id: userId }
        });

        revalidatePath("/admin/users/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Personnel purging failed." };
    }
}

const CreateUserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["GUEST", "AUTHOR", "EDITOR", "ADMIN"]),
});

export async function createUser(data: z.infer<typeof CreateUserSchema>) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return { success: false, error: "Master Admin clearance required." };
        }

        const validated = CreateUserSchema.parse(data);
        const hashedPassword = await bcrypt.hash(validated.password, 12);

        await prisma.user.create({
            data: {
                name: validated.name,
                email: validated.email,
                password: hashedPassword,
                role: validated.role,
                isApproved: true, // Manually created users are pre-approved
            }
        });

        revalidatePath("/admin/users/");
        return { success: true };
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        if (error.code === 'P2002') {
            return { success: false, error: "Identity already exists in Registry." };
        }
        return { success: false, error: "Personnel induction failed." };
    }
}

// --- Contributor Submission System ---

export async function getAdminSubmissions(statusFilter?: string) {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
        throw new Error("Unauthorized access.");
    }

    const where: any = {};
    if (statusFilter && Object.values(SubmissionStatus).includes(statusFilter as any)) {
        where.status = statusFilter as SubmissionStatus;
    }

    return await prisma.submission.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    designation: true,
                    affiliation: true,
                    institutionalBio: true
                }
            },
            category: {
                select: {
                    name: true
                }
            }
        },
        orderBy: { submittedAt: "desc" }
    });
}

export async function reviewSubmission(submissionId: string, action: 'approve' | 'reject', reviewNote?: string) {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "EDITOR"].includes(session.user.role)) {
        return { success: false, error: "Unauthorized access: Insufficient clearance." };
    }

    if (action === 'reject' && !reviewNote) {
        return { success: false, error: "Review note is required for rejections." };
    }

    try {
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
            include: { user: true }
        });

        if (!submission) {
            return { success: false, error: "Submission not found." };
        }

        if (action === 'reject') {
            await prisma.submission.update({
                where: { id: submissionId },
                data: {
                    status: "REJECTED" as any,
                    reviewNote,
                    reviewedAt: new Date()
                }
            });
            revalidatePath("/admin/submissions/");
            revalidatePath("/dashboard/");
            return { success: true };
        }

        // Action: Approve
        // 1. Update submission status to APPROVED
        await prisma.submission.update({
            where: { id: submissionId },
            data: {
                status: "APPROVED" as any,
                reviewNote,
                reviewedAt: new Date()
            }
        });

        // 2. Author Resolution
        const user = submission.user;
        const authorSlug = slugify(user.name || "Anonymous Contributor");
        
        let author = await prisma.author.findUnique({
            where: { slug: authorSlug }
        });

        if (!author) {
            author = await prisma.author.create({
                data: {
                    name: user.name || "Anonymous Contributor",
                    slug: authorSlug,
                    role: user.designation || "Contributor",
                    bio: user.institutionalBio || "Contributor at Today Decode",
                    affiliation: user.affiliation || "Independent",
                }
            });
        }

        // 3. Article Creation
        let articleSlug = slugify(submission.title);
        // Collision Detection
        let uniqueSlug = articleSlug;
        let counter = 1;
        while (true) {
            const existing = await prisma.article.findUnique({
                where: { slug: uniqueSlug }
            });
            if (!existing) break;
            counter++;
            uniqueSlug = articleSlug.replace(/\/$/, `-${counter}/`);
        }

        await prisma.article.create({
            data: {
                title: submission.title,
                slug: uniqueSlug,
                summary: submission.summary,
                content: submission.content,
                format: submission.format as any,
                categoryId: submission.categoryId,
                region: submission.region as any,
                sourceUrls: submission.sourceUrls,
                status: "DRAFT" as any,
                authorId: author.id,
                riskScore: 50,
                impactScore: 50,
            }
        });

        // 4. Update submission to PUBLISHED (processed)
        await prisma.submission.update({
            where: { id: submissionId },
            data: { status: "PUBLISHED" as any }
        });

        revalidatePath("/admin/submissions/");
        revalidatePath("/admin/articles/");
        revalidatePath("/dashboard/");
        
        return { success: true };
    } catch (error: any) {
        console.error("Submission Review Error:", error);
        return { success: false, error: "Failed to process review." };
    }
}
