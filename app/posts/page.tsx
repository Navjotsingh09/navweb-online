import type { Metadata } from 'next';
import { listPosts } from '@/lib/posts';
import { PostsFilter } from './posts-filter';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.navweb.online';

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

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Essays — Nav Web Online',
    url: `${SITE_URL}/posts`,
    inLanguage: 'en-GB',
    isPartOf: { '@type': 'WebSite', name: 'Nav Web Online', url: SITE_URL },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Essays', item: `${SITE_URL}/posts` },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 50).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/posts/${p.slug}`,
        name: p.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <PostsFilter posts={posts} />
    </>
  );
}
