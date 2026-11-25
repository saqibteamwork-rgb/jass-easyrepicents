# Crimson Ledger — Fintech Receipt Studio

A next-generation Pakistani fintech receipt and transaction slip studio built with Next.js, Tailwind CSS, TypeScript, and Supabase.

## Features

- **Multi-Provider Support**: Realistic, high-fidelity receipt templates for JazzCash, Easypaisa, Raast, and Bank transfers.
- **Micro-Notch Geometry**: High-precision thermal receipt styling with realistic tear edges and barcode rendering.
- **Export Formats**: Instant 1-click export to PNG and PDF, clipboard copy, and print mode.
- **Admin Management Console**: Secure PIN-protected dashboard for managing user tiers, subscription expiry, coupons, and system announcements.
- **PWA Ready**: Offline-capable Progressive Web App with standalone install support on Android, iOS, and Desktop.

## Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and set your Supabase credentials:
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```
