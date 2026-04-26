import { listPosts } from '@/lib/posts';

export default function PostsPage() {
  const posts = listPosts();

  return (
    <div className="container posts-page">
      <div className="posts-header">
        <h1>Essays on biomimicry &amp; innovation</h1>
        <p>{posts.length} posts</p>
      </div>

      {posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map((post) => (
            <article key={post.slug} className="post-card">
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </article>
          ))}
        </div>
      ) : (
        <p>No posts found</p>
      )}
    </div>
  );
}
