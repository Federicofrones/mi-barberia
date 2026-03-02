import { createHash, randomBytes } from 'crypto';

export function generateCancelToken(): { token: string; hash: string } {
    const token = randomBytes(32).toString('hex');
    const hash = createHash('sha256').update(token).digest('hex');
    return { token, hash };
}

export function verifyCancelToken(token: string, hash: string): boolean {
    const inputHash = createHash('sha256').update(token).digest('hex');
    return inputHash === hash;
}
