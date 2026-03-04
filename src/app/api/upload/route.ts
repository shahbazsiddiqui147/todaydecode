import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const session = await getServerSession(authOptions);

        // Institutional Security Check
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized access to Strategic Assets' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename') || 'unnamed-asset.png';

        if (!request.body) {
            return NextResponse.json({ error: 'No strategic data provided' }, { status: 400 });
        }

        // Upload to Vercel Blob
        const blob = await put(filename, request.body, {
            access: 'public',
        });

        return NextResponse.json(blob);
    } catch (error) {
        console.error('[Strategic Upload Failure]:', error);
        return NextResponse.json({ error: 'Internal Analytical Error during upload' }, { status: 500 });
    }
}
