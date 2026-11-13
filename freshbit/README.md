# FreshBit website

The marketing site for FreshBit, published by dotXline LTD. It's a self-contained static site:
every link and asset inside this folder is relative, and links out to dotxline.com are absolute.
So the same folder works in two places without changes:

- **Today:** at `https://dotxline.com/freshbit/`, as part of the dotxline-website repo (GitHub Pages).
- **Next:** at `https://freshbit.dotxline.com/`, from its own small repo (steps below).

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home: hero with the working phone demo, how it works and the score lab, features, light and dark, privacy, TestFlight, FAQ |
| `design.html` | Design process: problem, research, structure, design system, components, logo, motion, iteration, build |
| `press.html` | Press kit: descriptions, facts, logos, app icon, colours, screens |
| `privacy.html` | Privacy policy for the app |
| `support.html` | Support and common questions |
| `assets/fb.css`, `assets/fb.js` | All styles and behaviour, no build step and no dependencies |

The phone demos are plain HTML, CSS and JS in `assets/fb.js` (`Phone`). Their stories are the ones
in the app on 12 November 2026. Scores are calculated with the app's own rules (`score()`, copied
from `fb-ingest/logic.ts`). After changing `fb.css` or `fb.js`, bump `?v=` in every page.

## Going live at freshbit.dotxline.com

No domain to buy: FreshBit uses a subdomain of dotxline.com. GitHub Pages allows one custom
domain per repo, so the subdomain is served from its own small repo. `CNAME` already holds
`freshbit.dotxline.com` (GitHub ignores it while it sits in this subfolder of dotxline-website).

1. Create a GitHub repo, for example `NagulesGobi/freshbit-website`, and put the **contents** of
   this folder at its root (CNAME included).
2. In that repo: Settings › Pages › Deploy from branch `main`, folder `/ (root)`. The custom
   domain field should show `freshbit.dotxline.com`.
3. In Namecheap (dotxline.com › Advanced DNS), add one record:
   Type `CNAME`, Host `freshbit`, Value `nagulesgobi.github.io.`
4. Wait for the DNS check and certificate, then tick **Enforce HTTPS**.
5. On dotxline.com, point the FreshBit links (apps grid on index and About, menu and footer on
   every page, the search entry in `assets/site.js`, `sitemap.xml`) at
   `https://freshbit.dotxline.com/`, and replace this folder with a redirect page so old
   `/freshbit/` links keep working.

Until then the site also works as it is at `https://dotxline.com/freshbit/`.

## FreshBit for Mac downloads

The site's "Download for Mac" buttons (dock, hero, the Mac section, FAQ, footer, support, press)
stay hidden until `mac.json` exists. They always link to the latest GitHub release:
`https://github.com/NagulesGobi/freshbit-website/releases/latest/download/FreshBit.dmg`.

To publish a new Mac version, raise `MARKETING_VERSION` (and `CURRENT_PROJECT_VERSION`) in the
Mac project's `project.yml`, then run:

    tools/release-mac.sh

It builds a Release, signs it with Developer ID, packages and notarizes `FreshBit.dmg`, publishes
GitHub release `mac-v<version>`, and writes `mac.json` (version, size, date) to both copies of the
site and pushes them. So the version on the website changes in the same step as the app.
One-time setup (Developer ID certificate and a notarization profile) is described at the top of
the script.

## Copy rules

Copy comes only from the FreshBit project files and app screenshots. FreshBit is in TestFlight
testing: don't describe it as on the App Store until it is. Say "AI-assisted development".
