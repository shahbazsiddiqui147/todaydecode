import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function upgradeSlugs() {
    console.log("--- STARTING INSTITUTIONAL SLUG RECONCILIATION ---");

    // 1. Upgrade Categories
    const categories = await prisma.category.findMany();
    for (const cat of categories) {
        const raw = cat.slug.replace(/^\/|\/$/g, '');
        const upgraded = `/${raw}/`;

        if (cat.slug !== upgraded) {
            console.log(`[UPGRADE] Category: ${cat.name} | ${cat.slug} -> ${upgraded}`);
            await prisma.category.update({
                where: { id: cat.id },
                data: { slug: upgraded }
            });
        }
    }

    // 2. Upgrade Pages
    const pages = await prisma.page.findMany();
    for (const page of pages) {
        const raw = page.slug.replace(/^\/|\/$/g, '');
        const upgraded = `/${raw}/`;

        if (page.slug !== upgraded) {
            console.log(`[UPGRADE] Page: ${page.title} | ${page.slug} -> ${upgraded}`);
            await prisma.page.update({
                where: { id: page.id },
                data: { slug: upgraded }
            });
        }
    }

    console.log("--- RECONCILIATION COMPLETE ---");
}

upgradeSlugs().catch(console.error).finally(() => prisma.$disconnect());
