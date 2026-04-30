#!/usr/bin/env node
/**
 * generate-post.mjs
 * Daily blog post generator for Nav Web Online.
 * Fetches trending topics from Hacker News, picks one not already published,
 * calls the Claude API to write a biomimicry/bio-inspired post, and saves it
 * to content/posts/<slug>.md.
 *
 * Required env: ANTHROPIC_API_KEY
 */

import { writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const POSTS_DIR = join(REPO_ROOT, 'content', 'posts');

// Fallback topic pool — used when HN has nothing bio-relevant
const TOPIC_POOL = [
  'spider silk and next-generation body armor',
  'termite mound ventilation and passive building cooling',
  'cuttlefish skin and adaptive camouflage displays',
  'slime mold network optimization and city planning',
  'polar bear fur and solar thermal collectors',
  'abalone shell toughness and impact-resistant materials',
  'dragonfly wing aerodynamics and micro-drone design',
  'electric eel bioelectricity and soft robotics',
  'pangolin scales and flexible protective armor',
  'mangrove root filtration and coastal water treatment',
  'woodpecker skull structure and helmet shock absorption',
  'whale shark dermal denticles and drag-reducing surfaces',
  'bombardier beetle chemical reaction and spray systems',
  'peacock feather photonics and structural color displays',
  'toucan beak foam and lightweight composite materials',
  'manta ray gill rakers and microplastic filtration',
  'cactus spine fog collection and water harvesting',
  'sea cucumber skin stiffness and soft exoskeletons',
  'firefly lantern optics and LED extraction efficiency',
  'dung beetle navigation and miniature GPS sensors',
];

// Keywords that suggest a story is bio/nature/engineering relevant
const BIO_PATTERN =
  /\b(bio|nature|animal|evolut|organ|cell|protein|material|robot|sensor|medical|neural|brain|insect|plant|ocean|marine|coral|bacteria|virus|dna|gene|algae|fungi|forest|climate|ecolog|swarm|flock|herd)\b/i;

async function fetchHNTopics() {
  try {
    const res = await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json',
      { signal: AbortSignal.timeout(8000) }
    );
    const ids = await res.json();
    const top40 = ids.slice(0, 40);
    const stories = await Promise.all(
      top40.map((id) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
          signal: AbortSignal.timeout(5000),
        })
          .then((r) => r.json())
          .catch(() => null)
      )
    );
    return stories
      .filter((s) => s && s.title && BIO_PATTERN.test(s.title))
      .map((s) => s.title);
  } catch (err) {
    console.warn('HN fetch failed, using topic pool:', err.message);
    return [];
  }
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickTopic(hnTopics, existingSlugs) {
  const candidates = [...hnTopics, ...shuffled(TOPIC_POOL)];
  for (const topic of candidates) {
    const slug = slugify(topic);
    if (!existingSlugs.has(slug)) return topic;
  }
  // Absolute fallback: append year to avoid collision
  const t = TOPIC_POOL[0];
  return `${t} ${new Date().getFullYear()}`;
}

async function callClaude(topic, today) {
  const SYSTEM = `You are the autonomous content writer for Nav Web Online, a biomimicry and innovation blog.

HARD RULES — no exceptions:
- NEVER fabricate statistics, study titles, author names, or URLs. Only assert facts you know with high confidence from your training data.
- If uncertain about a specific number or study, describe it qualitatively or omit it.
- Every factual claim that is non-obvious must be backed by a source in the frontmatter sources list.
- Only include URLs you are highly confident exist and are relevant.
- No filler phrases ("In today's fast-paced world", "rapidly evolving landscape").
- No hedging adverbs ("very", "really", "incredibly").
- Active voice. Short paragraphs (3–5 sentences max).
- Define every piece of jargon on first use.
- Do NOT anthropomorphize evolution. Write "selection pressure favored…" not "evolution wanted…".
- American English spelling. SI units (imperial in parentheses only when directly useful).
- Tone: educational and engaging — a curious, intelligent non-specialist reader.

OUTPUT FORMAT — return ONLY valid YAML frontmatter + markdown, nothing else:
---
title: "Compelling headline here"
slug: slug-here
date: ${today}
tags: [biomimicry, tag2, tag3, tag4]
truth: <integer 0-100 reflecting your confidence in the factual accuracy>
sources:
  - label: "Source title"
    url: "https://real-url.example.com"
    type: primary
---

# Headline (same as title)

[Body — 1,500 to 2,000 words structured as below]

## The Biological Inspiration
## From Biology to Engineering
## The Technology Today
## Limits, Trade-offs, and What's Next
## Conclusion

[No "## Sources" section at the end — sources belong only in frontmatter]`;

  const USER = `Write a biomimicry blog post about: ${topic}`;

  const body = JSON.stringify({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: SYSTEM,
    messages: [{ role: 'user', content: USER }],
  });

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body,
    signal: AbortSignal.timeout(120_000),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Claude API ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.content[0].text;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ERROR: ANTHROPIC_API_KEY environment variable is not set.');
    process.exit(1);
  }

  const existing = readdirSync(POSTS_DIR);
  const existingSlugs = new Set(existing.map((f) => f.replace(/\.md$/, '')));

  // Allow manual topic override from workflow_dispatch input
  if (process.env.TOPIC_OVERRIDE && process.env.TOPIC_OVERRIDE.trim()) {
    const topic = process.env.TOPIC_OVERRIDE.trim();
    console.log(`Topic override: ${topic}`);
    const today = new Date().toISOString().split('T')[0];
    const markdown = await callClaude(topic, today);
    const slugMatch = markdown.match(/^slug:\s*(.+)$/m);
    const slug = slugMatch ? slugMatch[1].trim().replace(/['"]/g, '') : slugify(topic);
    const filename = `${slug}.md`;
    const filePath = join(POSTS_DIR, filename);
    if (existsSync(filePath)) {
      console.log(`Post already exists at ${filePath} — skipping.`);
      process.exit(0);
    }
    writeFileSync(filePath, markdown, 'utf8');
    console.log(`Post saved: ${filePath}`);
    return;
  }

  const hnTopics = await fetchHNTopics();
  console.log(`HN bio-relevant topics found: ${hnTopics.length}`);

  const topic = pickTopic(hnTopics, existingSlugs);
  console.log(`Selected topic: ${topic}`);

  const today = new Date().toISOString().split('T')[0];
  const markdown = await callClaude(topic, today);

  // Extract slug from generated frontmatter
  const slugMatch = markdown.match(/^slug:\s*(.+)$/m);
  const slug = slugMatch ? slugMatch[1].trim().replace(/['"]/g, '') : slugify(topic);
  const filename = `${slug}.md`;
  const filePath = join(POSTS_DIR, filename);

  if (existsSync(filePath)) {
    console.log(`Post already exists at ${filePath} — skipping.`);
    process.exit(0);
  }

  writeFileSync(filePath, markdown, 'utf8');
  console.log(`Post saved: ${filePath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
