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
| `src/pages/index.astro` | Home page: masthead, numbers, the 01–07 pipeline rail, experience, skills |
| `src/pages/battleroom.astro` | BattleRoom case study |
| `src/data/site.ts` | Name, links, and the numbers strip (shared by both pages) |
| `src/components/Clip.astro` | Muted looping video with poster, pause button, placeholder if the file is missing |
| `src/components/Architecture.astro` | The AWS architecture diagram (inline SVG) |
| `src/styles/global.css` | Design tokens (colours, fonts, spacing) and shared styles |
| `src/scripts/clips.ts` | Plays clips only while on screen; turns rail steps green |
| `public/media/` | Clips (`.mp4`) and posters (`.webp`) |
| `CLAUDE.md` | The brief and the facts. Content on the site must come from here. |

## Adding the resume

Drop the file at `public/resume.pdf` and rebuild. The "Resume" button switches from "PDF pending" to a real link on its own.

## Replacing a clip

Keep the same file name in `public/media/` (`<name>.mp4` + `<name>.webp` poster). If the size changes, update `width`/`height` where that clip is used. Keep each clip under ~3 MB, H.264, no audio.
