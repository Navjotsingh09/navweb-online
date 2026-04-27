import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export type PostSource = {
  label: string;
  url: string;
  type?: "primary" | "secondary" | "video" | "docs" | "opinion";
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt?: string;
  coverImage?: string;
  coverAlt?: string;
  youtubeUrl?: string;
  truth?: number;
  sources?: PostSource[];
};

export type Post = PostMeta & {
  html: string;
  raw: string;
  dateModified?: string;
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

function parseSources(input: unknown): PostSource[] | undefined {
  if (!Array.isArray(input)) return undefined;
  const out: PostSource[] = [];
  for (const item of input) {
    if (item && typeof item === "object" && "url" in item) {
      const obj = item as { label?: unknown; url?: unknown; type?: unknown };
      if (typeof obj.url === "string" && obj.url.trim()) {
        out.push({
          label: typeof obj.label === "string" && obj.label.trim() ? obj.label : obj.url,
          url: obj.url,
          type:
            typeof obj.type === "string" &&
            ["primary", "secondary", "video", "docs", "opinion"].includes(obj.type)
              ? (obj.type as PostSource["type"])
              : undefined,
        });
      }
    }
  }
  return out.length ? out : undefined;
}

function parseTruth(input: unknown): number | undefined {
  const n = typeof input === "number" ? input : Number(input);
  if (!Number.isFinite(n)) return undefined;
  return Math.max(0, Math.min(100, Math.round(n)));
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
        truth: parseTruth(data.truth),
        sources: parseSources(data.sources),
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
  const stat = fs.statSync(file);
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
    youtubeUrl: buildYouTubeUrl(String(data.title ?? slug), Array.isArray(data.tags) ? data.tags.map(String) : []),
    truth: parseTruth(data.truth),
    sources: parseSources(data.sources),
    html,
    raw: contentWithoutLeadImage,
    dateModified: new Date(stat.mtimeMs).toISOString(),
  };
}
