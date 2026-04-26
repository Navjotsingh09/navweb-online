/**
 * Firebase Admin SDK singleton — server-side only (API routes, cron handlers).
 *
 * Required Vercel environment variables:
 *   FIREBASE_PROJECT_ID      — from Firebase project settings
 *   FIREBASE_CLIENT_EMAIL    — from the service account JSON
 *   FIREBASE_PRIVATE_KEY     — from the service account JSON (keep the \n newlines,
 *                              Vercel stores them literally; we replace \\n → \n below)
 */
import * as admin from "firebase-admin";

function getApp(): admin.app.App {
  if (admin.apps.length > 0) return admin.apps[0]!;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
    );
  }

  return admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

export function getFirestore(): admin.firestore.Firestore {
  return getApp().firestore();
}

export type CommentStatus = "pending" | "approved" | "flagged";

export interface Comment {
  id?: string;
  postSlug: string;
  author: string;
  body: string;
  status: CommentStatus;
  createdAt: admin.firestore.Timestamp | null;
  moderatedAt: admin.firestore.Timestamp | null;
  reason: string | null;
}
