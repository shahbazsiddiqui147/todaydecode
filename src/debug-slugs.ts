import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugSlugs() {
    console.log("--- DEBUGGING CATEGORY SLUGS ---");
    const categories = await prisma.category.findMany();
    categories.forEach(c => {
        console.log(`ID: ${c.id} | Name: "${c.name}" | Slug: "${c.slug}" | Length: ${c.slug.length}`);
    });

    console.log("--- DEBUGGING PAGE SLUGS ---");
    const pages = await prisma.page.findMany();
    pages.forEach(p => {
        console.log(`ID: ${p.id} | Title: "${p.title}" | Slug: "${p.slug}" | Length: ${p.slug.length}`);
    });
}

debugSlugs().catch(console.error).finally(() => prisma.$disconnect());
