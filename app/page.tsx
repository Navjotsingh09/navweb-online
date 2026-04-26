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
      <section className="ux-hero" id="posts">
        <p className="ux-kicker">Issue one</p>
        <h1 className="ux-title">Built for readers who ship better systems by studying nature.</h1>
        <p className="ux-intro">
          Nav Web Online is an editorial archive on biomimicry: how beetles,
          jellyfish, termites, butterflies, geckos, and whales quietly inform
          buildings, materials, vehicles, medical devices, and interfaces.
        </p>
        <figure className="ux-hero-media" aria-label="Biomimicry hero illustration">
          <img
            src="/images/whale-tubercles.svg"
            alt="Humpback whale tubercles informing wind turbine blade design"
          />
        </figure>
        <div className="ux-actions">
          {featured && (
            <Link href={`/posts/${featured.slug}`} className="btn-primary">
              Read the latest essay
            </Link>
          )}
          <Link href="/posts" className="btn-secondary">
            Browse the archive
          </Link>
        </div>
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

