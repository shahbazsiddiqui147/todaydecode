import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        maintenance_m1: !!process.env.MAINTENANCE_MODE,
        maintenance_m2: !!process.env.NEXT_PUBLIC_MAINTENANCE_MODE,
        nextauth_secret: !!process.env.NEXTAUTH_SECRET,
        node_env: process.env.NODE_ENV,
        TIMESTAMP: new Date().toISOString()
    });
}
