import { listPosts } from '@/lib/posts';

export default function PostsPage() {
  const posts = listPosts();

  return (
    <div className="container">
      <h1>Essays</h1>
      <p>{posts.length} posts available</p>
      {posts.map((p) => (
        <div key={p.slug} style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h2>{p.title}</h2>
          <p>{p.excerpt}</p>
        </div>
      ))}
    </div>
  );
}
