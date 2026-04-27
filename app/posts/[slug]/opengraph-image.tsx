import { ImageResponse } from "next/og";
import { getPost } from "@/lib/posts";

export const runtime = "nodejs";
export const alt = "Navweb.Online essay";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  const title = post?.title ?? "Navweb.Online";
  const tags = post?.tags?.slice(0, 4) ?? [];
  const date = post?.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background:
            "linear-gradient(135deg, #f7f3e8 0%, #ece8dc 60%, #d9d0b4 100%)",
          fontFamily: "Georgia, serif",
          color: "#1c1c1c",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#5a5a5a",
          }}
        >
          Navweb.Online
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 80 ? 56 : 72,
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: -1,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#3a3a3a",
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            {tags.map((t) => (
              <span
                key={t}
                style={{
                  padding: "6px 16px",
                  background: "#ffffffaa",
                  borderRadius: 999,
                  fontSize: 20,
                }}
              >
                #{t}
              </span>
            ))}
          </div>
          <div style={{ display: "flex" }}>{date}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
