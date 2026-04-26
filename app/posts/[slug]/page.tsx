import { notFound } from "next/navigation";
import { getPost, listPostSlugs } from "@/lib/posts";

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
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </article>
  );
}
