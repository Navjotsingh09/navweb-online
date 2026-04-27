"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  title: string;
  text: string;
};

type Status = "idle" | "playing" | "paused";

export default function ListenButton({ title: _title, text }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [supported, setSupported] = useState(true);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    // Trigger voices to load (Chrome loads them async)
    window.speechSynthesis.getVoices();
    const handler = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", handler);
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", handler);
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
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1.05;
    utter.lang = "en-GB";

    const voices = synth.getVoices();
    const preferred =
      // Premium / Natural UK voices first
      voices.find((v) => /en[-_]GB/i.test(v.lang) && /Natural|Neural|Premium|Enhanced/i.test(v.name)) ||
      // Named UK voices known to be high-quality
      voices.find((v) => /Libby|Sonia|Ryan|Daniel|Kate|Serena|Stephanie|Oliver/i.test(v.name) && /en[-_]GB/i.test(v.lang)) ||
      // Google UK voices
      voices.find((v) => /en[-_]GB/i.test(v.lang) && /Google/i.test(v.name)) ||
      // Any UK voice
      voices.find((v) => /en[-_]GB/i.test(v.lang)) ||
      // Fallback to any English
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
