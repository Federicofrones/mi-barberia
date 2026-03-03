import { getSession } from './session';
import { NextRequest, NextResponse } from 'next/server';

export async function requireAdminSession(req?: NextRequest) {
    const session = await getSession(req);
    if (!session || !session.uid || session.role !== 'admin') {
        return null;
    }
    return session;
}

export async function requireBarberSession(req?: NextRequest) {
    const session = await getSession(req);
    // Allow both admin and barber roles to access barber routes
    if (!session || !session.uid || (session.role !== 'barber' && session.role !== 'admin')) {
        return null;
    }
    return session;
}

export function unauthorizedResponse() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
