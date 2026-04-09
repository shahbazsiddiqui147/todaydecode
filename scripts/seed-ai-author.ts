import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Initializing Strategic Analysis Desk identity...");

    const existingAuthor = await prisma.author.findUnique({
        where: { slug: "strategic-analysis-desk" }
    });

    if (existingAuthor) {
        console.log("Identity already exists in Strategic Archive.");
        console.log("------------------------------------------");
        console.log(`AI_AUTHOR_ID=${existingAuthor.id}`);
        console.log("------------------------------------------");
        return;
    }

    const newAuthor = await prisma.author.create({
        data: {
            name: "Strategic Analysis Desk",
            slug: "strategic-analysis-desk",
            role: "Institutional Research",
            bio: "Today Decode's institutional research framework, producing automated strategic analysis across geopolitics, global economy, security, and governance.",
            affiliation: "Today Decode",
            expertise: [
                "Geopolitical Analysis",
                "Risk Assessment",
                "Strategic Forecasting",
                "Policy Research",
                "Global Economics"
            ]
        }
    });

    console.log("Institutional identity created successfully.");
    console.log("------------------------------------------");
    console.log(`AI_AUTHOR_ID=${newAuthor.id}`);
    console.log("------------------------------------------");
}

main()
    .catch((e) => {
        console.error("Initialization Protocol Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
