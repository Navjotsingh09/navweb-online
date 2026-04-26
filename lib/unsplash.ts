/**
 * Unsplash image resolver for Nav Web Online.
 *
 * The Biomimicry Blogger agent outputs `images[]` in its JSON bundle, each with:
 *   { subject: "natural_system" | "technology", search_query: string, alt_text: string }
 *
 * This module takes those search queries and resolves them to actual Unsplash URLs.
 *
 * Setup:
 *   1. Create a free Unsplash developer account at https://unsplash.com/developers
 *   2. Register an application → copy the Access Key
 *   3. Add to Vercel env vars:  UNSPLASH_ACCESS_KEY=<your-key>
 *   4. Also add NEXT_PUBLIC_SITE_URL=https://navweb-online.vercel.app (or your domain)
 *
 * Usage (in a Next.js Server Component or API route):
 *   import { resolveUnsplashImages } from "@/lib/unsplash";
 *   const images = await resolveUnsplashImages(agentJson.images);
 */

export type AgentImage = {
  subject: "natural_system" | "technology";
  search_query: string;
  alt_text: string;
};

export type ResolvedImage = AgentImage & {
  url: string;          // full-size URL
  thumb: string;        // 400px thumb URL
  credit: string;       // "Photo by <name> on Unsplash"
  credit_url: string;   // UTM-tagged Unsplash link
};

const UNSPLASH_API = "https://api.unsplash.com";

async function searchOne(query: string, accessKey: string): Promise<{
  url: string;
  thumb: string;
  credit: string;
  credit_url: string;
} | null> {
  const params = new URLSearchParams({
    query,
    per_page: "1",
    orientation: "landscape",
    content_filter: "high",
  });

  const res = await fetch(`${UNSPLASH_API}/search/photos?${params}`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
    next: { revalidate: 86400 }, // cache 24 h in Next.js
  });

  if (!res.ok) return null;

  const data = (await res.json()) as {
    results: Array<{
      urls: { full: string; thumb: string };
      user: { name: string; links: { html: string } };
    }>;
  };

  const photo = data.results[0];
  if (!photo) return null;

  const utm = "?utm_source=navweb_online&utm_medium=referral";
  return {
    url: photo.urls.full,
    thumb: photo.urls.thumb,
    credit: `Photo by ${photo.user.name} on Unsplash`,
    credit_url: `${photo.user.links.html}${utm}`,
  };
}

export async function resolveUnsplashImages(
  images: AgentImage[]
): Promise<ResolvedImage[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.warn("[unsplash] UNSPLASH_ACCESS_KEY not set — skipping image resolution.");
    return images.map((img) => ({
      ...img,
      url: "",
      thumb: "",
      credit: "",
      credit_url: "",
    }));
  }

  const resolved = await Promise.all(
    images.map(async (img): Promise<ResolvedImage> => {
      const photo = await searchOne(img.search_query, accessKey);
      return {
        ...img,
        url: photo?.url ?? "",
        thumb: photo?.thumb ?? "",
        credit: photo?.credit ?? "",
        credit_url: photo?.credit_url ?? "",
      };
    })
  );

  return resolved;
}
