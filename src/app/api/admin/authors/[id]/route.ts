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
        const { name, slug, role, bio, image, expertise, socialLinks } = body;

        const author = await prisma.author.update({
            where: { id },
            data: {
                name,
                slug,
                role,
                bio,
                image,
                expertise,
                socialLinks
            }
        });

        return NextResponse.json(author);
    } catch (error) {
        console.error("[AUTHOR_PATCH]", error);
        return new NextResponse("Error updating author", { status: 500 });
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!await isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { id } = await params;
        await prisma.author.delete({
            where: { id }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[AUTHOR_DELETE]", error);
        return new NextResponse("Error deleting author", { status: 500 });
    }
}
