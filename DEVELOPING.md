# Ananya Anandharaman — Personal Portfolio

A single-page portfolio site built around a scroll journey from deep space down to the Earth's core. Each section is a different layer of the universe/planet, with animated canvases and wave visualisations that change character as you scroll.

## Quick start

```bash
# Option 1 — just open locally (no server needed for most browsers)
open index.html

# Option 2 — run a local dev server (recommended, avoids CORS with SVG assets)
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080` (or `http://localhost:3000` for npx serve).

---

## Deploy to GitHub Pages in 2 minutes

1. Create a new repository on GitHub (e.g. `ananya-portfolio`)
2. Push this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git remote add origin https://github.com/YOUR_USERNAME/ananya-portfolio.git
   git push -u origin main
   ```
3. Go to **Settings → Pages → Source → Deploy from branch → main / (root)**
4. Your site will be live at `https://YOUR_USERNAME.github.io/ananya-portfolio/`

---

## File structure

```
/
├── index.html          Main page (section containers, script tags)
├── media.html          Photo gallery
├── css/
│   ├── base.css        Reset, nav, depth bar, fade-ins, utilities
│   ├── sections.css    Section backgrounds (the earth-journey colours)
│   └── components.css  Cards, buttons, contact links, chips
├── js/
│   ├── config.js       ★ ALL CONTENT LIVES HERE — edit this to update copy
│   ├── main.js         DOM rendering from config, scroll logic, nav state
│   ├── waves.js        Global wave canvas (changes type by section)
│   ├── starfield.js    Star field for deep-space section
│   ├── cbc.js          Compact binary coalescence animation
│   ├── constellations.js  Named, interactive constellation canvas
│   ├── surface.js      Earth-surface canvas with configurable vehicles
│   ├── mantle.js       Lava-convection canvas
│   ├── core.js         Core-plasma canvas
│   └── earthquake.js   Earthquake click interaction (mantle section)
├── assets/
│   ├── vehicles/       SVG vehicle doodles — see HOW_TO_REPLACE.md
│   ├── media/          Drop photos here for the gallery (see config.js)
│   └── cv/             Drop your CV PDF here (Ananya_CV.pdf)
└── README.md
```

---

## Updating content

Open **`js/config.js`** — everything is defined there with inline comments.

| What to change | Where in config.js |
|---|---|
| Name, tagline, bio | `name`, `tagline`, `bio` |
| Research projects | `research` array |
| Side projects | `sideProjects` array |
| Workshops / blog | `workshops` array |
| Certifications | `certifications` array |
| Contact links | `contact` object |
| Vehicle drawings | `vehicles` array — see `assets/vehicles/HOW_TO_REPLACE.md` |
| Gallery photos | `media` array — drop files in `assets/media/` |

---

## Adding media

1. Drop images into `assets/media/`
2. In `config.js`, find the `media` array
3. Set `file` to the path, e.g.:
   ```js
   { file: "assets/media/lvk-pisa.jpg", caption: "LVK 2026, Pisa", date: "2026" }
   ```

---

## Replacing vehicle drawings

See `assets/vehicles/HOW_TO_REPLACE.md`.

---

## Custom domain (optional)

1. Create a file called `CNAME` in the root with your domain: `ananya.science`
2. Point your DNS `A` or `CNAME` records to GitHub Pages IPs
3. Enable **HTTPS** in the Pages settings

---

## Tech stack

Pure HTML / CSS / JS — no build tools, no frameworks, no dependencies.
The Google Fonts CDN link is the only external resource.


---

## Design layer (v2)

- `css/theme.css` holds the fonts, type scale, glass cards and the continuous space-to-core background gradient (on `<body>`).
  Headings use Fraunces. To switch to Sora, set `--font-display: 'Sora', sans-serif;` at the top of `theme.css` (both fonts are already loaded).
- `css/sections.css` only holds layout hooks; section backgrounds are transparent so there are no seams.
- `js/nav.js` adds the mobile menu on both pages.
- `js/waves.js` has one generator per wave type: gravitational chirp, AM radio, infrasound (upper atmosphere), seismic noise with vehicle spikes, P/S body waves, dispersive surface waves, and normal modes (core). Clicking or tapping the mantle layer triggers the earthquake response.
- On screens under 768 px the site halves the number of vehicles, dims the constellations, and shows a compact wave label.

## Before you deploy

- Put the CV you want public at `assets/cv/Ananya_CV.pdf` (the CV buttons point there).
- Add photos to `assets/media/` and register them in `config.js`.
