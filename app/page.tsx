import Link from "next/link";
import { listPosts } from "@/lib/posts";

const SIGNALS = [
  {
    label: "Research-first",
    body: "Every essay is built from primary papers, university labs, and product evidence rather than generic trend commentary.",
  },
  {
    label: "Translation arc",
    body: "The structure stays consistent: organism, mechanism, prototype, and present-day engineering use, always with citations.",
  },
  {
    label: "Tight scope",
    body: "The archive stays focused on biomimicry, materials, mobility, medicine, robotics, and climate-adaptive systems.",
  },
  {
    label: "Moderated discussion",
    body: "Reader responses are reviewed before publication so the conversation remains technical, useful, and free of spam.",
  },
];

const STATS = [
  { label: "Edition", value: "Spring 2026" },
  { label: "Archive", value: "14 essays" },
  { label: "Cadence", value: "Long-form weekly" },
  { label: "Signal", value: "Research-first" },
];

function formatRelativeDate(date: string) {
  const target = new Date(date);
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((now.getTime() - target.getTime()) / dayMs);

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return target.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function HomePage() {
  const posts = listPosts();
  const featured = posts[0];
  const columnPosts = posts.slice(1, 4);
  const archive = posts.slice(4, 9);

  return (
    <div className="home-shell">
      <section className="cinema-hero" id="posts">
        <video
          className="cinema-hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/whale-tubercles.svg"
          aria-hidden="true"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
            type="video/mp4"
          />
        </video>
        <div className="cinema-hero-overlay" aria-hidden="true" />
        <div className="cinema-hero-fade" aria-hidden="true" />

        <div className="cinema-hero-content">
          <div className="cinema-badge liquid-glass" role="presentation">
            <span className="cinema-badge-pill">New</span>
            <span className="cinema-badge-text">Issue one — biomimicry field guide</span>
          </div>

          <h1 className="cinema-title">
            Built for readers who ship better systems by studying nature.
          </h1>

          <p className="cinema-sub">
            Editorial archive on biomimicry. How beetles, jellyfish, termites, butterflies,
            geckos, and whales quietly inform buildings, materials, vehicles, medical
            devices, and interfaces.
          </p>

          <div className="cinema-actions">
            {featured && (
              <Link href={`/posts/${featured.slug}`} className="cinema-cta liquid-glass-strong">
                <span>Read the latest essay</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7" /><path d="M7 7h10v10" /></svg>
              </Link>
            )}
            <Link href="/posts" className="cinema-link">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
              <span>Browse the archive</span>
            </Link>
          </div>

          <div className="cinema-trust">
            <div className="cinema-trust-pill liquid-glass">Trusted references from</div>
            <ul className="cinema-trust-list">
              {["MIT", "Caltech", "ETH Zürich", "RIKEN", "Stanford"].map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="ux-hero ux-hero-secondary">
        <p className="ux-kicker">About this issue</p>
        <ul className="ux-stat-list">
          {STATS.map((item) => (
            <li key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="ux-editorial-grid">
        {featured && (
          <article className="ux-featured-card">
            <p className="story-label">Lead essay</p>
            <Link href={`/posts/${featured.slug}`} className="ux-featured-link">
              <h2>{featured.title}</h2>
            </Link>
            <div className="ux-meta-row">
              <time dateTime={featured.date}>{formatRelativeDate(featured.date)}</time>
              <span>·</span>
              <span>{featured.tags.slice(0, 2).join(" / ")}</span>
            </div>
            {featured.excerpt && <p className="ux-featured-excerpt">{featured.excerpt}</p>}
            <Link href={`/posts/${featured.slug}`} className="card-read-link">Read essay →</Link>
          </article>
        )}

        <div className="ux-latest-column">
          <div className="ux-latest-heading">
            <p className="ux-kicker">Latest from the archive</p>
            <h2>Recent essays and reporting threads</h2>
          </div>
          {columnPosts.map((post) => (
            <article key={post.slug} className="ux-latest-card">
              <div>
                <Link href={`/posts/${post.slug}`} className="ux-latest-link">
                  <h3>{post.title}</h3>
                </Link>
                <p className="ux-date-row">
                  <time dateTime={post.date}>{formatRelativeDate(post.date)}</time>
                </p>
                {post.excerpt && <p>{post.excerpt}</p>}
                <Link href={`/posts/${post.slug}`} className="card-read-link">Read essay →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ux-signals-grid">
        {SIGNALS.map((signal) => (
          <article key={signal.label} className="ux-signal-card">
            <p className="ux-kicker">{signal.label}</p>
            <p>{signal.body}</p>
          </article>
        ))}
      </section>

      <section className="ux-notebook-section">
        <div className="ux-notebook-header">
          <p className="ux-kicker">Notebook</p>
          <h2>More organisms, more mechanisms, more prototypes.</h2>
        </div>
        <div className="ux-notebook-list">
          {archive.map((post) => (
            <article key={post.slug} className="ux-notebook-row">
              <time dateTime={post.date}>{formatRelativeDate(post.date)}</time>
              <div className="ux-notebook-row-body">
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                <Link href={`/posts/${post.slug}`} className="card-read-link">Read essay →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="ux-about-grid">
        <div className="ux-about-copy">
          <p className="ux-kicker">About the journal</p>
          <h2>Biomimicry is not moodboarding nature. It is reverse-engineering survival.</h2>
        </div>
        <div className="ux-about-body">
          <p>
            This publication focuses on the transfer layer between biology and engineering:
            not simply that an organism is interesting, but why its mechanism survives,
            how it was measured, and where that insight becomes a repeatable human system.
          </p>
          <p>
            The goal is to turn academic findings into readable field notes for designers,
            founders, engineers, and researchers who want stronger references than trend decks
            and softer metaphors.
          </p>
        </div>
      </section>
    </div>
  );
}

