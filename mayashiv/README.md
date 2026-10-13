# mayashiv — Sudeshna Chatterjee

Static academic-portfolio site for **Sudeshna Chatterjee** — Academic Director, curriculum and
student welfare. Five hand-written pages, no build step, no framework, no trackers.

The name comes from the idea the site is built on: **Maya** (the world as it appears, imagination,
form) and **Shiv** (awareness, stillness, discernment) — two halves of what an education should
give a child.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — profile, the principle, entry index, what the work covers |
| `about.html` | The Approach — Maya and Shiv explained, and what it looks like on a Monday morning |
| `experience.html` | Full CV: nine roles with dates, education, competencies, languages, PDF download |
| `arts.html` | Arts & Culture — theatre direction, elocution, classical music, service, exchange |
| `contact.html` | Contact, availability, what she is open to |
| `404.html` | Not-found page (uses a `<base>` tag so it works at any depth) |

Supporting: `assets/css/site.css` (one stylesheet, tokens + print rules),
`assets/js/site.js`, `assets/img/favicon.svg`, `assets/pdf/Sudeshna_Chatterjee_CV.pdf`,
`robots.txt`, `sitemap.xml`.

## Design system

- **Posture:** warm editorial. Ivory paper, ink type, one terracotta accent, hairlines.
  Deliberately the daylight counterpart to the dark trader's site — related craft, different voice.
- **Type:** Fraunces (display serif) / Karla (body) / IBM Plex Mono (labels).
- **Colour:** `--paper #F7F4EE`, `--ink #1A1815`, `--terracotta #A9501E`, `--indigo #2B3A5E`.
- **Mark:** two interlocking circles — Maya and Shiv — as an inline SVG.
- Motion is a subtle fade/translate, disabled under `prefers-reduced-motion`. Print CSS included.

## Content provenance — read before editing

All biographical content is taken from her own CV
(`/home/chugh/Downloads/mom_docx/Sudeshna_Chatterjee_Academic_Director_CV.pdf`).
Two categories of copy are **drafted by the agent, not by her**, and need her approval:

1. The Maya/Shiv framing on `index.html` and `about.html`.
2. The voice/phrasing of the "what the work covers" section and the pull quotes.

**Privacy decisions applied:** her mobile number and street address are NOT published; the site
states "available on request" and gives city/corridor only. Her email `suds20@gmail.com` IS
published, matching her CV. Change either if she prefers.

**Photo:** `profile_photo.jpg` in the CV folder is only 357×247 px and dim — too low-resolution for
a hero portrait. The hero is typographic. If she supplies a daylight photo, crop to 4:5 and add a
`<figure class="portrait">` (styles already exist) in the hero's right column.

## Deploy

### GitHub Pages — project page (current, temporary)
Push this directory to a repo under an account that already has Pages working, e.g.
`chugh-ak5/mayashiv`, then enable Pages (Settings → Pages → Deploy from a branch → main / root).
Live at `https://chugh-ak5.github.io/mayashiv/`.

### Moving to mayashiv.github.io or a bought domain
```sh
./scripts/set-base.sh https://mayashiv.github.io/     # rewrites canonicals, OG, sitemap, base tag
git add -A && git commit -m "Point site at mayashiv.github.io"
```
For a user site, the repo must be named `mayashiv.github.io` under an account/org named `mayashiv`.
For a domain: add it under Settings → Pages → Custom domain and point DNS at GitHub Pages.
Note GitHub sets up **no redirects for Pages sites**, so old `github.io` links die on a move —
always migrate with a real domain when it matters.

### Free preview host
Served from the always-free ARM box as a systemd unit on `127.0.0.1:8100` behind a Cloudflare
quick tunnel. See `scripts/deploy.sh`. Tunnel hostnames are random and change on restart: preview only.
