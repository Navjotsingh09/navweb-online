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
      const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8");
      const { data, content } = matter(raw);
      const cover = extractFirstImage(content);
      const contentWithoutLeadImage = stripFirstImage(content);
      const excerpt = contentWithoutLeadImage
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
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const cover = extractFirstImage(content);
  const contentWithoutLeadImage = stripFirstImage(content);
  const html = String(
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
    html,
    raw: contentWithoutLeadImage,
  };
}
