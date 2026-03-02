import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
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

    // 4. STRATEGIC PREVIEW BYPASS (Root & Maintenance)
    const isPreviewParam = searchParams.get('preview') === 'true';
    const hasPreviewCookie = request.cookies.get('TD_PREVIEW_ACCESS')?.value === 'authorized';

    if (isPreviewParam || hasPreviewCookie) {
        let response = NextResponse.next();

        // Enforce trailing slash even in preview mode (for sub-paths)
        if (pathname !== '/' && !pathname.endsWith('/') && !pathname.includes('.')) {
            const redirectUrl = new URL(pathname + '/', request.url);
            searchParams.forEach((value, key) => redirectUrl.searchParams.set(key, value));
            response = NextResponse.redirect(redirectUrl);
        }

        // Set/Refresh the authorization cookie
        if (isPreviewParam || !hasPreviewCookie) {
            response.cookies.set('TD_PREVIEW_ACCESS', 'authorized', {
                path: '/',
                maxAge: 60 * 60 * 24, // 24 hours persistence
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            });
        }

        return response;
    }

    // 5. REDIRECTION (Maintenance Mode)
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
