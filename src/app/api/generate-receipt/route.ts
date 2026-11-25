import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import ImageKit from 'imagekit';
import { supabaseAdmin } from '../../../lib/supabase-server';

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'dummy_public_key',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'dummy_private_key',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/dummy',
});

// Basic in-memory rate limit (Reset every 1 minute)
const rateLimit = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60000;

// Configure Chromium path for Vercel Serverless
const getBrowser = async () => {
  const isLocal = process.env.NODE_ENV === 'development';
  const executablePath = isLocal ? undefined : await chromium.executablePath();
  
  return puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: true,
  });
};

export async function POST(req: Request) {
  try {
    // 1. Security check: Token validation
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // 2. Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const identifier = user.id; // Use user ID instead of IP to be strict
    const now = Date.now();
    const userLimit = rateLimit.get(identifier);

    if (userLimit && now - userLimit.lastReset < RATE_LIMIT_WINDOW_MS) {
      if (userLimit.count >= RATE_LIMIT_MAX) {
        return NextResponse.json({ error: 'Rate limit exceeded. Please wait a minute.' }, { status: 429 });
      }
      userLimit.count += 1;
    } else {
      rateLimit.set(identifier, { count: 1, lastReset: now });
    }

    const body = await req.json();
    const { slipData } = body;

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    
    const encodedData = Buffer.from(JSON.stringify(slipData)).toString('base64');
    
    // Add Secret Token to prevent public access
    const renderToken = process.env.RENDER_SECRET_TOKEN || 'secure_render_84f93a2c';
    const renderUrl = `${appUrl}/render-slip?data=${encodedData}&token=${renderToken}`;

    // 3. Launch Puppeteer
    const browser = await getBrowser();
    
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 1200, deviceScaleFactor: 2 });
    
    // 4. Visit the hidden render page
    await page.goto(renderUrl, { waitUntil: 'networkidle0' });
    
    // 5. Find the slip container and take a screenshot
    const element = await page.$('#receipt-container');
    if (!element) throw new Error('Receipt container not found on render page');
    
    const screenshotBuffer = await element.screenshot({ type: 'png' });
    await browser.close();

    // 6. Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: Buffer.from(screenshotBuffer),
      fileName: `receipt-${Date.now()}.png`,
      folder: '/receipts',
    });

    return NextResponse.json({ 
      success: true, 
      imageUrl: uploadResponse.url 
    });

  } catch (error: any) {
    console.error('Secure Generation Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
