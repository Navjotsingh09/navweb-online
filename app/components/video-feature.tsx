"use client";

import { useState } from "react";

type VideoFeatureProps = {
  videoId: string;
  title: string;
  channel: string;
  channelHref?: string;
  duration?: string;
  kicker?: string;
  summary: string;
  postHref?: string;
};

export function VideoFeature({
  videoId,
  title,
  channel,
  channelHref,
  duration,
  kicker = "Field viewing",
  summary,
  postHref,
}: VideoFeatureProps) {
  const [active, setActive] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <section className="vfeature" aria-label="Featured video">
      <div className="vfeature-inner">
        <header className="vfeature-head">
          <span className="vfeature-kicker liquid-glass">{kicker}</span>
          <h2 className="vfeature-title">
            <span>From the field —</span>
            <span className="vfeature-title-italic">a film worth your nine minutes.</span>
          </h2>
        </header>

        <div className="vfeature-grid">
          <div className="vfeature-stage">
            <div className={`vfeature-frame ${active ? "is-active" : ""}`}>
              {!active ? (
                <button
                  type="button"
                  className="vfeature-poster"
                  style={{ backgroundImage: `url(${thumb})` }}
                  onClick={() => setActive(true)}
                  aria-label={`Play "${title}" by ${channel}`}
                >
                  <span className="vfeature-poster-veil" aria-hidden="true" />
                  <span className="vfeature-play liquid-glass-strong" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5.5v13l11-6.5z" />
                    </svg>
                  </span>
                  <span className="vfeature-poster-meta">
                    <span className="vfeature-poster-channel">{channel}</span>
                    <span className="vfeature-poster-title">{title}</span>
                    {duration && <span className="vfeature-poster-dur">{duration}</span>}
                  </span>
                </button>
              ) : (
                <iframe
                  className="vfeature-iframe"
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>

            <div className="vfeature-credits">
              <span className="vfeature-cred-dot" aria-hidden="true" />
              <span className="vfeature-cred-label">Credit</span>
              {channelHref ? (
                <a href={channelHref} target="_blank" rel="noopener noreferrer">
                  {channel}
                </a>
              ) : (
                <span>{channel}</span>
              )}
              <span className="vfeature-cred-sep" aria-hidden="true">·</span>
              <a href={watchUrl} target="_blank" rel="noopener noreferrer">
                Watch on YouTube ↗
              </a>
            </div>
          </div>

          <aside className="vfeature-side">
            <p className="vfeature-side-kicker">Why we&apos;re sharing it</p>
            <p className="vfeature-summary">{summary}</p>
            {postHref && (
              <a className="vfeature-readlink" href={postHref}>
                <span>Read our take</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
