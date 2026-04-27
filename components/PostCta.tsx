type CtaVariant = {
  id: string;
  headline: string;
  sub: string;
  button: string;
  matchTags: string[];
};

const VARIANTS: CtaVariant[] = [
  {
    id: "ai-native",
    headline: "Building something AI-native?",
    sub: "5rv.digital ships AI-assisted products end-to-end — from idea to deploy.",
    button: "Start a project →",
    matchTags: [
      "ai",
      "artificial intelligence",
      "machine learning",
      "ml",
      "llm",
      "software",
      "engineering",
      "code",
      "developer",
      "automation",
    ],
  },
  {
    id: "design-product",
    headline: "Turn this idea into a product.",
    sub: "We design and build bio-inspired digital products at 5rv.digital.",
    button: "See how we work →",
    matchTags: [
      "design",
      "product",
      "biomimicry",
      "bio-inspired",
      "ux",
      "ui",
      "materials",
      "innovation",
    ],
  },
  {
    id: "systems-strategy",
    headline: "Need this thinking inside your team?",
    sub: "5rv.digital runs workshops and builds the systems to back them.",
    button: "Book a call →",
    matchTags: [
      "strategy",
      "business",
      "systems",
      "leadership",
      "process",
      "organisation",
      "operations",
      "seo",
      "marketing",
    ],
  },
  {
    id: "research-thinking",
    headline: "Like this kind of thinking?",
    sub: "We bring it into client work at 5rv.digital — research-led product design.",
    button: "Explore 5rv →",
    matchTags: ["research", "essay", "writing", "nature", "biology", "ecology"],
  },
];

const FALLBACK: CtaVariant = {
  id: "default",
  headline: "Ship the next one with us.",
  sub: "5rv.digital — AI-assisted design and engineering.",
  button: "Visit 5rv.digital →",
  matchTags: [],
};

function pickVariant(tags: string[]): CtaVariant {
  const lowered = tags.map((t) => t.toLowerCase());
  for (const v of VARIANTS) {
    if (v.matchTags.some((m) => lowered.some((t) => t.includes(m)))) {
      return v;
    }
  }
  return FALLBACK;
}

export function PostCta({ tags, slug }: { tags: string[]; slug: string }) {
  const variant = pickVariant(tags);
  const href = `https://5rv.digital?utm_source=navweb&utm_medium=post&utm_campaign=${encodeURIComponent(
    slug,
  )}&utm_content=${variant.id}`;

  return (
    <aside className="post-cta" aria-label="Sponsored by 5rv.digital">
      <div className="post-cta-glow" aria-hidden="true" />
      <div className="post-cta-inner">
        <p className="post-cta-kicker">
          <span className="post-cta-dot" aria-hidden="true" />
          From the studio · 5rv.digital
        </p>
        <h3 className="post-cta-headline">{variant.headline}</h3>
        <p className="post-cta-sub">{variant.sub}</p>
        <a
          className="post-cta-button"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{variant.button}</span>
        </a>
        <p className="post-cta-foot">AI-assisted design &amp; engineering · UK-based</p>
      </div>
    </aside>
  );
}
