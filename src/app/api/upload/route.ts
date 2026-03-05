import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions);

        // Institutional Security Check
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized access to Strategic Assets' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename') || `asset-${Date.now()}.png`;

        if (!request.body) {
            return NextResponse.json({ error: 'No strategic data provided' }, { status: 400 });
        }

        // Recovery Path Logic
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

            if (isProduction) {
                console.error('[Institutional Storage Failure]: BLOB_READ_WRITE_TOKEN is missing in Production environment.');
                return NextResponse.json({
                    error: 'Asset reconciliation failed: Production storage not configured. Please add BLOB_READ_WRITE_TOKEN to Vercel environment variables.'
                }, { status: 500 });
            }

            console.warn('[Strategic Warning]: BLOB_READ_WRITE_TOKEN is missing. Falling back to local filesystem (Development only).');

            const buffer = Buffer.from(await request.arrayBuffer());
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

            try {
                // Ensure directory exists
                await mkdir(uploadsDir, { recursive: true });

                const filePath = path.join(uploadsDir, filename);
                await writeFile(filePath, buffer);

                return NextResponse.json({
                    url: `/uploads/${filename}`,
                    pathname: `uploads/${filename}`,
                    contentType: 'image/octet-stream',
                    contentDisposition: 'inline'
                });
            } catch (fsError: any) {
                console.error('[Institutional Write Violation]:', fsError);
                return NextResponse.json({
                    error: `Asset reconciliation failed: Local storage unavailable. Serverless environments require Vercel Blob configuration.`
                }, { status: 500 });
            }
        }

        // Upload to Vercel Blob (Production)
        const blob = await put(filename, request.body, {
            access: 'public',
        });

        return NextResponse.json(blob);
    } catch (error: any) {
        console.error('[Strategic Upload Failure]:', error);
        return NextResponse.json({
            error: `Institutional analytical error: ${error.message || 'Asset reconciliation interrupted.'}`
        }, { status: 500 });
    }
}
