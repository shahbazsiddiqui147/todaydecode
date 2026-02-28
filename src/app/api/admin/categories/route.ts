import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

async function isAdmin() {
    const session = await getServerSession(authOptions);
    return session?.user && (session.user as any).role === "ADMIN";
}

export async function GET() {
    if (!await isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const categories = await prisma.category.findMany({
            orderBy: { order: "asc" }
        });
        return NextResponse.json(categories);
    } catch (error) {
        return new NextResponse("Error fetching categories", { status: 500 });
    }
}

export async function POST(req: Request) {
    if (!await isAdmin()) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const body = await req.json();
        const { name, slug, description, order, isVisible, icon } = body;

        const category = await prisma.category.create({
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
        console.error("[CATEGORIES_POST]", error);
        return new NextResponse("Error creating category", { status: 500 });
    }
}
