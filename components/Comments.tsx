"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
  id: string;
  author: string;
  body: string;
  createdAt: string | null;
}

interface CommentsProps {
  postSlug: string;
}

export default function Comments({ postSlug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(postSlug)}`);
      if (!res.ok) throw new Error("Failed to load comments");
      const data = (await res.json()) as { comments: Comment[] };
      setComments(data.comments);
    } catch {
      setError("Could not load comments.");
    } finally {
      setLoading(false);
    }
  }, [postSlug]);

  useEffect(() => {
    void fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug, author: author.trim(), body: body.trim() }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Submission failed");
      }

      setSubmitted(true);
      setAuthor("");
      setBody("");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(iso: string | null) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <section className="comments-section">
      <h2>Comments</h2>

      {loading && <p className="comments-status">Loading comments…</p>}
      {error && <p className="comments-status comments-error">{error}</p>}

      {!loading && !error && comments.length === 0 && (
        <p className="comments-status">No comments yet. Be the first.</p>
      )}

      {comments.length > 0 && (
        <ol className="comment-list">
          {comments.map((c) => (
            <li key={c.id} className="comment">
              <div className="comment-meta">
                <span className="comment-author">{c.author}</span>
                {c.createdAt && (
                  <time dateTime={c.createdAt} className="comment-date">
                    {formatDate(c.createdAt)}
                  </time>
                )}
              </div>
              <p className="comment-body">{c.body}</p>
            </li>
          ))}
        </ol>
      )}

      <div className="comment-form-wrap">
        <h3>Leave a comment</h3>
        {submitted ? (
          <p className="comments-status">
            Thanks — your comment is under review and will appear shortly.
          </p>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="comment-form">
            <label htmlFor="comment-author">Name</label>
            <input
              id="comment-author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={80}
              required
              disabled={submitting}
              placeholder="Your name"
              autoComplete="name"
            />

            <label htmlFor="comment-body">Comment</label>
            <textarea
              id="comment-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={2000}
              minLength={10}
              rows={5}
              required
              disabled={submitting}
              placeholder="Share your thoughts…"
            />

            {submitError && (
              <p className="comments-error" role="alert">
                {submitError}
              </p>
            )}

            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
