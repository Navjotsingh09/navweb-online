import { notFound } from "next/navigation";
import { getPost, listPostSlugs } from "@/lib/posts";

export async function generateStaticParams() {
  return listPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return { title: `${post.title} — Nav Web Online` };
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
