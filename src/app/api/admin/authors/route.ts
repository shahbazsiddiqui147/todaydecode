import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// SECURITY: Ensure only ADMINS can access this API
async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user && (session.user as any).role === "ADMIN";
}

export async function GET() {
    if (!await isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const authors = await prisma.author.findMany({
            orderBy: { name: "asc" }
        });
        return NextResponse.json(authors);
    } catch (error) {
        return new NextResponse("Error fetching authors", { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!await isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        const { name, slug, role, bio, image, expertise, socialLinks } = body;

        const author = await prisma.author.create({
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
        console.error("[AUTHORS_POST]", error);
        return new NextResponse("Error creating author", { status: 500 });
    }
}
