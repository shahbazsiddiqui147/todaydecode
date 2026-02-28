const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function test(name, url) {
    const prisma = new PrismaClient({
        datasources: { db: { url } },
    });
    try {
        console.log(`Testing ${name}...`);
        await prisma.$connect();
        const result = await prisma.$queryRaw`SELECT 1`;
        console.log(`${name} successful:`, result);
    } catch (error) {
        console.error(`${name} failed:`, error.message);
    } finally {
        await prisma.$disconnect();
    }
}

async function main() {
    await test('DATABASE_URL', process.env.DATABASE_URL);
    await test('DIRECT_URL', process.env.DIRECT_URL);
}

main();
