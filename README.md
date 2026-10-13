# showrojeetchugh.com

Static multi-page personal/business site for **Showrojeet Chugh** — proprietary trader,
liquidity & risk. Hand-written HTML/CSS/JS, no build step, no framework, no trackers.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — positioning, mono "ledger" panel, numbered section index, current work |
| `resume.html` | Full CV, print-optimised, with downloadable PDF |
| `markets.html` | Trading method, hedging approach, Python/SQL/InfluxDB telemetry stack, AI posture |
| `projects.html` | Flagship write-up (Kamino Sentinel), desk tooling, public GitHub repositories |
| `systems.html` | Linux, practical security/hardening table, cloud infrastructure & cost discipline |
| `digital-assets.html` | Exchange desk work, treasury/fiat rails, on-chain lending risk, vocabulary |
| `contact.html` | Contact details, what he's open to, disclosure note |
| `404.html` | Not-found page |

Supporting: `assets/css/site.css` (single stylesheet, tokens + print rules),
`assets/js/site.js` (mobile nav, scroll reveal, reading progress bar, desk session clock, copy-to-clipboard, repo filter, keyboard shortcuts), `assets/pdf/` (résumé PDF),
`assets/img/` (`favicon.svg`, `apple-touch-icon.png`, `og-preview.png`),
`site.webmanifest`, `robots.txt`, `sitemap.xml`.

## Design system

Tokens live at the top of `assets/css/site.css`.

- **Posture:** editorial desk-dossier. Warm paper type on near-black, hairline rules, mono for
  data, serif for voice. One accent only.
- **Type:** Instrument Serif (display) / IBM Plex Sans (body) / IBM Plex Mono (labels, data).
- **Colour:** `--ink #0A0B0D`, `--paper #F2EFE9`, `--gold #C9A227`, `--jade #3FBF9F` (status only).
- **Composition:** asymmetric hero with a right-hand ledger panel; numbered index rows instead of
  icon cards; rail-labelled sections (`--rail`) rather than centred stacks.
- Motion is a subtle fade/translate, disabled under `prefers-reduced-motion`.

## Deploy

### Production: GitHub Pages (free, permanent)
Published from `github.com/chugh-ak5/chugh-ak5.github.io` (public repo) as a **user site**:

```
git remote add origin git@github.com:chugh-ak5/chugh-ak5.github.io.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
Live at <https://chugh-ak5.github.io/> — free HTTPS, no card, no bandwidth billing.

Notes for this host:
- No `CNAME` file (that is only for a custom domain). `.nojekyll` is present so Pages serves
  the files verbatim without Jekyll processing.
- Serves from the repository root, so all relative links work unchanged.

### Moving to a real domain later (one command)
```sh
./scripts/set-base.sh showrojeetchugh.com     # rewrites canonicals, OG, sitemap, robots, contact links
git add -A && git commit -m "Point site at showrojeetchugh.com" && git push
```
Then add `showrojeetchugh.com` under Settings → Pages → Custom domain (Cloudflare Registrar,
at cost ~$10.26/yr) and point the DNS at GitHub Pages. Nothing here is wasted: the free URL keeps
working alongside the domain.

### Preview host (free, ephemeral — used before GitHub Pages existed)
Served from the Oracle always-free ARM box as a systemd unit:

```sh
# unit: /etc/systemd/system/showrojeetchugh-site.service -> python3 -m http.server on 127.0.0.1:8099
rsync -a --delete --exclude CNAME --exclude .git ./ a1:/home/ubuntu/sites/showrojeetchugh.com/
ssh a1 'sudo systemctl restart showrojeetchugh-site.service'
```

Public access is a Cloudflare **quick tunnel** (no account, free):
`cloudflared tunnel --url http://127.0.0.1:8099`. **Caveat:** a quick-tunnel hostname is random and
changes on every restart — preview only, never the address you hand out.

## Editing notes

- Nav is duplicated per page (no templating by design) — when adding a page, update the `<nav>`
  block and the active `aria-current="page"` in every page, plus `sitemap.xml`.
- Keep the `<head>` block consistent: title, description, canonical, OG tags.
- The résumé PDF is `assets/pdf/Showrojeet_Chugh_Resume.pdf`; replace it to update the download.
- Deliberately **not** published: phone number, and any repository that would read as
  offensive-security tooling (see the site owner before adding such links).
