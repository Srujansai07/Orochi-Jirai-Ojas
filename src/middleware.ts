// Jirai - Middleware
// Simplified - no auth checks (using localStorage mock auth on client side)

import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // For mock auth, we let all requests through
    // Auth is handled on the client side with localStorage
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
