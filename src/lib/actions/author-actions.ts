"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Normalizes a slug: lowercase, no leading slash, mandatory trailing slash.
 */
function normalizeSlug(slug: string): string {
    let s = slug.toLowerCase().replace(/^\/+/, '');
    if (!s.endsWith('/')) {
        s += '/';
    }
    return s;
}

export async function getAuthors() {
    try {
        const authors = await prisma.author.findMany({
            orderBy: { name: 'asc' },
        });
        return { success: true, data: authors };
    } catch (error) {
        return { success: false, error: "Failed to fetch personnel manifests." };
    }
}

export async function createAuthor(data: {
    name: string;
    slug?: string;
    role: string;
    bio: string;
    image?: string;
    expertise?: string[];
}) {
    try {
        const normalizedSlug = normalizeSlug(data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));

        const author = await prisma.author.create({
            data: {
                name: data.name,
                slug: normalizedSlug,
                role: data.role,
                bio: data.bio,
                image: data.image,
                expertise: data.expertise || [],
            },
        });

        revalidatePath("/admin/authors/");
        revalidatePath("/author/[slug]/"); // Potential dynamic route
        return { success: true, data: author };
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: "Personnel slug must be unique." };
        }
        return { success: false, error: "Initialization failed." };
    }
}

export async function updateAuthor(id: string, data: {
    name?: string;
    slug?: string;
    role?: string;
    bio?: string;
    image?: string;
    expertise?: string[];
}) {
    try {
        const updateData: any = { ...data };
        if (data.slug) {
            updateData.slug = normalizeSlug(data.slug);
        }

        const author = await prisma.author.update({
            where: { id },
            data: updateData,
        });

        revalidatePath("/admin/authors/");
        return { success: true, data: author };
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: "Duplicate slug detected." };
        }
        return { success: false, error: "Update failed." };
    }
}

export async function deleteAuthor(id: string) {
    try {
        await prisma.author.delete({
            where: { id },
        });

        revalidatePath("/admin/authors/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Purge aborted." };
    }
}
