import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_admin_key_for_hmac_256');

// Simple In-Memory Rate Limiter Map (Resets on server restart/isolate cycle)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Max 100 requests per IP per minute

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  // --- 1. API RATE LIMITING (DDoS Protection) ---
  if (pathname.startsWith('/api/')) {
    const currentWindow = Math.floor(Date.now() / RATE_LIMIT_WINDOW);
    const key = `${ip}-${currentWindow}`;
    const requestsCount = rateLimitMap.get(key) || 0;

    if (requestsCount >= MAX_REQUESTS) {
      return NextResponse.json({ error: 'Too Many Requests (Rate Limit Exceeded)' }, { status: 429 });
    }
    rateLimitMap.set(key, requestsCount + 1);
  }

  // --- 2. CSRF & API SECURITY (Anti-Bot & Direct Access) ---
  if (pathname.startsWith('/api/')) {
    const userAgent = request.headers.get('user-agent') || '';
    const isSuspicious = !userAgent || userAgent.includes('curl') || userAgent.includes('Wget') || userAgent.includes('PostmanRuntime');
    
    // Check Origin for CSRF protection on API POST requests
    if (request.method === 'POST') {
      const origin = request.headers.get('origin');
      const host = request.headers.get('host');
      // If origin is present and doesn't match host, reject (CSRF)
      if (origin && !origin.includes(host || '')) {
         return NextResponse.json({ error: 'CSRF token mismatch or Invalid Origin' }, { status: 403 });
      }
    }
    
    if (isSuspicious) {
      return NextResponse.json({ error: 'Direct API access or bots forbidden.' }, { status: 403 });
    }
  }

  // --- 3. LARGE PAYLOAD PROTECTION (Out of limit data) ---
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > 2 * 1024 * 1024) { // 2MB limit
    return NextResponse.json({ error: 'Payload Too Large' }, { status: 413 });
  }

  // --- 4. SECURE ADMIN APIS (Authentication) ---
  const isAdminAction = pathname.startsWith('/api/admin/') && !pathname.endsWith('/login');

  if (isAdminAction) {
    const token = request.cookies.get('admin_session')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No Token' }, { status: 401 });
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Token' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};
