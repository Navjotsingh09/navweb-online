---
title: "Figma's Snap-to-Grid Borrowed Its Magic from Burdock Seeds and Velcro"
slug: figma-velcro-snap-to-grid
date: 2026-05-02
tags: [biomimicry, ux, design-tools, web, figma, design-patterns]
---

# Figma's Snap-to-Grid Borrowed Its Magic from Burdock Seeds and Velcro

![Figma logo](https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg)

The first time you align two rectangles in Figma, the canvas does something subtle that no other design tool got right for twenty years: as your shape gets close to an edge or a midpoint, **it pulls**. Not a snap on a fixed grid — a *gravitational* pull toward whatever alignment guide is most relevant *right now*. Release the mouse, and it locks. The whole interaction takes less than a second and feels like a magnet finding metal. The reference design isn't from another software product. It's from a **seed**.

## The mechanism in nature

In 1941, a Swiss engineer named [George de Mestral](https://en.wikipedia.org/wiki/George_de_Mestral) walked his dog through a field of [burdock](https://en.wikipedia.org/wiki/Arctium) and came home with the burrs stuck to his trousers and the dog's coat. Under a microscope he saw the mechanism: each burr was covered in tiny, **hooked spines** that latched onto looped fibres in fabric and fur.

The biology is brilliant in three ways:

- **Asymmetric attraction.** A hook only catches a loop. Surfaces without loops slide past frictionlessly. The seed isn't *constantly* sticky — it's sticky *only when it should be*.
- **Reversible.** Pull hard enough and the hooks straighten and release. The seed disperses cleanly.
- **No central control.** Each hook acts independently. The aggregate effect is "stickiness" without anything coordinating it.

De Mestral spent eight years productising it. He called it Velcro — *velours* + *crochet*, velvet + hook.

## What Figma actually borrowed

Snap-to-grid in Figma is **soft, asymmetric, and contextual** — exactly like burdock:

- **Asymmetric attraction.** As an object approaches an alignment line, the snap distance grows non-linearly. Far away, the cursor moves freely. Within a threshold, magenta guides appear and the object is pulled into alignment. Past the alignment point, the pull releases and the object glides on. Hooks catching loops.
- **Reversible.** Hold a modifier key (or move past the snap radius) and the magnetism disappears entirely. Like Velcro, the lock is strong but never permanent.
- **No central planner.** Figma isn't computing one global "correct" position. It's running thousands of small, local checks against every nearby edge, midpoint, and grid line — and surfacing the strongest hook in real time.

Strip the biology label and the design pattern is: *contextual magnetism with non-linear attraction radius and reversible lock-in*. That's the mechanism. Velcro is the shorthand.

## Implications for your own product

1. **Snap is a feeling, not a constraint.** Hard, fixed-grid snapping creates a fight between user intent and tool. Soft magnetism makes the tool feel like it's *helping* instead of *correcting*.
2. **Make the lock visible.** Figma flashes a magenta guide the instant a hook catches. Without the visual confirmation, users can't tell whether they've snapped or just gotten lucky.
3. **Always offer a release.** A modifier key, a pull past the radius, a long-press — give users a way to override the magnetism. Burrs that don't release become bramble; tools that don't release become unusable.

## Further reading

- Parent essay: [How Nature Designs Better Web & Mobile Apps](/posts/biomimicry-in-web-and-app-design)
- Related: [Mussel Adhesive and Surgical Glue](/posts/mussel-adhesive-surgical-glue) — another reversible-attachment story from biology
- All [Topics](/topics)

---

**Credit:** Pattern analysis informed by [TheFinch — *Biomimicry in UX Design*](https://thefinch.design/biomimicry-in-ux-design/). Figma is a trademark of Figma, Inc.; logo used under brand-identification fair use.
