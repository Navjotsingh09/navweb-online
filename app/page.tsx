import Link from "next/link";
import { listPosts } from "@/lib/posts";

const FEATURES = [
  {
    icon: "🔬",
    title: "Research-first",
    body: "Every post sources at least 5 peer-reviewed papers, university press, or primary science publications. No SEO filler.",
  },
  {
    icon: "🌿",
    title: "Nature → Engineering",
    body: "We trace the full arc: organism → biological mechanism → prototype → real product. Always specific, always cited.",
  },
  {
    icon: "🤖",
    title: "Autonomous agent",
    body: "Posts are drafted by the Biomimicry Blogger, a VS Code agent that researches, writes, and quality-checks every piece.",
  },
  {
    icon: "💬",
    title: "Moderated comments",
    body: "Reader comments go through an automated moderation cycle every 2 hours so conversations stay substantive.",
  },
];

const EXAMPLES = [
  { headline: "How the Namib Beetle's Back Pulls Water from Fog", tags: ["biomimicry", "water-harvesting", "materials"] },
  { headline: "Termite Mounds and the Buildings That Breathe Like Them", tags: ["biomimicry", "architecture", "HVAC"] },
  { headline: "Gecko Adhesion: From Setae to Reusable Tape", tags: ["biomimicry", "adhesives", "nanotechnology"] },
];

export default function HomePage() {
  const posts = listPosts();
  const hasPosts = posts.length > 0;

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <p className="hero-eyebrow">Biomimicry &amp; Innovation</p>
        <h1 className="hero-headline">
          3.8 billion years of R&amp;D,<br />
          open source.
        </h1>
        <p className="hero-sub">
          Nav Web Online publishes deep-dive essays on how living systems — beetles,
          termites, sharks, fungi — are quietly rewriting engineering, architecture,
          computing, and medicine.
        </p>
        {hasPosts ? (
          <Link href="#posts" className="btn-primary">Read the latest</Link>
        ) : (
          <span className="btn-primary btn-muted">First posts coming soon</span>
        )}
      </section>

      {/* ── Feature grid ── */}
      <section className="features-section">
        <ul className="features-grid">
          {FEATURES.map((f) => (
            <li key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-body">{f.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Posts or preview ── */}
      <section id="posts" className="posts-section">
        <h2 className="section-heading">
          {hasPosts ? "Latest essays" : "What to expect"}
        </h2>

        {hasPosts ? (
          <ul className="post-list">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/posts/${p.slug}`}>
                  <h2>{p.title}</h2>
                </Link>
                {p.date && <time dateTime={p.date}>{p.date}</time>}
                {p.excerpt && <p>{p.excerpt}…</p>}
                {p.tags.length > 0 && (
                  <ul className="tags">
                    {p.tags.map((t) => (
                      <li key={t}>#{t}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="preview-list">
            {EXAMPLES.map((e) => (
              <li key={e.headline} className="preview-card">
                <h3 className="preview-headline">{e.headline}</h3>
                <ul className="tags">
                  {e.tags.map((t) => <li key={t}>#{t}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── About strip ── */}
      <section className="about-strip">
        <div className="about-inner">
          <h2>What is biomimicry?</h2>
          <p>
            Biomimicry is the practice of studying nature's time-tested patterns
            and strategies, then emulating those designs to solve human challenges.
            Selection pressure over millions of generations has produced solutions
            that are energy-efficient, durable, and self-repairing — qualities
            engineers spend careers trying to replicate.
          </p>
          <p>
            Nav Web Online exists to close the gap between biology papers and
            engineering practice. Each essay is written to be read by a curious
            technologist, not just an academic.
          </p>
        </div>
      </section>
    </>
  );
}

