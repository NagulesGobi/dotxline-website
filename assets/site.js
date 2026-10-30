// dotXline site behaviour: menu, the scroll film, pointer tilt, one-time reveals. No dependencies.
(() => {
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

  // the scroll film: as you scroll, the line draws 0, then x, then 1
  const film = document.querySelector('.film');
  if (film && !reduce) {
    const draws = film.querySelectorAll('.draw');
    const caps = film.querySelectorAll('.film-cap');
    const glyphs = film.querySelectorAll('.film-glyph span');
    const clamp = v => Math.max(0, Math.min(1, v));
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = film.getBoundingClientRect();
      const span = r.height - innerHeight;
      const p = clamp(-r.top / span);
      film.style.setProperty('--p', p.toFixed(4));
      // three equal chapters, each draws its own piece of the line
      draws.forEach((d, i) => { const v = clamp(p * 3 - i); d.style.strokeDashoffset = (1 - v).toFixed(4); d.style.opacity = v > 0.002 ? 1 : 0; });
      const stage = Math.min(2, Math.floor(p * 3 + 0.0001));
      caps.forEach((c, i) => c.classList.toggle('on', i === stage));
      glyphs.forEach((g, i) => g.classList.toggle('on', i === stage));
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

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

  // videos only play when on screen, and never when motion is reduced
  document.querySelectorAll('video[data-autoplay]').forEach(v => {
    if (reduce) { v.removeAttribute('autoplay'); v.controls = true; return; }
    const io = new IntersectionObserver(([en]) => { en.isIntersecting ? v.play().catch(() => {}) : v.pause(); }, { threshold: 0.3 });
    io.observe(v);
  });
})();
