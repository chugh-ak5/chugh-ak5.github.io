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
`assets/js/site.js` (mobile nav, scroll reveal, footer year), `assets/pdf/` (résumé PDF),
`robots.txt`, `sitemap.xml`, `CNAME` (GitHub Pages custom domain).

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

### Preview host (current, free)
Served from the Oracle always-free ARM box as a systemd unit:

```sh
# unit: /etc/systemd/system/showrojeetchugh-site.service  -> python3 -m http.server on 127.0.0.1:8099
rsync -a --delete --exclude CNAME ./ a1:/home/ubuntu/sites/showrojeetchugh.com/
ssh a1 'sudo systemctl restart showrojeetchugh-site.service'
```

Public access is provided by a Cloudflare **quick tunnel** (no account, free):
`cloudflared tunnel --url http://127.0.0.1:8099`.

**Caveat:** a quick-tunnel hostname is random and changes on every restart. It is a preview,
not the production URL.

### Production target (free + a domain)
Cloudflare Pages: point it at this directory (or a GitHub repo mirror), add
`showrojeetchugh.com` as a custom domain. Free plan = unlimited bandwidth, 500 builds/month,
automatic TLS. Domain from Cloudflare Registrar at cost (~$10.46/yr for .com) so renewal equals
registration.

GitHub Pages is the fallback: push these files to a public repo and enable Pages; the `CNAME`
file already contains the apex domain.

## Editing notes

- Nav is duplicated per page (no templating by design) — when adding a page, update the `<nav>`
  block and the active `aria-current="page"` in every page, plus `sitemap.xml`.
- Keep the `<head>` block consistent: title, description, canonical, OG tags.
- The résumé PDF is `assets/pdf/Showrojeet_Chugh_Resume.pdf`; replace it to update the download.
- Deliberately **not** published: phone number, and any repository that would read as
  offensive-security tooling (see the site owner before adding such links).
