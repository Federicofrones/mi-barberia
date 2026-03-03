import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/session';

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // 1. Proteger /admin (Requiere role: admin)
    if (pathname.startsWith('/admin') && pathname !== '/admin/setup') {
        const session = await getSession(request);

        if (!session || session.role !== 'admin') {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }
    }

    // 2. Proteger /barber (Requiere role: barber o admin)
    if (pathname.startsWith('/barber')) {
        const session = await getSession(request);

        if (!session || (session.role !== 'barber' && session.role !== 'admin')) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/barber/:path*'],
};
