import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // 1. Define maintenance mode configuration
    const maintenanceEnv = String(process.env.MAINTENANCE_MODE || process.env.NEXT_PUBLIC_MAINTENANCE_MODE || '').toLowerCase().trim();
    const isMaintenanceMode = maintenanceEnv === 'true' || maintenanceEnv === '1' || maintenanceEnv === 'on';

    const bypassSecret = 'true';

    // 2. Allow internal Next.js requests and static assets
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/images') ||
        pathname.includes('favicon.ico') ||
        pathname.includes('.svg') ||
        pathname.includes('.png') ||
        pathname.includes('.jpg') ||
        pathname.includes('.webp')
    ) {
        return NextResponse.next();
    }

    // 3. Allow access to the Coming Soon Page itself (Handle trailing slashes)
    if (pathname === '/coming-soon' || pathname === '/coming-soon/') {
        return NextResponse.next();
    }

    // 4. Maintenance Logic
    if (isMaintenanceMode) {
        // Check for bypass via query param or cookie
        const hasBypassParam = searchParams.get('preview') === bypassSecret;
        const hasBypassCookie = request.cookies.get('preview_access')?.value === bypassSecret;

        if (hasBypassParam || hasBypassCookie) {
            const response = NextResponse.next();
            if (hasBypassParam) {
                response.cookies.set('preview_access', bypassSecret, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7, // 1 week
                    sameSite: 'lax',
                });
            }
            return response;
        }

        // Redirect all other requests to coming-soon
        const comingSoonUrl = new URL('/coming-soon/', request.url);
        return NextResponse.redirect(comingSoonUrl);
    }

    return NextResponse.next();
}

// Global matcher - simpler and more inclusive
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
