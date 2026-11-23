/* FreshBit website: theme, menu, reveal, score lab, light/dark compare, and the working phone demo.
   The demo is a small copy of the iPhone app. Its stories are the ones in the app on
   Thursday 12 November 2026; headlines belong to their publishers. Scoring follows the app's
   own rules (fb-ingest/logic.ts), so every score here is what the backend would give. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DARKQ = window.matchMedia('(prefers-color-scheme: dark)');

  /* ---------------- icons (24px stroke set, plus the FreshBit leaf) ---------------- */
  var LEAF = 'M50 20H80V50C80 66.6 66.6 80 50 80H20V50C20 33.4 33.4 20 50 20ZM34.5 61.5L61.5 34.5L66.5 39.5L39.5 66.5Z';
  var P = {
    leaf: '<svg viewBox="15 15 70 70" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="' + LEAF + '"/></svg>',
    leafInk: '<svg viewBox="15 15 70 70" aria-hidden="true"><path fill="#0A0A0C" fill-rule="evenodd" d="' + LEAF + '"/></svg>',
    search: s('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>'),
    chevUp: s('<path d="m6 15 6-6 6 6"/>'),
    back: s('<path d="m15 5-7 7 7 7"/>'),
    share: s('<path d="M12 15V3M8 7l4-4 4 4"/><path d="M6 11H5v10h14V11h-1"/>'),
    bm: s('<path d="M6 3h12v18l-6-4.5L6 21z"/>'),
    bmFill: f('<path d="M6 3h12v18l-6-4.5L6 21z"/>'),
    bolt: f('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
    seal: f('<path d="M12 1.5l2.6 1.9 3.2-.2 1 3 2.7 1.8-1 3.1 1 3.1-2.7 1.8-1 3-3.2-.2L12 22.5l-2.6-1.9-3.2.2-1-3-2.7-1.8 1-3.1-1-3.1 2.7-1.8 1-3 3.2.2z"/><path d="m8 12 2.6 2.6L16 9.4" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
    clock: s('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    excl: s('<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/>'),
    check: s('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
    checkCircle: f('<circle cx="12" cy="12" r="10"/><path d="m7.5 12.2 3 3 6-6" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'),
    arrowUR: s('<path d="M7 17 17 7M8 7h9v9"/>'),
    arrowUp: s('<path d="M12 19V5M6 11l6-6 6 6"/>'),
    pin: s('<path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>'),
    bell: s('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>'),
    bellFill: f('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>'),
    cal: s('<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/>'),
    news: s('<rect x="3" y="4" width="15" height="16" rx="2"/><path d="M18 8h3v10a2 2 0 0 1-2 2H5M7 8h7M7 12h7M7 16h4"/>'),
    newsF: f('<path d="M5 3h12a2 2 0 0 1 2 2v1h1a1 1 0 0 1 1 1v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2zm2 5v2h8V8zm0 4v2h8v-2zm0 4v2h5v-2zm12-8v10a1 1 0 0 0 1 1V8z"/>'),
    compass: s('<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>'),
    compassF: f('<path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm4.2 5.8-6 2.4-2.4 6 6-2.4z"/>'),
    gear: s('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.3l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.7 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    person: s('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    eye: s('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    eyeOff: s('<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>'),
    plus: s('<path d="M12 5v14M5 12h14"/>'),
    x: s('<path d="M6 6l12 12M18 6 6 18"/>'),
    updown: s('<path d="m8 9 4-4 4 4M8 15l4 4 4-4"/>'),
    chevR: s('<path d="m9 6 6 6-6 6"/>'),
    apple: f('<path d="M16.4 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.7zM14.1 5.6c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3z"/>'),
    sig: '<svg viewBox="0 0 18 11" aria-hidden="true"><rect x="0" y="7" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="5" width="3" height="6" rx="1" fill="currentColor"/><rect x="10" y="2.5" width="3" height="8.5" rx="1" fill="currentColor"/><rect x="15" y="0" width="3" height="11" rx="1" fill="currentColor"/></svg>',
    wifi: '<svg viewBox="0 0 16 11" aria-hidden="true"><path fill="currentColor" d="M8 2.2c2.3 0 4.4.9 6 2.4l1.1-1.2A10.2 10.2 0 0 0 8 .6C5.3.6 2.8 1.6.9 3.4L2 4.6c1.6-1.5 3.7-2.4 6-2.4zm0 3.3c1.4 0 2.6.5 3.6 1.4l1.1-1.2A6.8 6.8 0 0 0 8 3.9c-1.8 0-3.4.7-4.7 1.8l1.1 1.2c1-.9 2.2-1.4 3.6-1.4zm0 3.3c-.6 0-1.1.2-1.5.6L8 11l1.5-1.6c-.4-.4-.9-.6-1.5-.6z"/></svg>',
    batt: '<svg viewBox="0 0 26 12" aria-hidden="true"><rect x=".5" y=".5" width="22" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="19" height="8" rx="2" fill="currentColor"/><rect x="23.5" y="4" width="1.8" height="4" rx=".9" fill="currentColor" opacity=".4"/></svg>',
    lock: s('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
    flash: s('<path d="M9 2h6l-1 6h4l-8 14 2-10H8z"/>'),
    camera: s('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>')
  };
  function s(x) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + x + '</svg>'; }
  function f(x) { return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + x + '</svg>'; }
  window.FBI = P;

  /* ---------------- data: the app on Thursday 12 November 2026 ---------------- */
  var CAT = { design: 'Design', ux: 'UX/UI', ai: 'AI', dev: 'Dev' };
  var COL = { design: '#14B8A6', ux: '#E8578A', ai: '#2F7BF6', dev: '#F2802F' };
  var TIER = ['', 'Official source', 'Established outlet', 'Community'];
  var SOURCES = {
    1: ['OpenAI', 'Google DeepMind', 'Google AI', 'Hugging Face', 'GitHub Changelog', 'GitHub Blog', 'Vercel', 'React', 'Next.js', 'Expo Blog', 'Expo Changelog', 'Apple Developer', 'Android Developers', 'Chrome for Developers', 'web.dev', 'Mozilla Hacks', 'Deno', 'Node.js', 'TypeScript', 'Figma', 'Figma Release Notes', 'Material Design', 'Linear Changelog', 'WebKit', 'Tailwind CSS', 'Svelte', 'Astro', 'Bun', 'Cloudflare Blog', 'JetBrains'],
    2: ['NN/g', 'Smashing Magazine', 'UX Collective', 'A List Apart', 'Sidebar', 'Creative Bloq', 'CSS-Tricks', 'InfoQ', 'The New Stack', 'Simon Willison', 'MIT Technology Review', 'TechCrunch AI', 'Ars Technica', 'The Verge', '9to5Mac', 'Dribbble Stories', 'UX Planet', 'UXmatters'],
    3: ['Hacker News', 'Lobsters', 'Product Hunt']
  };
  window.FB_SOURCES = SOURCES;
  function tierOf(name) { return SOURCES[1].indexOf(name) > -1 ? 1 : SOURCES[2].indexOf(name) > -1 ? 2 : 3; }

  // [id, headline, source, age, category, extra sources]. Headlines and summaries are FreshBit's own
  // words (display_title), exactly as the app shows them; the app never shows a publisher's headline.
  var RAW = [
    [547, 'Google DeepMind introduces Gemini 4 Hydrogen model', 'Google DeepMind', '23h ago', 'ai', [['Vercel', '23h ago'], ['Google DeepMind', '5h ago'], ['Hacker News', '5h ago'], ['9to5Mac', '5h ago'], ['Product Hunt', '4h ago']]],
    [654, 'Google launches Gemini 4 with dynamic mid-task model switching', 'The New Stack', '2h ago', 'ai'],
    [655, 'Coding agents evolve to support parallel swarms and multiplayer setups', 'The New Stack', '2h ago', 'dev'],
    [651, 'Opera One brings Data Saver to iOS and cuts bandwidth usage', '9to5Mac', '2h ago', 'dev'],
    [548, 'Google updates Search globally with new Gemini 4 Hydrogen model', 'Google AI', '5h ago', 'ai', [['Google AI', '5h ago'], ['Hacker News', '4h ago'], ['TechCrunch AI', '4h ago'], ['The Verge', '1h ago']]],
    [545, 'Expo launches cloud simulators and emulators for coding agents', 'Expo Blog', '6h ago', 'dev', [['Expo Blog', '6h ago'], ['Product Hunt', '4h ago']]],
    [333, 'Figma details workflow behind its 3D transform launch video', 'Figma', '9h ago', 'design'],
    [536, 'Figma introduces native 3D design tools and direct code output', 'Figma Release Notes', '23h ago', 'design'],
    [10, 'Law firm adopts machine learning for business operations', 'OpenAI', '23h ago', 'ai'],
    [118, 'Airlines restrict autonomous software from booking tickets', 'The Verge', '1d ago', 'ai', [['Hacker News', '2d ago'], ['The Verge', '1d ago'], ['TechCrunch AI', '6h ago']]],
    [96, 'Amazon Web Services introduces local testing clone', 'The New Stack', '1d ago', 'dev', [['The New Stack', '1d ago'], ['Hacker News', '1d ago'], ['Simon Willison', '1d ago']]],
    [75, 'Why the term design system matters more than its parts', 'Sidebar', '2d ago', 'design', [['Sidebar', '2d ago'], ['UX Collective', '1d ago']]],
    [99, 'Anthropic reveals multi-chip AI strategy', 'Simon Willison', '2d ago', 'ai', [['Simon Willison', '2d ago'], ['Hacker News', '11h ago']]]
  ];
  var ORG = { 'Google DeepMind': 'google', 'Google AI': 'google' };
  var STORIES = RAW.map(function (r) {
    var list = r[5] ? r[5].map(function (x) { return { name: x[0], tier: tierOf(x[0]), ago: x[1] }; }) : [{ name: r[2], tier: tierOf(r[2]), ago: r[3] }];
    var orgs = {};
    list.forEach(function (x) { orgs[ORG[x.name] || x.name] = x.tier; });
    var best = Math.min.apply(null, list.map(function (x) { return x.tier; }));
    var est = Object.keys(orgs).filter(function (k) { return orgs[k] <= 2; }).length;
    var all = Object.keys(orgs).length;
    var sc = score({ best: best, established: est, all: all, articles: list.length, agree: true, flags: 0, spec: false });
    return { id: r[0], t: r[1], src: r[2], ago: r[3], cat: r[4], sources: list, n: all, best: best, established: est, score: sc.total, st: sc.status };
  });
  var BY = {}; STORIES.forEach(function (x) { BY[x.id] = x; });
  // The Gemini story is the one the screenshots open, so it carries its brief and facts (from the app).
  BY[547].brief = 'Google DeepMind announced Gemini 4 Hydrogen, a model built for fast execution in everyday coding and agentic workflows. Hydrogen surpasses previous models on intelligence indices while maintaining flat pricing across its one million-token context window.';
  BY[547].facts = ['Gemini 4 Hydrogen', '1 million-token context', 'Flat pricing'];
  BY[547].when = 'Thu, 12 November 2026 · 18:00';
  BY[547].by = 'Koray Kavukcuoglu, Google DeepMind';
  BY[333].event = 'Figma Config 2026';
  // The subject of a FreshBit headline, shown on the designed cover when a story has no allowed image.
  // Same rules as the app (lib/subject.ts).
  var SMALL = {};
  ('a an the and or but for with from into on in at to of by as is are was were be its it this that new now how why what who your our we you more most just adds add gets get here meet see i my best top inside when where after following across using launches launch introduces releases release unveils ships report reports').split(' ').forEach(function (w) { SMALL[w] = 1; });
  function subjectOf(x) {
    var words = x.t.replace(/[“”"'’:|–—]/g, ' ').split(/\s+/).filter(Boolean).map(function (w) { return w.replace(/[.,!?]+$/, ''); });
    var best = [], cur = [], start = 0, bestStart = 0;
    words.forEach(function (w, i) {
      var proper = /^[A-Z0-9]/.test(w) && !SMALL[w.toLowerCase()];
      if (proper || (cur.length && /^\d/.test(w))) { if (!cur.length) start = i; cur.push(w); }
      else { if (cur.length > best.length) { best = cur; bestStart = start; } cur = []; }
    });
    if (cur.length > best.length) { best = cur; bestStart = start; }
    if (best.length === 1 && bestStart === 0 && !/[A-Z0-9]/.test(best[0].slice(1))) best = [];
    var t = best.slice(0, 3).join(' ');
    return t.length >= 2 ? t : x.src.replace(/\s+(Blog|Changelog|News|Engineering|Developers?)$/, '');
  }
  var COUNTS = { design: 25, ux: 6, ai: 78, dev: 41 };
  var TRENDING = [['ios', 5], ['gemini', 4], ['android', 3], ['openai', 3], ['anthropic', 3], ['open-source', 3], ['adobe', 3], ['claude', 2], ['figma', 2]];
  var EVENTS = [['Adobe MAX 2026', 7], ['Disrupt conference', 1]];
  var KEYWORDS = ['Claude', 'Gemini', 'OpenAI', 'Figma', 'SwiftUI', 'Liquid Glass', 'Expo', 'React Native', 'Next.js', 'WCAG', 'Design systems', 'Vercel'];
  var BRIEF_HOURS = [-1, 6, 7, 8, 9, 10, 12, 18, 21];

  /* ---------------- the app's scoring rules (fb-ingest/logic.ts) ---------------- */
  function score(o) {
    if (!o.best) return { total: 0, status: 'held', rows: [], reasons: ['No source has reported it yet.'] };
    var hasOfficial = o.best === 1;
    var tierPts = o.best === 1 ? 45 : o.best === 2 ? 35 : 10;
    var primaryPts = hasOfficial ? 20 : 0;
    var conf = o.established + (o.all - o.established) * 0.5; // community sources count half
    var corrPts = hasOfficial ? 20 : conf >= 3 ? 30 : conf >= 2 ? 15 : conf >= 1.5 ? 8 : 0;
    var consistency = o.articles === 1 ? 10 : 15, conflict = false;
    if (o.articles >= 2 && !o.agree) { consistency = 0; conflict = true; }
    var penalty = Math.min(20, o.flags * 10);
    var total = Math.max(0, Math.min(100, tierPts + primaryPts + corrPts + consistency - penalty));
    var status = total >= 75 ? 'verified' : total >= 50 ? 'reported' : total >= 40 ? 'developing' : 'held';
    if (o.spec && status === 'verified') status = 'reported';
    if (o.best === 3) status = 'held';
    var reasons = [];
    if (o.best === 1) reasons.push('Confirmed by the official source (company blog, changelog or release).');
    else if (o.best === 2) reasons.push('Reported by an established outlet, no official post found yet.');
    else reasons.push('Only community sites so far. FreshBit never publishes these on their own.');
    if (o.established >= 3) reasons.push(o.established + ' independent outlets report it.');
    else if (o.all >= 2) reasons.push(o.all + ' independent sources report it.');
    else reasons.push('Only one source so far. FreshBit re-checks every 30 minutes.');
    if (conflict) reasons.push('Sources disagree on version numbers.');
    if (o.spec) reasons.push('Contains rumour or leak wording, so it can never be marked Confirmed.');
    return {
      total: total, status: status, reasons: reasons,
      rows: [['Source tier', tierPts], ['Official source bonus', primaryPts], ['Corroboration', corrPts], ['Consistency', consistency], ['Red flags', -penalty]]
    };
  }

  var LABEL = { verified: 'Confirmed', reported: 'Reported', developing: 'Developing', held: 'Held back' };
  var LONG = { verified: 'Confirmed by trusted sources', reported: 'Reported', developing: 'Developing', held: 'Held back' };
  function badge(st) {
    var cls = st === 'verified' ? 'ok' : st === 'reported' ? 'rep' : st === 'developing' ? 'dev' : 'held';
    var ic = st === 'verified' ? P.seal : st === 'reported' ? P.excl : P.clock;
    return '<span class="badge ' + cls + '">' + ic + LABEL[st] + '</span>';
  }
  function cat(c) { return '<span class="cat d-' + c + '">' + CAT[c] + '</span>'; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  window.FBUI = { badge: badge, cat: cat, score: score, P: P };

  /* ---------------- site chrome ---------------- */
  function siteDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : DARKQ.matches;
  }
  var themeListeners = [];
  function onTheme(fn) { themeListeners.push(fn); }
  function themeChanged() { themeListeners.forEach(function (fn) { fn(); }); }
  DARKQ.addEventListener && DARKQ.addEventListener('change', themeChanged);
  d.querySelectorAll('.theme-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var next = siteDark() ? 'light' : 'dark';
      var apply = function () {
        root.setAttribute('data-theme', next);
        var cs = d.querySelector('meta[name="color-scheme"]'); if (cs) cs.content = next; // keeps native controls and light-dark() in step
        try { localStorage.setItem('fb-theme', next); } catch (e) {}
        b.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        themeChanged();
      };
      if (!d.startViewTransition || RM.matches) return apply();
      // the new theme grows out of the button as a circle, like nagulesgobi.com
      var r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      var end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      d.startViewTransition(apply).ready.then(function () {
        root.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 750, easing: 'cubic-bezier(.76,0,.24,1)', pseudoElement: '::view-transition-new(root)' });
      }).catch(function () { /* skipped (e.g. tab in the background): the theme still changes */ });
    });
  });
  var menuBtn = d.querySelector('.menu-btn'), nav = d.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); } });
  }
  // header: a Liquid Glass dock. Scrolling down tucks it into a round bubble with the leaf at the
  // right edge, like the app's folding Today header; scrolling up, or tapping the bubble, opens it.
  var top = d.querySelector('.top');
  if (top) (function () {
    var wrap = top.querySelector('.wrap');
    var dot = d.createElement('button');
    dot.className = 'dock-dot'; dot.type = 'button'; dot.tabIndex = -1;
    dot.setAttribute('aria-label', 'Open the menu'); dot.setAttribute('aria-expanded', 'false');
    dot.innerHTML = '<svg viewBox="15 15 70 70" aria-hidden="true"><path fill-rule="evenodd" d="' + LEAF + '"/></svg>';
    wrap.appendChild(dot);
    var parts = function () { return [].filter.call(wrap.children, function (c) { return c !== dot; }); };
    function measure() {
      if (top.classList.contains('collapsed')) return;
      var pad = parseFloat(getComputedStyle(top).paddingLeft) || 0;
      wrap.style.setProperty('--pw', Math.min(1120, Math.round(top.clientWidth - pad * 2)) + 'px');
      top.classList.add('ready');
    }
    function setCollapsed(c) {
      if (c === top.classList.contains('collapsed')) return;
      top.classList.toggle('collapsed', c); dot.tabIndex = c ? 0 : -1;
      dot.setAttribute('aria-expanded', String(!c));
      parts().forEach(function (p) { if (c) p.setAttribute('inert', ''); else p.removeAttribute('inert'); });
    }
    var lastY = window.scrollY, hold = 0, ticking = false;
    function onScroll() {
      ticking = false;
      var y = window.scrollY, dy = y - lastY;
      var menuOpen = nav && nav.classList.contains('open');
      if (y < 70) setCollapsed(false);
      else if (dy > 6 && y > 180 && !menuOpen && Date.now() > hold) setCollapsed(true);
      else if (dy < -6) setCollapsed(false);
      if (Math.abs(dy) > 6) lastY = y;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    dot.addEventListener('click', function () { hold = Date.now() + 2500; lastY = window.scrollY; setCollapsed(false); });
    top.addEventListener('focusin', function () { setCollapsed(false); });
    if (window.matchMedia('(pointer: fine)').matches) wrap.addEventListener('pointermove', function (e) {
      var r = wrap.getBoundingClientRect();
      wrap.style.setProperty('--hx', (e.clientX - r.left) + 'px');
      wrap.style.setProperty('--hy', (e.clientY - r.top) + 'px');
    });
    measure();
    window.addEventListener('resize', measure);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(measure);
    window.addEventListener('load', measure);
  })();

  // FreshBit for Mac. tools/release-mac.sh writes mac.json when a notarized build is published,
  // so the version shown here changes at the same moment as the app. Until then every
  // [data-mac] element stays hidden and the TestFlight call to action shows instead.
  if (window.fetch) fetch('mac.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (m) {
    if (!m || !m.version || !m.url) return;
    var mb = m.size ? (m.size / 1048576).toFixed(1).replace(/\.0$/, '') + ' MB' : '';
    var os = 'macOS ' + String(m.minimumOS || '26').replace(/\.0$/, '') + ' or later';
    d.querySelectorAll('a[data-mac-href]').forEach(function (a) { a.href = m.url; });
    d.querySelectorAll('[data-mac-version]').forEach(function (e) { e.textContent = m.version; });
    d.querySelectorAll('[data-mac-short]').forEach(function (e) { e.textContent = 'Version ' + m.version + (mb ? ' · ' + mb : ''); });
    d.querySelectorAll('[data-mac-meta]').forEach(function (e) { e.textContent = 'Version ' + m.version + ' · ' + os + ' · ' + (m.arch || 'Apple silicon') + (mb ? ' · ' + mb : ''); });
    root.classList.add('has-mac');
    if (top) window.dispatchEvent(new Event('resize'));
  }).catch(function () {});

  // reveal on scroll
  if ('IntersectionObserver' in window && !RM.matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    d.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
  } else d.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
  // copy buttons
  d.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = d.getElementById(b.getAttribute('data-copy'));
      if (!t || !navigator.clipboard) return;
      navigator.clipboard.writeText(t.innerText.trim()).then(function () {
        var o = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = o; }, 1600);
      });
    });
  });
  // case-study contents: highlight the chapter in view
  var toc = d.querySelector('.toc');
  if (toc && 'IntersectionObserver' in window) {
    var links = {};
    toc.querySelectorAll('a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var tio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { toc.querySelectorAll('a').forEach(function (a) { a.classList.remove('on'); }); var l = links[e.target.id]; if (l) l.classList.add('on'); }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(links).forEach(function (id) { var el = d.getElementById(id); if (el) tio.observe(el); });
  }

  /* ---------------- score lab ---------------- */
  var lab = d.querySelector('[data-lab]');
  if (lab) (function () {
    var st = { official: true, outlets: 2, community: 0, agree: true, rumour: false };
    var PRESETS = {
      gemini: { official: true, outlets: 2, community: 0, agree: true, rumour: false },
      single: { official: false, outlets: 1, community: 0, agree: true, rumour: false },
      press: { official: false, outlets: 3, community: 1, agree: true, rumour: false },
      leak: { official: false, outlets: 3, community: 0, agree: true, rumour: true },
      chatter: { official: false, outlets: 0, community: 2, agree: true, rumour: false }
    };
    var out = { n: lab.querySelector('[data-n]'), bar: lab.querySelector('.meter i'), verdict: lab.querySelector('[data-verdict]'), rows: lab.querySelector('[data-rows]'), reasons: lab.querySelector('[data-reasons]'), msg: lab.querySelector('[data-msg]') };
    var shown = 0, raf;
    function calc() {
      var official = st.official ? 1 : 0;
      var all = official + st.outlets + st.community;
      var best = official ? 1 : st.outlets ? 2 : st.community ? 3 : 0;
      return score({ best: best, established: official + st.outlets, all: all, articles: all, agree: st.agree, flags: st.rumour ? 1 : 0, spec: st.rumour });
    }
    function sync() {
      lab.querySelector('[data-k=official]').checked = st.official;
      lab.querySelector('[data-k=rumour]').checked = st.rumour;
      [['outlets', 0, 5], ['community', 0, 3]].forEach(function (k) {
        var w = lab.querySelector('[data-step=' + k[0] + ']');
        w.querySelector('output').textContent = st[k[0]];
        w.querySelector('[data-d="-1"]').disabled = st[k[0]] <= k[1];
        w.querySelector('[data-d="1"]').disabled = st[k[0]] >= k[2];
      });
      lab.querySelectorAll('[data-agree]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-agree') === String(st.agree))); });
      var r = calc();
      var target = r.total;
      cancelAnimationFrame(raf);
      if (RM.matches) { shown = target; out.n.textContent = target; }
      else {
        var from = shown, t0 = performance.now();
        (function step(t) {
          var p = Math.min(1, (t - t0) / 450), e = 1 - Math.pow(1 - p, 3);
          shown = Math.round(from + (target - from) * e); out.n.textContent = shown;
          if (p < 1) raf = requestAnimationFrame(step);
        })(t0);
      }
      out.bar.style.width = target + '%';
      out.bar.style.background = r.status === 'verified' ? '#C8F550' : r.status === 'reported' ? '#F2B53A' : r.status === 'developing' ? '#A5A5B0' : '#5b6b60';
      var msg = { verified: 'Shows in the feed as Confirmed.', reported: 'Shows when “Show Reported and Developing stories” is on.', developing: 'Shows when “Show Reported and Developing stories” is on.', held: 'Held back and checked again on the next run.' }[r.status];
      out.verdict.innerHTML = badge(r.status);
      out.msg.textContent = msg;
      out.rows.innerHTML = r.rows.map(function (x) {
        return '<div class="' + (x[1] < 0 ? 'neg' : x[1] === 0 ? 'zero' : '') + '"><span>' + x[0] + '</span><span>' + (x[1] > 0 ? '+' : x[1] < 0 ? '−' : '') + Math.abs(x[1]) + '</span></div>';
      }).join('');
      out.reasons.innerHTML = r.reasons.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
      lab.querySelector('[data-live]').textContent = 'Score ' + r.total + ' of 100, ' + LABEL[r.status] + '.';
    }
    lab.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-preset')) {
        st = Object.assign({}, PRESETS[b.getAttribute('data-preset')]);
        lab.querySelectorAll('[data-preset]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      } else if (b.hasAttribute('data-d')) {
        var k = b.closest('[data-step]').getAttribute('data-step');
        st[k] = Math.max(0, st[k] + Number(b.getAttribute('data-d')));
        clearPreset();
      } else if (b.hasAttribute('data-agree')) { st.agree = b.getAttribute('data-agree') === 'true'; clearPreset(); }
      sync();
    });
    lab.addEventListener('change', function (e) {
      var k = e.target.getAttribute('data-k'); if (!k) return;
      st[k] = e.target.checked; clearPreset(); sync();
    });
    function clearPreset() { lab.querySelectorAll('[data-preset]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); }
    sync();
  })();

  /* ---------------- light / dark compare ---------------- */
  d.querySelectorAll('[data-compare]').forEach(function (c) {
    var r = c.querySelector('input[type=range]');
    var set = function () { c.style.setProperty('--cut', r.value + '%'); };
    r.addEventListener('input', set); set();
  });

  /* ======================================================================
     The phone
     ====================================================================== */
  function Phone(el) {
    this.el = el;
    el._fb = this; // lets a page switch the scheme later (design page light/dark switch)
    this.opts = { screen: el.getAttribute('data-screen') || 'today', scheme: el.getAttribute('data-scheme') || 'auto', story: Number(el.getAttribute('data-story') || 1), fixed: el.hasAttribute('data-static') };
    this.s = { tab: 'today', filter: 'all', topics: { design: true, ux: true, ai: true, dev: true }, showReported: true, saved: [10], read: [], hidden: [], appearance: 'system', notify: true, briefHour: 2, keywords: ['Gemini'], hiddenSources: [], follows: [] };
    this.build();
  }
  Phone.prototype.build = function () {
    var o = this.opts, me = this;
    this.el.setAttribute('role', 'group');
    if (!this.el.getAttribute('aria-label')) this.el.setAttribute('aria-label', 'Working demo of the FreshBit app');
    this.el.innerHTML =
      '<div class="p-screen">' +
      '<div class="p-island"></div>' +
      '<div class="p-status" aria-hidden="true"><span>09:41</span><span class="r">' + P.sig + P.wifi + P.batt + '</span></div>' +
      (o.screen === 'lock' ? this.lockHTML() : o.screen === 'home' ? this.homeHTML() :
        '<div class="p-view" data-v="today"></div><div class="p-view" data-v="explore" hidden></div><div class="p-view" data-v="saved" hidden></div><div class="p-view" data-v="settings" hidden></div>' +
        '<div class="p-scrim"></div>' +
        '<button class="p-glassmark" type="button" aria-label="Show the Today bar">' + leafSvg() + '</button>' +
        '<div class="p-bar"></div>' +
        '<div class="p-push" data-push="1" aria-hidden="true"></div><div class="p-push" data-push="2" aria-hidden="true"></div>' +
        '<button class="p-cta" type="button" tabindex="-1" aria-label="Read the story on the publisher’s site"></button>' +
        '<nav class="p-tabs" role="tablist" aria-label="App tabs">' + this.tabsHTML() + '</nav>' +
        '<div class="p-dim"></div><div class="p-sheet" role="dialog" aria-modal="false" aria-label="Credibility details"></div>' +
        '<div class="p-toast" role="status" aria-live="polite"></div>') +
      '</div>';
    this.scr = this.el.querySelector('.p-screen');
    this.applyScheme();
    onTheme(function () { me.applyScheme(); });
    if (o.screen === 'lock') { this.lockAnimate(); return; }
    if (o.screen === 'home') return;
    this.renderAll();
    this.bind();
    if (o.screen === 'story') this.openStory(BY[o.story] ? o.story : 547, true);
    else if (o.screen === 'brief') this.openBrief(true);
    else if (o.screen !== 'today') this.go(o.screen);
  };
  function leafSvg() { return '<svg viewBox="15 15 70 70" aria-hidden="true"><path fill-rule="evenodd" d="' + LEAF + '"/></svg>'; }
  Phone.prototype.applyScheme = function () {
    var a = this.s.appearance, sch = this.opts.scheme;
    var dark = a === 'dark' ? true : a === 'light' ? false : sch === 'dark' ? true : sch === 'light' ? false : siteDark();
    this.el.classList.toggle('is-dark', dark);
  };
  Phone.prototype.tabsHTML = function () {
    var t = [['today', 'Today', P.news, P.newsF], ['explore', 'Explore', P.compass, P.compassF], ['saved', 'Saved', P.bm, P.bmFill], ['settings', 'Settings', P.gear, P.gear]];
    var cur = this.s.tab;
    return t.map(function (x) {
      return '<button class="p-tab" role="tab" type="button" data-tab="' + x[0] + '" aria-selected="' + (x[0] === cur) + '"><span class="o">' + x[2] + '</span><span class="f">' + x[3] + '</span>' + x[1] + '</button>';
    }).join('');
  };

  // which stories Today shows, given the settings in this phone
  Phone.prototype.visible = function () {
    var s = this.s;
    var list = STORIES.filter(function (x) {
      return s.topics[x.cat] && (s.filter === 'all' || x.cat === s.filter) && (s.showReported || x.st === 'verified') &&
        s.hidden.indexOf(x.id) < 0 && s.hiddenSources.indexOf(x.src) < 0;
    });
    var lead = null;
    list.forEach(function (x) { var r = x.n * 20 + x.score; if (!lead || r > lead.n * 20 + lead.score) lead = x; });
    return lead ? [lead].concat(list.filter(function (x) { return x !== lead; })) : list;
  };
  // No allowed image: the app's FreshBit painting cover (violet layers on black, lime on top), with the
  // story's subject in white Montserrat ExtraBold (components/ui.tsx Placeholder).
  function thumb(x, big) {
    return '<div class="' + (big ? 'art' : 'thumb') + ' cover" style="--a:' + COL[x.cat] + '"><svg class="wm" viewBox="15 15 70 70" aria-hidden="true"><path fill-rule="evenodd" d="' + LEAF + '"/></svg>' +
      (big ? '<small>' + CAT[x.cat].toUpperCase() + '</small>' : '') + '<b>' + esc(subjectOf(x)) + '</b></div>';
  }
  Phone.prototype.card = function (x, hero) {
    var read = this.s.read.indexOf(x.id) > -1;
    var src = esc(x.src) + ' · ' + x.ago + (x.n > 1 ? ' · ' + x.n + ' sources' : '');
    var label = esc(x.t) + '. ' + LABEL[x.st] + ', ' + CAT[x.cat] + '. ' + src;
    if (hero) {
      return '<button type="button" class="p-card hero" data-open="' + x.id + '" aria-label="' + label + '">' +
        '<span style="position:relative;display:block">' + thumb(x, true) + '</span>' +
        '<span class="p-toptag">' + P.bolt + 'TOP STORY</span>' +
        '<span class="meta-l">' + badge(x.st) + cat(x.cat) + '</span><h4>' + esc(x.t) + '</h4><span class="p-src">' + src + '</span></button>';
    }
    return '<div class="p-swipe" data-sw="' + x.id + '"><div class="under" aria-hidden="true"><span class="s">' + (this.s.saved.indexOf(x.id) > -1 ? P.bmFill + 'Unsave' : P.bm + 'Save') + '</span><span class="h">' + P.eyeOff + 'Hide</span></div>' +
      '<button type="button" class="p-card row' + (read ? ' read' : '') + '" data-open="' + x.id + '" aria-label="' + label + '">' +
      '<span style="display:grid;gap:6px"><span class="meta-l">' + badge(x.st) + cat(x.cat) + '</span><h4>' + esc(x.t) + '</h4><span class="p-src">' + src + '</span></span>' + thumb(x) + '</button></div>';
  };
  Phone.prototype.chips = function () {
    var s = this.s, h = '<button type="button" class="p-chip" data-filter="all" aria-pressed="' + (s.filter === 'all') + '">All</button>';
    Object.keys(CAT).forEach(function (k) {
      if (s.topics[k]) h += '<button type="button" class="p-chip" data-filter="' + k + '" aria-pressed="' + (s.filter === k) + '" style="--dot:' + COL[k] + '"><i></i>' + CAT[k] + '</button>';
    });
    return '<div class="p-chips" role="toolbar" aria-label="Topic filter">' + h + '</div>';
  };
  Phone.prototype.renderToday = function () {
    var me = this, list = this.visible();
    var h = '<div class="p-head"><div><div class="p-titlerow"><div><span class="p-datepill">THURSDAY 12 NOVEMBER</span><h3 class="p-title">Today</h3></div>' +
      '<div class="p-acts"><button type="button" class="p-ib" data-act="toast" data-msg="Search: every story by headline, summary, event or author." aria-label="Search stories">' + P.search + '</button>' +
      '<button type="button" class="p-mark" data-act="brief" aria-label="Open your brief">' + P.leafInk + '</button></div></div>' +
      '<p class="p-pulse"><b>48 confirmed</b> · 150 stories from 30 sources</p></div>' + this.chips() + '</div><div class="p-feed">';
    if (!list.length) {
      var f = this.s.filter;
      h += '<div class="p-empty">' + P.leaf + '<b>Nothing here in this demo</b>' + (f !== 'all' ? 'In the app on 12 November, ' + CAT[f] + ' had ' + COUNTS[f] + ' stories. This demo carries a few from the screenshots.' : 'Turn a topic or source back on in Settings.') + '</div>';
    }
    list.forEach(function (x, i) {
      if (i === 2 && me.s.filter === 'all') h += '<div class="p-caught" role="note"><span>' + P.checkCircle + 'You’re caught up · earlier stories</span></div>';
      h += me.card(x, i === 0);
    });
    h += '</div>';
    this.view('today').innerHTML = h;
    this.renderBar();
  };
  Phone.prototype.renderBar = function () {
    this.scr.querySelector('.p-bar').innerHTML = '<div class="row1"><button type="button" class="m p-ib" style="border:0;background:transparent" data-act="brief" aria-label="Open your brief">' + leafSvg() + '</button>' +
      '<div><b>Today</b><small>Thu 12 Nov · 48 confirmed</small></div><div class="btns"><button type="button" data-act="toast" data-msg="Search: every story by headline, summary, event or author." aria-label="Search stories">' + P.search + '</button>' +
      '<button type="button" data-act="unpin" aria-label="Fold the bar back into the mark">' + P.chevUp + '</button></div></div>' + this.chips();
  };
  Phone.prototype.renderExplore = function () {
    var s = this.s, me = this;
    var h = '<div class="p-head"><h3 class="p-title">Explore</h3></div><h4 class="p-h">Topics</h4><div class="p-tiles">';
    Object.keys(CAT).forEach(function (k) { if (s.topics[k]) h += '<button type="button" class="p-tile" style="--a:' + COL[k] + '" data-tile="' + k + '"><b>' + CAT[k] + '</b><small>' + COUNTS[k] + ' stories</small></button>'; });
    h += '</div><h4 class="p-h">Trending today</h4><div class="p-trend">' + TRENDING.map(function (t) { return '<span>' + P.arrowUR + t[0] + ' <em>' + t[1] + '</em></span>'; }).join('') + '</div>';
    h += '<h4 class="p-h">Events</h4><div class="p-events">' + EVENTS.map(function (e) { return '<div class="p-event">' + P.pin + '<b>' + e[0] + '</b><small>' + e[1] + (e[1] === 1 ? ' story' : ' stories') + '</small></div>'; }).join('') + '</div>';
    var week = STORIES.filter(function (x) { return x.st === 'verified' && s.topics[x.cat]; }).sort(function (a, b) { return b.n - a.n || b.score - a.score; });
    h += '<h4 class="p-h">This week, most confirmed</h4><div class="p-feed" style="margin-top:0">' + week.map(function (x) { return me.card(x); }).join('') + '</div>';
    this.view('explore').innerHTML = h;
  };
  Phone.prototype.renderSaved = function () {
    var me = this, list = this.s.saved.map(function (id) { return BY[id]; });
    this.view('saved').innerHTML = '<div class="p-head"><h3 class="p-title">Saved</h3></div><div class="p-feed">' +
      (list.length ? list.map(function (x) { return me.card(x); }).join('') : '<div class="p-empty">' + P.leaf + '<b>No saved stories</b>Tap the bookmark on a story to read it later.</div>') + '</div>';
  };
  function tog(label, on, key, disabled) {
    return '<button type="button" class="p-row" role="switch" aria-checked="' + on + '" data-tog="' + key + '"' + (disabled ? ' aria-disabled="true"' : '') + '><span>' + label + '</span><span class="p-tog"></span></button>';
  }
  function hourLabel(h) { return h < 0 ? 'Off' : (h % 12 || 12) + (h < 12 ? ' AM' : ' PM'); }
  Phone.prototype.renderSettings = function () {
    var s = this.s, on = Object.keys(s.topics).filter(function (k) { return s.topics[k]; });
    var names = { design: 'Product design', ux: 'UX/UI design', ai: 'AI development', dev: 'Software, web & apps' };
    var h = '<div class="p-head"><h3 class="p-title">Settings</h3></div>' +
      '<div class="p-group"><small>Account</small><div class="p-rows"><div class="p-row" style="cursor:default">Signed in with Apple</div>' +
      '<button type="button" class="p-row apple" data-act="toast" data-msg="Synced. Saved stories and settings are backed up.">Sync now</button>' +
      '<button type="button" class="p-row apple" data-act="toast" data-msg="Sign out keeps your saved stories and settings on this device.">Sign out</button>' +
      '<button type="button" class="p-row" style="color:#FF453A" data-act="toast" data-msg="Delete account removes your account and its synced data straight away.">Delete account</button></div>' +
      '<p>Saved stories and settings are backed up.</p></div>' +
      '<div class="p-group"><small>Topics</small><div class="p-rows">' + Object.keys(names).map(function (k) { return tog(names[k], s.topics[k], 'topic:' + k, s.topics[k] && on.length === 1); }).join('') + '</div></div>' +
      '<div class="p-group"><small>Alerts</small><div class="p-rows">' + tog('Top story alerts', s.notify, 'notify') +
      '<button type="button" class="p-row" data-act="hour"><span>Morning brief</span><span class="v">' + hourLabel(BRIEF_HOURS[s.briefHour]) + P.updown + '</span></button>' +
      '<button type="button" class="p-row" data-act="keywords"><span>Keyword alerts' + (s.keywords.length ? ' (' + s.keywords.length + ')' : '') + '</span><span class="v">' + P.chevR + '</span></button></div>' +
      '<p>Top stories: at most 3 a day, confirmed by 2+ trusted sources. Keywords: at most 3 a day. The brief arrives once a day at the time you pick.</p></div>' +
      '<div class="p-group"><small>Feed</small><div class="p-rows">' + tog('Show Reported and Developing stories', s.showReported, 'showReported') +
      '<button type="button" class="p-row" data-act="sources"><span>Sources' + (s.hiddenSources.length ? ' (' + s.hiddenSources.length + ' hidden)' : '') + '</span><span class="v">' + P.chevR + '</span></button>' +
      '<button type="button" class="p-row" data-act="hidden"><span>Hidden stories' + (s.hidden.length ? ' (' + s.hidden.length + ')' : '') + '</span><span class="v">' + P.chevR + '</span></button></div>' +
      '<p>Off: only stories confirmed by trusted sources (an official source, or 3+ independent outlets). Swipe a story left to hide it; bring it back from Hidden stories.</p></div>' +
      '<div class="p-group"><small>Appearance &amp; feel</small><div class="p-rows"><button type="button" class="p-row" data-act="appearance"><span>Appearance</span><span class="v">' + { system: 'System', light: 'Light', dark: 'Dark' }[s.appearance] + P.updown + '</span></button>' + tog('Haptics', true, 'noop') + '</div></div>' +
      '<div class="p-group"><small>About</small><div class="p-rows">' +
      '<a class="p-row apple" href="terms.html" target="_blank" rel="noopener">Terms of Use</a><a class="p-row apple" href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a><a class="p-row apple" href="sources.html" target="_blank" rel="noopener">Copyright &amp; Sources</a></div><p>FreshBit checks 51 trusted sources every 30 minutes and scores each story on who published it, whether an official source confirms it, and how many independent outlets report it. Rumours are never marked Confirmed.</p></div>';
    this.view('settings').innerHTML = h;
  };
  Phone.prototype.view = function (v) { return this.scr.querySelector('[data-v=' + v + ']'); };
  Phone.prototype.renderAll = function () { this.renderToday(); this.renderExplore(); this.renderSaved(); this.renderSettings(); };

  Phone.prototype.go = function (tab) {
    this.s.tab = tab;
    var me = this;
    ['today', 'explore', 'saved', 'settings'].forEach(function (v) { me.view(v).hidden = v !== tab; });
    this.scr.querySelectorAll('.p-tab').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-tab') === tab)); });
    this.scr.classList.remove('folded', 'pinned', 'mini');
    this.view(tab).scrollTop = 0;
  };
  Phone.prototype.toast = function (msg, undo) {
    var t = this.scr.querySelector('.p-toast'), me = this;
    t.innerHTML = '<span>' + esc(msg) + '</span>' + (undo ? '<button type="button" data-act="undo">Undo</button>' : '');
    t.classList.add('show');
    clearTimeout(this._tt);
    this._tt = setTimeout(function () { t.classList.remove('show'); }, undo ? 3600 : 2600);
    this._undo = undo || null;
  };
  Phone.prototype.push = function (n, html, cls) {
    var p = this.scr.querySelector('[data-push="' + n + '"]');
    p.innerHTML = html; p.scrollTop = 0;
    p.setAttribute('aria-hidden', 'false');
    this.scr.classList.add('push');
    if (cls) this.scr.classList.add(cls);
    var me = this;
    void p.offsetWidth; // commit the closed position so the slide-in animates
    p.classList.add('open');
    var b = p.querySelector('.back'); if (b && me._focus) b.focus({ preventScroll: true });
    return p;
  };
  Phone.prototype.pop = function () {
    var p2 = this.scr.querySelector('[data-push="2"]'), p1 = this.scr.querySelector('[data-push="1"]');
    var p = p2.classList.contains('open') ? p2 : p1;
    p.classList.remove('open'); p.setAttribute('aria-hidden', 'true');
    this.scr.classList.remove('sheet');
    if (p === p1) { this.scr.classList.remove('push', 'story'); this.renderAll(); this.go(this.s.tab); }
    else if (this.scr.classList.contains('story')) { /* back to story */ }
  };
  function navbar(title, right) {
    return '<div class="p-navbar"><button type="button" class="back" data-act="back" aria-label="Back">' + P.back + '</button>' + (title ? '<span class="ttl">' + title + '</span>' : '') + (right || '<span style="width:34px"></span>') + '</div>';
  }
  Phone.prototype.openStory = function (id, instant) {
    var x = BY[id], s = this.s;
    if (s.read.indexOf(id) < 0) s.read.push(id);
    this.cur = x;
    var saved = s.saved.indexOf(id) > -1, follow = s.follows.indexOf(id) > -1, canFollow = x.st !== 'verified';
    var facts = (x.when ? fact(P.cal, 'When', x.when) : '') + (x.event ? fact(P.pin, 'Where', x.event) : '') + fact(P.news, 'Reported by', x.by || x.src) + fact(P.seal, 'Confirmed by', x.n + ' independent source' + (x.n === 1 ? '' : 's'));
    var barCol = x.st === 'verified' ? '#C8F550' : x.st === 'reported' ? '#F2B53A' : 'var(--p-text2)';
    var html = navbar('', '<span class="grp">' + (canFollow ? '<button type="button" data-act="follow" aria-label="Follow">' + (follow ? P.bellFill : P.bell) + '</button>' : '') +
      '<button type="button" data-act="toast" data-msg="Shares a branded card: headline, status and how many sources confirm it." aria-label="Share">' + P.share + '</button>' +
      '<button type="button" data-act="save" aria-label="' + (saved ? 'Remove from saved' : 'Save story') + '">' + (saved ? P.bmFill : P.bm) + '</button></span>') +
      '<div class="p-story">' + thumb(x, true) +
      '<div class="meta-l" style="display:flex;gap:7px;align-items:center"><button type="button" data-act="sheet" style="border:0;background:none;padding:0;cursor:pointer" aria-label="' + LABEL[x.st] + '. Show credibility details">' + badge(x.st) + '</button>' + cat(x.cat) + '</div>' +
      '<h3>' + esc(x.t) + '</h3><span class="src">' + esc(x.src) + ' · ' + x.ago + '</span>' +
      (canFollow ? '<button type="button" class="p-follow" data-act="follow" aria-pressed="' + follow + '">' + (follow ? P.bellFill + 'Following: you will get an alert when it is confirmed' : P.bell + 'Follow: alert me when trusted sources confirm it') + '</button>' : '') +
      '<div class="p-box"><h5>Brief' + (x.brief ? '<span class="ondev">Own words</span>' : '') + '</h5>' +
      (x.brief ? '<p>' + esc(x.brief) + '</p><div class="p-kf">' + x.facts.map(function (k) { return '<span>' + esc(k) + '</span>'; }).join('') + '</div>' : '<p style="color:var(--p-text2)">No details yet. FreshBit reads the full article shortly after a story is published.</p>') + '</div>' +
      '<div class="p-box" style="gap:0"><h5 style="margin-bottom:6px">The facts</h5>' + facts + '</div>' +
      '<button type="button" class="p-box p-cred" data-act="sheet" aria-label="Credibility ' + x.score + ' of 100. Show details"><h5>Credibility<span>' + x.score + ' / 100</span></h5><span class="bar"><i style="--w:' + x.score + '%;background:' + barCol + '"></i></span>' +
      x.sources.map(function (z) { return '<span class="srcrow"><span>' + esc(z.name) + '</span><span>' + TIER[z.tier] + '</span></span>'; }).join('') + '<span class="why">Why this score ›</span></button></div>';
    var cta = this.scr.querySelector('.p-cta');
    cta.innerHTML = 'Read on ' + esc(x.src) + ' ' + P.arrowUR; cta.setAttribute('data-act', 'toast'); cta.setAttribute('data-msg', 'Opens the original article on ' + x.src + '.'); cta.tabIndex = 0;
    var r = score({ best: x.best, established: x.established, all: x.n, articles: x.sources.length, agree: true, flags: 0, spec: false });
    this.scr.querySelector('.p-sheet').innerHTML = '<span class="grab"></span><button type="button" class="x" data-act="unsheet" aria-label="Close">' + P.x + '</button><h5>' + LONG[x.st] + ' · ' + x.score + '/100</h5><ul>' +
      r.reasons.map(function (z) { return '<li>' + esc(z) + '</li>'; }).join('') + '</ul>' +
      x.sources.map(function (z) { return '<p class="s">' + esc(z.name) + ' (' + TIER[z.tier] + ') · ' + z.ago + '</p>'; }).join('');
    var p = this.push(1, html, 'story');
    if (instant) { p.style.transition = 'none'; p.classList.add('open'); p.offsetWidth; p.style.transition = ''; }
  };
  function fact(ic, label, v) { return '<div class="p-fact"><i>' + ic + '</i><div><small>' + label.toUpperCase() + '</small><span>' + esc(v) + '</span></div></div>'; }
  Phone.prototype.openBrief = function (instant) {
    var me = this, list = STORIES.filter(function (x) { return x.st === 'verified'; }).sort(function (a, b) { return b.n - a.n || b.score - a.score; });
    var html = navbar('') + '<div style="display:grid;gap:4px;margin:6px 0 12px"><span style="font:600 10.5px/1 var(--sys);letter-spacing:.06em;color:var(--p-text2)">THURSDAY 12 NOVEMBER</span>' +
      '<h3 class="p-title" style="font-size:30px">Your brief</h3><p class="p-pulse">12 stories confirmed by trusted sources in the last 24 hours.</p></div><div class="p-feed">' +
      list.map(function (x, i) { return me.card(x, i === 0); }).join('') + '<p class="p-pulse" style="text-align:center;margin-top:6px">This demo carries ' + list.length + ' of the 12.</p></div>';
    var p = this.push(1, html);
    if (instant) { p.style.transition = 'none'; p.classList.add('open'); p.offsetWidth; p.style.transition = ''; }
  };
  Phone.prototype.openKeywords = function () {
    var s = this.s;
    var html = navbar('Keyword alerts') + '<p class="p-pulse" style="font-size:12.5px;line-height:1.45;margin:4px 0 12px">Get an alert when a new Confirmed or Reported story mentions one of these in its headline. At most 3 keyword alerts a day.</p>' +
      '<div class="p-trend" style="margin-bottom:14px">' + s.keywords.map(function (k) { return '<button type="button" class="p-chip" aria-pressed="true" data-kw-del="' + esc(k) + '" aria-label="Remove ' + esc(k) + '">' + esc(k) + ' ' + P.x.replace('<svg', '<svg width="9" height="9"') + '</button>'; }).join('') + '</div>' +
      '<small style="display:block;font:600 10px/1 var(--sys);letter-spacing:.06em;color:var(--p-text2);margin-bottom:8px">SUGGESTIONS</small><div class="p-trend">' +
      KEYWORDS.filter(function (k) { return s.keywords.indexOf(k) < 0; }).map(function (k) { return '<button type="button" class="p-chip" data-kw-add="' + esc(k) + '">' + P.plus.replace('<svg', '<svg width="10" height="10"') + esc(k) + '</button>'; }).join('') + '</div>';
    var p = this.scr.querySelector('[data-push="2"]');
    if (p.classList.contains('open')) { p.innerHTML = html; return; }
    this.push(2, html);
  };
  Phone.prototype.openSources = function () {
    var s = this.s, titles = { 1: 'Official sources', 2: 'Established outlets', 3: 'Community signals' };
    var notes = { 1: 'Company blogs, changelogs and release notes. A story from one of these counts as confirmed.', 2: 'Press and expert publications. Three or more of them together make a story Confirmed.', 3: 'Never published on their own; they only add weight to stories others report.' };
    var html = navbar('Sources') + [1, 2, 3].map(function (t) {
      return '<div class="p-group"><small>' + titles[t] + '</small><div class="p-rows">' + SOURCES[t].map(function (n) { return tog(esc(n), s.hiddenSources.indexOf(n) < 0, 'src:' + n); }).join('') + '</div><p>' + notes[t] + '</p></div>';
    }).join('');
    var p = this.scr.querySelector('[data-push="2"]');
    if (p.classList.contains('open')) { var y = p.scrollTop; p.innerHTML = html; p.scrollTop = y; return; }
    this.push(2, html);
  };
  Phone.prototype.openHidden = function () {
    var me = this, list = this.s.hidden.map(function (id) { return BY[id]; });
    var html = navbar('Hidden stories') + (list.length ? '<p class="p-pulse" style="margin:4px 0 10px">Unhide a story to put it back in your Today feed.</p><div class="p-feed">' +
      list.map(function (x) { return '<div style="display:grid;gap:6px">' + me.card(x).replace('p-swipe', 'p-noswipe') + '<button type="button" class="p-follow" style="justify-content:center;color:var(--p-link)" data-unhide="' + x.id + '">' + P.eye + 'Unhide</button></div>'; }).join('') + '</div>'
      : '<div class="p-empty">' + P.eyeOff + '<b>No hidden stories</b>Swipe a story left in Today to hide it. It will show up here.</div>');
    var p = this.scr.querySelector('[data-push="2"]');
    if (p.classList.contains('open')) { p.innerHTML = html; return; }
    this.push(2, html);
  };

  Phone.prototype.bind = function () {
    var me = this, scr = this.scr, s = this.s;
    scr.addEventListener('focusin', function () { me._focus = true; });
    scr.addEventListener('click', function (e) {
      if (me._dragged) { me._dragged = false; e.preventDefault(); return; }
      var t = e.target.closest('button, [data-open]'); if (!t || !scr.contains(t)) return;
      var a = t.getAttribute('data-act');
      if (t.hasAttribute('data-tab')) { me.go(t.getAttribute('data-tab')); return; }
      if (t.hasAttribute('data-filter')) { s.filter = t.getAttribute('data-filter'); me.renderToday(); keepChip(t.getAttribute('data-filter')); return; }
      if (t.hasAttribute('data-tile')) { s.filter = t.getAttribute('data-tile'); me.renderToday(); me.go('today'); return; }
      if (t.hasAttribute('data-open')) { me.openStory(Number(t.getAttribute('data-open'))); return; }
      if (t.hasAttribute('data-tog')) {
        if (t.getAttribute('aria-disabled') === 'true') return;
        var k = t.getAttribute('data-tog');
        if (k.indexOf('topic:') === 0) { var c = k.slice(6); s.topics[c] = !s.topics[c]; if (!s.topics[s.filter]) s.filter = 'all'; }
        else if (k.indexOf('src:') === 0) { var n = k.slice(4), i = s.hiddenSources.indexOf(n); if (i > -1) s.hiddenSources.splice(i, 1); else s.hiddenSources.push(n); t.setAttribute('aria-checked', String(i > -1)); me.renderToday(); return; }
        else if (k === 'noop') { t.setAttribute('aria-checked', String(t.getAttribute('aria-checked') !== 'true')); return; }
        else s[k] = !s[k];
        me.renderAll(); return;
      }
      if (t.hasAttribute('data-kw-add')) { s.keywords.push(t.getAttribute('data-kw-add')); me.openKeywords(); return; }
      if (t.hasAttribute('data-kw-del')) { s.keywords.splice(s.keywords.indexOf(t.getAttribute('data-kw-del')), 1); me.openKeywords(); return; }
      if (t.hasAttribute('data-unhide')) { s.hidden.splice(s.hidden.indexOf(Number(t.getAttribute('data-unhide'))), 1); me.openHidden(); return; }
      switch (a) {
        case 'brief': me.openBrief(); break;
        case 'back': me.pop(); break;
        case 'toast': me.toast(t.getAttribute('data-msg')); break;
        case 'unpin': scr.classList.remove('pinned'); break;
        case 'save': {
          var id = me.cur.id, j = s.saved.indexOf(id);
          if (j > -1) { s.saved.splice(j, 1); me.toast('Removed from Saved'); } else { s.saved.unshift(id); me.toast('Saved. It also opens offline.'); }
          t.innerHTML = j > -1 ? P.bm : P.bmFill; me.renderSaved(); break;
        }
        case 'follow': {
          var fid = me.cur.id, q = s.follows.indexOf(fid);
          if (q > -1) s.follows.splice(q, 1); else { s.follows.push(fid); me.toast('You will get one alert when it is confirmed.'); }
          var y = scr.querySelector('[data-push="1"]').scrollTop; me.openStory(fid, true); scr.querySelector('[data-push="1"]').scrollTop = y; break;
        }
        case 'sheet': scr.classList.add('sheet'); var x = scr.querySelector('.p-sheet .x'); if (x && me._focus) x.focus({ preventScroll: true }); break;
        case 'unsheet': scr.classList.remove('sheet'); break;
        case 'hour': s.briefHour = (s.briefHour + 1) % BRIEF_HOURS.length; me.renderSettings(); focusAct('hour'); break;
        case 'appearance': s.appearance = { system: 'light', light: 'dark', dark: 'system' }[s.appearance]; me.applyScheme(); me.renderSettings(); focusAct('appearance'); break;
        case 'keywords': me.openKeywords(); break;
        case 'sources': me.openSources(); break;
        case 'hidden': me.openHidden(); break;
        case 'undo': if (me._undo) { me._undo(); scr.querySelector('.p-toast').classList.remove('show'); } break;
      }
    });
    function focusAct(a) { if (!me._focus) return; var b = scr.querySelector('[data-act=' + a + ']'); if (b) b.focus({ preventScroll: true }); }
    function keepChip(f) { if (!me._focus) return; var b = scr.querySelector('.p-view [data-filter=' + f + ']'); if (b) b.focus({ preventScroll: true }); }
    scr.querySelector('.p-dim').addEventListener('click', function () { scr.classList.remove('sheet'); });
    scr.querySelector('.p-glassmark').addEventListener('click', function () { scr.classList.add('pinned'); });
    scr.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { if (scr.classList.contains('sheet')) scr.classList.remove('sheet'); else if (scr.classList.contains('push')) me.pop(); }
    });
    // the header folds into a glass leaf once the title slides under the clock; the tab bar shrinks on scroll down
    var lastY = 0;
    scr.querySelectorAll('.p-view').forEach(function (v) {
      v.addEventListener('scroll', function () {
        var y = v.scrollTop;
        if (v.getAttribute('data-v') === 'today') {
          if (!scr.classList.contains('folded') && y > 96) scr.classList.add('folded');
          else if (scr.classList.contains('folded') && y < 56) scr.classList.remove('folded', 'pinned');
        }
        if (y > lastY + 6 && y > 120) scr.classList.add('mini'); else if (y < lastY - 6) scr.classList.remove('mini');
        lastY = y;
      }, { passive: true });
    });
    // swipe right to save, left to hide
    var drag = null;
    scr.addEventListener('pointerdown', function (e) {
      var w = e.target.closest('.p-swipe'); if (!w || e.button !== 0) return;
      drag = { w: w, card: w.querySelector('.p-card'), x0: e.clientX, y0: e.clientY, dx: 0, on: false, id: e.pointerId };
    });
    scr.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
      if (!drag.on) { if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { drag.on = true; drag.w.classList.add('dragging'); try { drag.card.setPointerCapture(e.pointerId); } catch (x) {} } else return; }
      drag.dx = Math.max(-140, Math.min(140, dx));
      drag.card.style.transform = 'translateX(' + drag.dx + 'px)';
      drag.w.classList.toggle('r', drag.dx > 10); drag.w.classList.toggle('l', drag.dx < -10);
    });
    function end() {
      if (!drag) return;
      var g = drag; drag = null;
      if (!g.on) return;
      me._dragged = true; setTimeout(function () { me._dragged = false; }, 50);
      g.w.classList.remove('dragging');
      var id = Number(g.w.getAttribute('data-sw'));
      g.card.style.transform = '';
      setTimeout(function () { g.w.classList.remove('r', 'l'); }, 200);
      if (g.dx > 80) {
        var k = s.saved.indexOf(id);
        if (k > -1) { s.saved.splice(k, 1); me.toast('Removed from Saved'); } else { s.saved.unshift(id); me.toast('Saved for later'); }
        me.renderSaved(); me.renderToday();
      } else if (g.dx < -80) {
        s.hidden.unshift(id);
        g.card.style.opacity = '0';
        setTimeout(function () { me.renderAll(); }, 180);
        me.toast('Story hidden', function () { s.hidden.splice(s.hidden.indexOf(id), 1); me.renderAll(); });
      }
    }
    scr.addEventListener('pointerup', end); scr.addEventListener('pointercancel', end);
  };

  /* lock screen with FreshBit alerts, written with the app's own alert templates (fb-push) */
  Phone.prototype.lockHTML = function () {
    var notes = [
      ['Top story', 'AI · Confirmed by 5 trusted sources', 'Google DeepMind introduces Gemini 4 Hydrogen model', 'now'],
      ['Keyword', '“Gemini” · Confirmed', 'Google updates Search globally with new Gemini 4 Hydrogen model', '1m ago'],
      ['Morning brief', 'Your FreshBit brief · 12 confirmed stories', 'Top: Google DeepMind introduces Gemini 4 Hydrogen model', '8:00']
    ];
    return '<div class="p-lock"><span style="opacity:.85">' + P.lock.replace('<svg', '<svg width="14" height="14"') + '</span><span class="date">Thu 12 · FreshBit · 48 confirmed today</span><span class="clock">9:41</span>' +
      '<div class="lk-rect"><b>FRESHBIT</b><span>' + esc(widgetStories()[0].t) + '</span></div><div class="p-notes">' +
      notes.map(function (n) { return '<div class="p-note"><span class="ic">' + P.leafInk + '</span><div><span class="ntop"><span>' + n[1] + '</span><em>' + n[3] + '</em></span><p>' + n[2] + '</p></div></div>'; }).join('') +
      '</div><span class="flash l">' + P.flash + '</span><span class="flash r">' + P.camera + '</span><span class="home"></span></div>';
  };
  // The FreshBit widget (widgets/top-stories.tsx): the most-confirmed stories that aren't Developing,
  // ranked by independent sources and then by score. Lime in light mode, ink in dark mode.
  function widgetStories() {
    return STORIES.filter(function (x) { return x.st !== 'developing'; })
      .sort(function (a, b) { return (b.n * 20 + b.score) - (a.n * 20 + a.score); });
  }
  function wLabel(x) { return x.st === 'verified' ? 'Confirmed · ' + x.n + ' source' + (x.n === 1 ? '' : 's') : 'Reported'; }
  Phone.prototype.homeHTML = function () {
    var w = widgetStories();
    var head = '<span class="wh"><b>FRESHBIT</b><em>48 confirmed</em></span>';
    var medium = '<div class="wd wd-m">' + head + w.slice(0, 3).map(function (x, i) {
      return '<span class="wr' + (i === 0 ? ' first' : '') + '"><b>' + esc(x.t) + '</b><em>' + esc(x.src) + ' · ' + wLabel(x) + '</em></span>';
    }).join('') + '</div>';
    var small = '<div class="wd wd-s">' + head + '<span class="sp"></span><b class="st">' + esc(w[0].t) + '</b><em>' + wLabel(w[0]) + '</em></div>';
    var icon = '<span class="ai"><i></i></span>';
    var fb = '<span class="ai fb"><i>' + P.leafInk + '</i><small>FreshBit</small></span>';
    return '<div class="p-home">' + medium + '<span class="wcap">FreshBit</span>' +
      '<div class="hrow">' + small + '<div class="apps4">' + fb + icon + icon + icon + '</div></div>' +
      '<span class="wcap">FreshBit</span>' +
      '<div class="dock">' + icon + icon + icon + icon + '</div><span class="home"></span></div>';
  };
  Phone.prototype.lockAnimate = function () {
    var notes = this.el.querySelectorAll('.p-note');
    function show() { notes.forEach(function (n, i) { setTimeout(function () { n.classList.add('in'); }, RM.matches ? 0 : 250 + i * 650); }); }
    if (!('IntersectionObserver' in window)) return show();
    var io2 = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { show(); io2.disconnect(); } }, { threshold: .35 });
    io2.observe(this.el);
  };

  d.querySelectorAll('[data-phone]').forEach(function (el) { new Phone(el); });
  // a light/dark switch for a group of phones: <div data-scheme-switch="#target"> with buttons data-set="light|dark"
  d.querySelectorAll('[data-scheme-switch]').forEach(function (sw) {
    var group = d.querySelector(sw.getAttribute('data-scheme-switch'));
    sw.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-set]'); if (!b || !group) return;
      sw.querySelectorAll('button[data-set]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      group.querySelectorAll('[data-phone]').forEach(function (el) { if (el._fb) { el._fb.opts.scheme = b.getAttribute('data-set'); el._fb.applyScheme(); } });
      group.setAttribute('data-set', b.getAttribute('data-set'));
    });
  });

  /* motion demos on the case-study page */
  d.querySelectorAll('[data-motion]').forEach(function (box) {
    var b = box.querySelector('button.replay'), target = box.querySelector('[data-target]');
    if (!b || !target) return;
    b.addEventListener('click', function () {
      var k = box.getAttribute('data-motion');
      if (k === 'fold') target.closest('.p-screen').classList.toggle('pinned');
      if (k === 'pill') { target.classList.remove('show'); setTimeout(function () { target.classList.add('show'); }, 250); }
      if (k === 'press') { target.animate([{ transform: 'scale(1)' }, { transform: 'scale(.98)' }, { transform: 'scale(1)' }], { duration: RM.matches ? 1 : 240, easing: 'ease-out' }); }
    });
  });
})();

/* WCAG 2.2.2: the scrolling sources ticker runs for more than five seconds, so it gets a visible pause control.
   The label swaps between Pause and Play (no aria-pressed, which would announce a "pressed Play"). */
(function () {
  var btn = document.querySelector('.ticker-pause');
  if (!btn) return;
  var ticker = btn.closest('.ticker');
  btn.addEventListener('click', function () {
    var paused = ticker.classList.toggle('paused');
    btn.textContent = paused ? 'Play' : 'Pause';
    btn.setAttribute('aria-label', paused ? 'Play the scrolling sources' : 'Pause the scrolling sources');
  });
})();
