import { notFound } from "next/navigation";
import { getPost, listPostSlugs } from "@/lib/posts";
import { resolveUnsplashImages } from "@/lib/unsplash";
import type { AgentImage } from "@/lib/unsplash";
import fs from "node:fs";
import path from "node:path";

export async function generateStaticParams() {
  return listPostSlugs().map((slug) => ({ slug }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://navweb-online.vercel.app";

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

  return (
    <article className="post">
      <header>
        <h1>{post.title}</h1>
        {post.date && <time dateTime={post.date}>{post.date}</time>}
        {post.tags.length > 0 && (
          <ul className="tags">
            {post.tags.map((t) => (
              <li key={t}>#{t}</li>
            ))}
          </ul>
        )}
      </header>
      {heroImage && (
        <figure className="hero-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImage.url} alt={heroImage.credit} />
          <figcaption>
            <a href={heroImage.credit_url} target="_blank" rel="noopener noreferrer">
              {heroImage.credit}
            </a>
          </figcaption>
        </figure>
      )}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}
