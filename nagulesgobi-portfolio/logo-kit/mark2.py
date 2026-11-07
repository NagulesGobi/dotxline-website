"""NagulesGobi N-mark (2026 version) as exact geometry, measured from the supplied artwork.
Square S, stroke t = 0.18 S, corner radius R = 0.384 S on the top-right and bottom-left.
Every stroke and gap is t; the diagonal lies on the square's diagonal; the opening on the
right (and the end of the bottom-left arc) sits centred on the square's midline."""
import math
S = 60.0
t = S * 70.5 / 391
R = S / 2 - t / 2               # corner arcs end exactly at the opening / bar end
k = t * math.sqrt(2) / 2          # half-width of the diagonal band, measured horizontally
g0, g1 = S / 2 - t / 2, S / 2 + t / 2
ri = R - t                         # inner radius
TIP = S + k
def f(v): return ('%.2f' % v).rstrip('0').rstrip('.')
def path(ox=0.0, oy=0.0, sc=1.0):
    X = lambda x: f(ox + x * sc); Y = lambda y: f(oy + y * sc); r = lambda v: f(v * sc)
    return ''.join([
        f'M{X(0)} {Y(0)}',
        f'H{X(S - R)}',
        f'A{r(R)} {r(R)} 0 0 1 {X(S)} {Y(R)}',
        f'V{Y(g0)}',
        f'H{X(S - t)}',
        f'V{Y(R)}',
        f'A{r(ri)} {r(ri)} 0 0 0 {X(S - R)} {Y(t)}',
        f'H{X(t + k)}',
        f'L{X(S - t)} {Y(S - t - k)}',
        f'V{Y(g1)}',
        f'H{X(S)}',
        f'V{Y(TIP)}',
        f'L{X(t)} {Y(t + k)}',
        f'V{Y(S - R)}',
        f'A{r(ri)} {r(ri)} 0 0 0 {X(R)} {Y(S - t)}',
        f'H{X(g0)}',
        f'V{Y(S)}',
        f'H{X(R)}',
        f'A{r(R)} {r(R)} 0 0 1 {X(0)} {Y(S - R)}',
        'Z'])
STOPS = [(0, '#FF8E24'), (0.33, '#FF3B30'), (0.6, '#FF1B4E'), (1, '#FF008E')]
def grad(id_, ox=0, oy=0, sc=1, stops=STOPS):
    s = ''.join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<linearGradient id="{id_}" gradientUnits="userSpaceOnUse" x1="{f(ox)}" y1="{f(oy)}" x2="{f(ox+S*sc)}" y2="{f(oy+TIP*sc)}">{s}</linearGradient>'
def icon(fill=None, stops=STOPS):
    sc = 84 / TIP; ox = (100 - S * sc) / 2; oy = 8
    head = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Nagules Gobi"><title>Nagules Gobi</title>'
    if fill: return head + f'<g id="icon"><path fill="{fill}" d="{path(ox, oy, sc)}"/></g></svg>\n'
    return head + f'<defs>{grad("ng-g", ox, oy, sc, stops)}</defs><g id="icon"><path fill="url(#ng-g)" d="{path(ox, oy, sc)}"/></g></svg>\n'
if __name__ == '__main__':
    print('t', round(t, 2), 'R', round(R, 2), 'k', round(k, 2), 'tip', round(TIP, 2))
    # overlay test against the reference at the reference's own scale
    sc = 391 / S
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1600" viewBox="0 0 1600 1600"><rect width="1600" height="1600" fill="#F2F2F2"/><defs>{grad("g", 604, 605, sc)}</defs><path fill="url(#g)" d="{path(604, 605, sc)}"/></svg>'
    open('overlay.svg', 'w').write(svg)
