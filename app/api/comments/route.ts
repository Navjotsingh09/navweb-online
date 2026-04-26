import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const MAX_AUTHOR_LEN = 80;
const MAX_BODY_LEN = 2000;
const MIN_BODY_LEN = 10;

// GET /api/comments?slug=<postSlug>
// Returns all approved comments for a post, newest first.
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
  }

  try {
    const db = getFirestore();
    const snap = await db
      .collection("comments")
      .where("postSlug", "==", slug)
      .where("status", "==", "approved")
      .orderBy("createdAt", "desc")
      .get();

    const comments = snap.docs.map((doc: any) => {
      const d = doc.data();
      return {
        id: doc.id,
        author: d.author as string,
        body: d.body as string,
        createdAt: (d.createdAt as { toDate?: () => Date } | null)?.toDate?.()?.toISOString() ?? null,
      };
    });

    return NextResponse.json({ comments });
  } catch (err) {
    console.error("[comments GET]", err);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST /api/comments
// Body: { postSlug, author, body }
// Creates a new comment with status "pending".
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).postSlug !== "string" ||
    typeof (body as Record<string, unknown>).author !== "string" ||
    typeof (body as Record<string, unknown>).body !== "string"
  ) {
    return NextResponse.json(
      { error: "Required fields: postSlug (string), author (string), body (string)" },
      { status: 400 }
    );
  }

  const { postSlug, author, body: commentBody } = body as Record<string, string>;

  // Input validation
  const authorTrimmed = author.trim().slice(0, MAX_AUTHOR_LEN);
  const bodyTrimmed = commentBody.trim().slice(0, MAX_BODY_LEN);
  const slugTrimmed = postSlug.trim();

  if (!slugTrimmed || !/^[a-z0-9-]+$/.test(slugTrimmed)) {
    return NextResponse.json({ error: "Invalid postSlug" }, { status: 400 });
  }
  if (authorTrimmed.length === 0) {
    return NextResponse.json({ error: "author is required" }, { status: 400 });
  }
  if (bodyTrimmed.length < MIN_BODY_LEN) {
    return NextResponse.json(
      { error: `Comment body must be at least ${MIN_BODY_LEN} characters` },
      { status: 400 }
    );
  }

  try {
    const db = getFirestore();
    const ref = await db.collection("comments").add({
      postSlug: slugTrimmed,
      author: authorTrimmed,
      body: bodyTrimmed,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      moderatedAt: null,
      reason: null,
    });

    return NextResponse.json({ id: ref.id, status: "pending" }, { status: 201 });
  } catch (err) {
    console.error("[comments POST]", err);
    return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
  }
}
