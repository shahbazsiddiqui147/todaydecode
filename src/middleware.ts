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

    // 2. Get maintenance state (Extremely broad check for reliability)
    const m1 = process.env.MAINTENANCE_MODE;
    const m2 = process.env.NEXT_PUBLIC_MAINTENANCE_MODE;
    const maintenanceRaw = String(m1 || m2 || '').toLowerCase().trim();

    // If it's literally anything like true/1/on/yes, it's active
    const isMaintenanceActive =
        maintenanceRaw.includes('true') ||
        maintenanceRaw === '1' ||
        maintenanceRaw === 'on' ||
        maintenanceRaw === 'yes';

    // 3. EXEMPTIONS (Static assets, Auth, and the Coming Soon page)
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/coming-soon') ||
        pathname.startsWith('/auth') || // Allow login page access
        pathname.includes('favicon.ico') ||
        pathname.includes('.') // Broad check for file extensions
    ) {
        return NextResponse.next();
    }

    // 4. BYPASS (Developer Preview)
    if (searchParams.get('preview') === 'true' || request.cookies.get('preview_access')?.value === 'true') {
        const response = NextResponse.next();
        if (searchParams.get('preview') === 'true') {
            response.cookies.set('preview_access', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7 });
        }
        return response;
    }

    // 5. REDIRECTION
    if (isMaintenanceActive) {
        const target = new URL('/coming-soon/', request.url);
        return NextResponse.redirect(target);
    }

    return NextResponse.next();
}

// 6. MATCHER (Must be global to catch the root '/')
export const config = {
    matcher: [
        '/((?!api|_next|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
