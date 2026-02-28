import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // 1. Define maintenance mode configuration
    const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
    const bypassSecret = 'true'; // Simple toggle, can be more complex

    // 2. Allow internal Next.js requests and static assets
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/images') ||
        pathname.includes('favicon.ico') ||
        pathname.includes('.svg') ||
        pathname.includes('.png') ||
        pathname.includes('.jpg')
    ) {
        return NextResponse.next();
    }

    // 3. Allow access to the Maintenance Page itself
    if (pathname === '/coming-soon') {
        return NextResponse.next();
    }

    // 4. Maintenance Logic
    if (isMaintenanceMode) {
        // Check for bypass via query param or cookie
        const hasBypassParam = searchParams.get('preview') === bypassSecret;
        const hasBypassCookie = request.cookies.get('preview_access')?.value === bypassSecret;

        if (hasBypassParam || hasBypassCookie) {
            const response = NextResponse.next();
            // Set cookie if bypass via param to persist access
            if (hasBypassParam) {
                response.cookies.set('preview_access', bypassSecret, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7, // 1 week
                });
            }
            return response;
        }

        // Redirect to maintenance page
        return NextResponse.redirect(new URL('/coming-soon', request.url));
    }

    return NextResponse.next();
}

// Ensure middleware runs for all routes except the maintenance page and static files
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
