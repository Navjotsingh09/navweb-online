"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  title?: string;
};

const SPEEDS = [1, 1.25, 1.5, 1.75];

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const a = new Audio(src);
    a.preload = "metadata";
    audioRef.current = a;
    const onMeta = () => {
      setDuration(a.duration);
      setReady(true);
    };
    const onTime = () => setTime(a.currentTime);
    const onEnd = () => setPlaying(false);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    return () => {
      a.pause();
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
      audioRef.current = null;
    };
  }, [src]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play();
      setPlaying(true);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (!a) return;
    const v = Number(e.target.value);
    a.currentTime = v;
    setTime(v);
  };

  const cycleSpeed = () => {
    const next = (speedIdx + 1) % SPEEDS.length;
    setSpeedIdx(next);
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[next];
  };

  return (
    <div className="listen-card" role="region" aria-label="Listen to this essay">
      <div className="listen-row">
        <button
          type="button"
          className={`listen-orb ${playing ? "playing" : ""}`}
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          disabled={!ready}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" fill="#fff" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="#fff" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M7 5l12 7-12 7V5z" fill="#fff" stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <div className="listen-text">
          <span className="listen-title">{playing ? "Now playing" : "Listen to this essay"}</span>
          <span className="listen-sub">{fmt(time)} / {fmt(duration)}</span>
        </div>
        <button type="button" className="listen-speed" onClick={cycleSpeed} aria-label="Playback speed">
          {SPEEDS[speedIdx]}×
        </button>
      </div>
      <input
        type="range"
        className="listen-seek"
        min={0}
        max={duration || 0}
        step={0.1}
        value={time}
        onChange={seek}
        aria-label="Seek"
        disabled={!ready}
      />
    </div>
  );
}
