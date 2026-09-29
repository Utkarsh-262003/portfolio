# utkarshtyagi.in

Portfolio for Utkarsh Tyagi, DevOps Engineer. Static site built with [Astro](https://astro.build).

## Run it

```sh
npm install
npm run dev      # local dev server on http://localhost:4321
npm run build    # writes the static site to dist/
npm run preview  # serves dist/ locally
npm run check    # type-checks the .astro files
```

`dist/` is plain HTML, CSS, fonts and media. There's no server code, so it can go straight to Azure Static Web Apps (app location `/`, output location `dist`).

## Where things live

| Path | What |
|---|---|
| `src/pages/index.astro` | Home: hero + terminal, tools marquee, clip grid, pipeline, stack.yml, experience, skills, contact |
| `src/pages/battleroom.astro` | BattleRoom case study |
| `src/data/site.ts` | Name, links, numbers, skills; git SHA of the build; the build-time `/healthz` snapshot |
| `src/components/Terminal.astro` | Hero terminal (the commands themselves are in `src/scripts/site.ts`) |
| `src/components/Pipeline.astro` | The animated 01 → 07 pipeline |
| `src/components/Clip.astro` | Muted looping video card with Pause/Play and Expand, placeholder if the file is missing |
| `src/components/Architecture.astro` | The AWS architecture diagram (inline SVG) |
| `src/styles/global.css` | Design tokens (colours, fonts, spacing) and shared styles |
| `src/scripts/site.ts` | All behaviour: clips, full-size player, terminal, pipeline animation, counters, clock, copy email |
| `public/media/` | Clips (`.mp4`) and posters (`.webp`) |
| `CLAUDE.md` | The brief and the facts. Content on the site must come from here. |

The build fetches `https://battleroom.utkarshtyagi.in/healthz` once (5 s timeout). If it can't, the terminal simply skips the `curl` lines.

## The resume

`public/resume.pdf` is the web copy, with the phone number removed. When you update your resume, remove the phone number before replacing this file (the site is public).

## Replacing a clip

Keep the same file name in `public/media/` (`<name>.mp4` + `<name>.webp` poster). If the size changes, update `width`/`height` where that clip is used. Keep each clip under ~3 MB, H.264, no audio.
