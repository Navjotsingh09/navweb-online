#!/usr/bin/env node
// Generate MP3 narration for every post via Unreal Speech v8 /synthesisTasks
// Usage: node scripts/generate-audio.mjs [--force] [slug1 slug2 ...]

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import matter from "gray-matter";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "content", "posts");
const AUDIO_DIR = path.join(ROOT, "public", "audio");
const MANIFEST = path.join(AUDIO_DIR, "manifest.json");

// Load .env.local
const envFile = path.join(ROOT, ".env.local");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const API_KEY = process.env.UNREAL_SPEECH_API_KEY;
const VOICE_ID = process.env.UNREAL_SPEECH_VOICE_ID || "Daniel";
const BITRATE = "64k";
const SPEED = "0";
const PITCH = VOICE_ID.match(/^(Daniel|Ronan|Jasper|Noah|Caleb|Ethan|Zane)$/) ? "0.92" : "1.0";

if (!API_KEY) {
  console.error("Missing UNREAL_SPEECH_API_KEY in .env.local");
  process.exit(1);
}

const force = process.argv.includes("--force");
const filterSlugs = process.argv.slice(2).filter((a) => !a.startsWith("--"));

fs.mkdirSync(AUDIO_DIR, { recursive: true });
const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};

function strip(md) {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`>]/g, "")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{2,}/g, ". ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function pollTask(taskId) {
  for (let i = 0; i < 60; i++) {
    await sleep(5000);
    const r = await fetch(
      `https://api.v8.unrealspeech.com/synthesisTasks/${taskId}`,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`Poll failed ${r.status}: ${t}`);
    }
    const j = await r.json();
    const task = j.SynthesisTask || j;
    const status = task.TaskStatus || task.status;
    if (status === "completed") {
      return task.OutputUri || task.output_uri;
    }
    if (status === "failed") {
      throw new Error(`Task failed: ${task.TaskStatusReason || JSON.stringify(task)}`);
    }
    process.stdout.write(".");
  }
  throw new Error("Timed out waiting for synthesis task");
}

async function downloadTo(url, filePath) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Download failed ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(filePath, buf);
}

async function processPost(file) {
  const slug = file.replace(/\.md$/, "");
  if (filterSlugs.length && !filterSlugs.includes(slug)) return;

  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { content, data } = matter(raw);
  const title = data.title || slug;
  const text = `${title}. ${strip(content)}`.slice(0, 480000);

  const hash = crypto
    .createHash("sha1")
    .update(`${VOICE_ID}|${BITRATE}|${SPEED}|${PITCH}|${text}`)
    .digest("hex")
    .slice(0, 12);

  const outPath = path.join(AUDIO_DIR, `${slug}.mp3`);
  if (!force && manifest[slug]?.hash === hash && fs.existsSync(outPath)) {
    console.log(`✓ skip ${slug} (unchanged)`);
    return;
  }

  console.log(`→ ${slug} (${text.length} chars, voice=${VOICE_ID})`);

  // Use /speech for ≤3000 chars, /synthesisTasks for longer
  if (text.length <= 3000) {
    const r = await fetch("https://api.v8.unrealspeech.com/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Text: text,
        VoiceId: VOICE_ID,
        Bitrate: BITRATE,
        Speed: SPEED,
        Pitch: PITCH,
        OutputFormat: "uri",
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`/speech failed ${r.status}: ${t}`);
    }
    const j = await r.json();
    const url = j.OutputUri || j.output_uri;
    if (!url) throw new Error(`No OutputUri in: ${JSON.stringify(j)}`);
    await downloadTo(url, outPath);
  } else {
    const r = await fetch("https://api.v8.unrealspeech.com/synthesisTasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Text: text,
        VoiceId: VOICE_ID,
        Bitrate: BITRATE,
        Speed: SPEED,
        Pitch: PITCH,
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`/synthesisTasks failed ${r.status}: ${t}`);
    }
    const j = await r.json();
    const taskId =
      j.SynthesisTask?.TaskId || j.TaskId || j.task_id || j.taskId;
    if (!taskId) throw new Error(`No task id in: ${JSON.stringify(j)}`);
    process.stdout.write(`  polling task ${taskId}`);
    const url = await pollTask(taskId);
    process.stdout.write("\n");
    await downloadTo(url, outPath);
  }

  manifest[slug] = { hash, voice: VOICE_ID, bytes: fs.statSync(outPath).size, generatedAt: new Date().toISOString() };
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`  saved ${path.relative(ROOT, outPath)} (${(manifest[slug].bytes / 1024).toFixed(0)} KB)`);
}

const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
let ok = 0, fail = 0;
for (const f of files) {
  try {
    await processPost(f);
    ok++;
  } catch (e) {
    fail++;
    console.error(`✗ ${f}: ${e.message}`);
  }
}
console.log(`\nDone. ${ok} ok, ${fail} failed.`);
