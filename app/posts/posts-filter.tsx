'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';
import { getAllTags, filterPostsByTag, getReadingTime } from '@/lib/post-utils';

export function PostsFilter({ posts }: { posts: PostMeta[] }) {
  const allTags = getAllTags(posts);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredPosts = useMemo(
    () => filterPostsByTag(posts, selectedTags),
    [selectedTags]
  );

  const featuredPost = filteredPosts[0];
  const secondaryPosts = filteredPosts.slice(1, 4);
  const archivePosts = filteredPosts.slice(4);

  const formatDate = (date: string) => {
    const target = new Date(date);
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor((now.getTime() - target.getTime()) / dayMs);

    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return target.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

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
      {filteredPosts.length > 0 ? (
        <>
          <section className="posts-masthead">
            <div className="posts-masthead-copy">
              <p className="posts-kicker">Journal / Biomimicry archive</p>
              <h1>Field notes from nature, translated into engineering.</h1>
              <p className="posts-intro">
                A slower-reading collection of case studies on organisms, mechanisms,
                prototypes, and the design decisions humans borrow from living systems.
              </p>
            </div>

            <aside className="posts-ledger">
              <div className="posts-ledger-row">
                <span>Issue</span>
                <strong>Vol. 01</strong>
              </div>
              <div className="posts-ledger-row">
                <span>Archive</span>
                <strong>{filteredPosts.length} essays</strong>
              </div>
              <div className="posts-ledger-row">
                <span>Focus</span>
                <strong>
                  {selectedTags.length > 0 ? selectedTags.join(', ') : 'Open index'}
                </strong>
              </div>
            </aside>
          </section>

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
                Reset issue filter
              </button>
            )}
          </div>

          <section className="posts-journal-grid">
            {featuredPost && (
              <article className="lead-story">
                <p className="story-label">Featured essay</p>
                <Link href={`/posts/${featuredPost.slug}`} className="lead-story-link">
                  <h2>{featuredPost.title}</h2>
                </Link>
                <div className="lead-story-meta">
                  <time dateTime={featuredPost.date}>{formatDate(featuredPost.date)}</time>
                  <span>·</span>
                  <span>{getReadingTime(featuredPost.excerpt || '')} min read</span>
                </div>
                {featuredPost.excerpt && (
                  <p className="lead-story-excerpt">{featuredPost.excerpt}</p>
                )}
                {featuredPost.tags.length > 0 && (
                  <ul className="post-card-tags lead-story-tags">
                    {featuredPost.tags.map((tag) => (
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
                <div className="lead-story-actions">
                  <Link href={`/posts/${featuredPost.slug}`} className="read-link lead-read-link">
                    Read the full essay
                  </Link>
                  {featuredPost.youtubeUrl && (
                    <a
                      href={featuredPost.youtubeUrl}
                      className="read-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch on YouTube
                    </a>
                  )}
                </div>
              </article>
            )}

            <div className="secondary-stories">
              {secondaryPosts.map((post) => (
                <article key={post.slug} className="secondary-story">
                  <Link href={`/posts/${post.slug}`} className="secondary-story-link">
                    <h3>{post.title}</h3>
                  </Link>
                  <div className="post-card-meta secondary-story-meta">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span className="post-divider">·</span>
                    <span>{getReadingTime(post.excerpt || '')} min read</span>
                  </div>
                  {post.excerpt && <p className="post-card-excerpt">{post.excerpt}</p>}
                  <div className="secondary-story-actions">
                    <Link href={`/posts/${post.slug}`} className="read-link">Read essay →</Link>
                    {post.youtubeUrl && (
                      <a
                        href={post.youtubeUrl}
                        className="read-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        YouTube →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {archivePosts.length > 0 && (
            <section className="posts-archive">
              <div className="posts-archive-heading">
                <p className="posts-kicker">Archive</p>
                <h2>More essays in the notebook</h2>
              </div>

              <div className="archive-list">
                {archivePosts.map((post) => (
                  <article key={post.slug} className="archive-entry">
                    <div className="archive-entry-date">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </div>
                    <div className="archive-entry-body">
                      <Link href={`/posts/${post.slug}`} className="archive-entry-link">
                        <h3>{post.title}</h3>
                      </Link>
                      {post.excerpt && <p>{post.excerpt}</p>}
                    </div>
                    <div className="archive-entry-meta">
                      <span>{getReadingTime(post.excerpt || '')} min</span>
                      <Link href={`/posts/${post.slug}`} className="read-link">
                        Read essay →
                      </Link>
                      {post.youtubeUrl && (
                        <a
                          href={post.youtubeUrl}
                          className="read-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          YouTube →
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
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
