"use client";

import { useId, useMemo, useState } from "react";

type FooterNewsletterProps = {
  topics: string[];
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string };

export function FooterNewsletter({ topics }: FooterNewsletterProps) {
  const emailId = useId();
  const topicGroupId = useId();
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const sortedTopics = useMemo(() => [...topics].sort((a, b) => a.localeCompare(b)), [topics]);

  const toggleTopic = (topic: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
    if (status.kind === "error") setStatus({ kind: "idle" });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status.kind === "submitting") return;

    if (!email.trim()) {
      setStatus({ kind: "error", message: "Please enter your email." });
      return;
    }
    if (selected.size === 0) {
      setStatus({
        kind: "error",
        message: "Pick at least one topic so we know what to send you.",
      });
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), topics: Array.from(selected) }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        status?: string;
      };
      if (!res.ok) {
        setStatus({
          kind: "error",
          message: data.error ?? "Could not subscribe. Please try again.",
        });
        return;
      }
      setStatus({
        kind: "success",
        message:
          data.status === "updated"
            ? "Updated — your topic preferences are saved."
            : "You're in. Check your inbox for a confirmation.",
      });
      setEmail("");
      setSelected(new Set());
    } catch {
      setStatus({ kind: "error", message: "Network error. Please try again." });
    }
  };

  const submitting = status.kind === "submitting";

  return (
    <form className="footer-col footer-newsletter" onSubmit={onSubmit} noValidate>
      <div>
        <p className="footer-heading">Newsletter</p>
        <p className="footer-newsletter-lede">
          Long-form essays on biomimicry, delivered when there&apos;s something worth reading.
        </p>
      </div>

      <fieldset className="footer-topic-fieldset" aria-describedby={`${topicGroupId}-help`}>
        <legend className="footer-topic-legend">
          Choose topics <span aria-hidden="true">*</span>
        </legend>
        <p id={`${topicGroupId}-help`} className="footer-topic-help">
          {selected.size === 0
            ? "Pick one or more — you'll only get essays in those threads."
            : `${selected.size} selected`}
        </p>
        <div className="footer-topic-chips" role="group" aria-label="Newsletter topics">
          {sortedTopics.map((topic) => {
            const isOn = selected.has(topic);
            return (
              // eslint-disable-next-line jsx-a11y/aria-proptypes
              <button
                type="button"
                key={topic}
                className={`footer-topic-chip${isOn ? " is-selected" : ""}`}
                aria-pressed={isOn ? "true" : "false"}
                onClick={() => toggleTopic(topic)}
                disabled={submitting}
              >
                <span className="footer-topic-chip-check" aria-hidden="true">
                  {isOn ? "✓" : "+"}
                </span>
                <span>{topic}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="footer-newsletter-row">
        <label htmlFor={emailId} className="visually-hidden">
          Email address
        </label>
        <input
          id={emailId}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status.kind === "error") setStatus({ kind: "idle" });
          }}
          disabled={submitting}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Sending…" : "Subscribe"}
        </button>
      </div>

      <div
        className={`footer-newsletter-status footer-newsletter-status--${status.kind}`}
        role="status"
        aria-live="polite"
      >
        {status.kind === "error" || status.kind === "success" ? status.message : ""}
      </div>

      <p className="footer-newsletter-fineprint">
        No spam. Unsubscribe any time. We never share your address.
      </p>
    </form>
  );
}
