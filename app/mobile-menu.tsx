"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";

const LINKS: { href: Route; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Essays" },
  { href: "/topics", label: "Topics" },
  { href: "/#about" as Route, label: "About" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="floating-nav-burger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu-sheet"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`floating-nav-burger-bar ${open ? "is-open-1" : ""}`} />
        <span className={`floating-nav-burger-bar ${open ? "is-open-2" : ""}`} />
        <span className={`floating-nav-burger-bar ${open ? "is-open-3" : ""}`} />
      </button>

      <div
        id="mobile-menu-sheet"
        className={`mobile-menu-sheet ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <button
          type="button"
          className="mobile-menu-backdrop"
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />
        <div className="mobile-menu-panel">
          <div className="mobile-menu-head">
            <span className="mobile-menu-kicker">Menu</span>
            <button
              type="button"
              className="mobile-menu-close"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <nav className="mobile-menu-nav" aria-label="Mobile primary">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="mobile-menu-link"
                onClick={() => setOpen(false)}
              >
                <span>{l.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            ))}
          </nav>

          <Link
            href="/collaborate"
            className="mobile-menu-cta"
            onClick={() => setOpen(false)}
          >
            <span>Collaborate</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </Link>

          <div className="mobile-menu-foot">
            <a href="mailto:navjot.singh@5rv.digital">navjot.singh@5rv.digital</a>
            <a href="tel:+447587830397">+44 7587 830 397</a>
          </div>
        </div>
      </div>
    </>
  );
}
