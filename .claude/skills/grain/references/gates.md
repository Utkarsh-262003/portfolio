# Gates

Run before handing back **any** output. Every answer must be **no**. One yes fails the build — fix it, don't note it.

Twenty-four gates, not sixty-five. A list long enough to skip is a list that gets skipped.

Component scope runs everything except **Structure** and gate 24.

---

## Typography

1. Is the display face Inter, Roboto, Open Sans, Poppins, Lato, Montserrat, or a system default?
2. Are there more than three font families on the page?
3. Is any heading or display text italic — including a single `<em>` inside an otherwise upright heading?
4. Is any prose measure outside 45–75ch?

## Colour

5. Is there a purple/blue, cyan/magenta, or any multi-hue gradient — **including `background-clip: text` on a headline**?
6. Is pure `#000` or pure `#fff` used as a base? (A deliberate monochrome direction may claim `#fff` — say so in the stamp.)
7. Does any neutral have zero chroma? Tint toward the anchor hue; flat greys read as unconsidered.
8. Does the accent cover more than ~5% of any viewport by area?
9. Does any text/background pair fail WCAG AA — *including* accent-on-dark and ink-on-ink inside dark sections?

## Structure

10. Is this the banned shape — 100vh centred hero → three icon cards → CTA → footer?
11. Does this share a structure (or a shape with fewer than two knob deltas) with the last `/* Grain ·` stamp in the project?
12. Is there a 3-equal-column grid of icon-above-heading cards?
13. Is any card nested inside another card?
14. Is any card wearing a thick coloured side-stripe?
15. Are sections separated *only* by equal whitespace — no rule, no shift, no change in rhythm anywhere?
16. Is the `/* Grain · ... */` stamp missing?

## Motion & interaction

17. Is `transition: all` (or `transition-all`) used anywhere?
18. Is a uniform hover-scale (`hover:scale-105`) applied across unrelated elements — or does any element carry more than one hover effect at once?
19. Are you animating `width`, `height`, `top`, `left`, `margin`, or `padding`?
20. Does the focus ring fade in? (Focus must be instant — a keyboard user is waiting on it.)
21. Does any interactive element lack `:focus-visible`, `:active`, or `:disabled`? Is any affordance hover-only?
22. Is there a keyframe or transform with no `prefers-reduced-motion` fallback? Is auto-rotating content missing pause-on-hover-and-focus?

## Honesty

23. Is any number, testimonial, logo, or customer count on this page one that the user did not supply? Is there a "Jane Doe", an "Acme", a "Seamless", or a "Built for the modern team"? Is there an emoji standing in for a feature icon, or two icon libraries on one page?

## Layout safety

24. Does the page scroll horizontally at any width from 320px up? Is `overflow-x: clip` missing from `html` *and* `body`? Does any image-bearing grid track use bare `1fr` instead of `minmax(0, 1fr)`? Does any clickable text wrap to two lines?

---

## Reporting

Don't paste the list back at the user. If everything passed, the stamp says so. If something failed and you fixed it, mention it in one line — *"Bumped the accent back to margin-only; it was filling about a third of the fold."* If something failed and you couldn't fix it (the brief demands it, the existing system enforces it), say which gate and why, once.
