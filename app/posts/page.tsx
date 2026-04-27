import type { Metadata } from 'next';
import { listPosts } from '@/lib/posts';
import { PostsFilter } from './posts-filter';

export const metadata: Metadata = {
  title: 'All Essays — Biomimicry & Bio-Inspired Design',
  description:
    'The full archive of Nav Web Online essays — every story on biomimicry, bio-inspired engineering, and the natural systems shaping tomorrow\u2019s products. Filter by topic, search by keyword, listen as audio.',
  alternates: { canonical: '/posts' },
  openGraph: {
    title: 'All Essays — Nav Web Online',
    description:
      'Every biomimicry and bio-inspired design essay on Nav Web Online. Filterable, searchable, audio-narrated.',
    url: '/posts',
    type: 'website',
  },
};

export default function PostsPage() {
  const posts = listPosts();

  return <PostsFilter posts={posts} />;
}
