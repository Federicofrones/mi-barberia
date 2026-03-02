import { getSession } from './session';
import { NextRequest, NextResponse } from 'next/server';

export async function requireAdminSession(req?: NextRequest) {
    const session = await getSession(req);
    if (!session || !session.uid) {
        return null;
    }
    return session;
}

export function unauthorizedResponse() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
