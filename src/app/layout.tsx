import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "Crimson Ledger - Fintech Receipt Studio",
  description: "Next-gen receipt generator and studio for fintech slips.",
  openGraph: {
    title: "Crimson Ledger - Fintech Receipt Studio",
    description: "Create, customize, and manage fintech receipts instantly.",
    url: "https://crimson-ledger.vercel.app",
    siteName: "Crimson Ledger",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Crimson Ledger Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crimson Ledger - Fintech Receipt Studio",
    description: "Create, customize, and manage fintech receipts instantly.",
    images: ["/og-image.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
