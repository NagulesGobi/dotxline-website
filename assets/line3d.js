// The dotXline line in 3D: one tube that draws a circle (0), crosses over itself (x), and rises (1).
// Flat toon shading in Amber, no glow. Falls back to the SVG mark if WebGL or the module is unavailable.
import * as THREE from './vendor/three-r160.module.min.js';

const stage = document.querySelector('[data-line3d]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (stage && !reduce) {
  try { start(stage); } catch (e) { /* the SVG fallback stays */ }
}

function pathPoints() {
  // the mark's own geometry (100 x 100 units, y down), with depth at the crossing
  const pts = [];
  const C = { x: 50, y: 50 }, R = 16, O = { x: 50 - R * Math.SQRT2, y: 50 };
  const S = { x: 63.44, y: 36.56 }, T1 = { x: 38.69, y: 61.31 }, T2 = { x: 38.69, y: 38.69 }, P = { x: 61.31, y: 61.31 };
  const Q = { x: 67.67, y: 54.95 }, r2 = 9, E = { x: 76.68, y: 54.95 }, B = { x: 76.68, y: 20 };
  const over = 6, under = -6;
  const line = (a, b, za, zb, n) => { for (let i = 0; i < n; i++) { const t = i / n; pts.push([a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, za + (zb - za) * t]); } };
  line(S, T1, over, over, 24);                                  // first stroke of the x passes over
  const a0 = Math.PI / 4, a1 = Math.PI / 4 + Math.PI * 1.5;     // the loop: 270 degrees around the zero
  for (let i = 0; i < 90; i++) { const t = i / 90, a = a0 + (a1 - a0) * t; pts.push([O.x + R * Math.cos(a), O.y + R * Math.sin(a), over + (under - over) * (0.5 - 0.5 * Math.cos(Math.PI * t))]); }
  line(T2, P, under, 0, 24);                                    // second stroke of the x passes under
  const b0 = Math.PI * 0.75, b1 = 0;                            // the turn
  for (let i = 0; i < 18; i++) { const t = i / 18, a = b0 + (b1 - b0) * t; pts.push([Q.x + r2 * Math.cos(a), Q.y + r2 * Math.sin(a), 0]); }
  line(E, B, 0, 0, 20);                                         // the rise: the one
  pts.push([B.x, B.y, 0]);
  return pts.map(([x, y, z]) => new THREE.Vector3(x - 52, -(y - 44), z));
}

function start(host) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 1, 2000);
  camera.position.set(0, 0, 250);

  // three flat tones: shadow, body, light. Toon, so it reads as a drawn line, not a glossy object.
  const tones = new Uint8Array([150, 225, 255]);
  const grad = new THREE.DataTexture(tones, 3, 1, THREE.RedFormat);
  grad.minFilter = grad.magFilter = THREE.NearestFilter; grad.needsUpdate = true;
  const mat = new THREE.MeshToonMaterial({ color: 0xF5A524, gradientMap: grad });

  const curve = new THREE.CatmullRomCurve3(pathPoints(), false, 'centripetal');
  const SEG = 600, RAD = 5, RS = 28;
  const geo = new THREE.TubeGeometry(curve, SEG, RAD, RS, false);
  const tube = new THREE.Mesh(geo, mat);
  const capGeo = new THREE.SphereGeometry(RAD, 28, 20);
  const capA = new THREE.Mesh(capGeo, mat), capB = new THREE.Mesh(capGeo, mat);
  capA.position.copy(curve.getPointAt(0));

  const group = new THREE.Group();
  group.add(tube, capA, capB);
  group.scale.setScalar(1.3);
  scene.add(group);

  scene.add(new THREE.AmbientLight(0xffffff, 0.95));
  const key = new THREE.DirectionalLight(0xffffff, 1.25); key.position.set(-60, 90, 160); scene.add(key);

  const total = geo.index.count, per = RS * 6;
  let drawn = 0;
  const t0 = performance.now(), DRAW = 1700;
  const target = { x: 0, y: 0 }, rot = { x: 0, y: 0 };
  let dragging = false, dragX = 0, spin = 0, spinV = 0;

  const resize = () => {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(host); resize();

  // the mark looks toward the pointer wherever it is on the page; dragging still spins it
  addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const r = host.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    target.y = Math.max(-0.6, Math.min(0.6, (e.clientX - cx) / innerWidth * 1.4));
    target.x = Math.max(-0.4, Math.min(0.4, (e.clientY - cy) / innerHeight * 1.0));
    if (dragging) { spinV = (e.clientX - dragX) * 0.012; spin += spinV; dragX = e.clientX; }
  }, { passive: true });
  host.addEventListener('pointerdown', e => { dragging = true; dragX = e.clientX; host.setPointerCapture(e.pointerId); host.querySelector('canvas').style.cursor = 'grabbing'; });
  const up = () => { dragging = false; host.querySelector('canvas').style.cursor = ''; };
  host.addEventListener('pointerup', up); host.addEventListener('pointercancel', up);
  document.addEventListener('pointerleave', () => { target.x = target.y = 0; });

  let visible = true, raf = 0;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(frame); }).observe(host);

  function frame(now) {
    raf = 0;
    const t = now - t0;
    // draw-on: ease out over DRAW ms, the round cap leads the line
    const k = Math.min(1, t / DRAW), e = 1 - Math.pow(1 - k, 3);
    const segs = Math.max(1, Math.round(e * SEG));
    if (segs !== drawn) { drawn = segs; geo.setDrawRange(0, Math.min(total, segs * per)); capB.position.copy(curve.getPointAt(Math.min(1, segs / SEG))); }
    // gentle sway, pointer follow, and a flick you can throw
    if (!dragging) { spinV *= 0.94; spin += spinV; spin *= 0.985; }
    const sway = Math.sin(t / 2600) * 0.18;
    rot.x += (target.x - rot.x) * 0.06; rot.y += (target.y - rot.y) * 0.06;
    group.rotation.set(rot.x + 0.08, sway + rot.y + spin, 0);
    group.position.y = Math.sin(t / 1900) * 2;
    renderer.render(scene, camera);
    if (visible) raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  host.classList.add('is-3d');
}
