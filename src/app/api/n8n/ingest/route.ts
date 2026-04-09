import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const N8N_SECRET = process.env.N8N_INGEST_SECRET;

function authorize(req: NextRequest) {
    const secret = req.headers.get('x-n8n-secret');
    return secret === N8N_SECRET;
}

function generateSlug(title: string) {
    let slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // remove special chars
        .trim()
        .replace(/\s+/g, '-'); // spaces to hyphens
    
    // Max 8 words
    const words = slug.split('-');
    if (words.length > 8) {
        slug = words.slice(0, 8).join('-');
    }
    
    return slug;
}

export async function GET(req: NextRequest) {
    if (!authorize(req)) {
        return NextResponse.json({ error: "Unauthorized clearance level." }, { status: 403 });
    }
    return NextResponse.json({ status: "ok" });
}

export async function POST(req: NextRequest) {
    if (!authorize(req)) {
        return NextResponse.json({ error: "Unauthorized clearance level." }, { status: 403 });
    }

    try {
        const body = await req.json();
        const {
            title,
            summary,
            content,
            format,
            categoryId,
            authorId,
            slug: providedSlug,
            onPageLead,
            region = "GLOBAL",
            riskLevel = "MEDIUM",
            riskScore = 50,
            impactScore = 50,
            confidenceScore,
            featuredImage,
            featuredImageAlt,
            metaTitle,
            metaDescription,
            directAnswer,
            faqData = [],
            structuredData = {},
            scenarios = {},
            auditNodes,
            researchArchive,
            sourceUrls = [],
            tags = [],
            locale = "en",
            isPremium = false
        } = body;

        // 1. Mandatory Validation
        if (!title || !summary || !content || !format || !categoryId) {
            return NextResponse.json({ error: "Missing required institutional fields." }, { status: 400 });
        }

        // 2. Author Resolution
        let finalAuthorId = authorId;
        if (!finalAuthorId) {
            const aiAuthor = await prisma.author.findUnique({
                where: { slug: 'strategic-analysis-desk' }
            });
            if (!aiAuthor) {
                return NextResponse.json({ error: "Strategic Analysis Desk identity not found." }, { status: 500 });
            }
            finalAuthorId = aiAuthor.id;
        }

        // 3. Category Validation
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });
        if (!category) {
            return NextResponse.json({ error: "Strategic silo (categoryId) does not exist." }, { status: 400 });
        }

        // 4. Slug Generation & Collision Protection
        let slug = providedSlug || generateSlug(title);
        const existing = await prisma.article.findUnique({ where: { slug } });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }

        // 5. Reading Time Calculation
        const wordCount = content.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 238);

        // 6. Create Article Draft
        const article = await prisma.article.create({
            data: {
                title,
                slug,
                summary,
                content,
                onPageLead,
                format,
                status: 'DRAFT',
                isFeatured: false,
                isFeaturedScenario: false,
                region,
                riskLevel,
                riskScore,
                impactScore,
                confidenceScore,
                featuredImage,
                featuredImageAlt,
                readingTime,
                metaTitle,
                metaDescription,
                directAnswer,
                faqData,
                structuredData,
                scenarios,
                auditNodes,
                researchArchive,
                sourceUrls,
                tags,
                locale,
                isPremium,
                authorId: finalAuthorId,
                categoryId
            }
        });

        const adminUrl = `${process.env.NEXTAUTH_URL || ''}/admin/articles/edit/${article.id}`;

        return NextResponse.json({
            success: true,
            articleId: article.id,
            slug: article.slug,
            adminUrl,
            message: "Intelligence dispatch ingested successfully as DRAFT."
        });

    } catch (error: any) {
        console.error("Ingestion Failure:", error);
        return NextResponse.json({ error: "Internal protocol error during ingestion." }, { status: 500 });
    }
}
