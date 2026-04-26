import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://navweb-online.vercel.app";
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
        <header className="site-header">
          <a className="brand" href="/">
            Nav Web Online
          </a>
          <nav>
            <a href="/">Posts</a>
          </nav>
        </header>
        <Analytics />
        <main className="container">{children}</main>
        <footer className="site-footer">
          <p>© {new Date().getFullYear()} Nav Web Online · Biomimicry & Innovation</p>
        </footer>
      </body>
    </html>
  );
}
