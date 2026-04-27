import Link from "next/link";
import type { Metadata } from "next";
import { listPosts, type PostMeta } from "@/lib/posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.navweb.online";

export const metadata: Metadata = {
  title: "Topics — Browse Biomimicry Essays by Subject",
  description:
    "Explore biomimicry and bio-inspired design essays grouped by topic — organisms, mechanisms, materials, and the products they inspire. Discover what nature can teach engineers, designers, and founders.",
  alternates: { canonical: "/topics" },
  openGraph: {
    title: "Topics — Browse Biomimicry Essays by Subject",
    description:
      "Explore biomimicry and bio-inspired design essays grouped by topic — organisms, mechanisms, materials, and the products they inspire.",
    url: "/topics",
    type: "website",
  },
};

function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function TopicsPage() {
  const posts = listPosts();

  const tagMap = new Map<string, PostMeta[]>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const list = tagMap.get(tag) ?? [];
      list.push(post);
      tagMap.set(tag, list);
    }
  }

  const sortedTags = Array.from(tagMap.entries())
    .map(([tag, posts]) => ({ tag, posts, count: posts.length }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  const totalEssays = posts.length;
  const totalTopics = sortedTags.length;

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Topics — Browse Biomimicry Essays by Subject",
    url: `${SITE_URL}/topics`,
    inLanguage: "en-GB",
    isPartOf: { "@type": "WebSite", name: "Nav Web Online", url: SITE_URL },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Topics", item: `${SITE_URL}/topics` },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: sortedTags.length,
      itemListElement: sortedTags.map(({ tag, count }, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: tag,
        url: `${SITE_URL}/topics#${slugifyTag(tag)}`,
        description: `${count} essays on ${tag}`,
      })),
    },
  };

  return (
    <div className="topics-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <header className="topics-hero">
        <p className="topics-kicker">Index</p>
        <h1 className="topics-title">
          <span>Browse essays</span>
          <span className="topics-title-italic">by topic.</span>
        </h1>
        <p className="topics-intro">
          {totalEssays} essays organised across {totalTopics} living topics —
          from biological mechanisms to the engineering they inspire. Pick a
          thread and follow it.
        </p>

        <nav className="topics-jumpbar liquid-glass" aria-label="Jump to topic">
          {sortedTags.map(({ tag, count }) => (
            <a key={tag} href={`#${slugifyTag(tag)}`} className="topics-chip">
              <span>{tag}</span>
              <span className="topics-chip-count">{count}</span>
            </a>
          ))}
        </nav>
      </header>

      <main className="topics-grid">
        {sortedTags.map(({ tag, posts }) => (
          <section
            key={tag}
            id={slugifyTag(tag)}
            className="topic-section"
            aria-labelledby={`heading-${slugifyTag(tag)}`}
          >
            <div className="topic-section-head">
              <h2 className="topic-name" id={`heading-${slugifyTag(tag)}`}>
                {tag}
              </h2>
              <span className="topic-count">
                {posts.length} {posts.length === 1 ? "essay" : "essays"}
              </span>
            </div>
            <ul className="topic-essay-list">
              {posts.map((post) => (
                <li key={post.slug} className="topic-essay-item">
                  <Link href={`/posts/${post.slug}`} className="topic-essay-link">
                    <span className="topic-essay-title">{post.title}</span>
                    {post.excerpt && (
                      <span className="topic-essay-excerpt">
                        {post.excerpt.slice(0, 140)}
                        {post.excerpt.length > 140 ? "…" : ""}
                      </span>
                    )}
                    <span className="topic-essay-meta">
                      {post.tags
                        .filter((t) => t !== tag)
                        .slice(0, 3)
                        .map((t) => (
                          <span key={t} className="topic-essay-tag">
                            {t}
                          </span>
                        ))}
                      <span className="topic-essay-arrow" aria-hidden="true">
                        →
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}
