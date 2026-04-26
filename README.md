# Nav Web Online

Biomimicry & innovation blog. Next.js (App Router) site that renders markdown posts produced by the **Biomimicry Blogger** custom agent (`.github/agents/biomimicry-blogger.agent.md`).

## Stack

- Next.js 15 + React 19, TypeScript, App Router
- `gray-matter` + `unified`/`remark`/`rehype` for markdown → HTML
- Static generation (`generateStaticParams`) — fully prerendered, deployable to Vercel as a static-first Next app

## Project layout

```
app/
  layout.tsx
  page.tsx                  # post index
  posts/[slug]/page.tsx     # individual post
  globals.css
lib/
  posts.ts                  # filesystem loader for content/posts/*.md
content/
  posts/                    # agent writes <slug>.md here
  comments/pending.json     # optional moderation queue (read by agent)
.github/
  agents/biomimicry-blogger.agent.md
```

## Content workflow

1. In VS Code chat, pick the **Biomimicry Blogger** agent.
2. Prompt with a topic, e.g. `post about biomimicry in architecture` or `nature-inspired computing`.
3. Agent researches the topic, writes a 1,500–2,000 word markdown article to `content/posts/<slug>.md`, and emits a JSON bundle (post metadata, image search queries, video keywords, comment moderation results).
4. Run `npm run dev` to preview at <http://localhost:3000>.
5. Commit and push — Vercel rebuilds.

## Local development

```bash
npm install
npm run dev
```

## Deploy to Vercel

This is a zero-config Next.js project. Two paths:

### Option A — Vercel dashboard
1. Push this repo to GitHub.
2. <https://vercel.com/new> → import the repo.
3. Framework preset: **Next.js** (auto-detected). Build command and output dir: defaults.
4. Deploy. Subsequent pushes to `main` trigger production builds; PRs get preview deployments.

### Option B — Vercel CLI
```bash
npm i -g vercel
vercel              # first run links the project
vercel --prod       # production deploy
```

### Environment

No env vars required for the current scope (filesystem-only content). If you later add a CMS or analytics, configure them in **Vercel → Project → Settings → Environment Variables**.

### Notes

- Posts are read at build time. After the agent generates a new post, redeploy (or use Vercel's Git integration to auto-deploy on push).
- Comment moderation is intentionally offline — the agent reads/writes `content/comments/pending.json`. There is no live comments API.
- Images are not bundled. The agent suggests search queries; sourcing/licensing happens out-of-band.
