import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/session';

export async function middleware(request: NextRequest) {
    // Solo proteger /admin excluyendo subrutas o API, o todo reqs a /admin
    const pathname = request.nextUrl.pathname;

    // Exclude login
    if (pathname.startsWith('/admin') && pathname !== '/login') {
        const session = await getSession(request);

        if (!session) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
