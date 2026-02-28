const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = "analyst@todaydecode.com";
    const password = "admin"; // Default password as per user's prompt context
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: "ADMIN",
        },
        create: {
            email,
            name: "Strategic Lead",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log("Admin account initialized:", admin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
