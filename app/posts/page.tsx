'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';
import { getAllTags, filterPostsByTag, getReadingTime } from '@/lib/post-utils';

interface PostsPageProps {
  posts: PostMeta[];
}

function PostsPageClient({ posts }: PostsPageProps) {
  const allTags = getAllTags(posts);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredPosts = useMemo(
    () => filterPostsByTag(posts, selectedTags),
    [selectedTags]
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => setSelectedTags([]);

  return (
    <div className="container posts-page">
      {/* ── Page header ── */}
      <div className="posts-header">
        <h1>Essays on biomimicry &amp; innovation</h1>
        <p>
          {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}{' '}
          {selectedTags.length > 0 && `matching ${selectedTags.join(', ')}`}
        </p>
      </div>

      {/* ── Tag filters ── */}
      <div className="filters-bar">
        <div className="filter-tags">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`filter-tag ${selectedTags.includes(tag) ? 'active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <button className="filter-clear" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {/* ── Posts grid ── */}
      {filteredPosts.length > 0 ? (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <article key={post.slug} className="post-card">
              <Link href={`/posts/${post.slug}`}>
                <h2 className="post-card-title">{post.title}</h2>
              </Link>
              
              <div className="post-card-meta">
                {post.date && (
                  <time dateTime={post.date} className="post-date">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                )}
                <span className="post-divider">·</span>
                <span className="post-reading-time">
                  {getReadingTime(post.excerpt || '')} min read
                </span>
              </div>

              {post.excerpt && <p className="post-card-excerpt">{post.excerpt}…</p>}

              {post.tags.length > 0 && (
                <ul className="post-card-tags">
                  {post.tags.map((tag) => (
                    <li key={tag}>
                      <button
                        className="tag-link"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!selectedTags.includes(tag)) {
                            setSelectedTags([...selectedTags, tag]);
                          }
                        }}
                      >
                        #{tag}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="post-card-footer">
                <Link href={`/posts/${post.slug}`} className="read-link">
                  Read →
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="posts-empty">
          <p>No posts match those filters. Try clearing them.</p>
          <button className="btn-primary" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

// Server component that fetches data
export default function PostsPage() {
  // Dynamic import of server-only function
  const { listPosts } = require('@/lib/posts');
  const posts = listPosts();

  return <PostsPageClient posts={posts} />;
}
