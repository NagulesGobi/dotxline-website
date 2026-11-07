/* Nagules Gobi portfolio: interaction layer (all pages).
   No libraries. Each module runs only when its elements exist on the page.
   Motion uses transform/opacity or one canvas, pauses off-screen, and stands
   down under prefers-reduced-motion. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var store = {
    get: function (k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (_) { return null; } },
    set: function (k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (_) {} }
  };
  var MARK_D = 'M12.75 8H56.72A30.53 30.53 0 0 1 87.25 38.53V38.53H73.82V38.53A17.1 17.1 0 0 0 56.72 21.43H35.68L73.82 59.57V51.97H87.25V92L26.18 30.93V51.97A17.1 17.1 0 0 0 43.28 69.07H43.28V82.5H43.28A30.53 30.53 0 0 1 12.75 51.97Z';

  var pointer = { x: innerWidth / 2, y: innerHeight / 2, active: false };
  addEventListener('pointermove', function (e) { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; }, { passive: true });
  document.addEventListener('pointerleave', function () { pointer.active = false; });

  /* ------------------------------------------------------------- theme */
  function isDark() { var t = doc.dataset.theme; return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; }
  function syncTheme() { doc.classList.toggle('is-dark', isDark()); }
  syncTheme();
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncTheme);
  $$('.theme-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      var apply = function () { doc.dataset.theme = next; store.set('ng-theme', next); syncTheme(); };
      if (!document.startViewTransition || RM) return apply();
      var r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      var end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      document.startViewTransition(apply).ready.then(function () {
        doc.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 750, easing: 'cubic-bezier(.76,0,.24,1)', pseudoElement: '::view-transition-new(root)' });
      });
    });
  });

  /* ------------------------------------------------- page transitions */
  // A gradient curtain covers the page on the way out and lifts on the way in.
  var curtain = $('.curtain');
  function internal(a) {
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return false;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|https?:|\/\/)/i.test(href)) return false;
    return /\.html(#.*)?$/.test(href) || href === './' || href === '../';
  }
  if (curtain && !RM) {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest('a'); if (!internal(a)) return;
      e.preventDefault();
      var label = a.getAttribute('data-label') || (a.textContent || '').trim().split('\n')[0].slice(0, 40);
      curtain.querySelector('.curtain-label').textContent = label;
      doc.classList.add('leaving');
      store.set('ng-nav', label, true);
      setTimeout(function () { location.href = a.href; }, 650);
    });
    addEventListener('pageshow', function (e) { if (e.persisted) doc.classList.remove('leaving', 'arriving'); });
    if (doc.classList.contains('arriving')) {
      requestAnimationFrame(function () { requestAnimationFrame(function () { doc.classList.add('arrived'); setTimeout(function () { doc.classList.remove('arriving', 'arrived'); }, 1000); }); });
    }
  }

  /* --------------------------------------------------------- mobile menu */
  var menuBtn = $('.menu-btn'), menu = $('.menu');
  if (menuBtn && menu) {
    var setMenu = function (open) {
      doc.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.hidden = false;
      if (open) { var first = menu.querySelector('a'); if (first) setTimeout(function () { first.focus(); }, 300); }
    };
    menu.hidden = false;
    menuBtn.addEventListener('click', function () { setMenu(!doc.classList.contains('menu-open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && doc.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); } });
  }

  /* --------------------------------------------------------- split text */
  function splitWords(el) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span'); w.className = 'w';
            var wi = document.createElement('span'); wi.className = 'wi'; wi.style.setProperty('--i', i++); wi.textContent = part;
            w.appendChild(wi); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.classList.contains('nosplit')) walk(n);
      });
    })(el);
  }
  $$('[data-split]').forEach(splitWords);

  /* ----------------------------------------------------- reveal on view */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  function armReveals() { $$('[data-reveal], [data-split], [data-img], .giant').forEach(function (el) { if (!el.hasAttribute('data-hero')) revealIO.observe(el); }); }
  function startHero() { $$('[data-hero]').forEach(function (el) { el.classList.add('in'); }); }

  /* -------------------------------------------------------------- intro */
  function runIntro(done) {
    if (!doc.classList.contains('intro') || !$('.intro-screen')) { doc.classList.remove('intro'); return done(); }
    var out = $('[data-intro-count]'), t0 = performance.now(), D = 1500;
    (function tick(now) {
      var p = clamp((now - t0) / D, 0, 1), e = 1 - Math.pow(1 - p, 3);
      out.textContent = String(Math.round(e * 100)).padStart(3, '0');
      if (p < 1) return requestAnimationFrame(tick);
      doc.classList.add('intro-fill');
      setTimeout(function () {
        doc.classList.add('intro-out'); store.set('ng-intro', '1', true);
        setTimeout(done, 380);
        setTimeout(function () { doc.classList.remove('intro', 'intro-fill', 'intro-out'); }, 1100);
      }, 260);
    })(t0);
  }

  /* ----------------------------------------------------- particle N-mark */
  function MarkField(canvas) {
    var ctx = canvas.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2);
    var W = 0, H = 0, parts = [], buckets = [], running = false, visible = true, born = 0, shocks = [], cols = [];
    var stops = [[0, [255, 145, 36]], [0.3, [255, 74, 44]], [0.55, [255, 36, 64]], [1, [255, 0, 142]]];
    for (var i = 0; i < 24; i++) {
      var t = i / 23, k = 1; while (k < stops.length - 1 && t > stops[k][0]) k++;
      var a = stops[k - 1], b = stops[k], u = (t - a[0]) / (b[0] - a[0]);
      cols.push('rgb(' + [0, 1, 2].map(function (c) { return Math.round(lerp(a[1][c], b[1][c], u)); }).join(',') + ')');
    }
    function build() {
      var r = canvas.getBoundingClientRect(); W = r.width; H = r.height;
      if (!W || !H) return;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var mobile = W < 820;
      var size = mobile ? Math.min(W * 0.78, 420) : Math.min(H * 0.7, W * 0.36, 640);
      var cx = mobile ? W * 0.62 : W * 0.75, cy = mobile ? Math.max(size * 0.42, 150) : H * 0.5;
      var ox = cx - size / 2, oy = cy - size / 2;
      canvas.style.opacity = mobile ? .3 : 1;
      var step = Math.max(5, Math.round(size / 92));
      var off = document.createElement('canvas'); off.width = off.height = Math.ceil(size);
      var o = off.getContext('2d'); o.scale(size / 100, size / 100); o.fill(new Path2D(MARK_D));
      var data = o.getImageData(0, 0, off.width, off.height).data;
      var old = parts; parts = [];
      for (var y = 0; y < off.height; y += step) for (var x = 0; x < off.width; x += step) {
        if (data[(y * off.width + x) * 4 + 3] < 128) continue;
        var uu = x / size, vv = y / size, p = old[parts.length] || {};
        p.hx = ox + x; p.hy = oy + y; p.s = step * 0.62;
        p.c = Math.round(clamp(Math.sqrt(uu * uu + vv * vv) / 1.25, 0, 1) * 23);
        p.d = (uu + vv) * 450 + Math.random() * 250; p.ph = Math.random() * Math.PI * 2;
        if (p.x === undefined) { var an = Math.random() * Math.PI * 2, rr = Math.max(W, H) * (0.6 + Math.random() * 0.6); p.x = cx + Math.cos(an) * rr; p.y = cy + Math.sin(an) * rr; p.vx = p.vy = 0; }
        parts.push(p);
      }
      buckets = []; for (var c = 0; c < 24; c++) buckets.push([]);
      parts.forEach(function (p) { buckets[p.c].push(p); });
      if (RM) { parts.forEach(function (p) { p.x = p.hx; p.y = p.hy; }); draw(); }
    }
    function step(now) {
      if (!running) return;
      var r = canvas.getBoundingClientRect(), mx = pointer.x - r.left, my = pointer.y - r.top;
      var R = Math.max(90, W * 0.09), R2 = R * R, t = now * 0.001;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i]; if (now - born < p.d) continue;
        var hx = p.hx + Math.sin(t * 1.4 + p.ph) * 0.9, hy = p.hy + Math.cos(t * 1.1 + p.ph) * 0.9;
        p.vx += (hx - p.x) * 0.045; p.vy += (hy - p.y) * 0.045;
        if (pointer.active) { var dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
          if (d2 < R2 && d2 > 0.01) { var d = Math.sqrt(d2), f = (1 - d / R) * 7.5; p.vx += dx / d * f; p.vy += dy / d * f; } }
        for (var k = 0; k < shocks.length; k++) { var sh = shocks[k], sx = p.x - sh.x, sy = p.y - sh.y, sd = Math.sqrt(sx * sx + sy * sy) || 1, band = Math.abs(sd - sh.r);
          if (band < 40) { var sf = (1 - band / 40) * sh.f; p.vx += sx / sd * sf; p.vy += sy / sd * sf; } }
        p.vx *= 0.82; p.vy *= 0.82; p.x += p.vx; p.y += p.vy;
      }
      shocks = shocks.filter(function (s) { s.r += 14; s.f *= 0.93; return s.f > 0.2; });
      draw(); requestAnimationFrame(step);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var c = 0; c < 24; c++) { var b = buckets[c]; if (!b || !b.length) continue; ctx.fillStyle = cols[c];
        for (var i = 0; i < b.length; i++) { var p = b[i]; ctx.fillRect(p.x, p.y, p.s, p.s); } }
    }
    function play() { if (running || RM || !visible || document.hidden) return; running = true; requestAnimationFrame(step); }
    function pause() { running = false; }
    build();
    this.start = function () { born = performance.now(); play(); };
    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 150); });
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? play() : pause(); }).observe(canvas);
    document.addEventListener('visibilitychange', function () { document.hidden ? pause() : play(); });
    canvas.addEventListener('pointerdown', function (e) { var r = canvas.getBoundingClientRect(); shocks.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0, f: 9 }); });
  }
  var heroCanvas = $('.hero-canvas'), field = heroCanvas && heroCanvas.getContext ? new MarkField(heroCanvas) : null;

  /* ------------------------------------------------------------ cursor */
  if (FINE && !RM && $('.cursor')) {
    doc.classList.add('has-cursor');
    var cur = $('.cursor'), dot = $('.cursor-dot'), ring = $('.cursor-ring'), label = $('.cursor-label'), prev = $('.cursor-preview');
    var rx = pointer.x, ry = pointer.y, px = pointer.x, py = pointer.y, pvx = 0;
    (function loop() {
      rx = lerp(rx, pointer.x, 0.2); ry = lerp(ry, pointer.y, 0.2);
      var npx = lerp(px, pointer.x, 0.12); pvx = lerp(pvx, npx - px, 0.2); px = npx; py = lerp(py, pointer.y, 0.12);
      dot.style.transform = 'translate3d(' + pointer.x + 'px,' + pointer.y + 'px,0)';
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      if (prev) prev.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0) rotate(' + clamp(pvx * 1.2, -12, 12).toFixed(2) + 'deg)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest('[data-cursor], a, button, summary, label, input, textarea, select');
      var lab = t && t.closest('[data-cursor]');
      var pv = e.target.closest('[data-preview]');
      cur.classList.toggle('is-label', !!lab && !pv);
      cur.classList.toggle('is-link', !!t && !lab && !pv);
      cur.classList.toggle('is-preview', !!pv);
      label.textContent = lab && !pv ? lab.getAttribute('data-cursor') : '';
      if (prev && pv) { var src = pv.getAttribute('data-preview'); if (prev.getAttribute('data-src') !== src) { prev.setAttribute('data-src', src); prev.style.backgroundImage = 'url("' + src + '")'; } }
    });
    document.addEventListener('pointerdown', function () { cur.classList.add('is-down'); });
    document.addEventListener('pointerup', function () { cur.classList.remove('is-down'); });
    document.addEventListener('pointerleave', function () { cur.classList.add('is-hidden'); });
    document.addEventListener('pointerenter', function () { cur.classList.remove('is-hidden'); });
  }

  /* ---------------------------------------------------------- magnetic */
  if (FINE && !RM) $$('[data-magnetic]').forEach(function (el) {
    var inner = el.firstElementChild, strength = el.classList.contains('orb') ? 0.35 : 0.28;
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect(), x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
      el.style.transition = 'transform .15s linear'; el.style.transform = 'translate3d(' + x * strength + 'px,' + y * strength + 'px,0)';
      if (inner) { inner.style.transition = 'transform .15s linear'; inner.style.transform = 'translate3d(' + x * strength * 0.5 + 'px,' + y * strength * 0.5 + 'px,0)'; }
    });
    el.addEventListener('pointerleave', function () {
      el.style.transition = 'transform .8s cubic-bezier(.22,1.4,.36,1)'; el.style.transform = '';
      if (inner) { inner.style.transition = el.style.transition; inner.style.transform = ''; }
    });
  });

  /* -------------------------------------------------------------- tilt */
  if (FINE && !RM) $$('[data-tilt]').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.classList.add('tilting');
      el.style.setProperty('--ry', ((px - 0.5) * 10).toFixed(2) + 'deg'); el.style.setProperty('--rx', ((0.5 - py) * 8).toFixed(2) + 'deg');
      el.style.setProperty('--gx', (px * 100).toFixed(1) + '%'); el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
    });
    el.addEventListener('pointerleave', function () { el.classList.remove('tilting'); el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });

  /* -------------------------------------------------- spotlight border */
  $$('[data-spot]').forEach(function (grid) {
    var items = $$('[data-spot] > *', grid.parentNode).filter(function (c) { return c.parentNode === grid; });
    grid.addEventListener('pointermove', function (e) {
      items.forEach(function (c) { var r = c.getBoundingClientRect(); c.style.setProperty('--x', (e.clientX - r.left) + 'px'); c.style.setProperty('--y', (e.clientY - r.top) + 'px'); });
    });
    grid.addEventListener('pointerleave', function () { items.forEach(function (c) { c.style.setProperty('--x', '-999px'); }); });
  });

  /* --------------------------------------------- direction-aware hover */
  var DIRS = { top: ['0', '-101%'], right: ['101%', '0'], bottom: ['0', '101%'], left: ['-101%', '0'] };
  function edge(el, e) {
    var r = el.getBoundingClientRect(), x = (e.clientX - r.left - r.width / 2) * (r.width > r.height ? r.height / r.width : 1),
        y = (e.clientY - r.top - r.height / 2) * (r.height > r.width ? r.width / r.height : 1);
    return ['top', 'right', 'bottom', 'left'][Math.round((Math.atan2(y, x) * 180 / Math.PI + 180) / 90 + 3) % 4];
  }
  $$('[data-dir]').forEach(function (li) {
    li.addEventListener('pointerenter', function (e) {
      var d = DIRS[edge(li, e)];
      li.classList.add('notrans'); li.classList.remove('on');
      li.style.setProperty('--tx', d[0]); li.style.setProperty('--ty', d[1]);
      void li.offsetWidth; li.classList.remove('notrans'); li.classList.add('on');
    });
    li.addEventListener('pointerleave', function (e) { var d = DIRS[edge(li, e)]; li.style.setProperty('--tx', d[0]); li.style.setProperty('--ty', d[1]); li.classList.remove('on'); });
  });

  /* ---------------------------------------------------------- counters */
  var countIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return; countIO.unobserve(e.target);
      var el = e.target, to = +el.dataset.count, t0 = performance.now(), D = 1600;
      if (RM) return;
      (function tick(now) { var p = clamp((now - t0) / D, 0, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(tick); })(t0);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(function (el) { countIO.observe(el); });

  /* ------------------------------------------------- scroll-scrubbed text */
  var scrub = $('[data-scrub]'), scrubWords = [];
  if (scrub) { scrub.innerHTML = scrub.textContent.trim().split(/\s+/).map(function (w) { return '<span class="sw">' + w + '</span>'; }).join(' '); scrubWords = $$('.sw', scrub); }

  /* ----------------------------------------------------------- marquee */
  var rows = $$('[data-marquee]').map(function (row) {
    var track = row.firstElementChild, copy = track.cloneNode(true); copy.setAttribute('aria-hidden', 'true'); row.appendChild(copy);
    return { row: row, tracks: [track, copy], dir: +row.dataset.marquee, speed: +(row.dataset.speed || 0.6), x: 0, w: 0, vis: true };
  });
  function measureMarquee() { rows.forEach(function (m) { m.w = m.tracks[0].offsetWidth; }); }
  measureMarquee(); addEventListener('resize', measureMarquee);
  rows.forEach(function (m) { new IntersectionObserver(function (e) { m.vis = e[0].isIntersecting; }).observe(m.row); });

  /* ---------------------------------------------- pinned horizontal work */
  var work = $('.hwork'), track = work && $('.work-track', work), panels = work ? $$('.panel', work) : [];
  var meterIdx = $('[data-work-index]'), meterBar = $('[data-work-bar]');
  var hs = { on: false, dist: 0, top: 0, cur: 0 };
  function setupWork() {
    if (!work) return;
    hs.on = !RM && innerWidth > 900; doc.classList.toggle('hscroll', hs.on); track.style.transform = '';
    if (!hs.on) { work.style.height = ''; return; }
    hs.dist = Math.max(0, track.scrollWidth - innerWidth);
    work.style.height = (innerHeight + hs.dist) + 'px';
    hs.top = work.getBoundingClientRect().top + scrollY;
  }
  var panelIO = new IntersectionObserver(function (entries) { entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in-view'); }); }, { threshold: 0.3 });
  $$('.panel, .case-mock').forEach(function (p) { RM ? p.classList.add('in-view') : panelIO.observe(p); });

  /* ------------------------------------------------- parallax elements */
  var plx = $$('[data-parallax]').map(function (el) { return { el: el, k: +el.dataset.parallax || 0.12 }; });

  /* ---------------------------------------------- phone carousel (3D) */
  var flows = $$('[data-flow]');
  function flowFrame() {
    flows.forEach(function (f) {
      var r = f.getBoundingClientRect(), mid = r.left + r.width / 2;
      $$('.flow-item', f).forEach(function (it) {
        var b = it.getBoundingClientRect(), c = clamp((b.left + b.width / 2 - mid) / (r.width / 2), -1.4, 1.4);
        it.style.setProperty('--c', c.toFixed(3)); it.style.setProperty('--a', Math.min(1, Math.abs(c)).toFixed(3));
      });
    });
  }
  flows.forEach(function (f) {
    f.addEventListener('scroll', function () { requestAnimationFrame(flowFrame); }, { passive: true });
    var prevB = f.parentNode.querySelector('[data-flow-prev]'), nextB = f.parentNode.querySelector('[data-flow-next]');
    var by = function (d) { var it = f.querySelector('.flow-item'); f.scrollBy({ left: d * (it ? it.offsetWidth + 24 : 300), behavior: RM ? 'auto' : 'smooth' }); };
    if (prevB) prevB.addEventListener('click', function () { by(-1); });
    if (nextB) nextB.addEventListener('click', function () { by(1); });
  });
  flowFrame(); addEventListener('resize', flowFrame);

  /* ---------------------------------------------------- main scroll loop */
  var head = $('.head'), bar = $('.progress'), lastY = scrollY, vel = 0, skew = 0;
  function frame() {
    var y = scrollY, dy = y - lastY; lastY = y; vel = lerp(vel, dy, 0.12);
    var max = doc.scrollHeight - innerHeight;
    if (bar) bar.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    if (head) { head.classList.toggle('scrolled', y > 10); if (Math.abs(dy) > 2 && !doc.classList.contains('menu-open')) head.classList.toggle('hide', dy > 0 && y > 400); }
    if (!RM) {
      skew = lerp(skew, clamp(vel * 0.35, -10, 10), 0.1);
      rows.forEach(function (m) {
        if (!m.vis) return;
        m.x -= (m.speed + Math.abs(vel) * 0.25) * m.dir * (vel < 0 ? -1 : 1);
        if (m.x <= -m.w) m.x += m.w; if (m.x > 0) m.x -= m.w;
        var tf = 'translate3d(' + m.x.toFixed(2) + 'px,0,0)' + (m.row.dataset.skew === 'off' ? '' : ' skewX(' + (-skew).toFixed(2) + 'deg)');
        m.tracks[0].style.transform = tf; m.tracks[1].style.transform = tf;
      });
      plx.forEach(function (p) {
        var r = p.el.parentNode.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return;
        var c = (r.top + r.height / 2 - innerHeight / 2); p.el.style.transform = 'translate3d(0,' + (c * -p.k).toFixed(1) + 'px,0) scale(1.12)';
      });
    }
    if (hs.on) {
      var p = clamp((y - hs.top) / (hs.dist || 1), 0, 1); hs.cur = lerp(hs.cur, p, 0.14);
      track.style.transform = 'translate3d(' + (-hs.cur * hs.dist).toFixed(2) + 'px,0,0)';
      if (meterIdx) meterIdx.textContent = String(Math.min(panels.length, Math.floor(hs.cur * panels.length * 0.999) + 1)).padStart(2, '0');
      if (meterBar) meterBar.style.setProperty('--wp', (1 / panels.length + hs.cur * (1 - 1 / panels.length)).toFixed(3));
      panels.forEach(function (pn) {
        var r = pn.getBoundingClientRect(), c = (r.left + r.width / 2 - innerWidth / 2) / innerWidth;
        var sc = pn.querySelector('.scene'); if (sc) sc.style.setProperty('--px', (c * -60).toFixed(1) + 'px');
        if (Math.abs(c) < 0.35) pn.classList.add('in-view');
      });
    }
    if (scrubWords.length && !RM) {
      var r = scrub.getBoundingClientRect(), sp = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35), 0, 1), lit = Math.round(sp * scrubWords.length);
      for (var i = 0; i < scrubWords.length; i++) scrubWords[i].classList.toggle('lit', i < lit);
    }
    requestAnimationFrame(frame);
  }

  /* ------------------------------------------- filters with FLIP motion */
  $$('[data-filter-group]').forEach(function (group) {
    var target = document.getElementById(group.getAttribute('data-filter-group'));
    if (!target) return;
    var items = $$('[data-cat]', target), btns = $$('[data-filter]', group);
    btns.forEach(function (b) {
      var f = b.getAttribute('data-filter'), n = f === 'all' ? items.length : items.filter(function (i) { return (' ' + i.dataset.cat + ' ').indexOf(' ' + f + ' ') > -1; }).length;
      var c = b.querySelector('sup'); if (c) c.textContent = n;
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        var first = new Map(); items.forEach(function (i) { if (!i.hidden) first.set(i, i.getBoundingClientRect()); });
        items.forEach(function (i) { i.hidden = !(f === 'all' || (' ' + i.dataset.cat + ' ').indexOf(' ' + f + ' ') > -1); });
        if (RM) return;
        items.forEach(function (i) {
          if (i.hidden) return;
          var last = i.getBoundingClientRect(), fr = first.get(i);
          if (fr) { var dx = fr.left - last.left, dy = fr.top - last.top; if (dx || dy) i.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)' }); }
          else i.animate([{ opacity: 0, transform: 'scale(.92) translateY(20px)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.22,1,.36,1)' });
        });
      });
    });
  });

  /* ------------------------------------------------- grid / list toggle */
  $$('[data-view-toggle]').forEach(function (t) {
    var target = document.getElementById(t.getAttribute('data-view-toggle'));
    $$('button', t).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', t).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        var apply = function () { target.dataset.view = b.dataset.view; };
        if (document.startViewTransition && !RM) document.startViewTransition(apply); else apply();
      });
    });
  });

  /* ------------------------------------------------------------ lightbox */
  var lb = $('.lightbox');
  if (lb) {
    var lbImg = $('.lb-img', lb), lbCap = $('.lb-cap', lb), lbCount = $('.lb-count', lb), lbList = [], lbI = 0, lastFocus = null;
    var show = function (i) {
      lbI = (i + lbList.length) % lbList.length; var it = lbList[lbI];
      lbImg.classList.remove('ready'); lbImg.src = it.getAttribute('data-full'); lbImg.alt = it.getAttribute('data-title');
      lbCap.innerHTML = '<b>' + it.getAttribute('data-title') + '</b><span>' + (it.getAttribute('data-kind') || '') + '</span>';
      lbCount.textContent = String(lbI + 1).padStart(2, '0') + ' / ' + String(lbList.length).padStart(2, '0');
    };
    lbImg.addEventListener('load', function () { lbImg.classList.add('ready'); });
    var open = function (el) {
      lbList = $$('[data-full]').filter(function (x) { return !x.closest('[hidden]'); });
      lastFocus = el; lb.hidden = false; requestAnimationFrame(function () { lb.classList.add('open'); });
      doc.classList.add('lb-open'); show(lbList.indexOf(el)); $('.lb-close', lb).focus();
    };
    var close = function () { lb.classList.remove('open'); doc.classList.remove('lb-open'); setTimeout(function () { lb.hidden = true; }, 400); if (lastFocus) lastFocus.focus(); };
    $$('[data-full]').forEach(function (el) { el.addEventListener('click', function () { open(el); }); });
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', function () { show(lbI - 1); });
    $('.lb-next', lb).addEventListener('click', function () { show(lbI + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') show(lbI - 1); else if (e.key === 'ArrowRight') show(lbI + 1);
      else if (e.key === 'Tab') { var f = $$('button', lb); var i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    });
    var sx = null; lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(lbI + (dx < 0 ? 1 : -1)); sx = null; });
  }

  /* ------------------------------------------------------- FAQ accordion */
  $$('.faq details').forEach(function (d) {
    var s = d.querySelector('summary'), a = d.querySelector('.faq-a'), anim = null;
    s.addEventListener('click', function (e) {
      if (RM || !a.animate) return; e.preventDefault(); if (anim) anim.cancel();
      var open = !d.open, start = d.offsetHeight; if (open) d.open = true;
      var end = open ? s.offsetHeight + a.offsetHeight : s.offsetHeight;
      anim = d.animate({ height: [start + 'px', end + 'px'] }, { duration: 550, easing: 'cubic-bezier(.22,1,.36,1)' });
      a.animate({ opacity: open ? [0, 1] : [1, 0], transform: open ? ['translateY(-8px)', 'none'] : ['none', 'translateY(-8px)'] }, { duration: 450, easing: 'ease' });
      anim.onfinish = function () { if (!open) d.open = false; anim = null; };
    });
  });

  /* ------------------------------------------------------ copy + compose */
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy'), done = function (ok) { var l = b.querySelector('[data-copy-label]'); if (!l) return; var o = l.textContent; l.textContent = ok ? 'Copied' : 'Select and copy'; setTimeout(function () { l.textContent = o; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); else done(false);
    });
  });
  var form = $('[data-compose]');
  if (form) {
    var chips = $$('[data-chip]', form);
    chips.forEach(function (c) { c.addEventListener('click', function () { c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { var el = form.querySelector('#' + id); return el ? el.value.trim() : ''; };
      var picked = chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; }).map(function (c) { return c.textContent.trim(); });
      if (!v('f-name') || !v('f-msg')) { var st = form.querySelector('[data-status]'); st.textContent = 'Add your name and a short message, then try again.'; st.className = 'form-status warn'; return; }
      var body = 'Hi Nagules,\n\n' + v('f-msg') + '\n\n' + (picked.length ? 'Looking for: ' + picked.join(', ') + '\n' : '') + (v('f-company') ? 'Company: ' + v('f-company') + '\n' : '') + '\n' + v('f-name') + (v('f-email') ? '\n' + v('f-email') : '');
      var subject = (picked[0] ? picked[0] + ' · ' : '') + 'Hello from ' + v('f-name');
      var st2 = form.querySelector('[data-status]');
      st2.innerHTML = 'Your email is ready in your mail app. If it did not open, write to <b>contact@nagulesgobi.com</b>.'; st2.className = 'form-status ok';
      location.href = 'mailto:contact@nagulesgobi.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  /* -------------------------------------------------------------- clock */
  var clock = $('[data-clock]');
  function tickClock() { try { clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' }).format(new Date()); } catch (_) {} }
  if (clock) { tickClock(); setInterval(tickClock, 15000); }
  $$('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });

  /* --------------------------------------------------------------- boot */
  var rs; addEventListener('resize', function () { clearTimeout(rs); rs = setTimeout(setupWork, 120); });
  addEventListener('load', function () { setupWork(); measureMarquee(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setupWork(); measureMarquee(); });
  setupWork(); requestAnimationFrame(frame); armReveals();
  runIntro(function () { startHero(); if (field) field.start(); });
})();
