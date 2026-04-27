import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const MAX_EMAIL_LEN = 254;
const MAX_TOPICS = 12;
const MAX_TOPIC_LEN = 60;
// RFC 5322-lite — good enough for capture, server is the gate.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { email, topics } = payload as { email?: unknown; topics?: unknown };

  if (typeof email !== "string") {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }
  const emailNormalized = email.trim().toLowerCase().slice(0, MAX_EMAIL_LEN);
  if (!EMAIL_RE.test(emailNormalized)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!Array.isArray(topics) || topics.length === 0) {
    return NextResponse.json(
      { error: "Please choose at least one topic to subscribe to." },
      { status: 400 }
    );
  }

  const cleanTopics = Array.from(
    new Set(
      topics
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.trim().slice(0, MAX_TOPIC_LEN))
        .filter((t) => t.length > 0)
    )
  ).slice(0, MAX_TOPICS);

  if (cleanTopics.length === 0) {
    return NextResponse.json(
      { error: "Please choose at least one valid topic." },
      { status: 400 }
    );
  }

  try {
    const db = getFirestore();
    const docId = Buffer.from(emailNormalized).toString("base64url");
    const ref = db.collection("subscribers").doc(docId);
    const existing = await ref.get();

    if (existing.exists) {
      const prev = existing.data() ?? {};
      const prevTopics = Array.isArray(prev.topics) ? (prev.topics as string[]) : [];
      const merged = Array.from(new Set([...prevTopics, ...cleanTopics])).slice(0, MAX_TOPICS);
      await ref.update({
        topics: merged,
        updatedAt: FieldValue.serverTimestamp(),
        unsubscribedAt: null,
      });
      return NextResponse.json({ status: "updated", topics: merged });
    }

    await ref.set({
      email: emailNormalized,
      topics: cleanTopics,
      status: "active",
      source: "footer",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      unsubscribedAt: null,
    });

    return NextResponse.json({ status: "created", topics: cleanTopics }, { status: 201 });
  } catch (err) {
    console.error("[subscribe POST]", err);
    return NextResponse.json({ error: "Failed to save subscription. Try again." }, { status: 500 });
  }
}
