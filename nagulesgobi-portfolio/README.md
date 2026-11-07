# nagulesgobi.com portfolio

The redesigned multi-page portfolio for **www.nagulesgobi.com**, kept here as a backup
until it moves into its own repository. It is not part of the dotxline.com website.

- `site/` – the finished static website, ready to publish with GitHub Pages
  (it already contains `CNAME` for `www.nagulesgobi.com`).
- `source/` – the generator that builds `site/`: `python3 source/build.py`.
  Shared styles in `source/assets/css`, interactions in `source/assets/js/site.js`,
  images in `source/assets/img`.
- `logo-kit/` – the rebuilt N-mark logo: SVG masters, PNGs from 16 to 2048 px,
  web icons and `USAGE.md`. `mark2.py` holds the exact geometry.

## Publishing

1. Create a new repository (for example `nagulesgobi.com`) and copy the contents of
   `site/` to its root.
2. In the repository's Settings → Pages, publish from the `main` branch, set the custom
   domain to `www.nagulesgobi.com` and turn on Enforce HTTPS.
3. In Namecheap → Domain List → Manage → Advanced DNS: `A` records for `@` pointing to
   185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153, and a
   `CNAME` for `www` pointing to `<github-username>.github.io`. Leave email (MX/TXT)
   records as they are.
