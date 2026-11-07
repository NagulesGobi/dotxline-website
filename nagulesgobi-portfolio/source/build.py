#!/usr/bin/env python3
"""Builds the multi-page Nagules Gobi portfolio into ./out from shared partials.
Content comes only from nagulesgobi.com and dotxline.com."""
import json, os, re, html, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'site')
SIZES = json.load(open(os.path.join(HERE, 'img-sizes.json')))
PARTS = open(os.path.join(HERE, 'parts', 'site-parts.txt')).read().split('\n')
LOGO_VB, MARK60, WORD_D, MARK100 = PARTS
WM = open(os.path.join(HERE, 'parts', 'wordmark-big.txt')).read()
WM_W, WM_D = WM.split('|', 1)
STOPS = '<stop offset="0" stop-color="#FF9124"/><stop offset=".3" stop-color="#FF4A2C"/><stop offset=".55" stop-color="#FF2440"/><stop offset="1" stop-color="#FF008E"/>'
EMAIL = 'contact@nagulesgobi.com'
E = html.escape

def img(path, alt, root, cls='', lazy=True, extra=''):
    key = path.replace('.webp', '')
    w, h = SIZES.get(key, [1200, 900])
    return (f'<img src="{root}assets/img/{path}" alt="{E(alt)}" width="{w}" height="{h}"'
            f'{" loading=\"lazy\"" if lazy else ""} decoding="async"{f" class=\"{cls}\"" if cls else ""}{extra}>')

# ------------------------------------------------------------------ partials
NAV = [('work.html', 'Work'), ('dotxline.html', 'dotXline'), ('brand.html', 'Brand'), ('about.html', 'About'), ('contact.html', 'Contact')]

def logo_svg():
    return (f'<svg class="logo-svg" viewBox="{LOGO_VB}" role="img" aria-label="Nagules Gobi"><defs><radialGradient id="ngg" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="87">{STOPS}</radialGradient></defs>'
            f'<path fill="url(#ngg)" d="{MARK60}"/><path class="wm" d="{WORD_D}"/></svg>')

def head(title, desc, root, intro=False, canonical=''):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<script{' data-intro="1"' if intro else ''}>
  (function () {{
    var d = document.documentElement, s = document.currentScript; d.classList.add('js');
    try {{
      var t = localStorage.getItem('ng-theme'); if (t === 'light' || t === 'dark') d.dataset.theme = t;
      var rm = matchMedia('(prefers-reduced-motion: reduce)').matches, nav = sessionStorage.getItem('ng-nav');
      if (nav && !rm) {{ d.classList.add('arriving'); d.dataset.navLabel = nav; sessionStorage.removeItem('ng-nav'); sessionStorage.setItem('ng-intro', '1'); }}
      if (s.dataset.intro && !rm && !sessionStorage.getItem('ng-intro')) d.classList.add('intro');
    }} catch (e) {{}}
  }})();
</script>
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<meta property="og:title" content="{E(title)}">
<meta property="og:description" content="{E(desc)}">
<meta property="og:type" content="website">
<meta property="og:image" content="https://www.nagulesgobi.com/assets/brand/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F2F2F2" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#141414" media="(prefers-color-scheme: dark)">
<link rel="canonical" href="https://www.nagulesgobi.com/{canonical}">
<link rel="icon" href="{root}favicon.ico" sizes="48x48">
<link rel="icon" href="{root}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="{root}apple-touch-icon.png">
<link rel="manifest" href="{root}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{root}assets/css/base.css">
<link rel="stylesheet" href="{root}assets/css/pages.css">
<script src="{root}assets/js/site.js" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
'''

def chrome(root, active):
    links = ''.join(f'<a href="{root}{h}"{" aria-current=\"page\"" if h == active else ""}><span data-text="{t}">{t}</span></a>' for h, t in NAV)
    mlinks = ''.join(f'<a href="{root}{h}" style="--i:{i}"{" aria-current=\"page\"" if h == active else ""}><small>0{i + 1}</small><span>{t}</span></a>' for i, (h, t) in enumerate([('index.html', 'Home')] + NAV))
    return f'''<div class="curtain" aria-hidden="true"><span class="curtain-label"></span></div>
<div class="progress" aria-hidden="true"><i></i></div>
<div class="grain" aria-hidden="true"></div>
<div class="cursor" aria-hidden="true"><div class="cursor-preview"></div><div class="cursor-ring"><span class="cursor-label"></span></div><div class="cursor-dot"></div></div>
<header class="head">
  <div class="wrap head-row">
    <a class="logo" href="{root}index.html" aria-label="Nagules Gobi, home" data-label="Home">{logo_svg()}</a>
    <nav class="nav" aria-label="Main">{links}</nav>
    <button class="theme-btn" type="button" aria-label="Switch between light and dark theme"><svg viewBox="0 0 24 24" aria-hidden="true"><circle class="sun" cx="12" cy="12" r="5"/><g class="rays"><path d="M12 1.5v2.2M12 20.3v2.2M1.5 12h2.2M20.3 12h2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></g><circle class="moon-cut" cx="17" cy="7" r="5"/></svg></button>
    <a class="btn btn-sm hire" href="{root}contact.html" data-magnetic data-label="Contact"><span class="pulse" aria-hidden="true"></span><span>Hire me</span></a>
    <button class="menu-btn" type="button" aria-label="Open the menu" aria-expanded="false" aria-controls="menu"><i></i><i></i></button>
  </div>
</header>
<nav class="menu" id="menu" aria-label="Menu" hidden>{mlinks}
  <div class="menu-foot"><a class="btn" href="{root}contact.html" style="font-size:17px" data-label="Contact"><span>Hire me</span></a></div>
</nav>
'''

def footer(root, cta='Have a product people should love? Let’s build it.'):
    return f'''<section class="foot-cta">
  <div class="wrap">
    <div class="foot-cta-grid">
      <div>
        <p class="kicker" data-reveal>Available for product design roles and freelance projects</p>
        <h2 data-split>{E(cta)}</h2>
        <a class="mail" href="mailto:{EMAIL}" data-reveal><span data-text="{EMAIL}">{EMAIL}</span></a>
      </div>
      <a class="orb" href="{root}contact.html" data-magnetic aria-label="Hire me" data-label="Contact">
        <svg class="orb-ring" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="orb-c" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0"/></defs><text><textPath href="#orb-c" textLength="488" lengthAdjust="spacing">HIRE ME · LET'S TALK · HIRE ME · LET'S TALK · </textPath></text></svg>
        <span class="orb-core"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg></span>
      </a>
    </div>
  </div>
</section>
<footer class="foot">
  <div class="wrap">
    <svg class="giant" viewBox="-4 -4 {int(WM_W) + 8} 112" aria-hidden="true"><defs><linearGradient id="gw" x1="0" x2="1"><stop offset="0" stop-color="#FF9124"/><stop offset=".35" stop-color="#FF4A2C"/><stop offset=".6" stop-color="#FF2440"/><stop offset="1" stop-color="#FF008E"/></linearGradient></defs><path d="{WM_D}"/></svg>
    <div class="foot-cols">
      <div><h4>Pages</h4><ul>{''.join(f'<li><a href="{root}{h}">{t}</a></li>' for h, t in [('index.html', 'Home')] + NAV)}</ul></div>
      <div><h4>Case studies</h4><ul>{''.join(f'<li><a href="{root}work/{p["slug"]}.html">{p["title"]}</a></li>' for p in PROJECTS)}</ul></div>
      <div><h4>Elsewhere</h4><ul><li><a href="https://dotxline.com" target="_blank" rel="noopener">dotxline.com ↗</a></li><li><a href="https://www.behance.net/gallery/224174429/Chatvertiser" target="_blank" rel="noopener">Behance ↗</a></li><li><a href="mailto:{EMAIL}">Email</a></li><li><span>London <time data-clock>--:--</time></span></li></ul></div>
    </div>
    <div class="foot-row">
      <p>© <span data-year>2026</span> Nagules Gobi · Product designer, United Kingdom</p>
      <p><a href="#top">Back to top ↑</a></p>
    </div>
  </div>
</footer>
'''

def page(path, title, desc, active, body, intro=False, lightbox=False, cta=None):
    root = '../' * path.count('/')
    lb = '''<div class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" hidden>
  <div class="lb-bar"><span class="lb-count">01 / 01</span><button class="lb-btn lb-close" type="button" aria-label="Close">✕</button></div>
  <div class="lb-stage"><img class="lb-img" alt=""></div>
  <div class="lb-foot"><div class="lb-cap"></div><div class="lb-nav"><button class="lb-btn lb-prev" type="button" aria-label="Previous image">←</button><button class="lb-btn lb-next" type="button" aria-label="Next image">→</button></div></div>
</div>''' if lightbox else ''
    canonical = '' if path == 'index.html' else path
    doc = (head(title, desc, root, intro, canonical) + chrome(root, active) +
           f'<main id="main">\n{body.replace("{root}", root)}\n</main>\n' + footer(root, *( [cta] if cta else [] )) + lb + '\n</body>\n</html>\n')
    dst = os.path.join(OUT, path); os.makedirs(os.path.dirname(dst), exist_ok=True)
    open(dst, 'w').write(doc)

# ------------------------------------------------------------------ content
PROJECTS = [
  dict(slug='xpense', title='Xpense', cat='product apps mobile', kind='iPhone app · dotXline', badge='My product',
       short='A calm, native iPhone expense tracker. Log spending, set budgets and goals, and split costs with friends.',
       scene='app', shots=['apps/xpense-1.webp', 'apps/xpense-3.webp'], tone='x-scene', preview='apps/xpense-preview.webp'),
  dict(slug='tockbee', title='Tockbee', cat='product apps mobile', kind='iPhone and Android app · dotXline', badge='My product',
       short='A shift and pay tracker for UK hourly workers. It clocks you in at work, works out your pay and checks your payslip.',
       scene='app', shots=['apps/tockbee-today.webp', 'apps/tockbee-pay.webp'], tone='t-scene', preview='apps/tockbee-preview.webp'),
  dict(slug='chatvertiser', title='Chatvertiser', cat='product web', kind='Web design · Ad tech UX',
       short='An AI-powered advertising platform that turns conversations into conversion tools.',
       scene='img', image='work/chatvertiser.webp', preview='work/chatvertiser.webp'),
  dict(slug='greenlife', title='Greenlife', cat='product mobile', kind='App design · Retail',
       short='An everyday shopping assistant that makes the trip faster, from building the list to checkout.',
       scene='img', image='work/greenlife.webp', preview='work/greenlife.webp'),
  dict(slug='omnigps', title='OmniGPS', cat='product web', kind='Website design · Logistics',
       short='A precision-driven platform for streamlined, GPS-based fleet management.', scene='omni', preview=None),
  dict(slug='quantum-vac', title='Quantum Vac', cat='product', kind='Smart product · Interaction design',
       short='A high-fidelity prototype for a smart vacuum, focused on interaction models and seamless device control.', scene='qv', preview=None),
]
P = {p['slug']: p for p in PROJECTS}

def scene(p, root='{root}', lazy=True):
    s = p['scene']
    if s == 'img':
        return f'<div class="scene img-scene">{img(p["image"], p["title"] + " design preview", root, "cover", lazy)}<span class="scene-title">{p["title"]}</span></div>'
    if s == 'app':
        shots = ''.join(f'<div class="phone-shot">{img(x, p["title"] + " screen", root, lazy=lazy)}</div>' for x in p['shots'])
        return f'<div class="scene app-scene {p["tone"]}">{shots}<span class="scene-title">{p["title"]}</span></div>'
    if s == 'omni':
        return '''<div class="scene s1"><div class="mock mock-dash"><div class="mock-bar"><i></i><i></i><i></i></div><div class="mock-body"><div class="map"><span class="route"></span><span class="pin p1"></span><span class="pin p2"></span><span class="pin p3"></span></div><div class="side"><b></b><b></b><b></b><b></b></div></div></div><span class="scene-title">OmniGPS</span></div>'''
    return '''<div class="scene s3"><div class="dial"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"/><circle class="arc" cx="60" cy="60" r="50" pathLength="100"/></svg><span>72<small>%</small></span></div><div class="chips"><b></b><b></b><b></b></div><span class="scene-title">Quantum Vac</span></div>'''

def preview_attr(p, root):
    if p.get('preview'): return f' data-preview="{root}assets/img/{p["preview"]}"'
    return ''

# ---------------------------------------------------------------- home page
def home():
    panels = ''
    for i, p in enumerate(PROJECTS):
        panels += f'''
      <article class="panel" data-cursor="View">
        <a class="panel-media" href="{{root}}work/{p['slug']}.html" data-tilt data-label="{p['title']}" aria-label="{p['title']} case study">{scene(p)}<span class="glare" aria-hidden="true"></span></a>
        <div class="panel-body">
          <p class="tag"><span>{i + 1:02d}</span>{p['kind']}</p>
          <h3>{p['title']}</h3>
          <p>{p['short']}</p>
          <a class="link" href="{{root}}work/{p['slug']}.html" data-label="{p['title']}">Read the case study <span aria-hidden="true">→</span></a>
        </div>
      </article>'''
    logos = ''.join(f'<img class="mono-logo" src="{{root}}assets/img/brand/logo-{k}.webp" alt="{t}" width="{SIZES["logo/" + k][0]}" height="{SIZES["logo/" + k][1]}" loading="lazy">'
                    for k, t in [('hanek', 'Hanek'), ('phinaturals', 'PhiNaturals'), ('nation-insure', 'Nation Insure'), ('mr-physics', 'Mr Physics'), ('chatvertiser-logo', 'Chatvertiser'), ('cupid-theory', 'Cupid Theory')])
    body = f'''<div class="intro-screen" aria-hidden="true">
  <svg class="intro-mark" viewBox="0 0 100 100"><defs><radialGradient id="ngi" gradientUnits="userSpaceOnUse" cx="15" cy="8" r="113">{STOPS}</radialGradient></defs><path pathLength="1" d="{MARK100}"/></svg>
  <div class="intro-count"><span data-intro-count>000</span><i>%</i></div>
  <div class="intro-name">Nagules Gobi · Product Designer</div>
</div>
<section class="hero" id="top">
  <canvas class="hero-canvas" aria-hidden="true"></canvas>
  <div class="wrap hero-inner">
    <p class="me-chip" data-reveal data-hero>{img('me/portrait.webp', 'Portrait of Nagules Gobi', '{root}', lazy=False)}<span>Hi, I’m <b>Nagules Gobi</b>. Product designer who also builds. Director of dotXline LTD.</span></p>
    <h1 data-split data-hero>Product design that people <em>actually</em> enjoy using.</h1>
    <p class="lede" data-reveal data-hero style="--d:.35s">I design web and mobile products and brand identities, then build them with code and AI-assisted development. I turn complex ideas into clear, intuitive products that real people can use, not just look at.</p>
    <div class="btns" data-reveal data-hero style="--d:.5s">
      <a class="btn" href="{{root}}work.html" data-magnetic data-label="Work"><span>See my work</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      <a class="btn btn-ghost" href="{{root}}contact.html" data-magnetic data-label="Contact"><span>Hire me</span></a>
    </div>
  </div>
  <div class="wrap hero-foot" data-reveal data-hero style="--d:.7s">
    <span class="scroll-cue"><i aria-hidden="true"></i>Scroll to explore</span>
    <span class="hint">Move your cursor over the mark, or click it</span>
    <span class="clock">London <time data-clock>--:--</time></span>
  </div>
</section>

<section class="marquee" aria-label="Disciplines">
  <div class="marquee-row" data-marquee="1"><div class="marquee-track"><span>Product Design</span><b>✦</b><span>UX/UI</span><b>✦</b><span>Web Design</span><b>✦</b><span>App Design</span><b>✦</b><span>Brand Identity</span><b>✦</b></div></div>
  <div class="marquee-row outline" data-marquee="-1" aria-hidden="true"><div class="marquee-track"><span>Design Strategy</span><b>✦</b><span>Prototyping in Code</span><b>✦</b><span>AI-Assisted Development</span><b>✦</b><span>Graphic Design</span><b>✦</b></div></div>
</section>

<section class="stats" aria-label="At a glance">
  <div class="wrap stats-row">
    <div data-reveal><strong data-count="30">30</strong><span>projects shipped</span></div>
    <div data-reveal style="--d:.1s"><strong data-count="3">3</strong><span>countries</span></div>
    <div data-reveal style="--d:.2s"><strong data-count="6">6</strong><span>years of practice</span></div>
  </div>
</section>

<section class="work hwork" id="work" aria-label="Selected work">
  <div class="work-sticky">
    <div class="wrap work-head">
      <div>
        <p class="kicker" data-reveal>Selected work</p>
        <h2 data-split>Design that helps users, one product at a time.</h2>
      </div>
      <div class="work-meter" aria-hidden="true"><span data-work-index>01</span><i><b data-work-bar></b></i><span>{len(PROJECTS):02d}</span></div>
    </div>
    <div class="work-track">{panels}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <p class="kicker" data-reveal>I also build my own products</p>
      <h2 data-split>Director of dotXline LTD. Designer of every app it ships.</h2>
      <p data-reveal>dotXline is my product company in Cardiff. We make everyday money and work feel simple, one carefully built app at a time.</p>
    </div>
    <div class="ventures">
      <a class="venture company" href="{{root}}dotxline.html" data-reveal data-cursor="Open" data-label="dotXline">
        <img class="dx" src="{{root}}assets/img/apps/logo-dark.svg" alt="dotXline" width="240" height="40">
        <div><h3>Small, exact apps that just work.</h3><p>A product company I direct, from the first idea to the App Store.</p></div>
        <span class="v-link">About dotXline</span>
      </a>
      <a class="venture xp" href="{{root}}work/xpense.html" data-reveal style="--d:.1s" data-cursor="Open" data-label="Xpense">
        <div class="v-top">{img('apps/xpense-icon.webp', '', '{root}')}<b>Xpense</b></div>
        <div><h3>Every penny, in plain sight.</h3><p>A calm, native iPhone expense tracker.</p></div>
        <span class="v-link">Case study</span>
        <div class="v-shot">{img('apps/xpense-2.webp', 'Xpense new expense screen', '{root}')}</div>
      </a>
      <a class="venture tb" href="{{root}}work/tockbee.html" data-reveal style="--d:.2s" data-cursor="Open" data-label="Tockbee">
        <div class="v-top">{img('apps/tockbee-icon.webp', '', '{root}')}<b>Tockbee</b></div>
        <div><h3>Every hour you work, on the record.</h3><p>A shift and pay tracker for UK hourly workers.</p></div>
        <span class="v-link">Case study</span>
        <div class="v-shot">{img('apps/tockbee-today.webp', 'Tockbee today screen', '{root}')}</div>
      </a>
    </div>
  </div>
</section>

<section class="logos" aria-label="Brands I have designed for">
  <div class="wrap"><p class="kicker">Brands I’ve designed identities for</p><a href="{{root}}brand.html">See all brand work →</a></div>
  <div class="logo-row" data-marquee="1" data-speed="0.5" data-skew="off"><div class="logo-track">{logos}</div></div>
</section>

<section class="section alt" id="services">
  <div class="wrap">
    <div class="section-head">
      <p class="kicker" data-reveal>What I do</p>
      <h2 data-split>Clean interfaces that catch the eye and guide users effortlessly.</h2>
    </div>
    <div class="services" data-spot>
      <div class="service" data-reveal><svg class="ico" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" pathLength="1"/><circle cx="24" cy="24" r="10" pathLength="1"/><path d="M24 24 40 8M34 8h6v6" pathLength="1"/></svg><span class="num">Strategy</span><h3>Product design strategy</h3><p>Intuitive, user-focused design strategy rooted in research and aligned with business goals.</p></div>
      <div class="service" data-reveal style="--d:.08s"><svg class="ico" viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="9" width="30" height="24" rx="3" pathLength="1"/><rect x="30" y="18" width="13" height="22" rx="3" pathLength="1"/><path d="M5 15h30" pathLength="1"/></svg><span class="num">Interfaces</span><h3>Web &amp; app design</h3><p>From first concept to high-fidelity design, turning complex ideas into seamless digital experiences.</p></div>
      <div class="service" data-reveal style="--d:.16s"><svg class="ico" viewBox="0 0 48 48" aria-hidden="true"><path d="M8 14h32M8 24h32M8 34h32" pathLength="1"/><circle cx="17" cy="14" r="4" pathLength="1"/><circle cx="31" cy="24" r="4" pathLength="1"/><circle cx="21" cy="34" r="4" pathLength="1"/></svg><span class="num">Usability</span><h3>UI/UX optimisation</h3><p>Better usability and performance through engaging, accessible interfaces.</p></div>
      <div class="service" data-reveal style="--d:.24s"><svg class="ico" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5 41 15v18L24 43 7 33V15Z" pathLength="1"/><path d="M24 5v38M7 15l34 18M41 15 7 33" pathLength="1"/></svg><span class="num">Identity</span><h3>Brand identity</h3><p>Helping brands find their visual voice and build a consistent presence that resonates.</p></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <p class="kicker" data-reveal>Why teams hire me</p>
      <h2 data-split>A designer who has shipped his <em>own</em> products.</h2>
    </div>
    <div class="why" data-spot>
      <div class="why-card" data-reveal><span class="big">2 apps</span><h3>Founder’s view</h3><p>As Director of dotXline LTD, I take Xpense and Tockbee from first idea to finished app, so I design with the whole product in mind.</p></div>
      <div class="why-card" data-reveal style="--d:.08s"><span class="big">Code</span><h3>Designs and builds</h3><p>I take my own designs into working code with AI-assisted development, and a BSc in Computing means I review what gets built.</p></div>
      <div class="why-card" data-reveal style="--d:.16s"><span class="big">30+</span><h3>Range</h3><p>Thirty projects across three countries in six years: dashboards, mobile apps, websites, logos, campaigns and print.</p></div>
      <div class="why-card" data-reveal style="--d:.24s"><span class="big">UX + UI</span><h3>Brand to pixel</h3><p>I can shape the strategy, design the interface and give it a visual identity, so the product feels like one thing.</p></div>
    </div>
  </div>
</section>

<section class="section alt" id="build">
  <div class="wrap">
    <div class="section-head">
      <p class="kicker" data-reveal>How I build</p>
      <h2 data-split>From a Figma frame to a <em>working</em> product.</h2>
      <p data-reveal>I’m a product designer first. I also build, using AI-assisted development to turn designs into real, working software fast, then reviewing and refining the code myself.</p>
    </div>
    <ol class="build-steps" data-spot>
      <li class="why-card" data-reveal><span class="big">Design</span><h3>Research and design</h3><p>User flows, wireframes and high-fidelity UI in Figma, grounded in what people actually need.</p></li>
      <li class="why-card" data-reveal style="--d:.08s"><span class="big">Prototype</span><h3>Prototype in code</h3><p>Interactive prototypes that behave like the real thing, so ideas get tested with real taps and real data.</p></li>
      <li class="why-card" data-reveal style="--d:.16s"><span class="big">Build</span><h3>AI-assisted development</h3><p>I build front ends and full apps with AI coding tools, and check every change against the design and the brief.</p></li>
      <li class="why-card" data-reveal style="--d:.24s"><span class="big">Launch</span><h3>Take it to users</h3><p>At dotXline I take products from idea to launch-ready apps. For teams, I hand over clean code or clean specs.</p></li>
    </ol>
    <p class="build-note" data-reveal>This portfolio is an example: designed and built by me with AI-assisted development, including the particle logo, page transitions and every animation.</p>
  </div>
</section>

<section class="pitch">
  <div class="wrap">
    <p class="kicker" data-reveal>Need a product that looks great and works flawlessly?</p>
    <p class="scrub" data-scrub>With experience across web, mobile and brand design, I help businesses turn ideas into products people love to use. Whether you’re starting from scratch or refining something that already exists, I bring the clarity and creativity to make it stand out.</p>
  </div>
</section>
'''
    page('index.html', 'Nagules Gobi · Product Designer', 'Nagules Gobi is a UK product designer who also builds with code and AI-assisted development, and Director of dotXline LTD.', 'index.html', body, intro=True)

# ---------------------------------------------------------------- work index
def work_index():
    cards = ''
    for p in PROJECTS:
        badge = f'<span class="badge"><i></i>{p["badge"]}</span>' if p.get('badge') else ''
        cards += f'''
      <a class="wcard" href="{{root}}work/{p['slug']}.html" data-cat="{p['cat']}" data-cursor="View"{preview_attr(p, '{root}')} data-label="{p['title']}">
        <div class="media" data-img>{badge}{scene(p)}</div>
        <div class="wcard-meta"><h3>{p['title']}</h3><span class="tags">{p['kind']}</span></div>
        <p>{p['short']}</p>
      </a>'''
    for slug, title, kind, image, cat in [('brand.html', 'Brand identities', '21 logos and identity systems', 'brand/allura.webp', 'brand'),
                                          ('brand.html#campaigns', 'Campaigns and print', 'Ads, posters and book covers', 'brand/viviendo-del-trade.webp', 'brand')]:
        cards += f'''
      <a class="wcard" href="{{root}}{slug}" data-cat="{cat}" data-cursor="View" data-preview="{{root}}assets/img/{image}" data-label="Brand">
        <div class="media" data-img>{img(image, title, '{root}')}</div>
        <div class="wcard-meta"><h3>{title}</h3><span class="tags">{kind}</span></div>
        <p>{'Logos and visual identities for brands in health, insurance, education, gaming and retail.' if cat == 'brand' and 'identities' in title else 'Social ads, a school fundraising campaign, posters, a book cover and packaging.'}</p>
      </a>'''
    body = f'''<section class="page-hero">
  <div class="glow" aria-hidden="true"></div>
  <div class="wrap">
    <p class="kicker" data-reveal data-hero>Work · 2019 to now</p>
    <h1 data-split data-hero>Selected <em>work</em></h1>
    <p class="lede" data-reveal data-hero style="--d:.3s">Products I designed for clients, the apps I build with dotXline, and the brands I gave a visual voice. Filter by type, or switch to the list and hover a project to preview it.</p>
  </div>
</section>
<section class="section" style="padding-top:0">
  <div class="wrap" id="work-list" data-view="grid">
    <div class="filters" data-reveal>
      <div class="chipset" data-filter-group="work-grid" role="group" aria-label="Filter projects">
        <button class="chip" type="button" data-filter="all" aria-pressed="true">All<sup></sup></button>
        <button class="chip" type="button" data-filter="apps" aria-pressed="false">My apps<sup></sup></button>
        <button class="chip" type="button" data-filter="web" aria-pressed="false">Web<sup></sup></button>
        <button class="chip" type="button" data-filter="mobile" aria-pressed="false">Mobile<sup></sup></button>
        <button class="chip" type="button" data-filter="brand" aria-pressed="false">Brand<sup></sup></button>
      </div>
      <div class="toggle" data-view-toggle="work-list" role="group" aria-label="Layout"><button type="button" data-view="grid" aria-pressed="true">Grid</button><button type="button" data-view="list" aria-pressed="false">List</button></div>
    </div>
    <div class="wgrid" id="work-grid">{cards}
    </div>
  </div>
</section>'''
    page('work.html', 'Work · Nagules Gobi', 'Case studies and selected product, app and brand design work by Nagules Gobi.', 'work.html', body)

# ---------------------------------------------------------------- case pages
def facts(items):
    return '<dl class="case-facts" data-reveal>' + ''.join(f'<div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in items) + '</dl>'

def sec(title, inner):
    return f'<section class="wrap"><div class="case-sec"><h2 data-split>{title}</h2><div class="body" data-reveal>{inner}</div></div></section>'

def points(items):
    return '<ul class="points">' + ''.join(f'<li><b>{a}</b>{b}</li>' for a, b in items) + '</ul>'

def flow(items, root='{root}'):
    its = ''.join(f'<figure class="flow-item"><div class="shot">{img(src, cap, root)}</div><b>{cap}</b><span>{note}</span></figure>' for src, cap, note in items)
    return f'<div class="flow-wrap" data-reveal><div class="flow" data-flow tabindex="0" aria-label="App screens, scroll sideways">{its}</div><div class="flow-nav"><button type="button" data-flow-prev aria-label="Previous screen">←</button><button type="button" data-flow-next aria-label="Next screen">→</button></div></div>'

def next_link(slug):
    i = [p['slug'] for p in PROJECTS].index(slug); n = PROJECTS[(i + 1) % len(PROJECTS)]
    pic = img(n['preview'], '', '{root}') if n.get('preview') else f'<div class="case-mock" style="height:100%">{scene(n)}</div>'
    return f'''<a class="next" href="{{root}}work/{n['slug']}.html" data-label="{n['title']}" data-cursor="Next">
  <div class="wrap"><p class="kicker">Next case study</p><h2><span>{n['title']}</span></h2></div>
  <div class="next-img">{pic}</div>
</a>'''

def case(slug, hero_kicker, title_html, lede, fact_items, cover, sections, link=None):
    p = P[slug]
    body = f'''<section class="page-hero case-hero">
  <div class="glow" aria-hidden="true"></div>
  <div class="wrap">
    <p class="kicker" data-reveal data-hero>{hero_kicker}</p>
    <h1 data-split data-hero>{title_html}</h1>
    <p class="lede" data-reveal data-hero style="--d:.3s">{lede}</p>
    {facts(fact_items)}
  </div>
</section>
{cover}
{sections}
{next_link(slug)}'''
    page(f'work/{slug}.html', f'{p["title"]} · Nagules Gobi', p['short'], 'work.html', body)

def cover_img(path, alt):
    return f'<div class="media case-cover" data-img><div class="plx" data-parallax="0.08">{img(path, alt, "{root}", lazy=False)}</div></div>'

def cover_scene(p):
    return f'<div class="case-cover case-mock" data-img style="aspect-ratio:auto">{scene(p, lazy=False)}</div>'

def cases():
    # Xpense
    case('xpense', 'Case study · My product at dotXline', 'Every penny, in <em>plain</em> sight.',
         'A calm, native expense tracker for iPhone. Log it in one tap, see where it goes, and keep a little more each month.',
         [('Role', 'Founder · product and UI design'), ('Company', 'dotXline LTD'), ('Platform', 'iPhone, native'), ('Status', 'Coming soon')],
         f'<div class="case-cover case-mock" data-img style="aspect-ratio:auto">{scene(P["xpense"], lazy=False)}</div>',
         sec('The idea', '<p class="quote">Spending isn’t the problem. Not knowing is.</p><p>Xpense keeps every penny in plain sight, celebrates the months you keep a little more, and never makes you feel bad about the rest.</p>') +
         sec('Design decisions', points([
             ('Logged in one tap', 'Quick Add tiles open a new expense with the category already chosen. Your tiles, in your order.'),
             ('Progress, never shame', 'Spend less than last month and Xpense says so: “Nice, £12 less than September.” Spend more and it stays neutral.'),
             ('Numbers first', 'Built natively for iPhone with the calm design of iOS 26. Nothing in the way of the figure you came for.'),
             ('Private by default', 'No ads, no selling data, and receipt photos stay on your iPhone.')])) +
         '<section class="case-band"><div class="wrap section-head"><p class="kicker" data-reveal>The screens</p><h2 data-split>Five screens, one calm flow.</h2></div>' +
         flow([('apps/xpense-1.webp', 'Overview', 'This month at a glance, with Quick Add right under it.'),
               ('apps/xpense-2.webp', 'New expense', 'Amount, category, done. Add a note or receipt if you like.'),
               ('apps/xpense-3.webp', 'History', 'Every expense grouped by day. Search, filter and swipe.'),
               ('apps/xpense-4.webp', 'Analyze', 'Category donut, month bars and month against month.'),
               ('apps/xpense-5.webp', 'Shared', 'Groups for flats and trips. Settle up in a tap.')]) + '</section>' +
         sec('Principles', points([('Clear', 'We say the number. “£3.40 logged to Food.” Plain, specific, no guessing.'), ('Calm', 'Quiet interfaces that stay out of your way and respect your attention.'), ('Private', 'No ads. No tracking you across other companies’ apps.'), ('Built to ship', 'Designed and built inside my own company, with every detail owned end to end.')]) +
             '<p><a class="link" href="https://dotxline.com/xpense.html" target="_blank" rel="noopener">See Xpense on dotxline.com ↗</a></p>'))
    # Tockbee
    case('tockbee', 'Case study · My product at dotXline', 'Every hour you work, on the <em>record</em>.',
         'Tockbee keeps your own record of every hour you work, so you can check your payslip and sort out missing pay.',
         [('Role', 'Founder · product and UI design'), ('Company', 'dotXline LTD'), ('Platform', 'iPhone and Android'), ('For', 'UK hourly and shift workers')],
         f'<div class="case-cover case-mock" data-img style="aspect-ratio:auto">{scene(P["tockbee"], lazy=False)}</div>',
         sec('The problem', '<p class="quote">Every hour you work should show up on your payslip.</p><p>Tockbee keeps an honest record on your phone and nobody else’s, so checking your pay takes a minute instead of an argument.</p>') +
         sec('How it works', points([
             ('Arrive. You’re clocked in.', 'By location at a work site or by joining your work Wi-Fi. Every automatic clock-in sends a notification with Undo.'),
             ('Every minute counts', 'Overtime, weekend and night rates and unpaid breaks, worked out as you go.'),
             ('Check it against your payslip', 'Copy in what your payslip says and Tockbee shows any hours or pay that went missing.'),
             ('Your timesheet, ready to share', 'A PDF or CSV with every shift and how it was recorded.')])) +
         '<section class="case-band"><div class="wrap section-head"><p class="kicker" data-reveal>The screens</p><h2 data-split>From clock-in to payslip check.</h2></div>' +
         flow([('apps/tockbee-today.webp', 'Today', 'The running shift, also on the Lock Screen and Dynamic Island.'),
               ('apps/tockbee-shifts.webp', 'Shifts', 'Times, breaks and how each shift was recorded.'),
               ('apps/tockbee-pay.webp', 'Pay', 'Gross, overtime and estimated take-home.'),
               ('apps/tockbee-payslip.webp', 'Payslip check', 'Possibly underpaid? You’ll know.'),
               ('apps/tockbee-export.webp', 'Export', 'Your timesheet as PDF or CSV.')]) + '</section>' +
         sec('Honest by design', '<p class="lead">Tax is an estimate, and the app says so.</p><p>Tockbee calls it <strong>estimated take-home</strong>: after PAYE (including Scottish rates), National Insurance, student loan and pension. Your payslip stays the official figure. And Tockbee collects no data at all.</p>' +
             f'<div class="duo">{"".join(f"<div class=\"media\" data-img>{img(x, a, chr(123)+'root'+chr(125))}</div>" for x, a in [("apps/tockbee-preview.webp", "Tockbee promo: clocked in by location"), ("apps/tockbee-itemised.webp", "Tockbee promo: itemised shift receipt")])}</div>' +
             '<p><a class="link" href="https://dotxline.com/tockbee.html" target="_blank" rel="noopener">See Tockbee on dotxline.com ↗</a></p>'))
    # Chatvertiser
    case('chatvertiser', 'Case study · Web design · Ad tech UX', 'Advertising that starts with a <em>conversation</em>.',
         'An AI-powered advertising platform that turns conversations into conversion tools.',
         [('Role', 'Web and UX design, logo'), ('Industry', 'Advertising technology'), ('Deliverables', 'Web app UI and brand mark'), ('Prototype', '<a href="https://www.behance.net/gallery/224174429/Chatvertiser" target="_blank" rel="noopener">Behance ↗</a>')],
         cover_img('work/chatvertiser.webp', 'Chatvertiser web app on a laptop'),
         sec('Overview', '<p class="lead">One chat, the whole campaign.</p><p>The design focused on a fluid, chat-based interface that simplifies campaign creation, audience targeting and performance tracking, all through one intuitive conversational flow.</p>') +
         sec('Design focus', points([('Campaigns by chat', 'Creating a campaign feels like describing it, not filling in a long form.'), ('Targeting in context', 'Audience choices sit inside the same conversation.'), ('Results in the flow', 'Performance tracking stays one message away.'), ('A mark to match', 'I also designed the Chatvertiser logo, a speech bubble with a pulse.')])) +
         f'<section class="case-band"><div class="wrap"><div class="duo"><div class="media" data-img>{img("work/chatvertiser-2.webp", "Chatvertiser support system screens", "{root}")}</div><div class="media" data-img style="display:grid;place-items:center;padding:12%;background:var(--card)">{img("brand/logo-chatvertiser-logo.webp", "Chatvertiser logo", "{root}", "mono-logo")}</div></div></div></section>')
    # Greenlife
    case('greenlife', 'Case study · App design · Retail', 'Shopping, from list to <em>checkout</em>.',
         'An everyday shopping assistant app designed to make the trip faster, from building the list to paying at the till.',
         [('Role', 'App design'), ('Industry', 'Retail and grocery'), ('Platform', 'Mobile app'), ('Prototype', '<a href="https://www.behance.net/gallery/109365235/Grocery-Shopping-App" target="_blank" rel="noopener">Behance ↗</a>')],
         cover_img('work/greenlife.webp', 'Greenlife app screens with fresh produce'),
         sec('Overview', '<p class="lead">Built for the shop floor, not the sofa.</p><p>The UI focuses on simplicity, accessibility and visual clarity, so the app stays easy to use with one hand and a full basket.</p>') +
         sec('Design focus', points([('List creation', 'Build the list quickly before you leave home.'), ('In-store efficiency', 'Find what is next without hunting through menus.'), ('Accessible by default', 'Clear contrast, large targets and readable type.'), ('Fresh visual voice', 'A green, produce-led identity that feels like the food it sells.')])))
    # OmniGPS
    case('omnigps', 'Case study · Website design · Logistics', 'Fleet management with <em>precision</em>.',
         'A precision-driven platform designed for streamlined GPS-based fleet management.',
         [('Role', 'Website design'), ('Industry', 'Logistics and fleet'), ('Deliverable', 'High-fidelity prototype'), ('Prototype', '<a href="https://www.figma.com/proto/t9IoN1CckA53uq74buAnSC/OmniGPS?page-id=0%3A1&amp;node-id=31-1171&amp;starting-point-node-id=31%3A1171&amp;t=HMgvx7lLLX0UqqaT-1" target="_blank" rel="noopener">Figma ↗</a>')],
         cover_scene(P['omnigps']),
         sec('Overview', '<p class="lead">Every vehicle, one calm screen.</p><p>The project emphasised scalable interface systems and smooth navigation for logistics professionals who live in the dashboard all day.</p>') +
         sec('Design focus', points([('Scalable interface system', 'Components that hold up from one van to a whole fleet.'), ('Smooth navigation', 'Fast routes between map, vehicles and reports.'), ('Built for professionals', 'Dense information, organised so it stays readable.'), ('Clickable prototype', 'The full flow is explorable in Figma.')])))
    # Quantum Vac
    case('quantum-vac', 'Case study · Smart product · Interaction design', 'A smart vacuum you <em>actually</em> want to control.',
         'A high-fidelity prototype for a smart vacuum experience, focused on interaction models and seamless device control.',
         [('Role', 'Interaction and UI design'), ('Industry', 'Smart home'), ('Deliverable', 'High-fidelity prototype'), ('Prototype', '<a href="https://www.figma.com/proto/QLHC7r67dnviP4nckmwKhn/Quantum-Vac?page-id=6%3A65&amp;type=design&amp;node-id=7-67&amp;viewport=797%2C223%2C0.06&amp;t=RI1gczhAfvg7R0VD-1&amp;scaling=scale-down&amp;starting-point-node-id=7%3A67&amp;show-proto-sidebar=1&amp;mode=design" target="_blank" rel="noopener">Figma ↗</a>')],
         cover_scene(P['quantum-vac']),
         sec('Overview', '<p class="lead">Hardware, made obvious.</p><p>The prototype explores interaction models for a smart vacuum and seamless device control through intuitive UI components.</p>') +
         sec('Design focus', points([('Interaction models', 'How a person starts, pauses and steers a robot, mapped out first.'), ('Device control', 'Status and controls in components that read at a glance.'), ('Feedback', 'Progress like battery and cleaning shown as simple dials.'), ('High fidelity', 'A prototype close enough to real to test with people.')])))

# ---------------------------------------------------------------- dotXline
def dotxline():
    body = f'''<section class="page-hero dx-hero">
  <div class="wrap">
    <img class="dx-logo" src="{{root}}assets/img/apps/logo-dark.svg" alt="dotXline" width="320" height="54" data-reveal data-hero>
    <p class="kicker" data-reveal data-hero>My company · Director</p>
    <h1 data-split data-hero>Small, exact apps that just work.</h1>
    <p class="lede" data-reveal data-hero style="--d:.3s">dotXline LTD is a product company in Cardiff. We make everyday money and work feel simple, one carefully built app at a time. As Director, I lead the product and design every screen.</p>
    <div class="hero-meta" data-reveal data-hero style="--d:.4s"><span>Role <b>Director</b></span><span>Based in <b>Cardiff, United Kingdom</b></span><span>Apps <b>Xpense, Tockbee</b></span></div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head"><p class="kicker" data-reveal>The name is the method</p><h2 data-split>We build from zero to one.</h2></div>
    <div class="dx-story" data-spot>
      <div data-reveal><span class="sym">0</span><h3>Who we are.</h3><p>A small product company in Cardiff. Every app starts as a blank page and one small, exact idea.</p></div>
      <div data-reveal style="--d:.1s"><span class="sym">×</span><h3>Where this meets that.</h3><p>We look for the point where an everyday problem meets a simple answer: what you spent, the hours you worked, what you’re owed.</p></div>
      <div data-reveal style="--d:.2s"><span class="sym">1</span><h3>Then we finish it.</h3><p>One app at a time, built natively and kept simple, until it does its job without fuss.</p></div>
    </div>
  </div>
</section>
<section class="wrap app-sec">
  <div>
    <div class="app-id" data-reveal>{img('apps/xpense-icon.webp', '', '{root}')}<div><b>Xpense</b><br><span style="color:var(--muted)">by dotXline</span></div></div>
    <h2 data-split>Every penny, in plain sight.</h2>
    <div class="body" data-reveal><p>A calm, native iPhone expense tracker. Log spending, set budgets and goals, and split costs with friends.</p><div class="tags"><span>iPhone</span><span>Coming soon</span><span>No ads</span></div><p><a class="btn" href="{{root}}work/xpense.html" data-magnetic data-label="Xpense"><span>Read the case study</span></a></p></div>
  </div>
  <div class="stack" data-reveal>{''.join(f'<div class="shot">{img(x, "Xpense screen", "{root}")}</div>' for x in ['apps/xpense-3.webp', 'apps/xpense-1.webp', 'apps/xpense-4.webp'])}</div>
</section>
<section class="wrap app-sec">
  <div>
    <div class="app-id" data-reveal>{img('apps/tockbee-icon.webp', '', '{root}')}<div><b>Tockbee</b><br><span style="color:var(--muted)">by dotXline</span></div></div>
    <h2 data-split>Every hour you work, on the record.</h2>
    <div class="body" data-reveal><p>Tockbee clocks you in when you arrive at work, works out your pay and take-home, and checks your payslip against the hours you really worked.</p><div class="tags"><span>iPhone and Android</span><span>UK shift workers</span><span>No account, no tracking</span></div><p><a class="btn" href="{{root}}work/tockbee.html" data-magnetic data-label="Tockbee"><span>Read the case study</span></a></p></div>
  </div>
  <div class="stack" data-reveal>{''.join(f'<div class="shot">{img(x, "Tockbee screen", "{root}")}</div>' for x in ['apps/tockbee-shifts.webp', 'apps/tockbee-today.webp', 'apps/tockbee-payslip.webp'])}</div>
</section>
<section class="section alt">
  <div class="wrap">
    <div class="section-head"><p class="kicker" data-reveal>How we work</p><h2 data-split>Three habits, in every app.</h2></div>
    <div class="why three" data-spot>
      <div class="why-card" data-reveal><span class="big">Clear.</span><h3>We say the number.</h3><p>“£3.40 logged to Food.” Plain words, specific amounts, no guessing.</p></div>
      <div class="why-card" data-reveal style="--d:.08s"><span class="big">Calm.</span><h3>Quiet interfaces</h3><p>They stay out of your way and respect your attention. No guilt, no alarms.</p></div>
      <div class="why-card" data-reveal style="--d:.16s"><span class="big">Private.</span><h3>As little as possible.</h3><p>No ads. No selling your data. Xpense keeps receipt photos on your iPhone and Tockbee collects no data at all.</p></div>
    </div>
    <p data-reveal style="margin-top:40px"><a class="link" href="https://dotxline.com" target="_blank" rel="noopener">Visit dotxline.com ↗</a></p>
  </div>
</section>'''
    page('dotxline.html', 'dotXline · Nagules Gobi', 'Nagules Gobi is Director of dotXline LTD, a Cardiff product company that makes Xpense and Tockbee.', 'dotxline.html', body)

# ---------------------------------------------------------------- brand
GALLERY = [
  ('logo-hanek', 'Hanek', 'Logo', 'identity', True), ('allura', 'Allura Apparel', 'Brand guide', 'identity', False),
  ('logo-phinaturals', 'PhiNaturals', 'Logo · Nature’s formula', 'identity', True), ('unlucky-ninja', 'Unlucky Ninja', 'Logo and wallpaper', 'identity', False),
  ('turmeric-ad', 'Turmeric Curcumin', 'Social ad · buy one get one', 'campaign', False), ('logo-nation-insure', 'Nation Insure', 'Logo', 'identity', True),
  ('viviendo-del-trade', 'Viviendo del Trade', 'Book cover', 'print', False), ('team-reddin', 'Team Reddin', 'Logo', 'identity', False),
  ('logo-mr-physics', 'Mr Physics', 'Logo', 'identity', True), ('humanity', 'Humanity', 'Logo system', 'identity', False),
  ('fanera', 'Fanera', 'App launch visual', 'campaign', False), ('cheat-court', 'Cheat Court', 'Logo', 'identity', False),
  ('awesom', 'Awesom', 'Brand identity · triple your energy', 'identity', False), ('handicap', 'Handicap', 'Book poster', 'print', False),
  ('logo-cupid-theory', 'Cupid Theory', 'Logo', 'identity', True), ('vacay360', 'Vacay360', 'Logo and colour system', 'identity', False),
  ('growing-together', 'Growing Together', 'School fundraising campaign', 'campaign', False), ('video-game-break', 'Video Game Break', 'Logo and favicon', 'identity', False),
  ('mushroom-formulas', 'Medicinal mushroom formulas', 'Product ad', 'campaign', False), ('fitfables', 'FitFables', 'Logo', 'identity', False),
  ('wappnegocio', 'WappNegocio', 'Logo', 'identity', False), ('ink-calligraphy', 'Brush calligraphy', 'Artwork', 'print', False),
  ('suomen-tulkkauspalvelut', 'Suomen Tulkkauspalvelut', 'Logo', 'identity', False), ('plegables', 'Plegables.org', 'Logo', 'identity', False),
  ('sachet', 'Sachet', 'Packaging design', 'packaging', False), ('tiquipaya', 'Tiquipaya.net', 'Logo', 'identity', False),
  ('whitsunday-kombi', 'Whitsunday Kombi', 'Logo', 'identity', False), ('cupid-theory-rect', 'Cupid Theory', 'Logo on colour', 'identity', False),
  ('logo-chatvertiser-logo', 'Chatvertiser', 'Logo', 'identity', True),
]
def brand():
    items = ''
    for k, title, kind, cat, logo in GALLERY:
        key = ('logo/' + k[5:]) if logo else ('brand/' + k)
        w, h = SIZES[key]; src = f'{{root}}assets/img/brand/{k}.webp'
        pad = ' style="padding:14% 10%;background:var(--card)"' if logo else ''
        cls = ' class="mono-logo"' if logo else ''
        items += f'<button class="gitem" type="button" data-cat="{cat}" data-full="{src}" data-title="{E(title)}" data-kind="{E(kind)}" data-cursor="Open"{pad}><img{cls} src="{src}" alt="{E(title)}, {E(kind.lower())}" width="{w}" height="{h}" loading="lazy" decoding="async"><span class="gcap"><b>{E(title)}</b><span>{E(kind)}</span></span></button>'
    n = len(GALLERY)
    body = f'''<section class="page-hero">
  <div class="glow" aria-hidden="true"></div>
  <div class="wrap">
    <p class="kicker" data-reveal data-hero>Graphic and brand design</p>
    <h1 data-split data-hero>Every pixel shaped with <em>purpose</em>.</h1>
    <p class="lede" data-reveal data-hero style="--d:.3s">Alongside product work, I create bold visual identities and branding that help businesses stand out, connect with their audience and grow with confidence. {n} pieces below. Tap any of them to view it full screen.</p>
  </div>
</section>
<section class="section" style="padding-top:0" id="campaigns">
  <div class="wrap">
    <div class="filters" data-reveal>
      <div class="chipset" data-filter-group="gallery" role="group" aria-label="Filter brand work">
        <button class="chip" type="button" data-filter="all" aria-pressed="true">All<sup></sup></button>
        <button class="chip" type="button" data-filter="identity" aria-pressed="false">Logos and identity<sup></sup></button>
        <button class="chip" type="button" data-filter="campaign" aria-pressed="false">Campaigns<sup></sup></button>
        <button class="chip" type="button" data-filter="print" aria-pressed="false">Print<sup></sup></button>
        <button class="chip" type="button" data-filter="packaging" aria-pressed="false">Packaging<sup></sup></button>
      </div>
    </div>
    <div class="masonry" id="gallery">{items}</div>
  </div>
</section>'''
    page('brand.html', 'Brand Design · Nagules Gobi', 'Logos, identities, campaigns and print design by Nagules Gobi.', 'brand.html', body, lightbox=True)

# ---------------------------------------------------------------- about
def about():
    body = f'''<section class="page-hero">
  <div class="glow" aria-hidden="true"></div>
  <div class="wrap">
    <p class="kicker" data-reveal data-hero>About</p>
    <h1 data-split data-hero>Designer. Director. <em>Builder.</em></h1>
  </div>
</section>
<section class="section" style="padding-top:0">
  <div class="wrap about-grid">
    <figure class="portrait" style="margin:0">
      <div class="media" data-img><div class="plx" data-parallax="0.06">{img('me/portrait.webp', 'Nagules Gobi', '{root}', lazy=False)}</div></div>
      <figcaption><span>Gobikrishna Naguleswararajah</span><span>Nagules Gobi</span></figcaption>
    </figure>
    <div class="bio">
      <p class="lead" data-reveal>I design products people actually enjoy using, and I build my own.</p>
      <p data-reveal>I’m <strong>Nagules Gobi</strong>, a product designer in the United Kingdom working across UX/UI, web and app design, and brand identity. Over six years I’ve shipped <strong>30 projects across 3 countries</strong>, from fleet dashboards and ad-tech platforms to shopping apps and logos.</p>
      <p data-reveal>I’m also <strong>Director of dotXline LTD</strong>, a product company in Cardiff. There I design and build Xpense, a calm iPhone expense tracker, and Tockbee, a shift and pay tracker for UK workers. Owning products end to end taught me to design for the people using them and for the team that has to ship them.</p>
      <p data-reveal>I studied for a <strong>BSc in Computing</strong>, and today I also build what I design. I use <strong>AI-assisted development</strong> to turn designs into working products quickly, then review and refine the code myself. It means I can prototype in code, test ideas with real users sooner, and talk to engineering teams in their own language.</p>
      <dl class="facts" data-reveal>
        <div><dt>Role</dt><dd>Product designer who builds</dd></div>
        <div><dt>Company</dt><dd>Director, dotXline LTD</dd></div>
        <div><dt>Builds with</dt><dd>Code and AI-assisted development</dd></div>
        <div><dt>Education</dt><dd>BSc in Computing</dd></div>
        <div><dt>Experience</dt><dd>6 years · 30 projects</dd></div>
        <div><dt>Open to</dt><dd>Roles and freelance</dd></div>
      </dl>
      <p data-reveal><a class="btn" href="{{root}}contact.html" data-magnetic data-label="Contact"><span>Hire me</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></p>
    </div>
  </div>
</section>
<section class="section alt">
  <div class="wrap">
    <div class="section-head"><p class="kicker" data-reveal>How I work</p><h2 data-split>From first question to working product.</h2><p data-reveal>The same five steps on every project. Timelines depend on the size of the work, and I share one after our first call.</p></div>
    <ol class="steps" data-reveal>
      <li style="--i:0"><b>Discovery</b><span>Research the people, the goal and the constraints.</span></li>
      <li style="--i:1"><b>Wireframes</b><span>Structure and flow before any polish.</span></li>
      <li style="--i:2"><b>UI design</b><span>High-fidelity screens and a visual system.</span></li>
      <li style="--i:3"><b>Prototype</b><span>An interactive version to test and refine.</span></li>
      <li style="--i:4"><b>Build</b><span>I build it with AI-assisted development, or hand clean specs to your developers.</span></li>
    </ol>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="section-head"><p class="kicker" data-reveal>Capabilities</p><h2 data-split>What you get when you hire me.</h2></div>
    <div class="services six" data-spot>
      <div class="service" data-reveal><span class="num">Strategy</span><h3>Product design strategy</h3><p>User-focused strategy rooted in research and aligned with business goals.</p></div>
      <div class="service" data-reveal style="--d:.06s"><span class="num">Interfaces</span><h3>Web &amp; app design</h3><p>Concept to high-fidelity design for web, iPhone and Android.</p></div>
      <div class="service" data-reveal style="--d:.12s"><span class="num">Usability</span><h3>UI/UX optimisation</h3><p>Engaging, accessible interfaces that perform better.</p></div>
      <div class="service" data-reveal style="--d:.18s"><span class="num">Identity</span><h3>Brand identity</h3><p>Logos and visual systems that give a product its voice.</p></div>
      <div class="service" data-reveal style="--d:.24s"><span class="num">Prototyping</span><h3>Prototypes in code</h3><p>Interactive prototypes that feel real, ready to test with users.</p></div>
      <div class="service" data-reveal style="--d:.3s"><span class="num">Building</span><h3>AI-assisted development</h3><p>Designs turned into working front ends and apps, reviewed and refined by me.</p></div>
    </div>
  </div>
</section>'''
    page('about.html', 'About · Nagules Gobi', 'About Nagules Gobi: product designer, Director of dotXline LTD, BSc in Computing.', 'about.html', body)

# ---------------------------------------------------------------- contact
def contact():
    body = f'''<section class="page-hero">
  <div class="glow" aria-hidden="true"></div>
  <div class="wrap">
    <p class="kicker" data-reveal data-hero><span class="avail"><span class="pulse" style="width:8px;height:8px;border-radius:50%;background:#22B35E;display:inline-block"></span>Available now</span></p>
    <h1 data-split data-hero>Let’s work <em>together</em>.</h1>
    <p class="lede" data-reveal data-hero style="--d:.3s">Hiring for a product design role, or need a designer for a project? Tell me a little about it and I’ll get back to you.</p>
  </div>
</section>
<section class="section" style="padding-top:0">
  <div class="wrap contact-wrap">
    <form class="cform" data-compose novalidate data-reveal>
      <fieldset><legend>I’m looking for</legend><div class="chipset">
        <button class="chip" type="button" data-chip aria-pressed="false">Full-time role</button>
        <button class="chip" type="button" data-chip aria-pressed="false">Freelance project</button>
        <button class="chip" type="button" data-chip aria-pressed="false">App design</button>
        <button class="chip" type="button" data-chip aria-pressed="false">Website</button>
        <button class="chip" type="button" data-chip aria-pressed="false">Brand identity</button>
        <button class="chip" type="button" data-chip aria-pressed="false">Design and build</button>
      </div></fieldset>
      <div class="row">
        <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="f-email">Your email</label><input id="f-email" name="email" type="email" autocomplete="email"></div>
      </div>
      <div class="field"><label for="f-company">Company</label><input id="f-company" name="company" autocomplete="organization"></div>
      <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" required placeholder="The role or project, the timeline, and anything I should know."></textarea></div>
      <div class="btns"><button class="btn" type="submit" data-magnetic><span>Write the email</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></div>
      <p class="form-status" data-status role="status"></p>
    </form>
    <aside class="side-card" data-reveal style="--d:.15s">
      <p class="kicker" style="margin:0">Email me directly</p>
      <p class="email">{EMAIL}</p>
      <div class="btns"><button class="btn btn-sm" type="button" data-copy="{EMAIL}"><span data-copy-label>Copy email</span></button><a class="btn btn-sm btn-ghost" href="mailto:{EMAIL}"><span>Open mail app</span></a></div>
      <p style="margin-top:8px;color:var(--muted);font-size:15px">Helpful to include:</p>
      <ul><li>The role or project</li><li>Your timeline</li><li>A link to the product, if there is one</li></ul>
      <p style="color:var(--muted);font-size:15px">London time <b style="color:var(--text)"><time data-clock>--:--</time></b></p>
    </aside>
  </div>
</section>
<section class="section alt" id="faq">
  <div class="wrap faq-grid">
    <div class="section-head"><p class="kicker" data-reveal>FAQ</p><h2 data-split>Questions, answered.</h2></div>
    <div class="faq" data-reveal>
      <details><summary>Can you guarantee improvements in conversions?<i aria-hidden="true"></i></summary><div class="faq-a"><p>No designer can honestly guarantee a number. What I can promise is a process built on research, clear goals and testing, so every design decision is aimed at making your product easier to use and easier to say yes to.</p></div></details>
      <details><summary>How much does it cost to design one web page?<i aria-hidden="true"></i></summary><div class="faq-a"><p>It depends on scope: the content, the number of states and breakpoints, and whether you need a design system behind it. Tell me about your project and I’ll send a clear quote.</p></div></details>
      <details><summary>What’s your process like, and how long does it take?<i aria-hidden="true"></i></summary><div class="faq-a"><p>Discovery and research, then wireframes, UI design, an interactive prototype and a clean handoff to development. Timelines depend on the size of the project, and I’ll share one after our first call.</p></div></details>
      <details><summary>Can you build what you design?<i aria-hidden="true"></i></summary><div class="faq-a"><p>Yes. Alongside design, I build with code and AI-assisted development: interactive prototypes, front ends and full apps like Xpense and Tockbee at dotXline. For larger products I work with your engineers and hand over clean specs.</p></div></details>
      <details><summary>Are you open to full-time roles?<i aria-hidden="true"></i></summary><div class="faq-a"><p>Yes. I’m open to product design roles as well as freelance projects. Send me the details and let’s talk.</p></div></details>
    </div>
  </div>
</section>'''
    page('contact.html', 'Contact · Nagules Gobi', 'Hire Nagules Gobi for a product design role or project.', 'contact.html', body, cta='Prefer a call? Let’s talk it through.')

def extras():
    open(os.path.join(OUT, 'graphicdesigner.html'), 'w').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Brand Design · Nagules Gobi</title><meta http-equiv="refresh" content="0; url=brand.html"><link rel="canonical" href="https://www.nagulesgobi.com/brand.html"></head><body><p>This page has moved to <a href="brand.html">Brand design</a>.</p></body></html>\n')
    open(os.path.join(OUT, 'CNAME'), 'w').write('www.nagulesgobi.com\n')
    open(os.path.join(OUT, '.nojekyll'), 'w').write('')
    pages = ['', 'work.html', 'dotxline.html', 'brand.html', 'about.html', 'contact.html'] + [f'work/{p["slug"]}.html' for p in PROJECTS]
    open(os.path.join(OUT, 'sitemap.xml'), 'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'  <url><loc>https://www.nagulesgobi.com/{p}</loc></url>\n' for p in pages) + '</urlset>\n')
    open(os.path.join(OUT, 'robots.txt'), 'w').write('User-agent: *\nAllow: /\nSitemap: https://www.nagulesgobi.com/sitemap.xml\n')
    four = head('Page not found · Nagules Gobi', 'This page does not exist.', '/') + chrome('/', '') + '<main id="main"><section class="page-hero" style="min-height:80vh"><div class="glow" aria-hidden="true"></div><div class="wrap"><p class="kicker">404</p><h1 data-split data-hero>This page <em>doesn’t</em> exist.</h1><div class="btns" style="margin-top:40px"><a class="btn" href="/index.html"><span>Back to home</span></a><a class="btn btn-ghost" href="/work.html"><span>See my work</span></a></div></div></section></main></body></html>\n'
    open(os.path.join(OUT, '404.html'), 'w').write(four)

if __name__ == '__main__':
    if os.path.isdir(os.path.join(OUT, 'assets')): shutil.rmtree(os.path.join(OUT, 'assets'))
    os.makedirs(OUT, exist_ok=True)
    shutil.copytree(os.path.join(HERE, 'assets'), os.path.join(OUT, 'assets'))
    js = os.path.join(OUT, 'assets', 'js', 'site.js'); s = open(js).read()
    s = re.sub(r"var MARK_D = '[^']+';", f"var MARK_D = '{MARK100}';", s); open(js, 'w').write(s)
    home(); work_index(); cases(); dotxline(); brand(); about(); contact(); extras()
    print('built', sorted(os.path.relpath(os.path.join(d, f), OUT) for d, _, fs in os.walk(OUT) for f in fs if f.endswith('.html')))
