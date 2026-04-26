import Link from "next/link";
import { listPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = listPosts();
  return (
    <section>
      <h1>Lessons from 3.8 billion years of R&amp;D</h1>
      <p className="lede">
        Nav Web Online explores how living systems shape the next generation of
        technology — from gecko-inspired adhesives to termite-mound HVAC.
      </p>

      {posts.length === 0 ? (
        <p className="empty">
          No posts yet. Generate one with the <code>Biomimicry Blogger</code> agent
          (<code>.github/agents/biomimicry-blogger.agent.md</code>) — it writes to
          <code> content/posts/&lt;slug&gt;.md</code>.
        </p>
      ) : (
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
      )}
    </section>
  );
}
