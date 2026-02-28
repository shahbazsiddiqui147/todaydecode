import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // 1. Get maintenance state (Extremely broad check for reliability)
    const m1 = process.env.MAINTENANCE_MODE;
    const m2 = process.env.NEXT_PUBLIC_MAINTENANCE_MODE;
    const maintenanceRaw = String(m1 || m2 || '').toLowerCase().trim();

    // If it's literally anything like true/1/on/yes, it's active
    const isMaintenanceActive =
        maintenanceRaw.includes('true') ||
        maintenanceRaw === '1' ||
        maintenanceRaw === 'on' ||
        maintenanceRaw === 'yes';

    // 2. EXEMPTIONS (Static assets, Auth, and the Coming Soon page)
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/coming-soon') ||
        pathname.includes('favicon.ico') ||
        pathname.includes('.') // Broad check for file extensions (images, scripts, etc)
    ) {
        return NextResponse.next();
    }

    // 3. BYPASS (Developer Preview)
    if (searchParams.get('preview') === 'true' || request.cookies.get('preview_access')?.value === 'true') {
        const response = NextResponse.next();
        if (searchParams.get('preview') === 'true') {
            response.cookies.set('preview_access', 'true', { path: '/', maxAge: 60 * 60 * 24 * 7 });
        }
        return response;
    }

    // 4. REDIRECTION
    if (isMaintenanceActive) {
        // Force absolute redirect to ensure it works on www and non-www
        const target = new URL('/coming-soon/', request.url);
        return NextResponse.redirect(target);
    }

    return NextResponse.next();
}

// 5. MATCHER (Must be global to catch the root '/')
export const config = {
    matcher: [
        /*
         * Match all paths except:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /static (if using public/static)
         * 4. favicon.ico, sitemap.xml, etc.
         */
        '/((?!api|_next|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
