# Structures

Pick a whole-page shape **before** writing sections. Assembling bottom-up is how the model reverts to hero → three cards → CTA → footer without noticing.

Read `.grain/log.json` and any `/* Grain ·` CSS stamps first. **The shape you pick must differ from the last one in this project.** Colour-swapping the same shape is not variety.

## Contents

- [The nine shapes](#the-nine-shapes)
- [Picking](#picking)
- [Knobs](#knobs)
- [The banned shape](#the-banned-shape)

---

## The nine shapes

**1 · Split editorial**
Two columns that hold the whole page, not just the hero. Left carries a running narrative; right carries artifacts, images, or specimens. Asymmetric — a 2:3 or 1:2 split, never 50/50. Reads as a magazine spread.
*Fits:* studios, portfolios, brands with a story, anything where the writing matters.

**2 · Long document**
One column, one measure, headings and rules doing all the structural work. No cards at all. The page is a document that happens to be a website.
*Fits:* manifestos, changelogs, docs, essays, open-source projects, anything technical and honest.

**3 · Bento grid**
Irregular tile grid, tiles of different spans holding different content types — a stat, a screenshot, a quote, a list. The irregularity is the design; a 3×3 of equal tiles is a feature grid wearing a costume.
*Fits:* products with many small capabilities, dashboards, dev tools.

**4 · Stat-led**
The page opens with a number, not a sentence. Structure descends from the data. Requires *real* numbers — if the user has none, pick a different shape rather than inventing them.
*Fits:* infra, fintech, analytics, anything where the number is the pitch.

**5 · Workbench**
The interface itself is the hero — a live demo, a real screenshot, a working widget, running above the fold. Copy is captions around the thing.
*Fits:* tools where seeing it work beats being told it works.

**6 · Index first**
The page opens with a table of contents or a directory. Navigation *is* the landing. No hero at all.
*Fits:* large surface areas — component libraries, multi-product companies, archives, catalogs.

**7 · Photographic**
A full-bleed image or a photo sequence carries the page; type sits on and around it. Needs real photography — an AI-generated hero image is its own tell.
*Fits:* physical products, places, food, fashion, travel.

**8 · Letter**
Written as direct address, signed. First person. Paragraphs, not bullets.
*Fits:* founder announcements, pivots, small teams, anything where a human voice is the differentiator.

**9 · Type specimen**
The typography is the content — display type at extreme scale, the page demonstrating a voice rather than describing it. Very little else on the page.
*Fits:* foundries, agencies, design-forward brands, and almost nothing else.

> **Don't fall through to Specimen or Split editorial.** They're the most *interesting* shapes here, which makes them the new default attractor. Pick them when the brief calls for them, not when you're out of ideas.

---

## Picking

Map the brief's **single job** to the shape, in this order:

1. What is the one thing the page must do? (convince · demonstrate · orient · announce · sell · index)
2. What's the strongest asset the user actually has? (real numbers → stat-led. Real photos → photographic. A working demo → workbench. Neither → typography carries it.)
3. What did the last run in this project use? Rule that out.
4. Does the tone from step 1 of the page flow survive this shape? An austere brief in a bento grid is a mismatch.

Say the pick out loud with a one-line reason. If you can't justify it in a sentence, you defaulted.

---

## Knobs

Same shape twice in a project is allowed **only** if at least two knobs differ. State the deltas in the stamp.

| Knob | Options |
|---|---|
| **Rule weight** | hairline · 1px · heavy slab · none (space only) |
| **Accent footprint** | margin-only · single element · section band · none |
| **Alignment spine** | left-flush · right-flush · numeral-anchored · optical-centre |
| **Density** | airy (space does the work) · packed (rules do the work) |
| **Type contrast** | display+body same family · high contrast pairing · display-only |
| **Section rhythm** | equal · accelerating · one long + several short |
| **Entry** | cold open (content immediately) · masthead · full-bleed |

Two bento grids at `tiles=6, spans=irregular, accent=corner` are the same bento. Two split-editorials at `rule=hairline, spine=left-flush` are the same page.

---

## The banned shape

**Hero (100vh, everything centred) → three icon cards → testimonial row → CTA band → fat footer.**

This is the shape every model produces when it isn't thinking. It's not that it's bad — it's that it appears regardless of subject, which means it carries no information about the subject. If the brief genuinely calls for a SaaS marketing page, use a real SaaS sequence (hero → proof → features → pricing → FAQ → CTA) with a *chosen* hero shape, real prices, and specific testimonials — not this.
