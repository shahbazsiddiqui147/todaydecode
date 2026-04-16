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
        
        // Helper to normalize empty JSON from N8N
        function normalizeJsonField(value: any) {
            if (value === null || value === undefined) return null;
            if (Array.isArray(value) && value.length === 0) return null;
            if (typeof value === 'object' && Object.keys(value).length === 0) return null;
            return value;
        }

        const VALID_FORMATS = [
            'POLICY_BRIEF', 'STRATEGIC_REPORT', 'COMMENTARY',
            'SCENARIO_ANALYSIS', 'RISK_ASSESSMENT', 'DATA_INSIGHT',
            'ANNUAL_OUTLOOK', 'POLICY_TOOLKIT'
        ];

        const {
            id,
            title,
            summary,
            content,
            format: rawFormat,
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
            faqData,
            structuredData,
            scenarios,
            auditNodes,
            researchArchive,
            sourceUrls = [],
            tags = [],
            locale = "en",
            isPremium = false,
            status = 'DRAFT'
        } = body;

        // 1. Mandatory Validation
        if (!title || !summary || !content || !categoryId) {
            return NextResponse.json({ error: "Missing required institutional fields." }, { status: 400 });
        }

        // Normalize format
        const format = VALID_FORMATS.includes(rawFormat) ? rawFormat : 'COMMENTARY';

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
        const existing = await prisma.article.findFirst({ 
            where: { 
                slug,
                NOT: id ? { id } : undefined 
            } 
        });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }

        // 5. Reading Time Calculation
        const wordCount = content.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 238);

        // 6. Article Data Preparation
        const articleData = {
            title,
            slug,
            summary,
            content,
            onPageLead: onPageLead || summary?.substring(0, 200),
            format,
            status,
            isFeatured: false,
            isFeaturedScenario: false,
            region,
            riskLevel,
            riskScore: Number(riskScore),
            impactScore: Number(impactScore),
            confidenceScore: confidenceScore ? Number(confidenceScore) : null,
            featuredImage,
            featuredImageAlt,
            readingTime,
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || summary?.substring(0, 160),
            directAnswer,
            faqData: normalizeJsonField(faqData),
            structuredData: normalizeJsonField(structuredData),
            scenarios: normalizeJsonField(scenarios),
            auditNodes: normalizeJsonField(auditNodes),
            researchArchive: normalizeJsonField(researchArchive),
            sourceUrls,
            tags,
            locale,
            isPremium,
            authorId: finalAuthorId,
            categoryId,
            publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
        };

        let article;
        if (body.id) {
            article = await prisma.article.update({
                where: { id: body.id },
                data: articleData,
            });
        } else {
            article = await prisma.article.create({
                data: articleData,
            });
        }


        const adminUrl = `${process.env.NEXTAUTH_URL || ''}/admin/articles/edit/${article.id}`;

        return NextResponse.json({
            success: true,
            action: body.id ? 'updated' : 'created',
            article: {
                id: article.id,
                title: article.title,
                slug: article.slug,
                status: article.status,
            },
            adminUrl,
            message: `Intelligence dispatch ${body.id ? 'updated' : 'created'} successfully.`
        });

    } catch (error: any) {
        console.error("Ingestion Failure:", error);
        return NextResponse.json({ 
            success: false, 
            error: "Internal protocol error during ingestion.",
            details: error.message 
        }, { status: 500 });
    }
}
