# Anti-patterns

The named tells. Each entry says what it is, **why it reads as generated**, and the fix.

The "why" matters more than the ban. A rule you understand transfers to cases the list doesn't cover; a rule you've memorised only catches the exact string.

Used by `grain audit`, and when a gate fires and you need the repair.

## Contents

- [Critical — ships as slop](#critical--ships-as-slop)
- [Major — reads as AI-generated](#major--reads-as-ai-generated)
- [Minor — taste](#minor--taste)

---

## Critical — ships as slop

### The violet gradient
Purple→blue on a hero, a button, or `background-clip: text` on the headline.
**Why:** it is the single most over-represented visual in the training set. It signals "AI made this" before a reader has parsed a word.
**Fix:** one flat accent. If you want depth, use a paper shift or a rule, not a hue ramp.

### Inter everywhere
Inter (or Roboto/Poppins/Open Sans) as the display face.
**Why:** these are excellent *body* faces, which is why they're everywhere, which is why they carry zero identity as display. Using one for display means the type made no argument.
**Fix:** a characterful display face used with restraint, over a quiet body face. The wordmark may use a third — a Geist-bodied page can set its wordmark in something with a spine.

### The three-icon feature grid
Three equal columns, icon above heading above two lines of copy.
**Why:** it appears on every AI page regardless of subject, which means it encodes nothing about the subject. Also: the content is almost never actually three parallel things.
**Fix:** let the real content pick the shape. Four things? Show four. One dominant and two supporting? Show that. Not a set at all? A list or a paragraph.

### Fabricated metrics
`+47% conversion`, `trusted by 50,000+ teams`, `10× faster`, a testimonial from "Sarah Chen, VP Eng at Nexus".
**Why:** this one isn't taste — it's a falsehood in something the user might ship. It's also instantly legible as invented, because invented numbers cluster around plausible-sounding round-ish figures.
**Fix:** their number, a labelled placeholder (`—`, "metric TBC"), or a structure that doesn't need one.

### Full-viewport centred hero
`min-height: 100vh` with eyebrow, title, lede, and CTA all stacked on one centred axis.
**Why:** it's the path of least resistance in every framework's starter, and it wastes the most valuable screen in the document on air.
**Fix:** centre at most two of them; break the others off-axis — margin-aligned eyebrow, right-flush CTA, numeral-anchored heading. Or don't use full height at all: a cold open reads as confidence.

### Card-in-card
A card nested inside another card.
**Why:** it means the hierarchy wasn't decided, so containment got used twice to fake it.
**Fix:** pick one level of containment. The inner content gets space and type instead.

### Aurora blobs and floating orbs
Animated mesh gradients, blurred colour blobs, drifting circles behind the content.
**Why:** decoration with no relationship to the subject — it's what gets added when a page feels empty but nobody knows why.
**Fix:** the page is empty because the hierarchy is flat. Fix that. If you want atmosphere, one static tinted bloom, one hue, small footprint.

### Re-drawn UI chrome
A hand-built browser bar with traffic-light dots and a fake URL pill; a mock phone frame; a code block with a fake title bar.
**Why:** the user's browser already has chrome. Drawing a second one is a costume, and the fake never matches any real OS.
**Fix:** real screenshot in a `<figure>` with at most a hairline border, or no frame at all.

### The AI nav / the AI footer
Nav: wordmark left, four centred links, ghost button + filled button right. Footer: four equal columns (Product / Company / Resources / Legal), social icon row, centred copyright.
**Why:** both are the default answer, and both usually contain links to pages that don't exist.
**Fix:** ship the links you actually have. Two links is a legitimate nav. A single line with an email address is a legitimate footer.

---

## Major — reads as AI-generated

### Italic headers
`Built to <em>think</em>` — an italic emphasis word inside an upright heading. Or an all-italic display face.
**Why:** one of the highest-precision tells there is; it's the model reaching for emphasis without a system for it.
**Fix:** weight, accent colour, or a drawn underline. Italic lives in body copy.

### `transition: all`
**Why:** it animates properties you didn't think about, including ones that trigger layout. It's a declaration that the motion wasn't designed.
**Fix:** name the properties. `transition: background-color 120ms ease, transform 120ms ease`.

### Universal `hover:scale-105`
The same hover-scale on cards, buttons, links, avatars, logos.
**Why:** it's a global find-and-replace of a single idea. Also, scaling text resamples it.
**Fix:** one hover behaviour per element *type*, chosen for what that element does. Many elements need none.

### Bouncy easing on UI
`cubic-bezier(0.34, 1.56, ...)` on a button, modal, or tooltip.
**Why:** overshoot implies mass and momentum. A dropdown has neither; it reads as a toy.
**Fix:** overshoot only for things that model physical motion. UI state gets a fast ease-out.

### Everything animates on scroll
A universal fade-up on every section.
**Why:** it delays content the reader asked for, on every section equally, which means it emphasises nothing.
**Fix:** one orchestrated moment, or none. Scattered effects lose to a single deliberate one.

### Icon tiles and emoji icons
Rounded square with a Lucide glyph above each feature; or ✨🚀⚡ as feature icons.
**Why:** the icon is almost always redundant with the heading next to it. Emoji additionally render differently on every platform and cannot carry a brand.
**Fix:** drop the icon and lead with type. If icons genuinely help, one library, custom-drawn if it matters.

### Mixed icon libraries
Material + Heroicons + Lucide on one page.
**Why:** different grids, weights, and terminals. It reads as assembled, because it was.
**Fix:** one library.

### Glassmorphism without cause
Backdrop blur on a panel that isn't over anything.
**Why:** blur is a depth cue. Depth with nothing behind it is a texture, and a dated one.
**Fix:** blur only where something is genuinely behind and genuinely should show through.

### Hover-only affordances
Actions that appear on hover with no keyboard or touch path.
**Why:** invisible on touch, unreachable by keyboard.
**Fix:** always visible, or revealed by focus as well as hover.

### Celebratory toasts
A success toast for something the user can already see happen.
**Why:** it's noise confirming what the screen already confirmed.
**Fix:** silent success. Toasts are for failures and invisible effects. Optimistic update + Undo beats a confirm dialog for anything reversible.

### Focus rings that fade in
**Why:** a keyboard user is mid-navigation and waiting on the indicator. Any delay is a small failure.
**Fix:** instant, via `outline` — not a border swap, which shifts layout.

### Tabular data without `tabular-nums`
**Why:** proportional digits make columns of numbers fail to line up. It's the fastest way to make data look untrustworthy.
**Fix:** `font-variant-numeric: tabular-nums`.

---

## Minor — taste

- **Straight quotes** where typographic ones belong: `"` → `"` `"`, `'` → `'`
- **`--`** where an em dash belongs: `—`
- **`...`** where an ellipsis belongs: `…`
- **Placeholder names** — Jane Doe, John Smith. Use plausible varied names, or none.
- **Startup clichés** — Acme, Nexus, Seamless, Unleash, Elevate. And "Built for the modern team".
- **`z-index: 9999`** — a stacking context wasn't planned.
- **Arbitrary spacing** — `padding: 17px` off the scale.
- **`100vw`** — includes the scrollbar; causes horizontal overflow. Use `100%`.
- **Every section padded identically** — rhythm is information; equal rhythm says nothing.
