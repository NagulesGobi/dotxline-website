// dotXline site behaviour: menu, the scroll film, pointer tilt, one-time reveals. No dependencies.
(() => {
  document.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // mobile menu
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) btn.click(); });
  }

  // the scroll films: as you scroll, a mark builds itself, one chapter at a time.
  // Pieces: [data-step="n"] belongs to chapter n; data-kind = draw (default) | rotate | pop | fade;
  // data-from / data-to (0..1) set when, inside its chapter, a piece moves.
  // rotate takes data-a0, data-a1 (degrees) and data-cx, data-cy (the pivot, in SVG units).
  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  const setPiece = (el, v) => {
    const kind = el.dataset.kind || 'draw';
    if (kind === 'draw') { el.style.strokeDashoffset = (1 - v).toFixed(4); el.style.opacity = v > 0.002 ? 1 : 0; }
    else if (kind === 'fade') { el.style.opacity = v.toFixed(3); }
    else if (kind === 'rotate') {
      const a = +el.dataset.a0 + (+el.dataset.a1 - +el.dataset.a0) * ease(v);
      el.setAttribute('transform', `rotate(${a.toFixed(2)} ${el.dataset.cx} ${el.dataset.cy})`);
    } else if (kind === 'pop') {
      const k = ease(v), cx = el.dataset.cx, cy = el.dataset.cy;
      el.style.opacity = k.toFixed(3);
      el.setAttribute('transform', `translate(${cx} ${cy}) scale(${(0.2 + 0.8 * k).toFixed(3)}) translate(${-cx} ${-cy})`);
    }
  };
  document.querySelectorAll('.film').forEach(film => {
    const caps = film.querySelectorAll('.film-cap');
    const n = caps.length || 3;
    const pieces = [...film.querySelectorAll('[data-step], .draw')].filter((el, i, arr) => arr.indexOf(el) === i);
    const glyphs = film.querySelectorAll('.film-glyph span');
    const local = (el, i, p) => {
      const step = el.dataset.step !== undefined ? +el.dataset.step : i;
      const from = el.dataset.from !== undefined ? +el.dataset.from : 0;
      const to = el.dataset.to !== undefined ? +el.dataset.to : 1;
      return clamp(((p * n - step) - from) / Math.max(0.001, to - from));
    };
    if (reduce) { pieces.forEach(el => setPiece(el, 1)); return; }
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = film.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - innerHeight));
      film.style.setProperty('--p', p.toFixed(4));
      pieces.forEach((el, i) => setPiece(el, local(el, i, p)));
      const stage = Math.min(n - 1, Math.floor(p * n + 0.0001));
      caps.forEach((c, i) => c.classList.toggle('on', i === stage));
      glyphs.forEach((g, i) => g.classList.toggle('on', i === stage));
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  });

  // Apple-style scroll scenes. [data-scene] is a tall section with a sticky inside; its children marked
  // [data-show="i"] are shown one at a time as you scroll (n = data-scene). --p carries 0..1 for CSS.
  document.querySelectorAll('[data-scene]').forEach(scene => {
    const n = +scene.dataset.scene || 1;
    const items = scene.querySelectorAll('[data-show]');
    if (reduce) { items.forEach(i => i.classList.add('on')); scene.classList.add('flat'); return; }
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = scene.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - innerHeight));
      scene.style.setProperty('--p', p.toFixed(4));
      const stage = Math.min(n - 1, Math.floor(p * n + 0.0001));
      items.forEach(el => el.classList.toggle('on', +el.dataset.show === stage));
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  });

  // statements that light up word by word as you read down the page
  document.querySelectorAll('[data-read]').forEach(el => {
    if (reduce) return;
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map(w => `<span aria-hidden="true">${w}</span>`).join(' ');
    const spans = el.querySelectorAll('span');
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const p = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35));
      const lit = Math.round(p * spans.length);
      spans.forEach((s, i) => s.classList.toggle('lit', i < lit));
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  });

  // media that grows into place as it scrolls up the screen
  document.querySelectorAll('[data-zoom]').forEach(el => {
    if (reduce) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const p = clamp((innerHeight - r.top) / (innerHeight * 0.9));
      el.style.setProperty('--z', p.toFixed(4));
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  });

  // the drawn line dividers: each draws itself once, when it comes into view
  const lines = document.querySelectorAll('.line-rule path');
  if ('IntersectionObserver' in window && !reduce) {
    const lo = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.closest('.line-rule').classList.add('seen'); lo.unobserve(e.target); } }), { threshold: 0.6 });
    lines.forEach(l => lo.observe(l));
  } else lines.forEach(l => l.closest('.line-rule').classList.add('seen'));

  // pointer tilt on app icons and phones: the object turns toward you
  if (fine && !reduce) {
    document.querySelectorAll('[data-tilt]').forEach(host => {
      const target = host.querySelector('[data-tilt-target]') || host;
      const max = parseFloat(host.dataset.tilt) || 10;
      host.addEventListener('pointermove', e => {
        const r = host.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        target.style.setProperty('--ry', (x * max).toFixed(2) + 'deg');
        target.style.setProperty('--rx', (-y * max).toFixed(2) + 'deg');
      });
      host.addEventListener('pointerleave', () => { target.style.removeProperty('--ry'); target.style.removeProperty('--rx'); });
    });
  }

  // one-time reveals
  const els = document.querySelectorAll('.reveal, .piece');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('seen'); io.unobserve(en.target); }
    }), { threshold: 0.35 });
    els.forEach(el => io.observe(el));
  } else els.forEach(el => el.classList.add('seen'));

  // sound toggles for films that have a soundtrack
  document.querySelectorAll('[data-sound]').forEach(b => {
    const v = document.getElementById(b.dataset.sound);
    if (!v) return;
    b.addEventListener('click', () => {
      v.muted = !v.muted;
      if (!v.muted) { v.currentTime = 0; v.play().catch(() => {}); }
      b.setAttribute('aria-pressed', String(!v.muted));
      b.textContent = v.muted ? 'Turn sound on' : 'Turn sound off';
    });
  });

  // videos only play when on screen, and never when motion is reduced
  document.querySelectorAll('video[data-autoplay]').forEach(v => {
    if (reduce) { v.removeAttribute('autoplay'); if (!v.classList.contains('pbg')) v.controls = true; return; }
    const io = new IntersectionObserver(([en]) => { en.isIntersecting ? v.play().catch(() => {}) : v.pause(); }, { threshold: 0.3 });
    io.observe(v);
  });

  // the 3D mark's hint goes away once someone has turned it
  document.querySelectorAll('.stage').forEach(st => st.addEventListener('pointerdown', () => st.classList.add('dragged'), { once: true }));

  // motion layer: a progress line, staggered entrances, icons that draw themselves, magnetic buttons
  if (!reduce) {
    const bar = document.createElement('div');
    bar.className = 'scroll-line'; bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    let bt = false;
    const prog = () => {
      bt = false;
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? clamp(scrollY / h).toFixed(4) : 0})`;
    };
    addEventListener('scroll', () => { if (!bt) { bt = true; requestAnimationFrame(prog); } }, { passive: true });
    prog();

    const groups = new Map();
    document.querySelectorAll('.fc, .habit, .group, .privacy-points > div, .spec > div, .feature, .app, .section-head').forEach(el => {
      const key = el.parentElement;
      const i = groups.get(key) || 0; groups.set(key, i + 1);
      el.style.setProperty('--i', Math.min(i, 7));
      el.classList.add('sx');
      el.querySelectorAll('.fi svg *').forEach(s => s.setAttribute('pathLength', '1'));
    });
    if ('IntersectionObserver' in window) {
      const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); so.unobserve(e.target); } }), { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
      document.querySelectorAll('.sx').forEach(el => so.observe(el));
    } else document.querySelectorAll('.sx').forEach(el => el.classList.add('in'));

    if (fine) {
      document.querySelectorAll('.btn').forEach(b => {
        b.addEventListener('pointermove', e => {
          const r = b.getBoundingClientRect();
          b.style.setProperty('--mx', (((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(1) + 'px');
          b.style.setProperty('--my', (((e.clientY - r.top) / r.height - 0.5) * 8).toFixed(1) + 'px');
        });
        b.addEventListener('pointerleave', () => { b.style.removeProperty('--mx'); b.style.removeProperty('--my'); });
      });
    }
  }

  // ===== theme, sticky header, quick search, page veil, small touches =====
  const root = document.documentElement;
  const effective = () => root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const head = document.querySelector('.site-head');
  const headLogo = head && !head.classList.contains('on-light') ? head.querySelector('.brand img') : null;
  const syncTheme = () => {
    const dark = effective() === 'dark';
    document.querySelectorAll('.theme-btn').forEach(b => {
      b.classList.toggle('is-dark', dark);
      b.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    });
    document.querySelectorAll('picture source').forEach(s => { s.media = dark ? 'all' : 'not all'; });
    if (headLogo) headLogo.src = head.classList.contains('stuck') && !dark ? 'logo-light.svg' : 'logo-dark.svg';
  };
  const setTheme = t => { root.dataset.theme = t; try { localStorage.setItem('dx-theme', t); } catch (e) {} syncTheme(); };
  const toggleTheme = () => setTheme(effective() === 'dark' ? 'light' : 'dark');
  document.querySelectorAll('.theme-btn').forEach(b => b.addEventListener('click', toggleTheme));
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', syncTheme);
  if (root.dataset.theme) syncTheme(); else syncTheme();

  // header: slim and blurred once you scroll, hides on the way down, returns on the way up
  if (head) {
    let lastY = scrollY, ht = false;
    const onScroll = () => {
      ht = false;
      const y = scrollY, stuck = y > 80;
      if (stuck !== head.classList.contains('stuck')) { head.classList.toggle('stuck', stuck); syncTheme(); }
      const menuOpen = document.getElementById('menu')?.classList.contains('open');
      head.classList.toggle('hide', stuck && y > lastY + 4 && y > 400 && !menuOpen);
      if (y < lastY - 4 || y < 400) head.classList.remove('hide');
      lastY = y;
    };
    addEventListener('scroll', () => { if (!ht) { ht = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
    head.addEventListener('focusin', () => head.classList.remove('hide'));
  }

  // phone menu: backdrop for the bottom sheet
  if (btn && menu) {
    const bd = document.createElement('div'); bd.className = 'sheet-bd'; bd.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bd);
    bd.addEventListener('click', () => { if (menu.classList.contains('open')) btn.click(); });
    btn.addEventListener('click', () => bd.classList.toggle('on', menu.classList.contains('open')));
  }

  // quick search: / or Ctrl/Cmd+K
  const NAV = [
    ['Home', 'index.html', 'Page'], ['Xpense', 'xpense.html', 'App'], ['Tockbee', 'tockbee.html', 'App'],
    ['About dotXline', 'about.html', 'Page'], ['Support and FAQ', 'support.html', 'Page'], ['Press kit', 'press.html', 'Page'],
    ['What’s new', 'whats-new.html', 'Page'], ['Privacy policy', 'privacy.html', 'Legal'], ['Terms of use', 'terms.html', 'Legal']
  ];
  const ACTIONS = [
    ['Switch light / dark theme', () => toggleTheme(), 'Action'],
    ['Email hello@dotxline.com', () => { location.href = 'mailto:hello@dotxline.com'; }, 'Action'],
    ['Copy email address', () => { navigator.clipboard?.writeText('hello@dotxline.com'); }, 'Action']
  ];
  const base = location.pathname.replace(/[^/]*$/, '');
  const items = [...NAV.map(([t, h, k]) => ({ t, k, run: () => go(base + h) })), ...ACTIONS.map(([t, f, k]) => ({ t, k, run: f }))];
  const cmd = document.createElement('div');
  cmd.className = 'cmdk'; cmd.setAttribute('role', 'dialog'); cmd.setAttribute('aria-modal', 'true'); cmd.setAttribute('aria-label', 'Search the site');
  cmd.innerHTML = '<div class="cmdk-panel"><input type="text" role="combobox" aria-expanded="true" aria-controls="cmdk-list" placeholder="Where to? Try “xpense” or “theme”" autocomplete="off" spellcheck="false"><ul id="cmdk-list" role="listbox"></ul><div class="cmdk-foot"><span>↑↓ to move</span><span>↵ to open</span><span>esc to close</span></div></div>';
  document.body.appendChild(cmd);
  const input = cmd.querySelector('input'), list = cmd.querySelector('ul');
  let shown = [], sel = 0, lastFocus = null;
  const render = q => {
    const t = q.trim().toLowerCase();
    shown = items.filter(i => !t || (i.t + ' ' + i.k).toLowerCase().includes(t));
    sel = 0;
    list.innerHTML = shown.length ? shown.map((i, n) => `<li role="option" id="cmdk-${n}" data-n="${n}" aria-selected="${n === 0}">${i.t}<small>${i.k}</small></li>`).join('') : '<li class="none" aria-disabled="true">Nothing matches. Try “support”.</li>';
  };
  const mark = () => { list.querySelectorAll('li[role=option]').forEach((li, n) => { li.setAttribute('aria-selected', String(n === sel)); if (n === sel) { li.scrollIntoView({ block: 'nearest' }); input.setAttribute('aria-activedescendant', li.id); } }); };
  const openCmd = () => { lastFocus = document.activeElement; input.value = ''; render(''); cmd.classList.add('open'); setTimeout(() => input.focus(), 30); };
  const closeCmd = () => { cmd.classList.remove('open'); lastFocus?.focus?.(); };
  const choose = n => { const it = shown[n]; if (!it) return; closeCmd(); it.run(); };
  document.querySelectorAll('.cmd-btn').forEach(b => b.addEventListener('click', openCmd));
  cmd.addEventListener('click', e => { if (e.target === cmd) closeCmd(); const li = e.target.closest('li[data-n]'); if (li) choose(+li.dataset.n); });
  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(shown.length - 1, sel + 1); mark(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); mark(); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(sel); }
    else if (e.key === 'Tab') e.preventDefault();
  });
  addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); cmd.classList.contains('open') ? closeCmd() : openCmd(); }
    else if (e.key === '/' && !typing && !cmd.classList.contains('open')) { e.preventDefault(); openCmd(); }
    else if (e.key === 'Escape' && cmd.classList.contains('open')) closeCmd();
  });
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || '');
  document.querySelectorAll('.kbd').forEach(k => { k.textContent = mac ? '⌘K' : 'Ctrl K'; });

  // page veil: the mark draws itself while the next page loads
  function go(url) {
    if (reduce) { location.href = url; return; }
    veilOn(); setTimeout(() => { try { sessionStorage.setItem('dx-nav', '1'); } catch (e) {} location.href = url; }, 380);
  }
  let veil = null;
  function veilOn() {
    if (!veil) {
      veil = document.createElement('div'); veil.className = 'veil'; veil.setAttribute('aria-hidden', 'true');
      veil.innerHTML = '<svg viewBox="4 3 80 80"><path pathLength="1" d="M63.44 36.56 L38.69 61.31 A16 16 0 1 1 38.69 38.69 L61.31 61.31 A9 9 0 0 0 76.68 54.95 L76.68 20" fill="none" stroke="#F5A524" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      document.body.appendChild(veil);
    }
    veil.classList.add('on');
  }
  addEventListener('pageshow', e => { if (e.persisted && veil) veil.classList.remove('on'); });
  if (!reduce) document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target || a.hasAttribute('download')) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || !/\.html?$|\/$/.test(u.pathname) || (u.pathname === location.pathname && u.hash)) return;
    e.preventDefault(); go(u.href);
  });

  // images fade in sharp; headlines lean a hair with scroll speed; haptic tick on touch
  document.querySelectorAll('main img').forEach(img => {
    if (img.complete) return;
    img.classList.add('ld');
    const done = () => img.classList.remove('ld');
    img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true });
  });
  if (!reduce) {
    let py = scrollY, v = 0, vr = false;
    const decay = () => {
      v *= 0.86; root.style.setProperty('--v', v.toFixed(3));
      if (Math.abs(v) > 0.01) requestAnimationFrame(decay); else { vr = false; root.style.setProperty('--v', 0); }
    };
    addEventListener('scroll', () => {
      const dy = scrollY - py; py = scrollY;
      v = Math.max(-1, Math.min(1, v * 0.7 + dy / 60));
      if (!vr) { vr = true; requestAnimationFrame(decay); }
    }, { passive: true });
  }
  addEventListener('pointerdown', e => { if (e.pointerType === 'touch' && e.target.closest('.btn,.fc,.tool,.dkey,.dchip,.dsave')) navigator.vibrate?.(8); }, { passive: true });

  // press kit: click a colour or the boilerplate to copy it
  const flash = (el, txt) => { const old = el.dataset.label || el.textContent; el.dataset.label = old; el.textContent = txt; setTimeout(() => { el.textContent = old; }, 1400); };
  document.querySelectorAll('[data-copy]').forEach(el => el.addEventListener('click', async () => {
    const text = el.dataset.copy === 'next' ? el.parentElement.querySelector('p').textContent.trim() : el.dataset.copy;
    try { await navigator.clipboard.writeText(text); } catch (e) {}
    const small = el.querySelector('small'); flash(small || el, 'Copied');
  }));

  // try-it phone on the Xpense page
  document.querySelectorAll('[data-demo]').forEach(demo => {
    const $ = s => demo.querySelector(s);
    const amt = $('.damt'), save = $('.dsave'), chips = [...demo.querySelectorAll('.dchip')];
    let pence = 0, cat = '';
    const money = n => '£' + (n / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const refresh = () => { amt.textContent = money(pence); save.disabled = !(pence > 0 && cat); };
    const press = k => { if (k === 'del') pence = Math.floor(pence / 10); else if (k === '00') pence = Math.min(pence * 100, 9999999); else pence = Math.min(pence * 10 + (+k), 9999999); refresh(); };
    demo.querySelectorAll('.dkey').forEach(b => b.addEventListener('click', () => press(b.dataset.k)));
    chips.forEach(c => c.addEventListener('click', () => { cat = c.dataset.cat; chips.forEach(x => x.setAttribute('aria-pressed', String(x === c))); refresh(); }));
    demo.addEventListener('keydown', e => { if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') press('del'); else if (e.key === 'Enter' && !save.disabled && e.target.tagName !== 'BUTTON') save.click(); });
    const LAST = 24000, SO_FAR = 15000;
    save.addEventListener('click', () => {
      const total = SO_FAR + pence, diff = Math.abs(LAST - total);
      $('.dform').hidden = true; const done = $('.ddone'); done.hidden = false;
      $('.dlog').textContent = money(pence) + ' logged to ' + cat + '.';
      $('.dmsg').textContent = total <= LAST ? `Nice, ${money(diff).replace('.00', '')} less than last month so far.` : `${money(diff).replace('.00', '')} more than last month so far.`;
      const w = Math.min(100, total / Math.max(LAST, total) * 100), lw = LAST / Math.max(LAST, total) * 100;
      const [bl, bt] = done.querySelectorAll('.dbars div');
      bl.querySelector('b').style.width = '0'; bt.querySelector('b').style.width = '0'; bt.querySelector('span').style.width = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        bl.querySelector('b').style.width = lw + '%';
        bt.querySelector('b').style.width = w + '%';
        if (total < LAST) { bt.querySelector('span').style.width = (lw) + '%'; bt.querySelector('b').style.width = w + '%'; }
      }));
    });
    $('.dagain').addEventListener('click', () => { pence = 0; cat = ''; chips.forEach(x => x.setAttribute('aria-pressed', 'false')); refresh(); $('.ddone').hidden = true; $('.dform').hidden = false; });
    refresh();
  });

  // phones lean a few degrees as they scroll through the screen, like the screen-by-screen phone
  if (!reduce) {
    const phones = [...document.querySelectorAll('.phone')];
    if (phones.length) {
      let pt = false;
      const lean = () => {
        pt = false;
        phones.forEach(p => {
          const r = p.getBoundingClientRect();
          p.style.setProperty('--p', clamp((innerHeight - r.top) / (innerHeight + r.height)).toFixed(3));
        });
      };
      addEventListener('scroll', () => { if (!pt) { pt = true; requestAnimationFrame(lean); } }, { passive: true });
      addEventListener('resize', lean);
      lean();
    }
  }
})();
