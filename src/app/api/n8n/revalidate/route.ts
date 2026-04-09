import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const N8N_SECRET = process.env.N8N_INGEST_SECRET;

function authorize(req: NextRequest) {
    const secret = req.headers.get('x-n8n-secret');
    return secret === N8N_SECRET;
}

export async function POST(req: NextRequest) {
    if (!authorize(req)) {
        return NextResponse.json({ error: "Unauthorized clearance level." }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { slug, categorySlug } = body;

        // 1. Core Revalidations
        revalidatePath('/');
        revalidatePath('/sitemap.xml');
        revalidateTag('articles');

        const revalidated: any = {
            home: true,
            sitemap: true,
            tagArticles: true
        };

        // 2. Specific Intelligence Node Revalidation
        if (slug) {
            revalidatePath(`/${slug}/`);
            revalidateTag(`article-${slug}`);
            revalidated.article = slug;
        }

        // 3. Strategic Silo Revalidation
        if (categorySlug) {
            revalidatePath(`/${categorySlug}/`);
            revalidateTag(`category-${categorySlug}`);
            revalidated.category = categorySlug;
        }

        return NextResponse.json({
            success: true,
            revalidated,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return NextResponse.json({ error: "Revalidation protocol failure." }, { status: 500 });
    }
}
