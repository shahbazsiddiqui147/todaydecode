import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user && (session.user as any).role === "ADMIN";
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!await isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();
        const { name, slug, description, order, isVisible, icon } = body;

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                order: parseInt(order) || 0,
                isVisible: isVisible !== false,
                icon
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("[CATEGORY_PATCH]", error);
        return new NextResponse("Error updating category", { status: 500 });
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!await isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;
        await prisma.category.delete({
            where: { id }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[CATEGORY_DELETE]", error);
        return new NextResponse("Error deleting category", { status: 500 });
    }
}
