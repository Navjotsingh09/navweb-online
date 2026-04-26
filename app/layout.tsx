import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.navweb.online";
const SITE_NAME = "Nav Web Online";
const SITE_DESC =
  "How natural systems inspire the technology of tomorrow. Essays on biomimicry, bio-inspired engineering, and design lessons from evolution.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Biomimicry & Innovation`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESC,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Biomimicry & Innovation`,
    description: SITE_DESC,
    url: SITE_URL,
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Biomimicry & Innovation`,
    description: SITE_DESC,
    images: ["/og-default.png"],
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <div className="site-ribbon">
            <span>Biomimicry journal</span>
            <span>Case studies from biology to engineering</span>
          </div>
          <header className="site-header">
            <Link className="brand" href="/">
              <span className="brand-mark">NW</span>
              <span className="brand-copy">
                <strong>Nav Web Online</strong>
                <small>Journal of biomimicry and innovation</small>
              </span>
            </Link>
            <nav className="site-nav">
              <Link href="/">Index</Link>
              <Link href="/posts">Archive</Link>
              <Link href="/#about">About</Link>
            </nav>
          </header>
        </div>
        <Analytics />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="site-footer-inner">
            <p>© {new Date().getFullYear()} Nav Web Online</p>
            <p>Editorial notes on organisms, mechanisms, prototypes, and products.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
