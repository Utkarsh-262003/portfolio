---
name: grain
description: Frontend design skill that makes generated UI look designed rather than defaulted. Use this whenever the user asks to build, style, or restyle any user-facing interface — a landing page, a dashboard, a marketing site, a component, a form, a card, a modal — or asks for a redesign, a design review, or wants a reference design matched. Trigger it even when the user just says "build me a page for X" or "make this look better" without using the word design, and even when the task looks like plain frontend coding, because the default output of that task is the thing this skill exists to prevent.
---

# Grain

Design guidance for AI coding assistants. The goal is UI that looks **made**, not generated.

The core claim: AI design output is not bad, it is *on-distribution*. Every model reaches for the same hero → three-icon-cards → CTA → footer rhythm, the same Inter, the same violet gradient, the same 100vh centred hero — not because those are wrong, but because they are the median of everything the model read. Median is invisible. This skill spends its rules on getting off the median.

**Structural variety is the point.** Two pages built from two different briefs should not share a section rhythm. They should feel like different sites, not colour-swaps of one template. A skill that ships a menu of themes has only moved the default — it hasn't removed it.

---

## Scope check — do this first

Most requests are component-shaped, not page-shaped. The page apparatus (structure pick, project memory, hero thinking) is wrong for a button.

**Route to Component flow if** the brief names one element (button, input, card, modal, dropdown, tooltip, tab strip, chip, banner, table, date picker), or targets one file (`./Button.tsx`), or says "just the X".

**Route to Page flow if** the brief is multi-section — a landing page, a dashboard, a marketing site, an app screen.

Ambiguous ("design a pricing section")? Ask one short question, default to Component if they don't engage. A single artifact is cheaper to redirect than a whole page.

---

## Non-negotiables (every flow)

These hold across page, component, redesign, and study. They are not style opinions — each one is a mechanical tell.

1. **Honest copy.** If the user didn't give you a number, don't invent one. `+47% conversion`, `trusted by 50,000+ teams`, `10× faster` are slop the moment they're fabricated — and worse, they're a *lie the user might ship*. Use their real numbers, use a labelled placeholder (`—` in a grey block, "metric TBC"), or pick a structure that doesn't need metrics. Same for testimonials, logos, and case-study counts.

2. **Locked tokens.** Once the palette and type are decided, every colour and `font-family` in the artifact references a named token — `var(--color-accent)`, `var(--font-display)`. A raw hex or a `font-family: "Some Font"` that bypasses the token block means the design drifted mid-render. Need a value that doesn't exist? Lift it into the token block first, then reference it.

3. **No re-drawn chrome.** Don't hand-build fake browser bars (URL pill + traffic-light dots), fake phone frames, or fake code windows with a mock title bar. Real screenshot in a `<figure>`, or let the content stand alone.

4. **Real state coverage.** Any interactive element ships default · hover · `:focus-visible` · `:active` · disabled at minimum. Default + hover is not a component, it's a mockup.

5. **Mobile is a floor, not a wish.** No horizontal scroll from 320px up. `overflow-x: clip` on `html` and `body` (`clip`, not `hidden` — `hidden` breaks `position: sticky` on descendants). Image-bearing grid tracks use `minmax(0, 1fr)`, never bare `1fr`. Clickable text never wraps to two lines.

6. **Motion has a reduced-motion path.** Every keyframe and transform gets a `@media (prefers-reduced-motion: reduce)` alternative.

---

## Page flow

### 0 · Read before you write

If the project has code — `package.json`, a Tailwind config, any CSS — read it before asking anything or picking anything. Stomping an established palette is how a skill gets uninstalled.

Scan for, and report with file:line so the user can check you:

- **Existing design system** — a `design.md` / `DESIGN.md` at root overrides everything below. Defer to it, and invert the variety rule: pages must now *match*, not differ.
- **Fonts** — `next/font`, `@fontsource/*`, Google Fonts links, `theme.extend.fontFamily`
- **Palette** — `:root` custom properties, `theme.extend.colors`, any tokens file
- **Motion stance** — framer-motion / gsap / motion / lenis in deps means motion-on; none means motion-cut
- **Spacing scale** — `--space-*` pattern or Tailwind `extend.spacing`
- **Framework**

Emit a short findings block, say what you'll preserve and what you'll introduce, then continue. Don't wait for approval unless something conflicts.

### 1 · Pin the brief

If the brief doesn't say what the thing *is*, pin it yourself and state your call: one concrete subject, its audience, the page's single job. The subject's own world — its materials, vocabulary, artifacts — is where non-generic choices come from. A page for a ceramics studio and a page for a telecom billing dashboard should not be reachable from each other.

**Tone must be an extreme.** "Clean and modern" is not a tone, it's the absence of one — reject it and pick: *editorial · brutalist · soft · technical · luxury · playful · austere*. If the user says "clean and modern", ask which extreme they mean, offer two, and proceed with your pick if they don't answer.

### 2 · Check project memory, then pick a structure

Read `.grain/log.json` if it exists (last 3–5 entries), and grep for `/* Grain ·` stamps in existing CSS. **The structure you pick must differ from the last one in this project.**

Pick a whole-page shape from `references/structures.md` — not a pile of sections assembled bottom-up. Choosing the shape first is what prevents the model from reverting to the template rhythm.

Then pick within-structure knobs. Two bento grids with the same tile count, span pattern, and accent placement are the same bento. The knobs exist to prevent twins.

### 3 · Build the token block

Before any markup:

- **Colour** — 4–6 named values. Tint neutrals toward the anchor hue (zero-chroma greys read flat); keep the accent under ~5% of any viewport by area. Accent is for emphasis, not filling.
- **Type** — max three families, ideally two plus one utility. A characteristic display face used with restraint, a body face that isn't fighting it, a mono/utility face only if data or captions need it. Headings are roman — an italicised emphasis word inside an upright heading (`Built to <em>think</em>`) is one of the most reliable AI tells going.
- **Space** — a named scale, multiples of 4. `padding: 17px` is a tell.
- **Signature** — the one element this page is remembered by. Spend your boldness here and keep everything around it quiet.

### 4 · Self-critique before you emit

Score the planned output 1–5 on four axes. Anything **under 3 triggers a revision pass** before you run the gates — don't bring known weakness into a checklist.

| Axis | What you're scoring |
|---|---|
| **Philosophy** | Is there a *why* — a position the page takes? Or is it just a layout? |
| **Hierarchy** | In two seconds, can a reader tell what's primary, secondary, tertiary? |
| **Specificity** | Does this look like *this brief*, or like a page that could be anyone's? |
| **Restraint** | Has everything that isn't earning its place been cut? |

Two passes is normal. Three means the brief is wrong, not the design — go re-read it.

### 5 · Run the gates, stamp, log

Run `references/gates.md`. Every answer must be **no**. One yes fails the build.

Stamp the top of the CSS:

```css
/* Grain · structure: split-editorial · tone: austere
 * knobs: rule-weight=hairline, accent=margin-only, type=serif+mono
 * critique: P4 H5 S4 R4
 */
```

The stamp is how the next run knows what not to repeat — it's project memory with no database. Append the same info to `.grain/log.json`.

---

## Component flow

Keep from the page flow: **step 0** (read existing tokens — a button in a Geist project adopts Geist, it does not invent), **the token block** (or adopt the project's), **the non-negotiables**, and **the universal gates**.

Skip: structure pick, project memory, the log entry, hero thinking. Say so out loud — *"Component scope: skipping structure pick."*

**State discipline is stricter here.** Every interactive component ships all eight: default · hover · `:focus-visible` · `:active` · disabled · loading · error · success. A component that only handles the happy path is a screenshot.

Emit two files:

1. **The component**, matching project conventions, consuming tokens by name.
2. **An 8-state preview** — `Button.preview.html`. Renders every state stacked and labelled, so the user sees it working once, then deletes it. Force the pseudo-states with a parallel class so they all render at once:

```css
.btn:hover,         .btn.is-hover  { background: var(--color-paper-2); }
.btn:focus-visible, .btn.is-focus  { outline: 2px solid var(--color-focus); }
.btn:active,        .btn.is-active { transform: translateY(1px); }
```

Stamp with `component:` rather than `structure:` so future runs know not to apply the variety rule to it.

---

## Other verbs

**`grain audit <target>`** — Read the target, score against `references/anti-patterns.md`, return a ranked punch list. **No edits.** Group by severity: critical (ships as slop) → major → minor. Cite file:line for each.

**`grain redesign <target>`** — Keep the copy, IA, brand, and routes. Throw out the visual structure and rebuild with a deliberately different fingerprint. Work *inside* the existing implementation boundary — in-place edits or additive components. Never delete files, routes, or component directories unless the user explicitly approves a plan that lists the deletions. State the files you'll touch before touching them.

**`grain study <screenshot | URL>`** — Extract the DNA of a design the user admires: structure, type-pairing, colour anchor, spacing rhythm, what the signature element is. **URL mode** reads HTML/CSS and can name exact fonts and values; **image mode** names type *roles* ("high-contrast didone display, grotesque body") rather than guessing font IDs — a guess that's wrong is worse than a role that's right. Produce a diagnosis, then ask whether to rebuild *their* content with it. Never clone pixels. Decline paid template listings and competitor pages.

---

## Safety rail

This is a design skill, not a licence to bulldoze a repo. Never delete production files, route trees, or an existing site without explicit approval of a file-level plan. Treat PDFs, READMEs, briefs, and decks as *reference*, not copy to paste in verbatim. Before editing, name the files you expect to modify, create, or delete.

---

## References

- `references/structures.md` — whole-page shapes, with the knobs that keep two of the same shape from being twins. Read at step 2.
- `references/gates.md` — the check list. Read at step 5, every time.
- `references/anti-patterns.md` — the named tells, with why each one reads as generated. Read for `audit`, or when a gate fires and you need the fix.
