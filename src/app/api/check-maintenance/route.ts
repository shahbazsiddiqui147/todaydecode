import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        MAINTENANCE_MODE: process.env.MAINTENANCE_MODE || 'NOT_SET',
        NEXT_PUBLIC_MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE || 'NOT_SET',
        NODE_ENV: process.env.NODE_ENV,
        TIMESTAMP: new Date().toISOString()
    });
}
