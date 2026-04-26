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
  { value: "5+", label: "Sources per post" },
  { value: "1500–2000", label: "Words, rigorously edited" },
  { value: "2 hr", label: "Comment moderation cycle" },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
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
    <>
      <section className="home-masthead">
        <div className="home-masthead-copy">
          <p className="posts-kicker">Issue one / editorial field guide</p>
          <h1 className="home-title">Nature keeps shipping prototypes. We read the release notes.</h1>
          <p className="home-intro">
            Nav Web Online is an editorial archive on biomimicry: how beetles,
            jellyfish, termites, butterflies, geckos, and whales quietly inform
            buildings, materials, vehicles, medical devices, and interfaces.
          </p>
          <div className="home-actions">
            <Link href="/posts" className="btn-primary">Browse the archive</Link>
            {featured && (
              <Link href={`/posts/${featured.slug}`} className="btn-secondary">
                Read the latest essay
              </Link>
            )}
          </div>
        </div>
        <aside className="home-ledger">
          <div className="posts-ledger-row">
            <span>Edition</span>
            <strong>Spring 2026</strong>
          </div>
          <div className="posts-ledger-row">
            <span>Archive size</span>
            <strong>{posts.length} essays</strong>
          </div>
          <div className="posts-ledger-row">
            <span>Format</span>
            <strong>Long-form case studies</strong>
          </div>
          <div className="posts-ledger-row">
            <span>Review cadence</span>
            <strong>2-hour moderation cycle</strong>
          </div>
        </aside>
      </section>

      <section className="home-stats-band">
        <ul className="hero-stats home-stats-grid">
          {STATS.map((s) => (
            <li key={s.label}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-journal" id="posts">
        {featured && (
          <article className="home-featured-story">
            <p className="story-label">Lead essay</p>
            <Link href={`/posts/${featured.slug}`} className="lead-story-link">
              <h2>{featured.title}</h2>
            </Link>
            <div className="lead-story-meta">
              <time dateTime={featured.date}>{formatDate(featured.date)}</time>
              <span>·</span>
              <span>{featured.tags.slice(0, 2).join(" / ")}</span>
            </div>
            {featured.excerpt && <p className="lead-story-excerpt">{featured.excerpt}…</p>}
          </article>
        )}

        <div className="home-story-column">
          <div className="home-story-heading">
            <p className="posts-kicker">Latest from the archive</p>
            <h2>Recent essays and reporting threads</h2>
          </div>
          {columnPosts.map((post, index) => (
            <article key={post.slug} className="home-story-card">
              <span className="home-story-index">0{index + 1}</span>
              <div>
                <Link href={`/posts/${post.slug}`} className="secondary-story-link">
                  <h3>{post.title}</h3>
                </Link>
                {post.excerpt && <p>{post.excerpt}…</p>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-signals">
        {SIGNALS.map((signal) => (
          <article key={signal.label} className="signal-card">
            <p className="posts-kicker">{signal.label}</p>
            <p>{signal.body}</p>
          </article>
        ))}
      </section>

      <section className="home-archive-strip">
        <div className="home-archive-header">
          <p className="posts-kicker">Notebook</p>
          <h2>More organisms, more mechanisms, more prototypes.</h2>
        </div>
        <div className="home-archive-list">
          {archive.map((post) => (
            <article key={post.slug} className="home-archive-entry">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="home-manifesto">
        <div className="home-manifesto-copy">
          <p className="posts-kicker">About the journal</p>
          <h2>Biomimicry is not moodboarding nature. It is reverse-engineering survival.</h2>
        </div>
        <div className="home-manifesto-body">
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
    </>
  );
}

