import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";

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
