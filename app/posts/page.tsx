import { listPosts } from '@/lib/posts';
import { PostsFilter } from './posts-filter';

export default function PostsPage() {
  const posts = listPosts();
  return <PostsFilter posts={posts} />;
}
