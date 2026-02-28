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

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { order: 'asc' },
        });
        return { success: true, data: categories };
    } catch (error) {
        return { success: false, error: "Failed to fetch categories." };
    }
}

export async function createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    order?: number;
    isVisible?: boolean;
    icon?: string;
}) {
    try {
        const normalizedSlug = normalizeSlug(data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));

        const category = await prisma.category.create({
            data: {
                name: data.name,
                slug: normalizedSlug,
                description: data.description,
                order: data.order || 0,
                isVisible: data.isVisible ?? true,
                icon: data.icon,
            },
        });

        revalidatePath("/admin/categories/");
        revalidatePath("/"); // Update navigation
        return { success: true, data: category };
    } catch (error: any) {
        console.error("Prisma Error:", error);
        if (error.code === 'P2002') {
            return { success: false, error: "Duplicate slug detected. Please use a unique protocol path." };
        }
        return { success: false, error: "Internal Database Error." };
    }
}

export async function updateCategory(id: string, data: {
    name?: string;
    slug?: string;
    description?: string;
    order?: number;
    isVisible?: boolean;
    icon?: string;
}) {
    try {
        const updateData: any = { ...data };
        if (data.slug) {
            updateData.slug = normalizeSlug(data.slug);
        }

        const category = await prisma.category.update({
            where: { id },
            data: updateData,
        });

        revalidatePath("/admin/categories/");
        revalidatePath("/");
        return { success: true, data: category };
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: "Duplicate slug detected." };
        }
        return { success: false, error: "Update failed." };
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({
            where: { id },
        });

        revalidatePath("/admin/categories/");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Deletion failed." };
    }
}
