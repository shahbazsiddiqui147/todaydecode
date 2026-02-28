import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // 1. Define maintenance mode configuration
    // Check both standard and NEXT_PUBLIC prefixed variables for maximum reliability
    const maintenanceEnv = process.env.MAINTENANCE_MODE || process.env.NEXT_PUBLIC_MAINTENANCE_MODE;
    const isMaintenanceMode = maintenanceEnv === 'true' || maintenanceEnv === '1' || maintenanceEnv === 'TRUE';

    const bypassSecret = 'true';

    // 2. Allow internal Next.js requests and static assets
    // We handle this inside to avoid matcher issues with the root path
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

    // 3. Allow access to the Coming Soon Page itself
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
                    sameSite: 'lax',
                });
            }
            return response;
        }

        // Redirect all other requests to coming-soon
        // We use an absolute URL to ensure redirection works across different environments
        const comingSoonUrl = new URL('/coming-soon', request.url);
        return NextResponse.redirect(comingSoonUrl);
    }

    return NextResponse.next();
}

// Global matcher to ensure the root path and all subpaths are intercepted
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
