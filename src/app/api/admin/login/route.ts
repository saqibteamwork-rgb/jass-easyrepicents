import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { SignJWT } from 'jose';
import { supabaseAdmin } from '../../../../lib/supabase-server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_KEY || 'unsecure_fallback');

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    // 1. Fetch user from Supabase using Service Role (Bypasses RLS)
    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 2. Hash provided password with PBKDF2 (SHA-256) using stored salt
    const derivedKey = crypto.pbkdf2Sync(password, user.salt, 100000, 32, 'sha256');
    const hashHex = derivedKey.toString('hex');

    // 3. Compare hashes
    if (hashHex !== user.password_hash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 4. Generate JWT with HMAC-256
    const token = await new SignJWT({ id: user.id, username: user.username, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('12h')
      .sign(JWT_SECRET);

    // 5. Set HTTP-Only Cookie
    const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
    response.cookies.set({
      name: 'admin_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 12, // 12 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
