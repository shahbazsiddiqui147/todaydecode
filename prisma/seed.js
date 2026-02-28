const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- SEEDING TODAY DECODE INTELLIGENCE VAULT ---');

    // 1. Create Authors
    const author = await prisma.author.upsert({
        where: { id: 'cl_vance_1' },
        update: {},
        create: {
            id: 'cl_vance_1',
            name: 'Dr. Elena Vance',
            role: 'Strategic Analyst',
            bio: 'Former intelligence officer specializing in Arctic maritime security and High North geopolitics.',
        },
    });

    // 2. Create Categories
    const security = await prisma.category.upsert({
        where: { name: 'Security' },
        update: {},
        create: { name: 'Security', slug: 'security' },
    });

    const economy = await prisma.category.upsert({
        where: { name: 'Economy' },
        update: {},
        create: { name: 'Economy', slug: 'economy' },
    });

    const tech = await prisma.category.upsert({
        where: { name: 'Technology' },
        update: {},
        create: { name: 'Technology', slug: 'technology' },
    });

    const energy = await prisma.category.upsert({
        where: { name: 'Energy' },
        update: {},
        create: { name: 'Energy', slug: 'energy' },
    });

    // 3. Create Featured Articles
    const articles = [
        {
            title: "The Barents Gap: NATO's Silent Conflict in the High North",
            slug: "barents-gap-nato-silent-conflict",
            summary: "NATO is increasing presence in the Barents Sea as Arctic melting opens new strategic corridors.",
            content: "Strategic analysis of the maritime corridor between the North Cape and Bear Island...",
            region: 'GLOBAL',
            riskLevel: 'HIGH',
            riskScore: 82,
            impactScore: 78,
            categoryId: security.id,
            authorId: author.id,
            isPremium: true,
        },
        {
            title: "Post-Petrodollar: The UAE's Pivot to AI and Quantum Supremacy",
            slug: "post-petrodollar-uae-pivot-ai",
            summary: "The UAE's diversification strategy focuses on heavy investment in artificial intelligence and quantum computing.",
            content: "As global energy markets shift, Gulf states are racing to define the next era of technological sovereignty...",
            region: 'MENA',
            riskLevel: 'MEDIUM',
            riskScore: 45,
            impactScore: 72,
            categoryId: tech.id,
            authorId: author.id,
        },
        {
            title: "Strait of Hormuz: Energy Security and the 2026 Transit Forecast",
            slug: "strait-of-hormuz-energy-security",
            summary: "Monitoring maritime transit risks in the world's most critical energy choke point.",
            content: "Predictive modeling for 2026 suggests heightened naval friction and insurance premium spikes...",
            region: 'MENA',
            riskLevel: 'CRITICAL',
            riskScore: 94,
            impactScore: 88,
            categoryId: energy.id,
            authorId: author.id,
            isPremium: true,
        }
    ];

    for (const art of articles) {
        await prisma.article.upsert({
            where: { slug: art.slug },
            update: art,
            create: art,
        });
    }

    console.log('--- SEEDING COMPLETE ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
