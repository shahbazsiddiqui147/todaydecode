"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";

/**
 * Handles professional file uploads for institutional assets.
 * Saves files to the public/uploads directory for high-speed delivery.
 */
export async function uploadInstitutionalAsset(formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, error: "No asset detected in payload." };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Standardize filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const uploadDir = join(process.cwd(), "public", "uploads");

        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true });

        const path = join(uploadDir, filename);

        await writeFile(path, buffer);

        const publicUrl = `/uploads/${filename}`;

        return {
            success: true,
            url: publicUrl,
            message: "Asset synchronized with public repository."
        };
    } catch (error) {
        console.error("Upload Error:", error);
        return { success: false, error: "Asset uplink failed." };
    }
}
