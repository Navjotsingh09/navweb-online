import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, listPostSlugs, listPosts } from "@/lib/posts";
import { resolveUnsplashImages } from "@/lib/unsplash";
import type { AgentImage } from "@/lib/unsplash";
import Comments from "@/components/Comments";
import ListenButton from "@/components/ListenButton";
import AudioPlayer from "@/components/AudioPlayer";
import { findRelatedPosts, getReadingTime } from "@/lib/post-utils";
import fs from "node:fs";
import path from "node:path";

export async function generateStaticParams() {
  return listPostSlugs().map((slug) => ({ slug }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.navweb.online";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const postUrl = `${SITE_URL}/posts/${slug}`;
  const rawExcerpt = post.raw
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/^#.*$/gm, "")
    .replace(/[#*`>\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  // Trim to ~155 chars on a word boundary for clean SERP snippets
  const excerpt =
    rawExcerpt.length > 155
      ? rawExcerpt.slice(0, 155).replace(/\s+\S*$/, "") + "\u2026"
      : rawExcerpt;

  return {
    title: post.title,
    description: excerpt,
    keywords: post.tags?.length ? [...post.tags, "biomimicry", "bio-inspired design"] : undefined,
    alternates: { canonical: postUrl },
    openGraph: {
      type: "article",
      title: post.title,
      description: excerpt,
      url: postUrl,
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: excerpt,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // Load hero image from agent JSON sidecar if present
  let heroImage: { url: string; thumb: string; credit: string; credit_url: string } | null = null;
  const sidecarPath = path.join(process.cwd(), "content", "posts", `${slug}.json`);
  if (fs.existsSync(sidecarPath)) {
    try {
      const sidecar = JSON.parse(fs.readFileSync(sidecarPath, "utf8")) as {
        images?: AgentImage[];
      };
      const naturalImages = (sidecar.images ?? []).filter(
        (img) => img.subject === "natural_system"
      );
      if (naturalImages.length > 0) {
        const resolved = await resolveUnsplashImages([naturalImages[0]]);
        if (resolved[0]?.url) heroImage = resolved[0];
      }
    } catch {
      // sidecar malformed — skip hero image
    }
  }

  const allPosts = listPosts();
  const relatedPosts = findRelatedPosts(slug, allPosts, post.tags, 3);
  const excerpt = post.raw
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/^#.*$/gm, "")
    .replace(/[#*`>\[\]]/g, "")
    .trim()
    .split(/\n\s*\n/)[0]
    ?.slice(0, 260);

  const narrationText = post.raw
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`>]/g, "")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{2,}/g, ". ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return (
    <div className="post-page-shell">
      <article className="post-page-grid">
        <aside className="post-sidebar">
          <Link href="/posts" className="post-back-link">← Back to archive</Link>
          <div className="post-sidebar-block">
            <span className="post-sidebar-label">Published</span>
            <strong>
              {post.date
                ? new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Undated"}
            </strong>
          </div>
          <div className="post-sidebar-block">
            <span className="post-sidebar-label">Reading time</span>
            <strong>{getReadingTime(post.raw)} min</strong>
          </div>
          {post.youtubeUrl && (
            <div className="post-sidebar-block">
              <span className="post-sidebar-label">Video</span>
              <a
                href={post.youtubeUrl}
                className="post-youtube-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch on YouTube
              </a>
            </div>
          )}
          {post.tags.length > 0 && (
            <div className="post-sidebar-block">
              <span className="post-sidebar-label">Topics</span>
              <ul className="tags post-sidebar-tags">
                {post.tags.map((t) => (
                  <li key={t}>#{t}</li>
                ))}
              </ul>
            </div>
          )}
          {typeof post.truth === "number" && (
            <div className="post-sidebar-block truth-block">
              <span className="post-sidebar-label">Truth score</span>
              <div className="truth-meter" aria-label={`Truth score ${post.truth} percent`}>
                <div
                  className="truth-meter-fill"
                  style={{
                    width: `${post.truth}%`,
                    background:
                      post.truth >= 80
                        ? "#2f8f5e"
                        : post.truth >= 60
                        ? "#c9a55a"
                        : "#c97a4a",
                  }}
                />
              </div>
              <strong className="truth-value">{post.truth}% verifiable</strong>
              <p className="truth-note">
                Share of claims directly traceable to a cited source. The remainder is
                framing, opinion, or illustrative scenario.
              </p>
            </div>
          )}
          {post.sources && post.sources.length > 0 && (
            <div className="post-sidebar-block">
              <span className="post-sidebar-label">Sources</span>
              <ul className="post-sources">
                {post.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                    {s.type && <span className="source-type"> · {s.type}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="post-sidebar-block">
            <span className="post-sidebar-label">Listen</span>
            {fs.existsSync(path.join(process.cwd(), "public", "audio", `${slug}.mp3`)) ? (
              <AudioPlayer src={`/audio/${slug}.mp3`} />
            ) : (
              <ListenButton title={post.title} text={narrationText} />
            )}
          </div>
        </aside>

        <div className="post-main">
          <header className="post-hero">
            <p className="posts-kicker">Essay / Biomimicry archive</p>
            <h1>{post.title}</h1>
            {excerpt && <p className="post-dek">{excerpt}…</p>}
          </header>

          {(heroImage || post.coverImage) && (
            <figure className="hero-image editorial-hero-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage?.url || post.coverImage || ""} alt={post.coverAlt || post.title} />
              {heroImage?.credit_url && heroImage.credit && (
                <figcaption>
                  <a href={heroImage.credit_url} target="_blank" rel="noopener noreferrer">
                    Image: {heroImage.credit}
                  </a>
                </figcaption>
              )}
            </figure>
          )}

          <div className="prose editorial-prose" dangerouslySetInnerHTML={{ __html: post.html }} />

          <aside className="editorial-disclaimer" role="note" aria-label="Editorial note">
            <strong>Editorial note.</strong> This essay is opinion and synthesis — original
            commentary connecting publicly available facts about real products to broader
            patterns. It is not peer-reviewed research. Specific scenarios, dialogue, and
            illustrative numbers are scene-setting unless a citation is provided. Where a
            source link appears, please follow it for the underlying claim.
          </aside>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                description: excerpt,
                datePublished: post.date,
                dateModified: post.date,
                author: { "@type": "Organization", name: "Navweb.Online" },
                publisher: {
                  "@type": "Organization",
                  name: "Navweb.Online",
                  url: SITE_URL,
                  logo: { "@type": "ImageObject", url: `${SITE_URL}/og-default.png` },
                },
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `${SITE_URL}/posts/${slug}`,
                },
                image: [heroImage?.url || post.coverImage || `${SITE_URL}/og-default.png`],
                keywords: post.tags.join(", "),
              }),
            }}
          />

          {relatedPosts.length > 0 && (
            <section className="related-posts">
              <h2>Related essays</h2>
              <div className="related-posts-grid">
                {relatedPosts.map((relPost) => (
                  <article key={relPost.slug} className="related-post-card">
                    <Link href={`/posts/${relPost.slug}`}>
                      <h3>{relPost.title}</h3>
                    </Link>
                    <div className="related-post-meta">
                      {relPost.date && (
                        <time dateTime={relPost.date}>
                          {new Date(relPost.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      )}
                      {relPost.date && <span className="meta-divider">·</span>}
                      <span>{getReadingTime(relPost.excerpt || "")} min</span>
                    </div>
                    {relPost.excerpt && <p>{relPost.excerpt}…</p>}
                    <Link href={`/posts/${relPost.slug}`} className="related-read-link">
                      Read →
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          <Comments postSlug={slug} />
        </div>
      </article>
    </div>
  );
}
