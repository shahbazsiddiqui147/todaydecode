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
    socialLinks: z.record(z.string()).optional().nullable(),
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
                slug,
                description: validated.description,
                order: validated.order,
                isVisible: validated.isVisible,
                icon: validated.icon,
            },
            create: {
                name: validated.name,
                slug,
                description: validated.description,
                order: validated.order,
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
                slug,
                role: validated.role,
                bio: validated.bio,
                image: validated.image,
                expertise: validated.expertise,
                socialLinks: validated.socialLinks || {},
            },
            create: {
                name: validated.name,
                slug,
                role: validated.role,
                bio: validated.bio,
                image: validated.image,
                expertise: validated.expertise,
                socialLinks: validated.socialLinks || {},
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

// --- Data Fetchers (Shared) ---

export async function getAdminCategories() {
    return await prisma.category.findMany({ orderBy: { order: "asc" } });
}

export async function getAdminAuthors() {
    return await prisma.author.findMany({ orderBy: { name: "asc" } });
}
