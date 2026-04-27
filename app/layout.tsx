import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { MobileMenu } from "./mobile-menu";
import { FooterNewsletter } from "./footer-newsletter";
import { listPosts } from "@/lib/posts";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.navweb.online";
const SITE_NAME = "Nav Web Online";
const SITE_TAGLINE = "Biomimicry, Bio-Inspired Design & Innovation";
const SITE_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
const SITE_DESC =
  "Essays on biomimicry and bio-inspired engineering — how nature's 3.8 billion years of R&D shapes the technology, products, and systems of tomorrow. Cited, audio-narrated, free.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: [
    "biomimicry",
    "bio-inspired design",
    "bio-inspired engineering",
    "nature inspired technology",
    "innovation essays",
    "product design",
    "Navjot Singh",
    "Nav Web Online",
  ],
  authors: [{ name: "Navjot Singh", url: SITE_URL }],
  creator: "Navjot Singh",
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESC,
    url: SITE_URL,
    locale: "en_GB",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/og-default.png"],
  },
  alternates: { canonical: SITE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const year = new Date().getFullYear();
  const posts = listPosts();
  const essayCount = posts.length;
  const topics = Array.from(new Set(posts.flatMap((p) => p.tags))).filter(Boolean);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap"
        />
      </head>
      <body>
        <header className="floating-nav-wrap" aria-label="Site header">
          <div className="floating-nav">
            <Link className="floating-nav-brand" href="/" aria-label="NW — Nav Web Online home">
              <span className="floating-nav-brand-mark">NW</span>
            </Link>

            <nav className="floating-nav-pill liquid-glass" aria-label="Primary">
              <Link className="floating-nav-link" href="/">Home</Link>
              <Link className="floating-nav-link" href="/posts">Essays</Link>
              <Link className="floating-nav-link" href="/topics">Topics</Link>
              <Link className="floating-nav-link" href="/#about">About</Link>
              <Link className="floating-nav-cta" href="/collaborate">
                <span>Collaborate</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </Link>
            </nav>

            <Link className="floating-nav-cta floating-nav-cta-mobile" href="/collaborate" aria-label="Collaborate">
              <span>Collaborate</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </Link>

            <MobileMenu />
          </div>
        </header>
        <Analytics />
        <main className="site-main">{children}</main>
        <footer className="site-footer" aria-labelledby="footer-heading">
          <h2 id="footer-heading" className="visually-hidden">
            Site footer
          </h2>
          <div className="site-shell site-footer-grid">
            <div className="footer-col footer-col-brand">
              <Link href="/" className="footer-brand">
                <span className="footer-brand-mark">NW</span>
                <span className="footer-brand-name">Nav Web Online</span>
              </Link>
              <p className="footer-tagline">
                A biomimicry editorial archive for builders, researchers, and
                designers — essays on what evolution already solved.
              </p>
              <div className="footer-meta">
                <span className="footer-meta-pill">
                  <span className="footer-meta-dot" aria-hidden="true" />
                  {essayCount} essay{essayCount === 1 ? "" : "s"} live
                </span>
                <span className="footer-meta-pill">
                  {topics.length} topic{topics.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <nav className="footer-col" aria-label="Footer navigation">
              <p className="footer-heading">Navigate</p>
              <Link href="/">Home</Link>
              <Link href="/posts">Essay archive</Link>
              <Link href="/topics">Topics</Link>
              <Link href="/collaborate">Collaborate</Link>
              <Link href="/#about">About</Link>
            </nav>

            <div className="footer-col">
              <p className="footer-heading">Resources</p>
              <a href="/sitemap.xml">Sitemap</a>
              <a href="/robots.txt">Robots</a>
              <a href="mailto:hello@navweb.online">hello@navweb.online</a>
            </div>

            <FooterNewsletter topics={topics} />
          </div>

          <div className="site-shell footer-legal">
            <p>© {year} Nav Web Online. All essays released for human reading.</p>
            <p>Built for readers who ship better systems by studying nature.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
