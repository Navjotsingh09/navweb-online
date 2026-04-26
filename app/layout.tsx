import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nav Web Online — Biomimicry & Innovation",
  description:
    "How natural systems inspire the technology of tomorrow. Essays on biomimicry, bio-inspired engineering, and design lessons from evolution.",
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
        <main className="container">{children}</main>
        <footer className="site-footer">
          <p>© {new Date().getFullYear()} Nav Web Online · Biomimicry & Innovation</p>
        </footer>
      </body>
    </html>
  );
}
