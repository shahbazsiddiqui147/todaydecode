import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";
import { getSiteSettings } from "@/lib/actions/admin-actions";

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // 1. ADMIN PROTECTION
    if (pathname.startsWith('/admin/')) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        });

        if (!token || token.role !== 'ADMIN') {
            const url = new URL('/auth/signin/', request.url);
            url.searchParams.set('callbackUrl', encodeURI(request.url));
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // 1.1 DASHBOARD PROTECTION
    if (pathname.startsWith('/dashboard/')) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        });

        if (!token) {
            const url = new URL('/auth/signin/', request.url);
            url.searchParams.set('callbackUrl', encodeURI(request.url));
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // 2. EXEMPTIONS (Static assets, Auth, API)
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/auth') ||
        pathname.includes('favicon.ico') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // 3. MAINTENANCE MODE OVERRIDE (Institutional Bypass)
    const settings = await getSiteSettings();
    if (settings?.maintenanceMode) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        });

        // Allow ADMIN and EDITOR to bypass
        const canBypass = token && (token.role === 'ADMIN' || token.role === 'EDITOR' || token.role === 'AUTHOR');

        if (!canBypass && pathname !== '/coming-soon/') {
            return NextResponse.redirect(new URL('/coming-soon/', request.url));
        }
    }

    // 4. TRAILING SLASH ENFORCEMENT (Strategic Directive compliance)
    if (pathname !== '/' && !pathname.endsWith('/') && !pathname.includes('.')) {
        const redirectUrl = new URL(pathname + '/', request.url);
        searchParams.forEach((value, key) => redirectUrl.searchParams.set(key, value));
        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
}

// 6. MATCHER (Must be global to catch the root '/')
export const config = {
    matcher: [
        '/((?!api|_next|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
