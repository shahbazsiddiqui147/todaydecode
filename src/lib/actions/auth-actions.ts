"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Invalid institutional email format."),
    password: z.string().min(8, "Security framework requires at least 8 characters."),
    registrationType: z.enum(["ACADEMIC", "ANALYST", "JOURNALIST", "PROFESSIONAL", "STUDENT"]),
    institutionalBio: z.string().min(10, "Detail your institutional background."),
});

export async function signUp(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const validated = signUpSchema.parse(rawData);

        // Check for existing identity
        const existingUser = await prisma.user.findUnique({
            where: { email: validated.email },
        });

        if (existingUser) {
            return { error: "Identity already exists in the Strategic Archive." };
        }

        // Hash institutional access framework
        const hashedPassword = await bcrypt.hash(validated.password, 12);

        // Create user entity
        const user = await prisma.user.create({
            data: {
                name: validated.name,
                email: validated.email,
                password: hashedPassword,
                role: "AUTHOR",
                isApproved: false,
                registrationType: validated.registrationType,
                institutionalBio: validated.institutionalBio,
            },
        });

        return { success: true, userId: user.id };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: error.issues[0].message };
        }
        console.error("Sign-up Failure:", error);
        return { error: "Failed to initialize identity. System link error." };
    }
}
