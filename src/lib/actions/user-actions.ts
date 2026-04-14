"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { PublicationFormat, Region } from "@prisma/client";

/**
 * Toggles a user's follow status for a specific category (Strategic Silo).
 */
export async function toggleFollowSilo(categoryId: string) {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string } | undefined;
    if (!user?.id) {
        return { error: "Authorization required for Strategic Oversight." };
    }

    const userId = user.id;

    try {
        const existing = await prisma.watchlist.findUnique({
            where: {
                userId_categoryId_region: {
                    userId,
                    categoryId,
                    region: null as any // Following specific category
                }
            }
        });

        if (existing) {
            await prisma.watchlist.delete({
                where: { id: existing.id }
            });
            revalidatePath(`/dashboard/`);
            return { success: true, action: "unfollowed" };
        } else {
            await prisma.watchlist.create({
                data: {
                    userId,
                    categoryId
                }
            });
            revalidatePath(`/dashboard/`);
            return { success: true, action: "followed" };
        }
    } catch (error) {
        console.error("Watchlist Toggle Failure:", error);
        return { error: "Failed to update silo status. System link error." };
    }
}

/**
 * Toggles a bookmark for a specific strategic report.
 */
export async function toggleBookmarkArticle(articleId: string) {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string } | undefined;
    if (!user?.id) {
        return { error: "Authorization required to save analysis." };
    }

    const userId = user.id;

    try {
        const existing = await prisma.savedAnalysis.findUnique({
            where: {
                userId_articleId: {
                    userId,
                    articleId
                }
            }
        });

        if (existing) {
            await prisma.savedAnalysis.delete({
                where: { id: existing.id }
            });
            revalidatePath(`/dashboard/`);
            return { success: true, action: "unbookmarked" };
        } else {
            await prisma.savedAnalysis.create({
                data: {
                    userId,
                    articleId
                }
            });
            revalidatePath(`/dashboard/`);
            return { success: true, action: "bookmarked" };
        }
    } catch (error) {
        console.error("Bookmark Toggle Failure:", error);
        return { error: "Failed to save analysis. Matrix synchronization error." };
    }
}

/**
 * Checks if the current user is following a specific silo.
 */
export async function isFollowingSilo(categoryId: string) {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string } | undefined;
    if (!user?.id) return false;

    const userId = user.id;

    const follow = await prisma.watchlist.findUnique({
        where: {
            userId_categoryId_region: {
                userId,
                categoryId,
                region: null as any
            }
        }
    });

    return !!follow;
}

/**
 * Checks if the current user has bookmarked a specific strategic report.
 */
export async function isBookmarkedArticle(articleId: string) {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id?: string } | undefined;
    if (!user?.id) return false;

    const userId = user.id;

    try {
        const bookmark = await prisma.savedAnalysis.findUnique({
            where: {
                userId_articleId: {
                    userId,
                    articleId
                }
            }
        });

        return !!bookmark;
    } catch (error) {
        console.error("Bookmark Check Failure:", error);
        return false;
    }
}

/**
 * Saves or updates a country's institutional metrics.
 */
export async function saveCountryMetric(data: {
    countryCode: string;
    countryName: string;
    literacy: string;
    economy: string;
    energy: string;
    defenceProfile: string;
}) {
    const session = await getServerSession(authOptions);
    const user = session?.user as any;

    if (user?.role !== 'ADMIN') {
        return { error: "Institutional authority required for metric submission." };
    }

    try {
        await prisma.countryMetric.upsert({
            where: { countryCode: data.countryCode },
            update: {
                literacy: data.literacy,
                economy: data.economy,
                energy: data.energy,
                defenceProfile: data.defenceProfile,
                countryName: data.countryName
            },
            create: {
                countryCode: data.countryCode,
                countryName: data.countryName,
                literacy: data.literacy,
                economy: data.economy,
                energy: data.energy,
                defenceProfile: data.defenceProfile
            }
        });

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Metric Save Failure:", error);
        return { error: "Failed to authorize metrics. Matrix link error." };
    }
}

/**
 * --- Submission Actions ---
 */

const SubmissionSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters."),
    summary: z.string().min(20, "Summary must be at least 20 characters."),
    content: z.string().min(100, "Content must be at least 100 characters."),
    format: z.nativeEnum(PublicationFormat),
    categoryId: z.string().min(1, "Category is required."),
    region: z.nativeEnum(Region).default(Region.GLOBAL),
    sourceUrls: z.array(z.string()).optional().default([]),
});

export async function submitArticle(data: any) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, error: "Authentication required." };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user || (!user.isApproved && user.role !== "ADMIN" && user.role !== "EDITOR")) {
        return { success: false, error: "Your account is pending approval." };
    }

    try {
        const validated = SubmissionSchema.parse(data);
        await prisma.submission.create({
            data: {
                ...validated,
                userId: user.id,
            }
        });

        revalidatePath("/admin/submissions/");
        revalidatePath("/dashboard/");
        return { success: true };
    } catch (error: any) {
        console.error("Submission Error:", error);
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: "Failed to submit article. Please try again." };
    }
}

export async function getUserSubmissions() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    return await prisma.submission.findMany({
        where: { userId: session.user.id },
        include: {
            category: {
                select: { name: true }
            }
        },
        orderBy: { submittedAt: "desc" }
    });
}
