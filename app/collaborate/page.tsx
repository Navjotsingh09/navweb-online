import type { Metadata } from "next";
import { CollaborateForm } from "./collaborate-form";

export const metadata: Metadata = {
  title: "Collaborate — Pitch a Project or Propose an Essay",
  description:
    "Got a biomimicry research project, a bio-inspired product idea, or an essay to propose? Get in touch with Navjot directly — collaborations, commissions, and conversations welcome.",
  alternates: { canonical: "/collaborate" },
  openGraph: {
    title: "Collaborate with Nav Web Online",
    description:
      "Pitch a project, propose an essay, or just say hello. A direct line to Navjot for biomimicry collaborations.",
    url: "/collaborate",
    type: "website",
  },
};

const SERVICES = [
  {
    name: "SEO Services",
    blurb:
      "Keyword research, on-page optimisation, technical audits and link building to rank higher and earn organic traffic.",
    href: "https://www.5rv.digital/seo-expert",
    utm: "seo-expert",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
  },
  {
    name: "Digital Marketing",
    blurb:
      "Data-driven campaigns across SEO, paid ads, content and social — built to lift ROI and turn clicks into customers.",
    href: "https://www.5rv.digital/digital-marketing-strategies",
    utm: "digital-marketing",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 17V7l8 4 8-7v17" />
        <path d="M3 17h18" />
      </svg>
    ),
  },
  {
    name: "Web Development",
    blurb:
      "Bespoke, fast, accessible websites — engineered for performance, SEO and conversion from the first paint.",
    href: "https://www.5rv.digital/web-development",
    utm: "web-development",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 9h18M8 14l-2 2 2 2M16 14l2 2-2 2" />
      </svg>
    ),
  },
  {
    name: "Social Media Marketing",
    blurb:
      "Content systems and paid social that earn attention, build brand and move audiences down the funnel.",
    href: "https://www.5rv.digital/social-media-marketing-agency",
    utm: "social-media",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="18" cy="18" r="2.5" />
        <path d="m8.2 11 7.6-3.6M8.2 13l7.6 3.6" />
      </svg>
    ),
  },
  {
    name: "Branding",
    blurb:
      "Identity, voice and visual systems that make your brand instantly recognisable — across every touchpoint.",
    href: "https://www.5rv.digital/branding",
    utm: "branding",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z" />
      </svg>
    ),
  },
];

export default function CollaboratePage() {
  return (
    <div className="collab-shell">
      <section className="collab-intro">
        <p className="collab-kicker">Collaborate</p>
        <h1 className="collab-title">
          <span>Let&apos;s build something</span>
          <span className="collab-title-italic">worth shipping.</span>
        </h1>
        <p className="collab-lede">
          Pitch a project, propose an essay, request a workshop, or just say
          hello. Replies usually within a working day.
        </p>

        <ul className="collab-channels">
          <li>
            <a href="mailto:navjot.singh@5rv.digital" className="collab-channel">
              <span className="collab-channel-label">Email</span>
              <span className="collab-channel-value">navjot.singh@5rv.digital</span>
            </a>
          </li>
          <li>
            <a href="tel:+447587830397" className="collab-channel">
              <span className="collab-channel-label">Phone</span>
              <span className="collab-channel-value">07587 830 397</span>
            </a>
          </li>
        </ul>
      </section>

      <section className="collab-services" aria-labelledby="collab-services-heading">
        <div className="collab-services-head">
          <p className="collab-services-kicker">What we do · 5rv.digital</p>
          <h2 id="collab-services-heading" className="collab-services-title">
            A full studio behind every collaboration.
          </h2>
          <p className="collab-services-sub">
            Nav Web Online is the editorial wing of <strong>5rv.digital</strong> — a
            UK-based studio for SEO, digital marketing, design and engineering.
            Browse what we offer, then get in touch.
          </p>
        </div>

        <ul className="collab-services-grid">
          {SERVICES.map((s) => (
            <li key={s.name}>
              <a
                className="collab-service-card"
                href={`${s.href}?utm_source=navweb&utm_medium=collaborate&utm_campaign=services&utm_content=${s.utm}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="collab-service-icon" aria-hidden="true">{s.icon}</span>
                <h3 className="collab-service-name">{s.name}</h3>
                <p className="collab-service-blurb">{s.blurb}</p>
                <span className="collab-service-link">
                  Learn more
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <p className="collab-services-foot">
          See the full studio at{" "}
          <a
            href="https://www.5rv.digital/services?utm_source=navweb&utm_medium=collaborate&utm_campaign=services&utm_content=footer"
            target="_blank"
            rel="noopener noreferrer"
          >
            5rv.digital/services →
          </a>
        </p>
      </section>

      <CollaborateForm />
    </div>
  );
}
