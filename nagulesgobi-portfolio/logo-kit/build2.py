import os, re, math, glob, sys
sys.path.insert(0, '../brand')
from txt2path import text_path
import importlib.util
spec = importlib.util.spec_from_file_location('m', 'mark2.py'); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
f = m.f
STOPS = [(0, '#FF9124'), (0.3, '#FF4A2C'), (0.55, '#FF2440'), (1, '#FF008E')]
def rgrad(id_, ox, oy, sc):
    st = ''.join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in STOPS)
    return f'<radialGradient id="{id_}" gradientUnits="userSpaceOnUse" cx="{f(ox)}" cy="{f(oy)}" r="{f(1.45 * m.S * sc)}">{st}</radialGradient>'
HEAD = 'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Nagules Gobi"><title>Nagules Gobi</title>'
def icon(fill=None):
    sc = 84 / m.TIP; ox = (100 - m.S * sc) / 2; oy = 8
    d = m.path(ox, oy, sc)
    if fill: return f'<svg viewBox="0 0 100 100" {HEAD}<g id="icon"><path fill="{fill}" d="{d}"/></g></svg>\n'
    return f'<svg viewBox="0 0 100 100" {HEAD}<defs>{rgrad("ng-g", ox, oy, sc)}</defs><g id="icon"><path fill="url(#ng-g)" d="{d}"/></g></svg>\n'
FONT = glob.glob('../brand/fontpkgs/fontsource-barlow-semi-condensed-*/package/files/barlow-semi-condensed-latin-600-normal.woff')[0]
CAP, TRACK, GAP = 40.0, 0.06, 1.6 * m.t
def lockup(ink, mono=None):
    tx = m.S + GAP; base = m.S / 2 + CAP / 2
    d, w = text_path(FONT, 'NAGULESGOBI', CAP, x0=tx, y_base=base, tracking=TRACK)
    d = re.sub(r'-?\d+\.\d+', lambda q: f(float(q.group())), d)
    W = math.ceil(tx + w + 4); Hh = math.ceil(m.TIP + 8)
    vb = f'-4 -4 {W + 4} {Hh}'
    fill = mono or 'url(#ng-l)'
    defs = '' if mono else f'<defs>{rgrad("ng-l", 0, 0, 1)}</defs>'
    return f'<svg viewBox="{vb}" {HEAD}{defs}<g id="icon"><path fill="{fill}" d="{m.path()}"/></g><g id="wordmark"><path fill="{mono or ink}" d="{d}"/></g></svg>\n', d, vb
out = 'export'; os.makedirs(out, exist_ok=True)
open(f'{out}/icon.svg', 'w').write(icon())
open(f'{out}/icon-black.svg', 'w').write(icon('#1A1A1A'))
open(f'{out}/icon-white.svg', 'w').write(icon('#F2F2F2'))
L, wd, vb = lockup('#1A1A1A'); open(f'{out}/logo.svg', 'w').write(L)
open(f'{out}/logo-dark.svg', 'w').write(lockup('#F2F2F2')[0])
open(f'{out}/logo-mono-black.svg', 'w').write(lockup(None, '#1A1A1A')[0])
open(f'{out}/logo-mono-white.svg', 'w').write(lockup(None, '#F2F2F2')[0])
# pieces for the website
open('site-parts.txt', 'w').write('\n'.join([vb, m.path(), wd, m.path((100 - m.S * 84 / m.TIP) / 2, 8, 84 / m.TIP)]))
print('ok', vb)
