# Vansh Dobariya · End to End

Portfolio of Vansh Dobariya, Full-Stack Developer (backend systems), Ahmedabad.

A scroll-driven site where every main project is explained as a live
architecture diagram: as you scroll through the story, the request travels
through the system. A "request path" runs down the page and ends at
**200 OK** on the contact section.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Where things live

| Path | What |
|---|---|
| `src/content/site.ts` | **All content**: profile, principles, journey, case studies (with diagrams), work, skills, achievements, résumé. Edit this file to update the site. |
| `src/app/page.tsx` | The page: section order |
| `src/app/resume/page.tsx` | Plain résumé view for recruiters (`/resume`) |
| `src/site/` | Components: hero network, request path, case studies and diagrams, demos, work grid, skills map |
| `src/app/globals.css` | Design tokens ("Ink & Signal" dark, "Paper & Ink" light) and all styles |
| `public/media/projects/<id>/` | Project screenshots (`cover.webp`) and clips (`demo.mp4`) |
| `public/resume.pdf` | Downloadable résumé |
| `PLAN.md`, `STORY.md` | The plan and the locked story/facts the content comes from |

## Adding a project

1. Add an entry to `work` in `src/content/site.ts` (title, line, stack, links).
2. Drop a screenshot at `public/media/projects/<id>/cover.webp` and set `cover`.

## Adding a case study

Add an entry to `cases` in `src/content/site.ts`. Diagram boxes use a
540 × 430 grid in three columns (x ≈ 10, 200, 384); each step lists which
boxes and connections light up.

## Deploy

Built for Vercel. Set `NEXT_PUBLIC_SITE_URL` to the final domain so share
images and the sitemap use it.
