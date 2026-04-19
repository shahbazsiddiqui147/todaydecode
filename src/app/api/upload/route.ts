import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename') || `asset-${Date.now()}.jpg`;

        if (!request.body) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await request.arrayBuffer());

        // Auto-compress image using sharp
        const compressed = await sharp(buffer)
            .resize(1200, 630, {
                fit: 'cover',
                position: 'centre'
            })
            .jpeg({ quality: 82, progressive: true })
            .toBuffer();

        // Save to public/uploads on VPS
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadsDir, { recursive: true });

        // Always save as .jpg after compression
        const baseName = path.parse(filename).name
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-_]/g, '')
            .toLowerCase();
        const finalFilename = `${baseName}-${Date.now()}.jpg`;
        const filePath = path.join(uploadsDir, finalFilename);
        await writeFile(filePath, compressed);

        const baseUrl = process.env.NEXTAUTH_URL || 'https://todaydecode.com';
        const url = `${baseUrl}/uploads/${finalFilename}`;

        return NextResponse.json({
            url,
            pathname: `uploads/${finalFilename}`,
            contentType: 'image/jpeg',
            contentDisposition: 'inline',
            originalSize: buffer.length,
            compressedSize: compressed.length,
            compressionRatio: Math.round((1 - compressed.length / buffer.length) * 100) + '%'
        });

    } catch (error: any) {
        console.error('[Upload Failure]:', error);
        return NextResponse.json({
            error: error.message || 'Upload failed'
        }, { status: 500 });
    }
}
