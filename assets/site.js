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
    if (reduce) { v.removeAttribute('autoplay'); v.controls = true; return; }
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
})();
