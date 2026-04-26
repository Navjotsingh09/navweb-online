import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, listPostSlugs, listPosts } from "@/lib/posts";
import { resolveUnsplashImages } from "@/lib/unsplash";
import type { AgentImage } from "@/lib/unsplash";
import Comments from "@/components/Comments";
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
  const excerpt = post.raw
    .replace(/^#.*$/gm, "")
    .replace(/[#*`>\[\]]/g, "")
    .trim()
    .split(/\n\s*\n/)[0]
    ?.slice(0, 200);

  return {
    title: post.title,
    description: excerpt,
    alternates: { canonical: postUrl },
    openGraph: {
      type: "article",
      title: post.title,
      description: excerpt,
      url: postUrl,
      publishedTime: post.date,
      tags: post.tags,
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: excerpt,
      images: ["/og-default.png"],
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
    .replace(/^#.*$/gm, "")
    .replace(/[#*`>\[\]]/g, "")
    .trim()
    .split(/\n\s*\n/)[0]
    ?.slice(0, 260);

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
        </aside>

        <div className="post-main">
          <header className="post-hero">
            <p className="posts-kicker">Essay / Biomimicry archive</p>
            <h1>{post.title}</h1>
            {excerpt && <p className="post-dek">{excerpt}…</p>}
          </header>

          {heroImage && (
            <figure className="hero-image editorial-hero-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage.url} alt={post.title} />
              <figcaption>
                <a href={heroImage.credit_url} target="_blank" rel="noopener noreferrer">
                  Image: {heroImage.credit}
                </a>
              </figcaption>
            </figure>
          )}

          <div className="prose editorial-prose" dangerouslySetInnerHTML={{ __html: post.html }} />

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
