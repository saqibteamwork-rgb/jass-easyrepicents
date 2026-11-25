/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable source maps in production to hide code
  productionBrowserSourceMaps: false,
  
  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // 1. Prevent Clickjacking (X-Frame-Options)
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // 2. Prevent XSS & Data Injection (Content Security Policy)
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; connect-src 'self' https://*.supabase.co; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https://ik.imagekit.io https://*.supabase.co; frame-ancestors 'none';",
          },
          // 3. Prevent MIME-Sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // 4. Force HTTPS (Strict-Transport-Security / HSTS) to prevent Man-in-the-Middle
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // 5. Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // 6. XSS Protection (Legacy but good defense in depth)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          }
        ],
      },
    ];
  },
};

export default nextConfig;
