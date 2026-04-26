import Link from "next/link";
import { listPosts } from "@/lib/posts";

const FEATURES = [
  {
    icon: "○",
    title: "Research-first",
    body: "Every post sources at least 5 peer-reviewed papers, university press releases, or primary science publications. No SEO filler.",
  },
  {
    icon: "→",
    title: "Nature → Engineering",
    body: "We trace the full arc: organism → biological mechanism → prototype → real product. Always specific, always cited.",
  },
  {
    icon: "◈",
    title: "AI-drafted content",
    body: "Posts are drafted by the Biomimicry Blogger, a VS Code agent that researches, writes, and quality-checks every piece.",
  },
  {
    icon: "◻",
    title: "Moderated comments",
    body: "Reader comments go through an automated moderation pass every 2 hours — conversations stay substantive and spam-free.",
  },
];

const STATS = [
  { value: "5+", label: "Sources per post" },
  { value: "1500–2000", label: "Words, rigorously edited" },
  { value: "2 hr", label: "Comment moderation cycle" },
];

const EXAMPLES = [
  {
    headline: "How the Namib Beetle's Back Pulls Water from Fog",
    excerpt: "A 15 mm beetle has inspired water-collection meshes deployed in arid regions — the secret is in alternating hydrophilic bumps and waxy troughs.",
    tags: ["biomimicry", "water-harvesting", "materials"],
  },
  {
    headline: "Termite Mounds and the Buildings That Breathe Like Them",
    excerpt: "The Eastgate Centre in Harare stays cool without central air conditioning, drawing directly on the passive ventilation strategy of Macrotermes michaelseni.",
    tags: ["biomimicry", "architecture", "HVAC"],
  },
  {
    headline: "Gecko Adhesion: From Setae to Reusable Tape",
    excerpt: "Van der Waals forces across millions of nanoscale setae let geckos stick to glass. Researchers at Stanford turned the principle into a climbing suit.",
    tags: ["biomimicry", "adhesives", "nanotechnology"],
  },
];

export default function HomePage() {
  const posts = listPosts();
  const hasPosts = posts.length > 0;

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">Biomimicry &amp; Innovation</p>
          <h1 className="hero-headline">
            3.8 billion years of R&amp;D,<br />
            open source.          
          </h1>
          <p className="hero-sub">
            Deep-dive essays on how living systems — beetles, termites, sharks,
            fungi — are quietly rewriting engineering, architecture, computing,
            and medicine.
          </p>
          {hasPosts ? (
            <Link href="#posts" className="btn-primary">Read the latest</Link>
          ) : (
            <>
              <span className="btn-primary btn-muted">First posts coming soon</span>
              <p className="hero-hint">The agent is warming up — check back shortly.</p>
            </>
          )}
        </div>
        <ul className="hero-stats">
          {STATS.map((s) => (
            <li key={s.label}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </li>
          ))}
        </ul>
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
                <span className="preview-badge">Coming soon</span>
                <h3 className="preview-headline">{e.headline}</h3>
                <p className="preview-excerpt">{e.excerpt}</p>
                <ul className="tags">
                  {e.tags.map((t) => <li key={t}>#{t}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── About strip ── */}
      <section id="about" className="about-strip">
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
            engineering practice. Each essay is written to be understood by a curious
            technologist, not just a specialist.
          </p>
        </div>
      </section>
    </>
  );
}

