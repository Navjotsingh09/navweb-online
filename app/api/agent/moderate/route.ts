/**
 * POST /api/agent/moderate
 *
 * Vercel Cron: runs every 2 hours (configured in vercel.json).
 * Also callable manually: POST with Authorization: Bearer <CRON_SECRET>
 *
 * Reads all "pending" comments from Firestore, applies heuristic moderation,
 * and updates each comment to "approved" or "flagged" with a reason.
 */
import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const SPAM_PHRASES = [
  "buy now",
  "click here",
  "free money",
  "make money fast",
  "work from home",
  "casino",
  "crypto investment",
  "guaranteed returns",
  "limited offer",
  "earn $",
];

const URL_RE = /https?:\/\/|www\.\S+|\S+\.(com|net|org|io|xyz)\b/i;

function runHeuristics(body: string): { action: "approve" | "flag"; reason: string } {
  const lower = body.toLowerCase();

  if (body.length < 10) {
    return { action: "flag", reason: "Comment too short to be substantive." };
  }

  if (URL_RE.test(body)) {
    return { action: "flag", reason: "Comment contains a URL — possible spam." };
  }

  for (const phrase of SPAM_PHRASES) {
    if (lower.includes(phrase)) {
      return { action: "flag", reason: `Contains spam phrase: "${phrase}".` };
    }
  }

  const freq: Record<string, number> = {};
  for (const ch of body.replace(/\s/g, "")) freq[ch] = (freq[ch] ?? 0) + 1;
  const nonSpaceLen = body.replace(/\s/g, "").length;
  if (nonSpaceLen > 0) {
    const maxFreq = Math.max(...Object.values(freq));
    if (maxFreq / nonSpaceLen > 0.95) {
      return { action: "flag", reason: "Comment body appears to be repeated characters." };
    }
  }

  return { action: "approve", reason: "Passed heuristic review." };
}

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const db = getFirestore();
    const snap = await db.collection("comments").where("status", "==", "pending").get();

    if (snap.empty) {
      return NextResponse.json({ moderated: 0, message: "No pending comments." });
    }

    const batch = db.batch();
    const results: Array<{ id: string; action: string; reason: string }> = [];

    for (const doc of snap.docs) {
      const { body } = doc.data() as { body: string };
      const { action, reason } = runHeuristics(body);
      batch.update(doc.ref, {
        status: action === "approve" ? "approved" : "flagged",
        moderatedAt: FieldValue.serverTimestamp(),
        reason,
      });
      results.push({ id: doc.id, action, reason });
    }

    await batch.commit();
    console.log(`[moderate] processed ${results.length} comments`);
    return NextResponse.json({ moderated: results.length, results });
  } catch (err) {
    console.error("[moderate POST]", err);
    return NextResponse.json({ error: "Moderation run failed" }, { status: 500 });
  }
}