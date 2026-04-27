"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  title: string;
  text: string;
};

type Status = "idle" | "playing" | "paused";

export default function ListenButton({ title, text }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [supported, setSupported] = useState(true);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    if (status === "playing") {
      synth.pause();
      setStatus("paused");
      return;
    }
    if (status === "paused") {
      synth.resume();
      setStatus("playing");
      return;
    }

    synth.cancel();
    const fullText = `${title}. ${text}`;
    const utter = new SpeechSynthesisUtterance(fullText);
    utter.rate = 1;
    utter.pitch = 1;
    utter.lang = "en-US";

    const voices = synth.getVoices();
    const preferred =
      voices.find((v) => /en[-_]US/i.test(v.lang) && /Google|Samantha|Natural/i.test(v.name)) ||
      voices.find((v) => /en[-_]US/i.test(v.lang)) ||
      voices.find((v) => /^en/i.test(v.lang));
    if (preferred) utter.voice = preferred;

    utter.onend = () => setStatus("idle");
    utter.onerror = () => setStatus("idle");

    utterRef.current = utter;
    synth.speak(utter);
    setStatus("playing");
  };

  const stop = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setStatus("idle");
  };

  if (!supported) return null;

  const label =
    status === "playing"
      ? "Pause narration"
      : status === "paused"
      ? "Resume narration"
      : "Would you like to Listen?";

  return (
    <div className="listen-card" role="region" aria-label="Listen to this essay">
      <button
        type="button"
        className={`listen-orb ${status}`}
        onClick={speak}
        aria-label={status === "playing" ? "Pause" : status === "paused" ? "Resume" : "Play narration"}
      >
        {status === "playing" ? (
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1" fill="#fff" />
            <rect x="14" y="5" width="4" height="14" rx="1" fill="#fff" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M7 5l12 7-12 7V5z" fill="#fff" stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <div className="listen-text">
        <span className="listen-title">{label}</span>
        <span className="listen-sub">
          {status === "idle"
            ? "Hands-free narration of this essay"
            : status === "playing"
            ? "Tap the orb to pause"
            : "Tap the orb to resume"}
        </span>
      </div>
      {status !== "idle" && (
        <button type="button" className="listen-stop" onClick={stop} aria-label="Stop narration">
          Stop
        </button>
      )}
    </div>
  );
}
