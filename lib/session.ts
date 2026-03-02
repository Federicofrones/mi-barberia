import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const secretKey = process.env.SESSION_SECRET || "default-secret-very-unsecure-123456";
const key = new TextEncoder().encode(secretKey);

export async function createSessionCookie(uid: string, expDays: number = 7) {
    const expires = new Date(Date.now() + expDays * 24 * 60 * 60 * 1000);

    const token = await new SignJWT({ uid })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expDays + "d")
        .sign(key);

    cookies().set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires,
        path: "/",
    });

    return true;
}

export async function getSession(req?: NextRequest) {
    const cookieStore = req ? req.cookies : cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (!sessionToken) return null;

    try {
        const { payload } = await jwtVerify(sessionToken, key, {
            algorithms: ["HS256"],
        });
        return payload; // { uid: ... }
    } catch (err) {
        return null;
    }
}

export async function clearSession() {
    cookies().set("session", "", {
        expires: new Date(0),
        path: "/",
    });
}
