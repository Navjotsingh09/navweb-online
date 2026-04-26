import { PostMeta } from './posts';

/**
 * Estimate reading time in minutes based on word count.
 * Assumes average reading speed of 200 words per minute.
 */
export function getReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Find posts related by shared tags.
 * Excludes the current post and returns up to `limit` results.
 */
export function findRelatedPosts(
  currentSlug: string,
  allPosts: PostMeta[],
  currentTags: string[],
  limit: number = 3
): PostMeta[] {
  if (!currentTags.length) return [];

  const scored = allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((post) => {
      const sharedTags = post.tags.filter((t) => currentTags.includes(t));
      return { post, score: sharedTags.length };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ post }) => post);
}

/**
 * Get all unique tags from posts.
 */
export function getAllTags(posts: PostMeta[]): string[] {
  const tags = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

/**
 * Filter posts by tag(s).
 */
export function filterPostsByTag(
  posts: PostMeta[],
  selectedTags: string[]
): PostMeta[] {
  if (!selectedTags.length) return posts;
  return posts.filter((p) =>
    selectedTags.some((tag) => p.tags.includes(tag))
  );
}
