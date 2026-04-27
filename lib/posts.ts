import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt?: string;
  coverImage?: string;
  coverAlt?: string;
  youtubeUrl?: string;
};

export type Post = PostMeta & {
  html: string;
  raw: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const FIRST_IMAGE_RE = /!\[([^\]]*)\]\((\/images\/[^)]+)\)/;

function extractFirstImage(markdown: string): { alt: string; src: string } | null {
  const match = markdown.match(FIRST_IMAGE_RE);
  if (!match) return null;
  return { alt: match[1], src: match[2] };
}

function stripFirstImage(markdown: string): string {
  return markdown.replace(FIRST_IMAGE_RE, "").trim();
}

function buildYouTubeUrl(title: string, tags: string[]): string {
  const query = `${title} ${tags.join(" ")} biomimicry`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function ensureDir(): void {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
}

export function listPostSlugs(): string[] {
  ensureDir();
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function listPosts(): PostMeta[] {
  return listPostSlugs()
    .map((slug) => {
      const filePath = path.join(POSTS_DIR, `${slug}.md`);
      const raw = fs.readFileSync(filePath, "utf8");
      const mtimeMs = fs.statSync(filePath).mtimeMs;
      const { data, content } = matter(raw);
      const cover = extractFirstImage(content);
      const contentWithoutLeadImage = stripFirstImage(content);
      const excerpt = contentWithoutLeadImage
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
        .replace(/^#.*$/gm, "")
        .trim()
        .split(/\n\s*\n/)[0]
        ?.slice(0, 220);
      return {
        slug,
        title: String(data.title ?? slug),
        date: String(data.date ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        excerpt,
        coverImage: cover?.src,
        coverAlt: cover?.alt,
        youtubeUrl: buildYouTubeUrl(String(data.title ?? slug), Array.isArray(data.tags) ? data.tags.map(String) : []),
        _mtimeMs: mtimeMs,
      };
    })
    .sort((a, b) => {
      const dateA = Date.parse(a.date);
      const dateB = Date.parse(b.date);

      if (!Number.isNaN(dateA) && !Number.isNaN(dateB) && dateA !== dateB) {
        return dateB - dateA;
      }

      if ((b as { _mtimeMs?: number })._mtimeMs !== (a as { _mtimeMs?: number })._mtimeMs) {
        return ((b as { _mtimeMs?: number })._mtimeMs ?? 0) - ((a as { _mtimeMs?: number })._mtimeMs ?? 0);
      }

      return b.slug.localeCompare(a.slug);
    })
    .map(({ _mtimeMs, ...post }) => post as PostMeta);
}

export async function getPost(slug: string): Promise<Post | null> {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const cover = extractFirstImage(content);
  const contentWithoutLeadImage = stripFirstImage(content);
  const google07d1bd997931541c (1)html = String(
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(contentWithoutLeadImage),
  );
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    coverImage: cover?.src,
    coverAlt: cover?.alt,
    youtubeUrl: buildYouTubeUrl(String(data.title ?? slug), Array.isArray(data.tags) ? data.tags.map(String) : []),
    html,
    raw: contentWithoutLeadImage,
  };
}
