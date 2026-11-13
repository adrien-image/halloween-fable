// Bibliothèque de dessin : personnages, accessoires et décors en SVG.
// Style commun à toutes les images : aplats, contour épais sombre,
// une seule ombre décalée par forme (cel-shading), palette nocturne violet / orange.

export const W = 1200, H = 800;
export const OUT = '#1b1230';
const ST = `stroke="${OUT}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;
const THIN = `stroke="${OUT}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

let uid = 0;
export const resetIds = () => { uid = 0; };

// --- primitives -----------------------------------------------------------
export const E = (cx, cy, rx, ry) => (a) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${a}/>`;
export const R = (x, y, w, h, r = 0) => (a) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ${a}/>`;
export const P = (d) => (a) => `<path d="${d}" ${a}/>`;

// Forme cel-shadée : aplat clair + croissant d'ombre en bas à droite + contour.
export function cel(shape, fill, shade, dx = 9, dy = 5) {
  const id = 'c' + uid++;
  return `<clipPath id="${id}">${shape('')}</clipPath>` +
    shape(`fill="${shade}"`) +
    `<g clip-path="url(#${id})">${shape(`fill="${fill}" transform="translate(${-dx} ${-dy})"`)}` +
    shape(`fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="5" transform="translate(4 4)"`) + `</g>` +
    shape(`fill="none" ${ST}`);
}
export const flat = (shape, fill) => shape(`fill="${fill}" ${ST}`);
export const thin = (shape, fill) => shape(`fill="${fill}" ${THIN}`);
export const plain = (shape, fill, extra = '') => shape(`fill="${fill}" ${extra}`);
export const G = (x, y, s, inner, extra = '') => `<g transform="translate(${x} ${y}) scale(${s})" ${extra}>${inner}</g>`;
export const clip = (shape, inner) => {
  const id = 'c' + uid++;
  return `<clipPath id="${id}">${shape('')}</clipPath><g clip-path="url(#${id})">${inner}</g>`;
};
const ln = (d, w = 4, c = OUT) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
export const line = ln;

function limb(pts, color, w = 20) {
  const p = pts.map((q) => q.join(',')).join(' ');
  const hi = pts.map((q) => [q[0] - 3, q[1] - 3].join(',')).join(' ');
  const a = 'fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const [ex, ey] = pts[1];
  return `<polyline points="${p}" ${a} stroke="${OUT}" stroke-width="${w + 9}"/><polyline points="${p}" ${a} stroke="${color}" stroke-width="${w}"/>` +
    `<polyline points="${hi}" ${a} stroke="#fff" stroke-opacity=".16" stroke-width="${w * 0.28}"/>` +
    `<path d="M${ex - 6} ${ey - 3} q6 5 12 0" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2" stroke-linecap="round"/>`;
}

// --- visages ---------------------------------------------------------------
function face(cx, cy, expr = 'neutral', { look = 0, fangs = 0, my = 26, sp = 19, browC = OUT, iris = '#6b4a2a', old = false } = {}) {
  const ey = cy, m = cy + my;
  const eye = (x, r, pr) => {
    const px = x + look * r * 0.4;
    return `<ellipse cx="${x}" cy="${ey}" rx="${r}" ry="${r * 1.15}" fill="#fff" stroke="${OUT}" stroke-width="3"/>` +
      `<ellipse cx="${x}" cy="${ey - r * 0.75}" rx="${r * 0.85}" ry="${r * 0.4}" fill="#000" opacity=".1"/>` +
      `<circle cx="${px}" cy="${ey + 1}" r="${pr * 1.7}" fill="${iris}"/><circle cx="${px}" cy="${ey + 1}" r="${pr * 1.7}" fill="none" stroke="${OUT}" stroke-width="1.2"/>` +
      `<circle cx="${px}" cy="${ey + 1}" r="${pr}" fill="${OUT}"/><circle cx="${px - pr * 0.7}" cy="${ey - pr * 0.6}" r="${pr * 0.5}" fill="#fff"/><circle cx="${px + pr * 0.8}" cy="${ey + pr}" r="${pr * 0.25}" fill="#fff"/>` +
      ln(`M${x - r - 1} ${ey - r * 0.3} Q${x} ${ey - r * 1.6} ${x + r + 1} ${ey - r * 0.3}`, 4.5) +
      (old ? ln(`M${x - r * 0.8} ${ey + r * 1.5} q${r * 0.8} ${r * 0.5} ${r * 1.6} 0`, 2, '#00000055') : '');
  };
  const eyes = (r, pr) => eye(cx - sp, r, pr) + eye(cx + sp, r, pr);
  const arcs = (k) => ln(`M${cx - sp - 10} ${ey} q10 ${k} 20 0`, 4.5) + ln(`M${cx + sp - 10} ${ey} q10 ${k} 20 0`, 4.5) +
    (k < 0 ? ln(`M${cx - sp - 12} ${ey + 1} l-4 -4 M${cx + sp + 12} ${ey + 1} l4 -4`, 2.5) : '');
  const brows = (inn, out) => {
    let s = '';
    for (const sg of [-1, 1]) {
      const x1 = cx + sg * (sp + 13), y1 = ey - 21 + out, x2 = cx + sg * (sp - 10), y2 = ey - 21 + inn;
      const d = `M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - 4} ${x2} ${y2}`;
      s += browC === OUT ? ln(d, 5.5) : ln(d, 12) + ln(d, 7, browC);
    }
    return s;
  };
  const openM = (w, h, f) => {
    let s = `<path d="M${cx - w} ${m} Q${cx} ${m + h * 2} ${cx + w} ${m} Z" fill="#7a1f2b" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>` +
      `<path d="M${cx - w * 0.45} ${m + h * 0.72} Q${cx} ${m + h * 0.3} ${cx + w * 0.45} ${m + h * 0.72} Q${cx} ${m + h * 1.05} ${cx - w * 0.45} ${m + h * 0.72}Z" fill="#e0667a"/>` +
      `<path d="M${cx - w * 0.72} ${m + 1.6} H${cx + w * 0.72} L${cx + w * 0.6} ${m + 5} H${cx - w * 0.6}Z" fill="#fff"/>`;
    if (f) for (const sg of [-1, 1]) s += `<path d="M${cx + sg * w * 0.55 - 4} ${m + 1} l4 ${f} l4 ${-f} z" fill="#fff" stroke="${OUT}" stroke-width="1.5" stroke-linejoin="round"/>`;
    return s + ln(`M${cx - w - 4} ${m - 3} q3 3 0 7 M${cx + w + 4} ${m - 3} q-3 3 0 7`, 2);
  };
  switch (expr) {
    case 'smile': return eyes(9, 4.5) + brows(-2, 0) + openM(17, 10, fangs);
    case 'happy': return arcs(-11) + brows(-4, -2) + openM(17, 11, fangs);
    case 'scared': return eyes(13, 3) + brows(-9, 3) +
      `<ellipse cx="${cx}" cy="${m + 6}" rx="13" ry="10" fill="#7a1f2b" stroke="${OUT}" stroke-width="3.5"/><ellipse cx="${cx}" cy="${m + 11}" rx="7" ry="4" fill="#e0667a"/>` +
      (fangs ? `<path d="M${cx - 9} ${m - 2} l3 7 l3 -8z M${cx + 9} ${m - 2} l-3 7 l-3 -8z" fill="#fff" stroke="${OUT}" stroke-width="1.2"/>` : '') +
      `<path d="M${cx + 46} ${cy - 34} q9 16 0 22 q-9 -6 0 -22z" fill="#8fd3ff" stroke="${OUT}" stroke-width="2"/><path d="M${cx - 50} ${cy - 10} q6 11 0 15 q-6 -4 0 -15z" fill="#8fd3ff" stroke="${OUT}" stroke-width="1.6"/>`;
    case 'surprised': return eyes(12, 4) + brows(-9, -7) + `<ellipse cx="${cx}" cy="${m + 5}" rx="7" ry="9" fill="#7a1f2b" stroke="${OUT}" stroke-width="3.5"/><ellipse cx="${cx}" cy="${m + 9}" rx="4" ry="3" fill="#e0667a"/>`;
    case 'sad': return eyes(9, 4.5) + brows(-9, 3) + ln(`M${cx - 11} ${m + 8} q11 -10 22 0`) + ln(`M${cx - 4} ${m + 14} h8`, 2);
    case 'angry': return eyes(9, 4) + brows(9, -6) + ln(`M${cx - 5} ${ey - 22} v-6 M${cx + 5} ${ey - 22} v-6`, 2.5) +
      `<path d="M${cx - 15} ${m + 10} q15 -15 30 0 z" fill="#fff" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>` + ln(`M${cx - 6} ${m + 4} v6 M${cx} ${m + 3} v7 M${cx + 6} ${m + 4} v6`, 1.5);
    case 'grin': return eyes(10, 3.5) + brows(7, -5) + openM(24, 13, fangs || 13);
    case 'dizzy': {
      let s = brows(-6, 2);
      for (const x of [cx - sp, cx + sp]) s += ln(`M${x} ${ey} m-9 0 a9 9 0 1 1 9 9 a6 6 0 1 1 6 -6 a3 3 0 1 1 -3 -3`, 3);
      return s + ln(`M${cx - 14} ${m + 5} q4 -7 7 0 q4 7 7 0 q4 -7 7 0 q4 7 7 0`);
    }
    case 'disgust': return ln(`M${cx - sp - 8} ${ey - 7} l15 7 l-15 7`, 4.5) + ln(`M${cx + sp + 8} ${ey - 7} l-15 7 l15 7`, 4.5) + brows(7, -3) +
      ln(`M${cx - 14} ${m + 6} l7 -7 l7 7 l7 -7 l7 7`) + `<path d="M${cx - 5} ${m + 6} q5 14 10 0z" fill="#e0667a" stroke="${OUT}" stroke-width="2.5"/>`;
    case 'sleep': return arcs(9) + brows(0, 0) + ln(`M${cx - 6} ${m + 4} h12`);
    case 'worried': return eyes(10, 4) + brows(-9, 2) + ln(`M${cx - 11} ${m + 5} q5 -7 11 0 q6 7 11 0`);
    default: return eyes(9, 4.5) + brows(0, 0) + ln(`M${cx - 10} ${m} q10 8 20 0`) + ln(`M${cx - 13} ${m - 2} q-2 2 0 4 M${cx + 13} ${m - 2} q2 2 0 4`, 2);
  }
}

// --- accessoires -----------------------------------------------------------
export function prop(kind, x, y, s = 1, o = {}) {
  let i = '';
  switch (kind) {
    case 'glass':
      i = thin(P('M-11 -18 L11 -18 L8 18 L-8 18 Z'), '#e3f5ff') + plain(P('M-9.5 -4 L9.5 -4 L8 16 L-8 16 Z'), '#7cc4ee'); break;
    case 'cup':
      i = (o.steam === false ? '' : ln('M-6 -16 q-6 -8 0 -16 q6 -8 0 -16', 3, '#f4efe6') + ln('M7 -18 q-6 -8 0 -16', 3, '#f4efe6')) +
        ln('M13 -4 q14 4 2 14', 5) + ln('M13 -4 q14 4 2 14', 2, '#fff') +
        plain(E(0, 15, 24, 6), '#d8d2e6', THIN) + thin(P('M-15 -10 L15 -10 L11 13 L-11 13 Z'), '#ffffff') + plain(E(0, -9, 12, 3), '#5a3524'); break;
    case 'phone':
      i = thin(R(-12, -21, 24, 42, 5), '#2a2540') + plain(R(-9, -17, 18, 32, 2), o.off ? '#14101f' : '#8fd3ff'); break;
    case 'plate':
      i = thin(E(0, 2, 32, 11), '#ffffff') + (o.empty ? plain(E(0, 2, 20, 6), '#e6e1ee') :
        thin(P('M-20 0 Q-18 -14 0 -13 Q20 -14 20 0 Q0 8 -20 0Z'), '#f6cf4a') + plain(E(-6, -6, 3, 2), '#6aa84f') + plain(E(7, -4, 3, 2), '#6aa84f')); break;
    case 'tray':
      i = thin(R(-46, 4, 92, 10, 4), '#8a5f40') + prop('plate', -16, -6, 0.8) + prop('toast', 24, -10, 0.9); break;
    case 'toast':
      i = thin(R(-11, -11, 22, 22, 6), '#c98a3e') + plain(R(-7, -7, 14, 14, 4), '#f1c98a'); break;
    case 'frame': {
      i = thin(R(-24, -30, 48, 60, 3), '#6a4433') + plain(R(-18, -24, 36, 48), o.bg || '#d9d4c8');
      const bust = (px, c, veil) => (veil ? plain(P(`M${px - 9} 22 Q${px - 12} -10 ${px} -14 Q${px + 12} -10 ${px + 9} 22Z`), '#f4f2ee') : '') +
        plain(P(`M${px - 8} 24 Q${px - 8} 4 ${px} 4 Q${px + 8} 4 ${px + 8} 24Z`), c) + plain(E(px, -3, 6, 7), '#a9a39a');
      i += clip(R(-18, -24, 36, 48), o.trio
        ? bust(-10, '#3b3a44') + bust(10, '#77727f', true) + plain(P('M-8 24 Q-10 2 0 2 Q10 2 8 24Z'), '#1b1230') + plain(E(0, -5, 6, 7), '#f3c9a2') + plain(P('M-6 -8 Q0 -16 6 -8 L0 -6Z'), '#7a4a2a')
        : bust(-8, '#3b3a44') + bust(8, '#8c8791', true));
      break;
    }
    case 'envelope':
      i = thin(R(-30, -19, 60, 38, 2), '#f3ead2') + ln('M-30 -19 L0 2 L30 -19', 2.5) +
        (o.stamp ? thin(R(15, -15, 11, 13, 1), '#c8343f') + plain(R(17, -13, 4, 4), '#2f4f9a') : '') +
        (o.typed ? ln('M-18 4 h26 M-18 10 h20', 2, '#3a3350') : ln('M-18 6 q4 -6 8 0 q4 6 8 0 q4 -6 8 0 M-18 13 q4 -5 8 0 q4 5 8 0', 2, '#2f4f9a')); break;
    case 'paper':
      i = thin(R(-23, -31, 46, 62, 2), '#f8f1dd') +
        (o.typed ? plain(R(-12, -25, 24, 5), '#3a3350') : '') +
        ln(o.typed ? 'M-16 -12 h32 M-16 -5 h32 M-16 2 h32 M-16 9 h24 M-16 16 h14' : 'M-16 -20 h14 M-16 -11 q8 -4 16 0 t16 0 M-16 -3 q8 -4 16 0 t16 0 M-16 5 q8 -4 16 0 t16 0 M-16 13 q8 -4 16 0 M2 22 h12', 2, o.typed ? '#3a3350' : '#2f4f9a') +
        (o.typed ? plain(E(12, 21, 6, 6), '#c8343f') : ''); break;
    case 'note':
      i = thin(P('M-22 -16 L22 -16 L22 10 L14 18 L-22 18 Z'), '#fbf3c8') + ln('M-15 -8 q7 -4 14 0 t14 0 M-15 0 q7 -4 14 0 t14 0 M-15 8 q7 -4 14 0', 2, '#5a3a7a'); break;
    case 'ring':
      i = `<circle r="13" fill="none" stroke="${OUT}" stroke-width="10"/><circle r="13" fill="none" stroke="#f2c230" stroke-width="5.5"/><path d="M-13 -3 a13 13 0 0 1 12 -10" fill="none" stroke="#fff3a8" stroke-width="2.5" stroke-linecap="round"/>` +
        (o.shine === false ? '' : plain(P('M20 -22 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3z'), '#fff3a8')); break;
    case 'key':
      i = `<circle cx="0" cy="-12" r="8" fill="none" stroke="${OUT}" stroke-width="9"/><circle cx="0" cy="-12" r="8" fill="none" stroke="#f2c230" stroke-width="4.5"/>` +
        ln('M0 -4 V20 M0 20 h8 M0 12 h6', 9) + ln('M0 -4 V20 M0 20 h8 M0 12 h6', 4.5, '#f2c230'); break;
    case 'card':
      i = thin(R(-26, -17, 52, 34, 2), '#fbf3e0') + ln('M-18 -7 q6 -4 12 0 t12 0 t10 0 M-18 2 q6 -4 12 0 t12 0 M-18 10 q6 -4 12 0', 2, '#5a3a7a') + plain(P('M12 6 q4 -6 8 0 q-2 6 -4 7 q-2 -1 -4 -7z'), '#c8343f'); break;
    case 'newspaper':
      i = thin(R(-36, -27, 72, 54, 1), '#eee9da') + plain(R(-30, -22, 60, 6), '#3a3350') +
        ln('M-30 -10 h26 M-30 -4 h26 M-30 2 h26 M-30 8 h26 M-30 14 h26 M-30 20 h18', 1.6, '#8a8494') +
        `<rect x="2" y="-11" width="28" height="33" fill="#fff" stroke="${OUT}" stroke-width="1.5"/>` +
        plain(R(8, -8, 16, 15), '#cfc9bd') + plain(E(16, -2, 4, 5), '#8a8494') + plain(P('M10 7 q6 -8 12 0z'), '#5a5562') +
        ln('M7 11 h18 M7 15 h18 M10 19 h12', 1.4, '#3a3350'); break;
    case 'garlic':
      i = cel(P('M0 -24 Q-3 -10 -16 -1 Q-24 17 0 19 Q24 17 16 -1 Q3 -10 0 -24Z'), '#f8f3e6', '#d5cab1', 5, 3) + ln('M-6 -2 Q-9 8 -5 16 M6 -2 Q9 8 5 16', 2, '#b5a98c'); break;
    case 'knife':
      i = thin(P('M-4 -30 Q8 -18 4 6 L-4 6 Z'), '#dfe6ee') + thin(R(-6, 6, 12, 22, 4), '#6a4433'); break;
    case 'opener':
      i = thin(P('M0 -34 L5 4 L-5 4 Z'), '#c9d2de') + thin(R(-5, 4, 10, 18, 4), '#b08a2e'); break;
    case 'jar':
      i = thin(R(-14, -14, 28, 32, 6), '#d7efe4') + plain(E(-4, 6, 6, 5), '#f8f3e6', THIN) + plain(E(6, 9, 5, 4), '#f8f3e6', THIN) + thin(R(-15, -22, 30, 9, 3), '#c8343f'); break;
    case 'knight':
      i = cel(P('M-16 24 L16 24 L13 13 Q19 -6 7 -20 L9 -30 L-1 -24 Q-18 -19 -20 -1 L-9 -2 Q-6 6 -13 13 Z'), o.dark ? '#4a3f6b' : '#f4efe0', o.dark ? '#352c50' : '#cfc7b0', 5, 3) + `<circle cx="-4" cy="-13" r="2.5" fill="${OUT}"/>`; break;
    case 'pawn':
      i = thin(P('M-9 14 L9 14 L5 0 Q9 -6 4 -9 A6 6 0 1 0 -4 -9 Q-9 -6 -5 0 Z'), o.dark ? '#4a3f6b' : '#f4efe0'); break;
    case 'candle':
      i = thin(R(-6, -6, 12, 30, 2), '#f4efe0') + plain(P('M0 -30 Q10 -16 0 -8 Q-10 -16 0 -30Z'), '#f58a1f', THIN) + plain(P('M0 -22 Q4 -15 0 -11 Q-4 -15 0 -22Z'), '#fff3a8'); break;
    case 'heart':
      i = cel(P('M0 16 Q-28 -4 -18 -18 Q-8 -28 0 -12 Q8 -28 18 -18 Q28 -4 0 16Z'), '#e0425a', '#a82a45', 4, 3); break;
    case 'tissue':
      i = thin(P('M-12 -10 L12 -12 L14 8 L4 14 L-4 8 L-14 12 Z'), '#ffffff'); break;
    case 'cat':
      i = cat(0, 30, 0.72, o); break;
    case 'calendar':
      i = thin(R(-30, -34, 60, 68, 5), '#fbf7ee') + plain(P('M-30 -29 a5 5 0 0 1 5 -5 h50 a5 5 0 0 1 5 5 v13 h-60z'), '#c8343f') + ln('M-30 -16 h60', 3) +
        `<text x="0" y="-21" font-family="'Open Sans',sans-serif" font-weight="700" font-size="11" fill="#fff" text-anchor="middle">OCT</text>` +
        `<text x="0" y="22" font-family="'Open Sans',sans-serif" font-weight="700" font-size="36" fill="${OUT}" text-anchor="middle">31</text>`; break;
  }
  return `<g transform="translate(${x} ${y}) rotate(${o.rot || 0}) scale(${s})">${i}</g>`;
}

// --- personnages -----------------------------------------------------------
const POSES = {
  down: [[10, 52], [8, 100]], hold: [[18, 44], [46, 32]], up: [[34, -36], [40, -96]], ear: [[34, 14], [14, -62]],
  front: [[6, 48], [-28, 60]], lap: [[12, 50], [-12, 92]], reach: [[42, -2], [88, -10]], chin: [[16, 34], [-22, -18]],
};

function figure(x, y, s, o, cfg) {
  // Assis : le bassin repose sur l'assise (cfg.seat), les cuisses viennent vers l'avant
  // (genoux arrondis devant le buste) et les tibias descendent jusqu'au sol.
  const sit = !!o.sit && !!cfg.seat;
  const drop = sit ? cfg.hip - cfg.seat : 0;
  const T = (c) => `<g transform="translate(0 ${drop})">${c}</g>`;
  let inner = o.float || o.noShadow ? '' : `<ellipse cx="0" cy="2" rx="${sit ? 60 : cfg.shadow}" ry="12" fill="#000" opacity=".25"/>`;
  if (cfg.back) inner += sit ? T(`<g transform="translate(0 ${cfg.backTop}) scale(1.08 0.7) translate(0 ${-cfg.backTop})">${cfg.back()}</g>`) : cfg.back();
  if (!sit) inner += cfg.legs();
  let up = cfg.body(o);
  const hands = {};
  let armSvg = '';
  for (const [side, sg] of [['L', -1], ['R', 1]]) {
    const pts = [[sg * cfg.sx, cfg.sy], ...POSES[o[side] || (sit ? 'lap' : 'down')].map(([dx, dy]) => [sg * (cfg.sx + dx), cfg.sy + dy])];
    const h = pts[pts.length - 1];
    hands[side] = h;
    const e = pts[pts.length - 2], cu = [h[0] + (e[0] - h[0]) * 0.3, h[1] + (e[1] - h[1]) * 0.3];
    armSvg += limb(pts, cfg.sleeve) + (cfg.cuff ? `<circle cx="${cu[0]}" cy="${cu[1]}" r="13" fill="${cfg.cuff}" ${THIN}/>` : '') +
      `<circle cx="${h[0] - sg * 9}" cy="${h[1] - 6}" r="6" fill="${cfg.skin}" ${THIN}/>` +
      `<circle cx="${h[0]}" cy="${h[1]}" r="12" fill="${cfg.skin}" ${ST}/>` +
      ln(`M${h[0] - 5} ${h[1] + 3} v6 M${h[0]} ${h[1] + 4} v6 M${h[0] + 5} ${h[1] + 3} v6`, 1.8, '#00000066') +
      `<circle cx="${h[0] - 4}" cy="${h[1] - 5}" r="3.5" fill="#fff" opacity=".3"/>`;
    if (o.handDots === side) armSvg += `<circle cx="${h[0] - 4}" cy="${h[1] - 1}" r="2.6" fill="#5a0f1c"/><circle cx="${h[0] + 4}" cy="${h[1] - 1}" r="2.6" fill="#5a0f1c"/>`;
  }
  const carry = o.L === 'front' && o.R === 'front';
  inner += T(up);
  if (sit) {
    const k = cfg.seat;
    for (const sg of [-1, 1]) {
      const cx = sg * 25;
      inner += flat(R(cx - 13, -k + 8, 26, k - 12, 6), cfg.legC) + ln(`M${cx} ${-k + 30} V-14`, 2, '#00000040') + cfg.shoe(cx + sg * 3, -4) +
        cel(R(cx - 18, -k - 20, 36, 46, 16), cfg.legC, cfg.legShade, 4, 4) + ln(`M${cx - 9} ${-k + 12} q9 7 18 0`, 2, '#00000050');
    }
  }
  up = '';
  if (o.item && carry) up += prop(o.item, 0, cfg.sy + 44, o.itemS || 1.3, o.itemO);
  up += cfg.head(o) + armSvg;
  if (o.item && !carry) { const h = hands[o.hand || 'R']; up += prop(o.item, h[0], h[1] - 16, o.itemS || 1, o.itemO); }
  inner += T(up);
  return G(x, y - (o.float ? 22 : 0), s, inner, o.ghost ? `opacity="${o.ghost}"` : '');
}

// Le héros : un humain déguisé en vampire pour la soirée. Peau et cheveux naturels,
// jean et baskets qui dépassent du costume, cape nouée par un cordon, fausses dents en plastique.
const HERO_SKIN = '#f3c9a2', HERO_SKIN_SHADE = '#d9a279';
const sneaker = (x, y) => flat(E(x, y, 22, 10), '#f4efe6') + plain(P(`M${x - 22} ${y + 1} a22 10 0 0 0 44 0 l0 3 a22 9 0 0 1 -44 0z`), '#c8343f', THIN) +
  ln(`M${x - 8} ${y - 6} l6 5 M${x - 1} ${y - 8} l6 5 M${x + 6} ${y - 7} l5 4`, 1.8) + `<circle cx="${x - 14}" cy="${y - 1}" r="2.5" fill="#c8343f"/>`;
const dressShoe = (c) => (x, y) => flat(E(x, y, 20, 9), c) + `<ellipse cx="${x - 6}" cy="${y - 3}" rx="7" ry="2.5" fill="#fff" opacity=".35"/>` + ln(`M${x - 18} ${y + 4} h36`, 2);
export function hero(x, y, s = 1, o = {}) {
  return figure(x, y, s, o, {
    sx: 44, sy: -214, sleeve: '#2f2a4d', cuff: '#f3efe6', skin: HERO_SKIN, shadow: 100,
    hip: 104, seat: 92, legC: '#4f74ad', legShade: '#3a5888', shoe: sneaker, backTop: -238,
    // La cape passe derrière les jambes pour qu'elles restent visibles.
    back: () => cel(P('M-58 -238 Q-124 -120 -108 -8 Q-72 -24 -54 -6 Q-27 -24 0 -6 Q27 -24 54 -6 Q72 -24 108 -8 Q124 -120 58 -238 Z'), '#33274f', '#221a38') +
      cel(P('M-44 -228 Q-78 -120 -66 -26 Q-33 -38 0 -26 Q33 -38 66 -26 Q78 -120 44 -228 Z'), '#b32535', '#861a2a', 6, 0) +
      ln('M-58 -200 Q-76 -110 -70 -34 M58 -200 Q76 -110 70 -34 M-48 -180 Q-56 -110 -50 -40 M48 -180 Q56 -110 50 -40', 2.5, '#00000045') +
      ln('M-92 -150 Q-104 -80 -96 -22 M92 -150 Q104 -80 96 -22 M-78 -110 Q-86 -60 -80 -20 M78 -110 Q86 -60 80 -20', 2.5, '#0000004d'),
    legs: () => flat(R(-31, -112, 27, 104, 6), '#4f74ad') + flat(R(4, -112, 27, 104, 6), '#4f74ad') +
      plain(R(-31, -112, 9, 100, 4), '#fff', 'opacity=".12"') + plain(R(4, -112, 9, 100, 4), '#fff', 'opacity=".12"') +
      ln('M-10 -106 V-14 M25 -106 V-14', 1.8, '#2c4470') + ln('M-28 -62 q10 5 20 0 M7 -62 q10 5 20 0', 1.8, '#2c4470') +
      flat(R(-33, -22, 31, 12, 4), '#6f93c9') + flat(R(2, -22, 31, 12, 4), '#6f93c9') + sneaker(-22, -4) + sneaker(22, -4),
    body: () =>
      cel(P('M-40 -238 L-82 -322 L-14 -262 Z'), '#c8343f', '#96202b', 5, 0) + cel(P('M40 -238 L82 -322 L14 -262 Z'), '#c8343f', '#96202b', 5, 0) +
      cel(R(-40, -234, 80, 132, 18), '#2f2a4d', '#211d38') +
      // gilet : revers, boutons dorés, poche et chaîne
      thin(P('M-16 -234 L0 -188 L16 -234 Z'), '#f3efe6') + ln('M0 -188 V-106', 2.5) +
      thin(P('M-16 -234 L-30 -226 L-6 -180 L0 -188Z'), '#3d3766') + thin(P('M16 -234 L30 -226 L6 -180 L0 -188Z'), '#3d3766') +
      [-170, -148, -126].map((y) => `<circle cx="8" cy="${y}" r="4" fill="#f2c230" stroke="${OUT}" stroke-width="1.8"/>`).join('') +
      ln('M-30 -146 h18', 2.5) + ln('M-28 -146 q10 16 22 2', 2, '#f2c230') + `<path d="M-40 -128 q40 12 80 0" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="2"/>` +
      // cordon de la cape, noué sous le menton
      ln('M-2 -224 Q-16 -206 -12 -190 M2 -224 Q16 -208 10 -194', 3.5, '#f2c230') + `<circle cx="-12" cy="-188" r="3.5" fill="#f2c230" stroke="${OUT}" stroke-width="1.5"/><circle cx="10" cy="-192" r="3.5" fill="#f2c230" stroke="${OUT}" stroke-width="1.5"/>` +
      thin(P('M0 -224 L-15 -233 L-15 -215 Z'), '#f2c230') + thin(P('M0 -224 L15 -233 L15 -215 Z'), '#f2c230'),
    head: (o) =>
      flat(E(-52, -286, 11, 14), HERO_SKIN) + flat(E(52, -286, 11, 14), HERO_SKIN) + ln('M-55 -290 q5 4 2 9 M55 -290 q-5 4 -2 9', 2, HERO_SKIN_SHADE) +
      cel(E(0, -292, 54, 56), HERO_SKIN, HERO_SKIN_SHADE) +
      // cheveux châtains, en bataille
      cel(P('M-55 -296 Q-64 -352 -22 -356 L-28 -374 L-6 -358 L4 -378 L16 -358 L34 -370 L32 -352 Q62 -344 55 -296 Q44 -326 20 -328 Q-4 -318 -30 -330 Q-48 -322 -55 -296 Z'), '#8a5631', '#623a1c', 6, 5) +
      ln('M-36 -344 Q-20 -350 -8 -340 M0 -352 Q14 -350 22 -340 M-44 -332 Q-40 -342 -30 -346 M30 -346 Q42 -340 46 -328', 2.5, '#b87a4a') +
      `<ellipse cx="-32" cy="-266" rx="10" ry="6" fill="#ef8f8f" opacity=".65"/><ellipse cx="32" cy="-266" rx="10" ry="6" fill="#ef8f8f" opacity=".65"/>` +
      [[-38, -272], [-30, -276], [-24, -270], [38, -272], [30, -276], [24, -270]].map(([fx, fy]) => `<circle cx="${fx}" cy="${fy}" r="1.5" fill="#c98e66"/>`).join('') +
      (o.redNose ? `<ellipse cx="0" cy="-272" rx="9" ry="7" fill="#e0425a" stroke="${OUT}" stroke-width="2.5"/><circle cx="-3" cy="-274" r="2" fill="#fff" opacity=".6"/>` : ln('M-3 -278 q-3 7 5 4', 2.5, '#b9794f')) +
      (o.dots ? `<circle cx="-34" cy="-250" r="3.2" fill="#5a0f1c"/><circle cx="-25" cy="-244" r="3.2" fill="#5a0f1c"/><circle cx="-30" cy="-247" r="9" fill="#e0425a" opacity=".25"/>` : '') +
      face(0, -288, o.expr, { look: o.look, fangs: 9, iris: '#4f8a52' }),
  });
}

// Mme Morticia (Yvonne) : longue robe sombre à dentelle, collier de perles, chignon blanc, petites lunettes.
export function morticia(x, y, s = 1, o = {}) {
  return figure(x, y, s, o, {
    sx: 40, sy: -186, sleeve: '#4f3a6e', cuff: '#e9e2f2', skin: '#f0c7a3', shadow: 90,
    legs: () => flat(E(-22, -3, 18, 8), '#2a1c2e') + flat(E(22, -3, 18, 8), '#2a1c2e'),
    body: (o) => {
      let b = cel(P('M-44 -204 Q-54 -100 -84 -4 L84 -4 Q54 -100 44 -204 Q0 -220 -44 -204 Z'), '#4f3a6e', '#382850') +
        ln('M-28 -150 Q-40 -80 -52 -22 M0 -160 V-20 M28 -150 Q40 -80 52 -22 M-14 -120 Q-20 -70 -24 -20 M14 -120 Q20 -70 24 -20', 2.5, '#00000040') +
        ln('M-46 -160 Q0 -146 46 -160', 2.5, '#6d5690') + flat(R(-46, -166, 92, 12, 4), '#6d5690') + `<circle cx="0" cy="-160" r="7" fill="#f2c230" stroke="${OUT}" stroke-width="2"/>`;
      // ourlet et col en dentelle
      for (let i = -7; i <= 7; i++) b += `<circle cx="${i * 11}" cy="${-8 - Math.abs(i) * 0.3}" r="6.5" fill="#e9e2f2" stroke="${OUT}" stroke-width="2"/>`;
      b += thin(P('M-34 -206 Q-20 -178 0 -184 Q20 -178 34 -206 Q0 -222 -34 -206Z'), '#e9e2f2') + ln('M-22 -196 q5 6 10 2 M12 -194 q5 4 10 -2 M-6 -190 q6 4 12 0', 1.6, '#b8aecb');
      for (let i = -3; i <= 3; i++) b += `<circle cx="${i * 10}" cy="${-200 + (9 - i * i) * 1.2}" r="5.5" fill="#fbf7ee" stroke="${OUT}" stroke-width="2"/><circle cx="${i * 10 - 1.5}" cy="${-201.5 + (9 - i * i) * 1.2}" r="1.6" fill="#fff"/>`;
      if (o.key) b += ln('M0 -188 V-166', 2.5, '#f2c230') + prop('key', 0, -150, 0.8);
      return b;
    },
    head: (o) =>
      cel(E(0, -318, 23, 21), '#f4f2ee', '#cfcbd6', 5, 4) + ln('M-12 -326 q12 -8 24 0 M-14 -316 q14 -8 28 0', 2, '#b8b3c2') + ln('M-26 -330 L30 -306', 3.5, '#6a4433') +
      flat(E(-48, -248, 9, 12), '#f0c7a3') + flat(E(48, -248, 9, 12), '#f0c7a3') + `<circle cx="-49" cy="-232" r="5" fill="#fbf7ee" stroke="${OUT}" stroke-width="2"/><circle cx="49" cy="-232" r="5" fill="#fbf7ee" stroke="${OUT}" stroke-width="2"/>` +
      cel(E(0, -252, 50, 50), '#f0c7a3', '#d6a17c') +
      cel(P('M-52 -252 Q-58 -310 0 -308 Q58 -310 52 -252 Q32 -290 0 -288 Q-32 -290 -52 -252Z'), '#f4f2ee', '#cfcbd6', 6, 4) +
      ln('M-40 -280 Q-20 -298 0 -298 M40 -280 Q20 -298 0 -298 M-30 -292 Q-14 -302 0 -303 M30 -292 Q14 -302 0 -303', 2, '#b8b3c2') +
      `<ellipse cx="-30" cy="-232" rx="9" ry="6" fill="#e58a8a" opacity=".6"/><ellipse cx="30" cy="-232" rx="9" ry="6" fill="#e58a8a" opacity=".6"/>` +
      ln('M-16 -276 q16 -6 32 0 M-12 -282 q12 -4 24 0', 1.8, '#c08f6a') +
      face(0, -250, o.expr, { look: o.look, my: 24, iris: '#4f7fa8', old: true }) +
      ln('M-2 -240 q-4 8 4 6', 2.2, '#b07c58') +
      ln('M-40 -256 l-6 -3 M-40 -250 l-7 1 M40 -256 l6 -3 M40 -250 l7 1 M-22 -222 q-4 6 -1 12 M22 -222 q4 6 1 12', 2, '#b07c58') +
      // petites lunettes dorées
      `<circle cx="-19" cy="-250" r="15" fill="#fff" fill-opacity=".12" stroke="#b08a2e" stroke-width="2.5"/><circle cx="19" cy="-250" r="15" fill="#fff" fill-opacity=".12" stroke="#b08a2e" stroke-width="2.5"/>` +
      ln('M-4 -250 q4 -4 8 0 M-34 -252 L-46 -256 M34 -252 L46 -256', 2.5, '#b08a2e'),
  });
}

function henriHead(o = {}) {
  const sw = o.swollen;
  return (sw ? '' : cel(E(-42, -4, 17, 20), '#f4f2ee', '#cfcbd6', 4, 3) + cel(E(42, -4, 17, 20), '#f4f2ee', '#cfcbd6', 4, 3) + ln('M-50 -10 q-6 6 -2 14 M50 -10 q6 6 2 14 M-44 -16 q-6 2 -8 8 M44 -16 q6 2 8 8', 2, '#b8b3c2') +
      flat(E(-44, 2, 8, 12), '#ddd6c6') + flat(E(44, 2, 8, 12), '#ddd6c6')) +
    cel(sw ? E(0, 0, 64, 62) : E(0, 0, 44, 58), sw ? '#ec8f7e' : '#ddd6c6', sw ? '#c9604f' : '#b5ac99') +
    (sw ? [[-30, -20], [26, -30], [-10, 30], [38, 10], [-40, 14], [8, -42]].map(([px, py]) => `<circle cx="${px}" cy="${py}" r="5" fill="#c8343f" opacity=".55"/>`).join('')
      : ln('M-12 -52 q4 -10 10 -2 M4 -54 q6 -8 10 2', 3, '#f4f2ee') + ln('M-20 -38 q20 -7 40 0 M-16 -45 q16 -5 32 0', 1.8, '#9c937f') +
        `<circle cx="-24" cy="-30" r="3" fill="#a89a80" opacity=".6"/><circle cx="28" cy="-24" r="2.2" fill="#a89a80" opacity=".6"/><circle cx="-30" cy="18" r="2.4" fill="#a89a80" opacity=".6"/>` +
        ln('M-30 14 q-5 10 -2 20 M30 14 q5 10 2 20', 1.8, '#9c937f')) +
    face(0, -6, o.expr, { look: o.look, my: 34, sp: 18, browC: '#f4f2ee', fangs: o.expr === 'grin' ? 13 : 0, iris: o.expr === 'grin' || o.expr === 'angry' ? '#b32535' : '#7d8a99', old: true }) +
    ln('M-3 -2 q-7 12 3 14 q5 0 5 -4', 3, '#8f8674') +
    cel(P('M-24 23 Q-12 9 0 18 Q12 9 24 23 Q12 29 0 24 Q-12 29 -24 23Z'), '#f4f2ee', '#cfcbd6', 3, 2) + ln('M-14 17 l-3 7 M-7 15 l-2 9 M7 15 l2 9 M14 17 l3 7', 1.4, '#b8b3c2');
}

// Henri : vieil homme élégant d'un autre temps (veste brune à revers, gilet, nœud papillon, montre à gousset).
export function henri(x, y, s = 1, o = {}) {
  return figure(x, y, s, o, {
    sx: 40, sy: -232, sleeve: '#74553f', cuff: '#f3efe6', skin: '#ddd6c6', shadow: 80,
    hip: 120, seat: 96, legC: '#3d3a50', legShade: '#2a2838', shoe: dressShoe('#2a1c18'),
    legs: () => flat(R(-27, -132, 23, 124, 5), '#3d3a50') + flat(R(4, -132, 23, 124, 5), '#3d3a50') +
      ln('M-15 -126 V-12 M16 -126 V-12', 1.8, '#23212f') + plain(R(-27, -132, 7, 120, 3), '#fff', 'opacity=".1"') + plain(R(4, -132, 7, 120, 3), '#fff', 'opacity=".1"') +
      dressShoe('#2a1c18')(-20, -4) + dressShoe('#2a1c18')(20, -4),
    body: () =>
      cel(P('M-42 -252 Q-50 -170 -44 -118 L44 -118 Q50 -170 42 -252 Q0 -264 -42 -252Z'), '#74553f', '#573d2c') +
      // carreaux discrets du tweed
      clip(P('M-42 -252 Q-50 -170 -44 -118 L44 -118 Q50 -170 42 -252 Q0 -264 -42 -252Z'), ln('M-50 -220 H50 M-50 -186 H50 M-50 -152 H50 M-30 -260 V-118 M30 -260 V-118', 1.6, '#00000030')) +
      thin(P('M-16 -256 L0 -170 L16 -256 Z'), '#f3efe6') +
      thin(P('M-12 -226 L0 -170 L12 -226 L8 -130 L-8 -130Z'), '#5a6b4e') + [-200, -180, -160, -142].map((yy) => `<circle cx="0" cy="${yy}" r="2.6" fill="#f2c230" stroke="${OUT}" stroke-width="1.2"/>`).join('') +
      thin(P('M-16 -256 L-34 -244 L-10 -176 L0 -170Z'), '#8a674d') + thin(P('M16 -256 L34 -244 L10 -176 L0 -170Z'), '#8a674d') +
      ln('M8 -168 q14 16 26 2', 2.2, '#f2c230') + ln('M-36 -160 h18 M20 -152 h16', 2.2) + thin(P('M-34 -206 l8 -8 l5 8 l6 -7 l3 9z'), '#f3efe6') +
      thin(P('M0 -246 L-17 -257 L-17 -235 Z'), '#7a1f3a') + thin(P('M0 -246 L17 -257 L17 -235 Z'), '#7a1f3a') + `<circle cx="0" cy="-246" r="4.5" fill="#5a1429" stroke="${OUT}" stroke-width="1.8"/>`,
    head: (o) => `<g transform="translate(0 -314)">${henriHead(o)}</g>`,
  });
}

// Secouriste du SAMU.
export function medic(x, y, s = 1, o = {}) {
  return figure(x, y, s, o, {
    sx: 44, sy: -216, sleeve: '#eef2f5', cuff: '#2f4f9a', skin: '#e8b48c', shadow: 85,
    legs: () => flat(R(-30, -112, 25, 104, 6), '#2f4f9a') + flat(R(5, -112, 25, 104, 6), '#2f4f9a') + plain(R(-30, -60, 25, 8), '#c9d24a') + plain(R(5, -60, 25, 8), '#c9d24a') +
      flat(R(-28, -96, 16, 20, 3), '#3d62b8') + dressShoe('#14101f')(-22, -4) + dressShoe('#14101f')(22, -4),
    body: () => cel(R(-42, -236, 84, 134, 18), '#eef2f5', '#c5d0d9') + plain(R(-42, -150, 84, 12), '#2f4f9a') + plain(R(-42, -128, 84, 8), '#c9d24a') +
      ln('M0 -232 V-104', 2.5) + [-210, -190, -170].map((yy) => `<circle cx="0" cy="${yy}" r="2.5" fill="#8d98a3"/>`).join('') +
      flat(R(-34, -200, 24, 26, 3), '#dfe6ee') + ln('M-30 -206 v10 M-24 -206 v10', 3, '#c8343f') +
      plain(P('M18 -214 h8 v8 h8 v8 h-8 v8 h-8 v-8 h-8 v-8 h8z'), '#2f4f9a') +
      // stéthoscope
      ln('M-20 -232 Q-26 -180 0 -176 Q26 -180 20 -232', 4) + ln('M-20 -232 Q-26 -180 0 -176 Q26 -180 20 -232', 2, '#8d98a3') + `<circle cx="0" cy="-170" r="7" fill="#c9d2de" stroke="${OUT}" stroke-width="2"/>`,
    head: (o) => flat(E(-48, -284, 9, 12), '#e8b48c') + flat(E(48, -284, 9, 12), '#e8b48c') + cel(E(0, -290, 50, 52), '#e8b48c', '#c98e66') +
      cel(P('M-50 -296 Q-54 -350 0 -348 Q54 -350 50 -296 Q30 -322 0 -320 Q-30 -322 -50 -296Z'), '#6a4433', '#4e3024', 5, 4) + ln('M-30 -336 Q-10 -344 10 -338 M-40 -322 Q-34 -332 -24 -336', 2, '#8a5f40') +
      ln('M-2 -274 q-4 7 4 5', 2.2, '#b9794f') + face(0, -284, o.expr, { look: o.look, iris: '#4e3024' }),
  });
}

// Minou, le chat noir au médaillon.
export function cat(x, y, s = 1, o = {}) {
  const c = '#4b4570', sh = '#322d52';
  const ear = (sg) => flat(P(`M${sg * 36} -120 L${sg * 30} -162 L${sg * 6} -134 Z`), c) + plain(P(`M${sg * 30} -128 L${sg * 28} -148 L${sg * 15} -134 Z`), '#e58a8a') +
    ln(`M${sg * 26} -132 l${sg * 2} -8 M${sg * 21} -133 l${sg * 1} -6`, 1.5, '#fbf7ee');
  const eye = (cx) => `<ellipse cx="${cx}" cy="-106" rx="10" ry="${o.alert ? 13 : 11}" fill="#f6dc4a" stroke="${OUT}" stroke-width="3"/><ellipse cx="${cx}" cy="-102" rx="8" ry="6" fill="#c9d24a" opacity=".6"/>` +
    `<ellipse cx="${cx + (o.look || 0) * 3}" cy="-106" rx="${o.alert ? 2 : 3.5}" ry="9" fill="${OUT}"/><circle cx="${cx - 3 + (o.look || 0) * 3}" cy="-111" r="2.4" fill="#fff"/>`;
  const i = (o.noShadow ? '' : `<ellipse cx="0" cy="2" rx="52" ry="9" fill="#000" opacity=".25"/>`) +
    ln('M26 -10 Q86 -6 74 -62', 21) + ln('M26 -10 Q86 -6 74 -62', 12, c) + ln('M76 -52 L74 -62', 12, '#6b6496') + ln('M40 -8 Q72 -8 74 -30', 3, '#ffffff22') +
    cel(P('M-36 0 Q-46 -72 0 -86 Q46 -72 36 0 Z'), c, sh, 6, 4) +
    plain(P('M-12 -6 Q-16 -40 0 -52 Q16 -40 12 -6Z'), '#5f588c') + ln('M-30 -30 l8 -4 M-32 -44 l9 -3 M30 -30 l-8 -4 M32 -44 l-9 -3', 2, sh) +
    ear(-1) + ear(1) + cel(E(0, -104, 42, 35), c, sh, 6, 4) +
    plain(P('M-42 -98 l-12 4 l10 4 l-9 6 l14 0z M42 -98 l12 4 l-10 4 l9 6 l-14 0z'), c, THIN) + ln('M-8 -136 l2 8 M0 -138 v9 M8 -136 l-2 8', 2, sh) +
    eye(-17) + eye(17) + plain(P('M-5 -92 h10 l-5 6z'), '#e58a8a', `stroke="${OUT}" stroke-width="1.5"`) + ln('M0 -86 v4 M0 -82 q-5 5 -9 1 M0 -82 q5 5 9 1', 2) +
    `<circle cx="-14" cy="-86" r="1.2" fill="${OUT}"/><circle cx="-18" cy="-82" r="1.2" fill="${OUT}"/><circle cx="14" cy="-86" r="1.2" fill="${OUT}"/><circle cx="18" cy="-82" r="1.2" fill="${OUT}"/>` +
    ln('M-24 -88 l-28 -6 M-24 -84 l-28 4 M-24 -80 l-24 11 M24 -88 l28 -6 M24 -84 l28 4 M24 -80 l24 11', 1.8, '#d9d4e8') +
    ln('M-22 -70 Q0 -60 22 -70', 7, OUT) + ln('M-22 -70 Q0 -60 22 -70', 4.5, '#c8343f') + `<circle cx="0" cy="-58" r="${o.bigMedal ? 13 : 9}" fill="#f2c230" stroke="${OUT}" stroke-width="3"/><circle cx="-3" cy="-61" r="${o.bigMedal ? 4 : 2.5}" fill="#fff3a8"/>` +
    (o.bigMedal ? ln('M-6 -58 h12 M-6 -53 h8', 1.6, '#8a6a10') : '') +
    flat(E(-14, -3, 13, 8), c) + flat(E(14, -3, 13, 8), c) + ln('M-18 -1 v4 M-12 0 v4 M12 0 v4 M18 -1 v4', 1.6);
  return G(x, y, s, i);
}

// --- mobilier ----------------------------------------------------------------
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const f1 = (n) => +n.toFixed(1);
const dk = (d, w = 2, op = 0.3) => `<path d="${d}" fill="none" stroke="#000" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const lt = (d, w = 2, op = 0.3) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const foot = (x) => flat(P(`M${x - 12} -22 h24 l-4 16 q-8 10 -16 0z`), '#3a2418');
const studs = (pts) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#f2c230" stroke="${OUT}" stroke-width="1.2"/>`).join('');

// Fauteuil vu de dos (devant la fenêtre) ; head: 'back' = sommet du crâne, 'turn' = Henri tourne la tête.
export function chairBack(x, y, s = 1, o = {}) {
  let i = `<ellipse cx="0" cy="2" rx="125" ry="14" fill="#000" opacity=".25"/>`;
  if (o.head === 'back') i += cel(E(-34, -246, 15, 17), '#f4f2ee', '#cfcbd6', 4, 3) + cel(E(34, -246, 15, 17), '#f4f2ee', '#cfcbd6', 4, 3) + cel(E(0, -250, 38, 40), '#ddd6c6', '#b5ac99') + ln('M-14 -280 q6 -8 12 0 M4 -282 q6 -6 10 2', 2.5, '#f4f2ee');
  if (o.head === 'turn') i += `<g transform="translate(0 -262)">${henriHead(o)}</g>`;
  i += foot(-78) + foot(78) +
    cel(P('M-96 -18 L-96 -170 Q-96 -236 0 -236 Q96 -236 96 -170 L96 -18 Z'), '#8a3442', '#64222f', 12, 6) +
    dk('M-70 -196 Q0 -224 70 -196 M-78 -40 H78', 3, 0.35) + dk('M-60 -150 L0 -110 L60 -150 M-60 -70 L0 -110 L60 -70 M-60 -150 V-70 M60 -150 V-70', 2, 0.22) +
    [[-60, -150], [60, -150], [0, -110], [-60, -70], [60, -70], [0, -190]].map(([bx, by]) => `<circle cx="${bx}" cy="${by}" r="5.5" fill="#64222f" stroke="${OUT}" stroke-width="1.5"/><circle cx="${bx - 1.5}" cy="${by - 1.5}" r="1.6" fill="#fff" opacity=".4"/>`).join('') +
    studs([-84, -56, -28, 0, 28, 56, 84].map((sx) => [sx, -28])) +
    // napperon en dentelle
    thin(P('M-44 -236 Q0 -246 44 -236 L40 -206 q-5 8 -10 0 q-5 8 -10 0 q-5 8 -10 0 q-5 8 -10 0 q-5 8 -10 0 q-5 8 -10 0 q-5 8 -10 0 q-5 8 -10 0Z'), '#f4f2ee') + dk('M-30 -226 h60 M-30 -218 h60', 1.5, 0.18) +
    cel(R(-124, -120, 40, 104, 16), '#9a3d4c', '#64222f', 5, 4) + cel(R(84, -120, 40, 104, 16), '#9a3d4c', '#64222f', 5, 4) +
    dk('M-116 -100 q12 -8 24 0 M92 -100 q12 -8 24 0', 2.5) + studs([[-104, -30], [-104, -50], [104, -30], [104, -50]]);
  return G(x, y, s, i);
}

// Fauteuil vu de face.
export function chairFront(x, y, s = 1) {
  const i = `<ellipse cx="0" cy="2" rx="125" ry="14" fill="#000" opacity=".25"/>` + foot(-78) + foot(78) +
    cel(P('M-92 -60 L-92 -230 Q-92 -292 0 -292 Q92 -292 92 -230 L92 -60 Z'), '#8a3442', '#64222f', 12, 6) +
    dk('M-60 -210 L0 -170 L60 -210 M-60 -130 L0 -170 L60 -130 M-60 -210 V-130 M60 -210 V-130 M-66 -256 Q0 -282 66 -256', 2, 0.25) +
    [[-60, -210], [60, -210], [0, -170], [-60, -130], [60, -130], [0, -250]].map(([bx, by]) => `<circle cx="${bx}" cy="${by}" r="5.5" fill="#64222f" stroke="${OUT}" stroke-width="1.5"/>`).join('') +
    thin(P('M-40 -292 Q0 -300 40 -292 L36 -262 q-6 8 -12 0 q-6 8 -12 0 q-6 8 -12 0 q-6 8 -12 0 q-6 8 -12 0 q-6 8 -12 0Z'), '#f4f2ee') +
    cel(R(-96, -92, 192, 76, 14), '#9a3d4c', '#64222f', 6, 5) + dk('M-84 -70 Q0 -82 84 -70', 2.5) + studs([-80, -48, -16, 16, 48, 80].map((sx) => [sx, -26])) +
    cel(R(-126, -140, 42, 124, 16), '#9a3d4c', '#64222f', 5, 4) + cel(R(84, -140, 42, 124, 16), '#9a3d4c', '#64222f', 5, 4) + dk('M-118 -120 q13 -8 26 0 M92 -120 q13 -8 26 0', 2.5);
  return G(x, y, s, i);
}

export function woodChair(x, y, s = 1) {
  const i = `<ellipse cx="0" cy="2" rx="80" ry="11" fill="#000" opacity=".25"/>` +
    cel(R(-58, -250, 16, 250, 5), '#6a4433', '#4e3024', 4, 0) + cel(R(42, -250, 16, 250, 5), '#6a4433', '#4e3024', 4, 0) +
    cel(P('M-64 -232 Q-64 -272 0 -276 Q64 -272 64 -232 Z'), '#8a5f40', '#5f3f28', 5, 4) + dk('M-40 -244 Q0 -262 40 -244', 2) +
    [-30, -10, 10, 30].map((bx) => flat(R(bx - 4, -232, 8, 134, 3), '#7a5236')).join('') +
    cel(R(-66, -100, 132, 20, 8), '#8a5f40', '#5f3f28', 5, 4) + cel(R(-58, -86, 116, 12, 5), '#c8343f', '#96202b', 4, 3) + flat(R(-50, -40, 100, 8, 3), '#6a4433');
  return G(x, y, s, i);
}

export function sofa(x, y, s = 1) {
  const i = `<ellipse cx="0" cy="2" rx="230" ry="14" fill="#000" opacity=".25"/>` + foot(-180) + foot(180) + foot(0) +
    cel(P('M-190 -60 V-170 Q-190 -204 -150 -204 Q-95 -226 0 -206 Q95 -226 150 -204 Q190 -204 190 -170 V-60Z'), '#7f9160', '#5f6f45', 12, 6) +
    dk('M0 -204 V-100 M-150 -180 Q-95 -200 -20 -184 M20 -184 Q95 -200 150 -180', 2.5, 0.3) +
    [[-95, -150], [95, -150]].map(([bx, by]) => `<circle cx="${bx}" cy="${by}" r="6" fill="#5f6f45" stroke="${OUT}" stroke-width="1.5"/>`).join('') +
    // fleurs fanées du tissu
    [[-140, -130], [-50, -170], [50, -130], [140, -165], [-100, -110], [100, -112]].map(([fx, fy]) => `<g opacity=".45" transform="translate(${fx} ${fy})"><circle r="4" fill="#e8d9a0"/><circle cx="7" r="3.2" fill="#c98a8a"/><circle cx="-7" r="3.2" fill="#c98a8a"/><circle cy="7" r="3.2" fill="#c98a8a"/><circle cy="-7" r="3.2" fill="#c98a8a"/></g>`).join('') +
    cel(R(-196, -96, 194, 80, 16), '#8fa26c', '#5f6f45', 6, 5) + cel(R(2, -96, 194, 80, 16), '#8fa26c', '#5f6f45', 6, 5) + dk('M-180 -40 H-14 M14 -40 H180', 2.5, 0.25) +
    cel(P('M-224 -30 V-116 Q-224 -144 -198 -144 Q-172 -144 -172 -116 V-14 H-224Z'), '#8fa26c', '#5f6f45', 5, 4) + cel(P('M224 -30 V-116 Q224 -144 198 -144 Q172 -144 172 -116 V-14 H224Z'), '#8fa26c', '#5f6f45', 5, 4) +
    dk('M-214 -118 q16 -10 32 0 M182 -118 q16 -10 32 0', 2.5) +
    // coussin brodé et plaid
    `<g transform="translate(150 -118) rotate(12)">${cel(R(-34, -30, 68, 60, 10), '#c98a3e', '#9a6426', 5, 4)}${lt('M-20 -16 L20 16 M20 -16 L-20 16', 2.5, 0.5)}<circle r="6" fill="#7a1f3a" stroke="${OUT}" stroke-width="1.5"/></g>` +
    thin(P('M-190 -196 q30 -14 62 -6 l-4 70 q-6 8 -12 0 q-6 8 -12 0 q-6 8 -12 0 q-6 8 -12 0 q-6 8 -10 0Z'), '#7a5a9a') + dk('M-176 -180 l40 4 M-176 -160 l42 4 M-176 -140 l44 4', 2, 0.3);
  return G(x, y, s, i);
}

export function table(x, y, s = 1, o = {}) {
  const w = o.w || 110, h = o.h || 70;
  const leg = (lx) => cel(P(`M${lx - 8} ${-h} h16 l-3 ${h * 0.5} q5 ${h * 0.25} -1 ${h * 0.5} h-8 q-6 ${-h * 0.25} -1 ${-h * 0.5}z`), '#5f3f28', '#3a2418', 3, 0);
  const i = `<ellipse cx="0" cy="2" rx="${w * 0.9}" ry="10" fill="#000" opacity=".25"/>` + leg(-w + 22) + leg(w - 22) +
    (o.drawer ? '' : flat(R(-w + 26, -h * 0.42, w * 2 - 52, 8, 3), '#4e3024')) +
    flat(R(-w + 10, -h + 4, w * 2 - 20, 16, 3), '#6a4433') +
    cel(R(-w, -h - 16, w * 2, 22, 6), o.c || '#8a5f40', '#5f3f28', 6, 4) + dk(`M${-w + 14} ${-h - 8} H${w * 0.3} M${-w * 0.2} ${-h - 2} H${w - 14}`, 1.6, 0.25) +
    (o.drawer ? cel(R(-w + 22, -h + 8, w * 2 - 44, 30, 4), '#7a5236', '#5f3f28', 3, 3) + `<circle cx="0" cy="${-h + 23}" r="5.5" fill="#f2c230" stroke="${OUT}" stroke-width="2"/><circle cx="-1.5" cy="${-h + 21.5}" r="1.6" fill="#fff"/>` + thin(P(`M${-w - 2} ${-h - 16} h${w * 2 + 4} l-6 12 q-6 6 -12 0 q-6 6 -12 0 l-6 -6 h${-(w * 2 - 60)} l-6 6 q-6 6 -12 0 q-6 6 -12 0z`), '#f4f2ee') : '');
  return G(x, y, s, i);
}

// Table d'échecs avec partie en cours.
export function chessTable(x, y, s = 1) {
  let board = '';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) board += `<rect x="${-80 + c * 20}" y="${-124 + r * 9}" width="20" height="9" fill="${(r + c) % 2 ? '#3a3350' : '#f4efe0'}"/>`;
  const i = table(0, 0, 1, { w: 100, h: 84 }) + flat(R(-88, -130, 176, 48, 3), '#6a4433') + `<g>${board}</g>` + R(-80, -124, 160, 36)(`fill="none" ${THIN}`) +
    prop('pawn', -70, -124, 0.8) + prop('pawn', -50, -134, 0.8) + prop('pawn', -22, -130, 0.85, { dark: true }) + prop('knight', 18, -138, 0.8, { dark: true }) + prop('pawn', 44, -122, 0.8, { dark: true }) + prop('pawn', 64, -132, 0.85) + prop('knight', -36, -112, 0.8) +
    prop('pawn', 106, -112, 0.8, { rot: 80 }) + prop('pawn', -108, -110, 0.8, { dark: true, rot: -75 });
  return G(x, y, s, i);
}

export function bed(x, y, s = 1) {
  const i = `<ellipse cx="0" cy="2" rx="210" ry="14" fill="#000" opacity=".25"/>` +
    cel(P('M146 0 V-190 Q146 -230 170 -236 Q194 -230 194 -190 V0Z'), '#6a4433', '#4e3024') + `<circle cx="170" cy="-244" r="12" fill="#8a5f40" stroke="${OUT}" stroke-width="4"/>` + dk('M158 -180 V-20 M182 -180 V-20', 2) +
    cel(R(-196, -70, 34, 70, 6), '#6a4433', '#4e3024') + `<circle cx="-179" cy="-78" r="11" fill="#8a5f40" stroke="${OUT}" stroke-width="4"/>` +
    cel(R(-200, -110, 380, 76, 18), '#e6e1f2', '#aaa2c4', 8, 6) +
    cel(R(96, -146, 78, 44, 18), '#fbf7ee', '#cfc7b0', 5, 4) + dk('M108 -132 q26 -8 52 0', 2, 0.2) +
    cel(R(-204, -90, 300, 64, 14), '#5e8fb0', '#426d8c', 8, 6) +
    // courtepointe en patchwork
    clip(R(-204, -90, 300, 64, 14), [0, 1, 2, 3, 4, 5].map((c) => [0, 1].map((r) => `<rect x="${-204 + c * 50}" y="${-90 + r * 32}" width="50" height="32" fill="${['#c98a3e', '#7a5a9a', '#5f8f6a', '#c8343f'][(c + r * 2) % 4]}" opacity=".5"/>`).join('')).join('') + dk('M-204 -58 H96 M-154 -90 V-26 M-104 -90 V-26 M-54 -90 V-26 M-4 -90 V-26 M46 -90 V-26', 1.6, 0.35)) +
    thin(P('M-204 -32 h300 v10 q-10 8 -20 0 q-10 8 -20 0 q-10 8 -20 0 q-10 8 -20 0 q-10 8 -20 0 q-10 8 -20 0 q-10 8 -20 0 q-10 8 -20 0 q-10 8 -20 0 q-10 8 -20 0 q-10 8 -20 0 q-10 8 -20 0 q-10 8 -20 0 q-10 8 -20 0 q-10 8 -20 0z'), '#f4f2ee');
  return G(x, y, s, i);
}

// --- décor & éléments d'ambiance ---------------------------------------------
export function pumpkin(x, y, s = 1) {
  const i = `<ellipse cx="0" cy="2" rx="66" ry="10" fill="#000" opacity=".25"/><ellipse cx="0" cy="-40" rx="92" ry="74" fill="#f6a01f" opacity=".12"/>` +
    cel(P('M-6 -92 Q-6 -114 14 -120 L20 -106 Q10 -104 10 -90Z'), '#4f7a3a', '#35572a', 3, 2) + ln('M12 -108 q18 -10 26 6 q-10 -4 -14 6', 3, '#4f7a3a') +
    cel(E(-34, -46, 34, 44), '#e87a12', '#b9560a', 5, 4) + cel(E(34, -46, 34, 44), '#e87a12', '#b9560a', 5, 4) + cel(E(0, -48, 40, 48), '#f58a1f', '#c9600a') +
    dk('M-20 -92 Q-34 -48 -20 -4 M20 -92 Q34 -48 20 -4', 2.5, 0.25) + lt('M-48 -70 Q-56 -50 -50 -30 M-8 -86 Q-14 -60 -10 -40', 4, 0.35) +
    plain(P('M-36 -68 l20 -4 l-7 20z M36 -68 l-20 -4 l7 20z M-6 -44 l6 -10 l6 10z'), '#fff3a8', THIN) + plain(P('M-30 -62 l11 -2 l-4 11z M30 -62 l-11 -2 l4 11z'), '#f6a01f') +
    plain(P('M-36 -34 Q0 -6 36 -34 l-10 2 l-6 -8 l-8 8 l-10 -8 l-10 8 l-8 -8 l-8 8 z'), '#fff3a8', THIN) + plain(P('M-22 -26 Q0 -12 22 -26 Q0 -18 -22 -26z'), '#f6a01f');
  return G(x, y, s, i);
}
export const bat = (x, y, s = 1) => G(x, y, s, plain(P('M0 0 Q-8 -12 -14 -2 Q-26 -18 -44 -8 Q-34 -6 -32 6 Q-24 0 -18 8 Q-10 2 0 12 Q10 2 18 8 Q24 0 32 6 Q34 -6 44 -8 Q26 -18 14 -2 Q8 -12 0 0Z'), '#14101f') +
  plain(P('M-6 -6 l-2 -8 l6 5 M6 -6 l2 -8 l-6 5'), '#14101f') + `<circle cx="-3" cy="-2" r="1.3" fill="#f6dc4a"/><circle cx="3" cy="-2" r="1.3" fill="#f6dc4a"/>` + lt('M-14 -2 l-10 8 M14 -2 l10 8 M-14 -2 l-4 10 M14 -2 l4 10', 1, 0.18));
export const moon = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r * 1.6}" fill="#fff3a8" opacity=".06"/><circle cx="${x}" cy="${y}" r="${r * 1.25}" fill="#fff3a8" opacity=".12"/>` + cel(E(x, y, r, r), '#fbefb0', '#e2cc7a', r * 0.14, r * 0.08) +
  [[-0.3, -0.25, 0.14], [0.25, 0.3, 0.1], [-0.5, 0.25, 0.08], [0.1, -0.55, 0.07], [0.45, -0.2, 0.12], [-0.15, 0.55, 0.09], [-0.62, -0.1, 0.05], [0.05, 0.05, 0.06]].map(([cx, cy, cr]) =>
    `<circle cx="${f1(x + r * cx)}" cy="${f1(y + r * cy)}" r="${f1(r * cr)}" fill="#e2cc7a"/><path d="M${f1(x + r * (cx - cr))} ${f1(y + r * cy)} a${f1(r * cr)} ${f1(r * cr)} 0 0 1 ${f1(r * cr * 2)} 0" fill="none" stroke="#c9b25e" stroke-width="${f1(Math.max(1, r * 0.018))}"/>`).join('');
export const cloud = (x, y, s = 1, c = '#3f3684') => G(x, y, s, plain(P('M-110 20 Q-130 -6 -98 -14 Q-96 -46 -58 -38 Q-40 -70 0 -52 Q30 -76 62 -46 Q104 -52 104 -14 Q134 -6 112 20Z'), c) + plain(P('M-98 20 Q-90 4 -60 8 Q-40 -8 -10 6 Q20 -6 50 8 Q80 2 100 20Z'), '#000', 'opacity=".12"'));
export const tree = (x, y, s = 1, c = '#1a1438') => G(x, y, s, `<path d="M-14 0 Q-6 -60 -12 -130 L-60 -200 M-12 -130 L-4 -230 L-40 -290 M-4 -230 L30 -300 M-8 -100 L50 -170 L46 -230 M50 -170 L96 -196 M-30 -164 L-80 -160 M-22 -260 L-50 -262 M14 -266 L10 -310 M70 -184 L84 -230" fill="none" stroke="${c}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="M-60 -200 l-22 -26 M-60 -200 l-30 4 M-40 -290 l-6 -34 M-40 -290 l-28 -8 M30 -300 l22 -22 M30 -300 l-6 -30 M46 -230 l-18 -24 M96 -196 l28 -8 M96 -196 l12 -30 M-80 -160 l-20 14" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/>` + plain(P('M-26 0 Q-10 -30 -16 -60 H8 Q4 -30 22 0Z'), c));
export const cobweb = (x, y, s = 1, fx = 1) => `<g transform="translate(${x} ${y}) scale(${s * fx} ${s})" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="2" stroke-linecap="round"><path d="M0 0 L150 14 M0 0 L128 70 M0 0 L80 120 M0 0 L18 146"/><path d="M52 5 Q48 18 44 24 Q36 34 28 42 Q18 48 6 51 M98 9 Q92 34 84 46 Q70 62 52 78 Q34 90 12 96 M140 13 Q134 44 120 66 Q100 92 76 112 Q50 132 17 138"/></g>` +
  `<g transform="translate(${x} ${y}) scale(${s * fx} ${s})"><path d="M70 60 V96" stroke="#fff" stroke-opacity=".38" stroke-width="1.5"/><circle cx="70" cy="102" r="7" fill="#14101f"/><path d="M63 100 l-8 -5 M63 104 l-9 3 M77 100 l8 -5 M77 104 l9 3 M64 97 l-6 -9 M76 97 l6 -9" stroke="#14101f" stroke-width="1.8" fill="none"/></g>`;
export const sconce = (x, y, s = 1) => G(x, y, s, `<circle r="92" fill="#f6dc7a" opacity=".1"/><circle r="52" fill="#f6dc7a" opacity=".14"/>` + flat(R(-10, 14, 20, 34, 5), '#b08a2e') + ln('M0 30 Q0 8 0 6', 6) + cel(P('M-26 6 L26 6 L16 -34 L-16 -34Z'), '#f8e7a0', '#e0b84a', 5, 3) + dk('M-20 -4 H20', 2, 0.25) + plain(E(0, 8, 22, 4), '#fff8d0'));
export function plant(x, y, s = 1) {
  const leaf = (a, l, c) => `<g transform="rotate(${a})">${plain(P(`M0 0 Q${l * 0.28} ${-l * 0.5} 0 ${-l} Q${-l * 0.28} ${-l * 0.5} 0 0Z`), c, THIN)}${dk(`M0 -6 V${-l + 8}`, 1.5, 0.3)}</g>`;
  return G(x, y, s, `<ellipse cx="0" cy="2" rx="52" ry="9" fill="#000" opacity=".25"/><g transform="translate(0 -70)">` + leaf(-64, 96, '#3e6b3a') + leaf(64, 96, '#3e6b3a') + leaf(-36, 120, '#4f7a3a') + leaf(36, 120, '#4f7a3a') + leaf(-10, 136, '#5f8f4a') + leaf(14, 130, '#4f7a3a') + '</g>' +
    cel(P('M-38 -74 H38 L28 0 H-28Z'), '#b5653a', '#8a4526', 6, 3) + cel(R(-44, -84, 88, 18, 5), '#c97a4a', '#8a4526', 5, 3) + dk('M-30 -40 H30', 2));
}
export function bookshelf(x, y, w, h, seed = 1) {
  const r = rng(seed), cols = ['#7a1f3a', '#2f4f9a', '#4f7a3a', '#b08a2e', '#5a3a7a', '#8a4526', '#3d6b6b', '#c8343f', '#3a3350'];
  let s = cel(R(x, y - h, w, h, 4), '#6a4433', '#4e3024', 8, 0) + plain(R(x + 12, y - h + 12, w - 24, h - 24), '#2a1c18');
  const rows = Math.max(2, Math.round(h / 110)), rh = (h - 24) / rows;
  for (let i = 0; i < rows; i++) {
    const by = y - h + 12 + (i + 1) * rh;
    let bx = x + 16;
    while (bx < x + w - 34) {
      const bw = 12 + r() * 14, bh = rh * (0.55 + r() * 0.3), c = cols[Math.floor(r() * cols.length)];
      if (r() < 0.12) { s += prop(r() < 0.5 ? 'candle' : 'jar', bx + 14, by - 26, 0.9); bx += 34; continue; }
      const tilt = r() < 0.1 ? 10 : 0;
      s += `<g transform="rotate(${tilt} ${f1(bx)} ${f1(by)})"><rect x="${f1(bx)}" y="${f1(by - bh - 8)}" width="${f1(bw)}" height="${f1(bh)}" fill="${c}" stroke="${OUT}" stroke-width="2"/><rect x="${f1(bx + 2)}" y="${f1(by - bh)}" width="${f1(bw - 4)}" height="4" fill="#f2c230" opacity=".7"/><rect x="${f1(bx + 2)}" y="${f1(by - 22)}" width="${f1(bw - 4)}" height="3" fill="#f2c230" opacity=".5"/></g>`;
      bx += bw + (tilt ? 8 : 1);
    }
    s += flat(R(x + 8, by - 8, w - 16, 10, 2), '#8a5f40');
  }
  return s + cel(R(x - 8, y - h - 14, w + 16, 18, 4), '#8a5f40', '#5f3f28', 5, 3);
}
export function rug(cx, cy, rx, ry, c1 = '#8f3b46', c2 = '#a54d55', c3 = '#e8d9a0') {
  let s = '';
  for (let i = 0; i < 26; i++) { const a = (i / 26) * Math.PI * 2; s += `<path d="M${f1(cx + Math.cos(a) * rx)} ${f1(cy + Math.sin(a) * ry)} l${f1(Math.cos(a) * 14)} ${f1(Math.sin(a) * 9)}" stroke="${c3}" stroke-width="3" stroke-linecap="round"/>`; }
  s += plain(E(cx, cy, rx, ry), c1, THIN) + plain(E(cx, cy, rx * 0.88, ry * 0.8), c2) + `<ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.88}" ry="${ry * 0.8}" fill="none" stroke="${c3}" stroke-width="3" stroke-dasharray="14 10"/>` +
    plain(E(cx, cy, rx * 0.6, ry * 0.5), c1) + `<ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.6}" ry="${ry * 0.5}" fill="none" stroke="${c3}" stroke-width="2"/>`;
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; s += `<ellipse cx="${f1(cx + Math.cos(a) * rx * 0.74)}" cy="${f1(cy + Math.sin(a) * ry * 0.65)}" rx="9" ry="5" fill="${c3}" opacity=".8"/>`; }
  return s + plain(P(`M${cx - rx * 0.3} ${cy} Q${cx} ${cy - ry * 0.4} ${cx + rx * 0.3} ${cy} Q${cx} ${cy + ry * 0.4} ${cx - rx * 0.3} ${cy}Z`), c3, 'opacity=".7"');
}
export function runner(y, h, c1 = '#8f3b46', c2 = '#e8d9a0') {
  let s = plain(R(-10, y, W + 20, h), c1, THIN) + `<rect x="0" y="${y + 9}" width="${W}" height="${h - 18}" fill="none" stroke="${c2}" stroke-width="3" stroke-dasharray="16 10"/>`;
  for (let x = 40; x < W; x += 120) s += plain(P(`M${x} ${y + h / 2} l22 ${-h * 0.26} l22 ${h * 0.26} l-22 ${h * 0.26}z`), c2, 'opacity=".75"') + `<circle cx="${x + 82}" cy="${y + h / 2}" r="5" fill="${c2}" opacity=".6"/>`;
  return s;
}
export const cornice = (c = '#2a2148') => `<rect width="${W}" height="26" fill="${c}"/><rect y="26" width="${W}" height="5" fill="${OUT}"/>` + Array.from({ length: 30 }, (_, i) => `<rect x="${i * 40 + 8}" y="31" width="22" height="10" fill="${c}" stroke="${OUT}" stroke-width="2"/>`).join('');
export function leaves(seed, y0, y1, n = 14) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) s += `<path transform="translate(${f1(r() * W)} ${f1(y0 + r() * (y1 - y0))}) rotate(${Math.round(r() * 360)}) scale(${f1(0.7 + r() * 0.8)})" d="M0 0 Q8 -10 0 -22 Q-8 -10 0 0Z M0 0 v6" fill="${['#f58a1f', '#c9600a', '#b08a2e', '#96202b'][i % 4]}" stroke="${OUT}" stroke-width="1.5"/>`;
  return s;
}
export function sky(o = {}) {
  const b = o.band || 380;
  if (o.day) return `<rect width="${W}" height="${H}" fill="#f7c98a"/><rect y="${b * 0.5}" width="${W}" height="${H}" fill="#f9d49c"/><rect y="${b}" width="${W}" height="${H}" fill="#fbe0b0"/>` +
    cloud(260, 150, 1.1, '#fde9c4') + cloud(760, 250, 0.8, '#fde9c4') + cloud(1080, 380, 0.6, '#fdf0d6') + [[420, 120], [470, 150], [380, 170]].map(([x, y]) => ln(`M${x} ${y} q8 -8 16 0 q8 -8 16 0`, 2.5)).join('');
  const r = rng(o.seed || 7);
  let s = `<rect width="${W}" height="${H}" fill="#231c55"/><rect y="${b * 0.45}" width="${W}" height="${H}" fill="#2a2360"/><rect y="${b * 0.8}" width="${W}" height="${H}" fill="#30286c"/><rect y="${b}" width="${W}" height="${H}" fill="#372e78"/>`;
  for (let i = 0; i < 90; i++) { const x = f1(r() * W), y = f1(r() * b * 1.05), rr = f1(0.8 + r() * 2.2); s += r() < 0.12 ? `<path d="M${x} ${y - 7} l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z" fill="#fff3a8"/>` : `<circle cx="${x}" cy="${y}" r="${rr}" fill="#fff3a8" opacity="${f1(0.45 + r() * 0.55)}"/>`; }
  return s + cloud(250, b * 0.55, 1.2) + cloud(820, b * 0.75, 0.9) + cloud(1100, b * 0.3, 0.6, '#372e78');
}
export function burst(x, y, r, c = '#fff3a8', n = 10) {
  let d = '', d2 = '', rays = '';
  for (let i = 0; i < n * 2; i++) { const a = (Math.PI * i) / n, rr = i % 2 ? r * 0.55 : r; d += `${i ? 'L' : 'M'}${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)}`; d2 += `${i ? 'L' : 'M'}${f1(x + Math.cos(a) * rr * 0.55)} ${f1(y + Math.sin(a) * rr * 0.55)}`;
    if (i % 2 === 0) rays += `M${f1(x + Math.cos(a + 0.16) * r * 1.15)} ${f1(y + Math.sin(a + 0.16) * r * 1.15)} L${f1(x + Math.cos(a + 0.16) * r * 1.4)} ${f1(y + Math.sin(a + 0.16) * r * 1.4)}`; }
  return ln(rays, 5, '#f4efe6') + cel(P(d + 'Z'), c, '#f6c84a', r * 0.08, r * 0.06) + plain(P(d2 + 'Z'), '#ffffff');
}
export function bubble(x, y, rx, ry, inner, o = {}) {
  const [tx, ty] = o.tail || [x, y + ry + 60];
  let s = '';
  if (o.thought) for (const t of [0.35, 0.65, 0.9]) s += `<circle cx="${x + (tx - x) * t}" cy="${y + (ty - y) * t}" r="${16 - t * 10}" fill="#fff" ${THIN}/>`;
  else s += flat(P(`M${x - 24} ${y + ry * 0.6} L${tx} ${ty} L${x + 24} ${y + ry * 0.6}Z`), '#fff');
  return s + `<ellipse cx="${x + 6}" cy="${y + 8}" rx="${rx}" ry="${ry}" fill="#000" opacity=".18"/>` + flat(E(x, y, rx, ry), '#fff') + (o.thought ? '' : plain(P(`M${x - 21} ${y + ry * 0.6} L${tx} ${ty - 6} L${x + 21} ${y + ry * 0.6}Z`), '#fff')) + clip(E(x, y, rx - 4, ry - 4), `<g transform="translate(${x} ${y})">${inner}</g>`);
}
export function clock(x, y, r, hh, mm) {
  const ha = ((hh % 12) + mm / 60) * 30 - 90, ma = mm * 6 - 90, rad = Math.PI / 180;
  let t = '';
  for (let i = 0; i < 60; i++) { const a = i * 6 * rad, big = i % 5 === 0; t += `<path d="M${f1(x + Math.cos(a) * r * (big ? 0.76 : 0.86))} ${f1(y + Math.sin(a) * r * (big ? 0.76 : 0.86))} L${f1(x + Math.cos(a) * r * 0.92)} ${f1(y + Math.sin(a) * r * 0.92)}" stroke="${OUT}" stroke-width="${f1(r * (big ? 0.05 : 0.02))}" stroke-linecap="round"/>`; }
  return cel(E(x, y, r * 1.18, r * 1.18), '#b08a2e', '#7d5f17', 5, 4) + `<circle cx="${x}" cy="${y}" r="${r * 1.08}" fill="none" stroke="#f2c230" stroke-width="${f1(r * 0.04)}"/>` + cel(E(x, y, r, r), '#fbf7ee', '#e3dccb', r * 0.1, r * 0.07) + t +
    ln(`M${x} ${y} L${f1(x + Math.cos(ha * rad) * r * 0.5)} ${f1(y + Math.sin(ha * rad) * r * 0.5)}`, r * 0.11) +
    ln(`M${x} ${y} L${f1(x + Math.cos(ma * rad) * r * 0.72)} ${f1(y + Math.sin(ma * rad) * r * 0.72)}`, r * 0.07) + `<circle cx="${x}" cy="${y}" r="${r * 0.08}" fill="#c8343f" stroke="${OUT}" stroke-width="1.5"/>` + lt(`M${f1(x - r * 0.6)} ${f1(y - r * 0.5)} A${r * 0.8} ${r * 0.8} 0 0 1 ${f1(x + r * 0.1)} ${f1(y - r * 0.8)}`, r * 0.06, 0.6);
}
// Cadre mural (portraits anciens, variantes ovales ou paysages, suspendus à un clou).
export function wallFrame(x, y, s = 1, o = {}) {
  const v = Math.abs(Math.round(x * 7 + y * 13)) % 4, tilt = ((Math.round(x + y) % 5) - 2) * 1.2;
  const hang = `<path d="M-14 -30 L0 -44 L14 -30" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1.5"/><circle cx="0" cy="-44" r="2.5" fill="${OUT}"/>`;
  const sh = `<rect x="-20" y="-24" width="52" height="62" fill="#000" opacity=".16"/>`;
  let i;
  if (o.trio || v === 0) i = sh + hang + prop('frame', 0, 0, 1, { bg: '#cfc6b4', ...o });
  else if (v === 1) i = sh + hang + thin(R(-24, -30, 48, 60, 3), '#6a4433') + plain(R(-18, -24, 36, 48), '#cfc6b4') + clip(R(-18, -24, 36, 48), plain(P('M-14 26 Q-14 4 0 4 Q14 4 14 26Z'), '#3b3a44') + plain(E(0, -6, 9, 11), '#a9a39a') + plain(P('M-9 -8 Q0 -22 9 -8 Q0 -14 -9 -8Z'), '#5a5562'));
  else if (v === 2) i = `<ellipse cx="4" cy="6" rx="26" ry="32" fill="#000" opacity=".16"/>` + hang + cel(E(0, 0, 26, 32), '#b08a2e', '#7d5f17', 3, 2) + plain(E(0, 0, 19, 25), '#cfc6b4') + clip(E(0, 0, 19, 25), plain(P('M-13 28 Q-13 6 0 6 Q13 6 13 28Z'), '#f4f2ee') + plain(E(0, -4, 8, 10), '#a9a39a') + plain(P('M-10 -4 Q-12 -18 0 -18 Q12 -18 10 -4 Q0 -12 -10 -4Z'), '#77727f'));
  else i = `<rect x="-26" y="-16" width="62" height="46" fill="#000" opacity=".16"/>` + hang + thin(R(-30, -22, 60, 44, 3), '#6a4433') + plain(R(-24, -16, 48, 32), '#cfc6b4') + clip(R(-24, -16, 48, 32), plain(R(-24, 6, 48, 12), '#8c8791') + plain(P('M-12 6 V-6 L-2 -14 L8 -6 V6Z'), '#5a5562') + plain(P('M10 6 q4 -18 10 0z'), '#77727f') + `<circle cx="-16" cy="-9" r="4" fill="#f4f2ee"/>`);
  return `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${s})">${i}${lt('M-17 -22 L-6 -22 L-17 -8Z', 0, 0)}</g>`;
}

// La maison des Morticia vue de la rue.
export function house(x, y, s = 1, o = {}) {
  const lit = '#f6dc7a', dark = '#1f1840', wall = o.party ? '#b0507f' : '#6456a0', wallSh = o.party ? '#8a3a62' : '#4a3f7d', trim = o.party ? '#f4c6dc' : '#c9c2e6';
  const win = (wx, wy, on, fig) => (on ? `<rect x="${wx - 16}" y="${wy - 16}" width="94" height="106" fill="${lit}" opacity=".14"/>` : '') +
    flat(R(wx - 20, wy, 16, 74, 2), o.party ? '#5a2a4a' : '#3a2f63') + flat(R(wx + 66, wy, 16, 74, 2), o.party ? '#5a2a4a' : '#3a2f63') + dk(`M${wx - 16} ${wy + 18} h8 M${wx - 16} ${wy + 36} h8 M${wx - 16} ${wy + 54} h8 M${wx + 70} ${wy + 18} h8 M${wx + 70} ${wy + 36} h8 M${wx + 70} ${wy + 54} h8`, 1.6, 0.5) +
    flat(R(wx, wy, 62, 74, 4), on ? lit : dark) +
    (on ? plain(P(`M${wx} ${wy} h20 q-2 40 -20 60z M${wx + 62} ${wy} h-20 q2 40 20 60z`), '#e9a84a', 'opacity=".75"') : lt(`M${wx + 8} ${wy + 30} l20 -22 M${wx + 14} ${wy + 40} l12 -13`, 2.5, 0.2)) +
    (fig ? plain(P(`M${wx + 14} ${wy + 74} Q${wx + 14} ${wy + 40} ${wx + 31} ${wy + 40} Q${wx + 48} ${wy + 40} ${wx + 48} ${wy + 74}Z`), OUT) + plain(E(wx + 31, wy + 28, 13, 16), OUT) + `<circle cx="${wx + 26}" cy="${wy + 26}" r="2.2" fill="#e0425a"/><circle cx="${wx + 36}" cy="${wy + 26}" r="2.2" fill="#e0425a"/>` : '') +
    ln(`M${wx + 31} ${wy} v74 M${wx} ${wy + 37} h62`, 3) + flat(R(wx - 6, wy + 72, 74, 9, 2), trim);
  let shingles = '';
  for (let r = 0; r < 8; r++) { let d = ''; for (let k = -11; k < 11; k++) d += `M${k * 20 + (r % 2) * 10} ${-400 + r * 19} q10 12 20 0`; shingles += dk(d, 2, 0.4); }
  let siding = ''; for (let r = 1; r < 13; r++) siding += `M-170 ${-270 + r * 21} H170`;
  const i = `<ellipse cx="0" cy="4" rx="230" ry="16" fill="#000" opacity=".25"/>` +
    // cheminée en briques et fumée
    cel(R(90, -440, 40, 100), '#7a4a55', '#57303b', 5, 0) + dk('M90 -420 h40 M90 -400 h40 M90 -380 h40 M110 -440 v20 M100 -420 v20 M120 -400 v20', 1.6, 0.4) + flat(R(84, -448, 52, 12, 3), '#463a73') +
    `<g fill="#c9c2e6" opacity=".3"><circle cx="112" cy="-470" r="14"/><circle cx="128" cy="-498" r="18"/><circle cx="118" cy="-534" r="22"/></g>` +
    cel(R(-170, -270, 340, 270), wall, wallSh, 14, 0) + dk(siding, 1.6, 0.22) + flat(R(-178, -274, 16, 274, 2), trim) + flat(R(162, -274, 16, 274, 2), trim) +
    cel(P('M-204 -266 L0 -410 L204 -266 Z'), '#3a2f63', '#2a2148', 14, 6) + clip(P('M-204 -266 L0 -410 L204 -266 Z'), shingles) + ln('M-204 -266 L0 -410 L204 -266', 9) + ln('M-204 -266 L0 -410 L204 -266', 4, trim) +
    ln('M0 -410 V-448 M-12 -436 H12', 4) + plain(P('M0 -452 l14 6 l-14 6z'), OUT) +
    flat(E(0, -318, 24, 24), trim) + flat(E(0, -318, 18, 18), o.party ? '#9be564' : dark) + ln('M0 -336 V-300 M-18 -318 H18', 2.5) +
    win(-128, -236, !!o.upLit, o.fig) + win(66, -236, !!o.party) + win(-128, -118, !!o.downLit || !!o.party) + win(66, -118, !!o.downLit || !!o.party) +
    // porche
    flat(R(-58, -124, 10, 124, 2), trim) + flat(R(48, -124, 10, 124, 2), trim) + cel(P('M-76 -124 L0 -168 L76 -124Z'), '#3a2f63', '#2a2148', 6, 3) +
    cel(R(-32, -112, 64, 112, 6), '#6a4433', '#4e3024', 5, 0) + flat(R(-22, -100, 44, 40, 3), '#5a3524') + flat(R(-22, -52, 44, 44, 3), '#5a3524') + `<circle cx="20" cy="-54" r="5" fill="#f2c230" stroke="${OUT}" stroke-width="2"/><circle cx="0" cy="-80" r="6" fill="none" stroke="#f2c230" stroke-width="2.5"/>` +
    (o.party ? ln('M-170 -276 Q-85 -246 0 -276 Q85 -246 170 -276', 2.5) + [-150, -110, -70, -30, 10, 50, 90, 130].map((gx, k) => `<circle cx="${gx}" cy="${-262 + (k % 2) * 6}" r="6" fill="${['#f58a1f', '#9be564', '#8fd3ff', '#e0425a'][k % 4]}" stroke="${OUT}" stroke-width="1.5"/>`).join('') : cobweb(-170, -270, 0.5)) +
    cel(R(-62, -8, 124, 14, 3), '#8d86a8', '#6b6485', 4, 3) + flat(R(-74, 2, 148, 10, 3), '#8d86a8') +
    // buissons
    cel(P('M-176 0 Q-190 -40 -160 -44 Q-150 -66 -124 -50 Q-98 -60 -92 -34 Q-74 -22 -84 0Z'), '#2f4a3a', '#1f3328', 6, 4) + cel(P('M176 0 Q190 -40 160 -44 Q150 -66 124 -50 Q98 -60 92 -34 Q74 -22 84 0Z'), '#2f4a3a', '#1f3328', 6, 4);
  return G(x, y, s, i);
}
export function lamppost(x, y, s = 1) {
  return G(x, y, s, `<path d="M-26 -300 L26 -300 L140 0 L-140 0Z" fill="#f6dc7a" opacity=".14"/><path d="M-20 -300 L20 -300 L70 0 L-70 0Z" fill="#f6dc7a" opacity=".1"/><ellipse cx="0" cy="0" rx="140" ry="22" fill="#f6dc7a" opacity=".18"/><circle cx="0" cy="-320" r="70" fill="#f6dc7a" opacity=".14"/>` +
    cel(R(-6, -300, 12, 300, 4), '#2a2148', '#1a1438', 3, 0) + flat(P('M-18 0 L-12 -30 H12 L18 0Z'), '#2a2148') + flat(R(-10, -200, 20, 8, 3), '#2a2148') + ln('M-6 -280 Q-34 -284 -36 -262', 4) +
    cel(P('M-22 -300 L22 -300 L14 -340 L-14 -340Z'), '#f6dc7a', '#e0b84a', 4, 3) + ln('M0 -340 V-300 M-18 -320 H18', 2) + flat(P('M-20 -340 L20 -340 L0 -358Z'), '#2a2148') + `<circle cx="0" cy="-362" r="4" fill="#2a2148" stroke="${OUT}" stroke-width="2"/>`);
}
export function street(o = {}) {
  let fence = '';
  for (let x = 0; x < W; x += 34) fence += flat(P(`M${x} 564 V522 l8 -12 l8 12 V564Z`), '#2a2350');
  let slabs = '', cob = '';
  for (let x = 30; x < W; x += 96) slabs += `M${x} 566 l-10 58`;
  const r = rng(11);
  for (let i = 0; i < 46; i++) { const x = f1(r() * W), y = f1(640 + r() * 150); cob += `<ellipse cx="${x}" cy="${y}" rx="${f1(10 + r() * 12)}" ry="4" fill="${r() < 0.5 ? '#3d3470' : '#4d4484'}"/>`; }
  return sky() + moon(o.moonX || 1010, 130, 62) + bat(700, 110, 0.9) + bat(520, 190, 0.6) +
    plain(P('M0 560 Q150 470 300 540 Q420 480 560 550 L560 600 L0 600Z'), '#231c50') + plain(P('M700 560 Q900 470 1050 540 Q1130 500 1200 540 L1200 600 L700 600Z'), '#231c50') +
    tree(70, 566, 0.9) + tree(1150, 566, 0.75) + tree(560, 566, 0.5, '#231c50') + ln('M0 536 H1200', 5, '#2a2350') + fence +
    `<rect y="560" width="${W}" height="70" fill="#6a60a0"/><rect y="560" width="${W}" height="6" fill="${OUT}"/>` + dk(slabs, 2, 0.3) + `<rect y="618" width="${W}" height="10" fill="#8d86a8"/><rect y="626" width="${W}" height="174" fill="#453c78"/><rect y="624" width="${W}" height="5" fill="${OUT}"/>` + cob +
    [60, 320, 580, 840, 1100].map((dx) => `<rect x="${dx}" y="706" width="110" height="12" rx="4" fill="#8d86a8" stroke="${OUT}" stroke-width="2"/>`).join('') +
    `<ellipse cx="420" cy="770" rx="90" ry="14" fill="#6f66ad" opacity=".5"/><ellipse cx="420" cy="768" rx="60" ry="7" fill="#fbefb0" opacity=".2"/><ellipse cx="900" cy="672" rx="34" ry="9" fill="#2a2350" stroke="${OUT}" stroke-width="2.5"/>` + dk('M878 672 h44 M888 667 h24 M888 677 h24', 1.5, 0.5) + leaves(5, 570, 790, 22);
}

function stripes(c, x0 = 0, x1 = W, y0 = 0, y1 = 600) {
  let s = '';
  for (let x = x0 + 30; x < x1; x += 80) s += `<rect x="${x}" y="${y0}" width="22" height="${y1 - y0}" fill="${c}"/><rect x="${x + 26}" y="${y0}" width="3" height="${y1 - y0}" fill="#fff" opacity=".05"/>`;
  return s + `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="url(#wp)"/>`;
}
function floorBoards(y, c, lc) {
  let s = `<rect y="${y}" width="${W}" height="${H - y}" fill="${c}"/><rect y="${y}" width="${W}" height="${H - y}" fill="url(#grain)"/>` +
    // plinthe
    `<rect y="${y - 16}" width="${W}" height="16" fill="${lc}"/><rect y="${y - 19}" width="${W}" height="4" fill="${OUT}"/><rect y="${y - 13}" width="${W}" height="2" fill="#fff" opacity=".12"/><rect y="${y - 3}" width="${W}" height="6" fill="${OUT}"/>`;
  [[y + 46, 0], [y + 100, 140], [y + 160, 60]].forEach(([yy, off], k) => {
    s += `<rect y="${yy}" width="${W}" height="3" fill="${lc}"/>`;
    for (let x = off + 90; x < W; x += 280) s += `<rect x="${x}" y="${yy - (k ? (k === 1 ? 54 : 60) : 46)}" width="3" height="${k ? (k === 1 ? 54 : 60) : 46}" fill="${lc}"/><circle cx="${x + 6}" cy="${yy - 8}" r="1.6" fill="${OUT}" opacity=".5"/><circle cx="${x - 5}" cy="${yy - 8}" r="1.6" fill="${OUT}" opacity=".5"/>`;
  });
  return s;
}
// Soubassement à panneaux moulurés.
function wainscot(y, h, c, lc) {
  let s = `<rect y="${y}" width="${W}" height="${h}" fill="${c}"/><rect y="${y - 3}" width="${W}" height="5" fill="${OUT}"/><rect y="${y + 3}" width="${W}" height="7" fill="#fff" opacity=".1"/>`;
  for (let x = 14; x < W; x += 150) s += `<rect x="${x}" y="${y + 18}" width="122" height="${h - 44}" rx="3" fill="${lc}" stroke="${OUT}" stroke-opacity=".55" stroke-width="2.5"/><path d="M${x + 5} ${y + h - 30} V${y + 23} H${x + 117}" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>`;
  return s;
}

// La fête chez les amis.
export function party(o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="#5b2a7a"/>` + stripes('#532571') + wainscot(500, 100, '#4a2166', '#532571') + floorBoards(600, '#3d1b56', '#33154a');
  // buffet : bol de punch, gobelets, bonbons
  s += cel(R(40, 470, 330, 26, 5), '#f58a1f', '#c9600a', 6, 4) + cel(P('M48 496 H362 L352 640 H58Z'), '#2a1638', '#1c0e28', 8, 0) + dk('M110 500 l-6 136 M200 500 v138 M290 500 l6 136', 2, 0.4) + plain(P('M48 496 h314 l-4 26 q-13 12 -26 0 q-13 12 -26 0 q-13 12 -26 0 q-13 12 -26 0 q-13 12 -26 0 q-13 12 -26 0 q-13 12 -26 0 q-13 12 -26 0 q-13 12 -26 0 q-13 12 -26 0 q-13 12 -26 0 q-13 12 -26 0z'), '#f58a1f', THIN) +
    cel(P('M140 420 H270 Q266 470 205 472 Q144 470 140 420Z'), '#d7f0ff', '#9fcbe6', 6, 4) + plain(P('M146 432 H264 Q258 466 205 468 Q152 466 146 432Z'), '#9be564') + `<circle cx="180" cy="446" r="6" fill="#e0425a"/><circle cx="222" cy="452" r="5" fill="#f58a1f"/><circle cx="244" cy="440" r="4" fill="#fff" opacity=".6"/>` + ln('M236 430 L268 384', 6) + ln('M236 430 L268 384', 3, '#c9d2de') +
    [70, 100, 300, 330].map((cx, k) => thin(P(`M${cx - 11} 440 h22 l-4 30 h-14z`), k % 2 ? '#e0425a' : '#f4efe6')).join('') + A_pump(315, 420);
  for (const [x, c] of [[160, '#f58a1f'], [480, '#9be564'], [800, '#e0425a'], [1080, '#8fd3ff']])
    s += `<path d="M${x - 16} 0 L${x + 16} 0 L${x + 190} 800 L${x - 190} 800Z" fill="${c}" opacity="${o.dim ? 0.1 : 0.2}"/><path d="M${x - 8} 0 L${x + 8} 0 L${x + 90} 800 L${x - 90} 800Z" fill="${c}" opacity="${o.dim ? 0.05 : 0.1}"/>`;
  // boule à facettes, ballons, toile d'araignée
  s += ln('M600 0 V40', 4) + cel(E(600, 74, 36, 36), '#c9d2de', '#8d98a3', 7, 5) + clip(E(600, 74, 34, 34), dk('M564 60 H636 M564 74 H636 M564 88 H636 M580 40 V110 M594 40 V110 M608 40 V110 M622 40 V110', 1.6, 0.4) + `<rect x="582" y="50" width="12" height="10" fill="#fff" opacity=".7"/><rect x="610" y="76" width="12" height="10" fill="#fff" opacity=".4"/>`) +
    [[530, 150], [680, 170], [640, 30], [540, 60]].map(([px, py]) => `<path d="M${px} ${py - 8} l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2z" fill="#fff" opacity=".8"/>`).join('');
  for (const [bx, by, c] of [[440, 250, '#f58a1f'], [480, 210, '#14101f'], [760, 230, '#14101f'], [800, 270, '#f58a1f'], [900, 180, '#9be564']])
    s += ln(`M${bx} ${by + 40} q-10 60 6 150`, 2) + cel(E(bx, by, 32, 40), c, c === '#14101f' ? '#000' : '#c9600a', 6, 5) + plain(P(`M${bx - 6} ${by + 39} h12 l-6 9z`), c, THIN) + `<ellipse cx="${bx - 11}" cy="${by - 14}" rx="7" ry="11" fill="#fff" opacity=".3"/>`;
  s += cobweb(0, 0, 1.3) + cobweb(W, 0, 1.1, -1) + garland();
  const r = rng(3);
  for (let i = 0; i < 46; i++) s += `<rect x="${f1(r() * W)}" y="${f1(120 + r() * 660)}" width="9" height="5" fill="${['#f58a1f', '#9be564', '#e0425a', '#8fd3ff', '#fff3a8'][i % 5]}" opacity=".8" transform="rotate(${Math.round(r() * 180)} ${f1(r() * W)} 400)"/>`;
  return s;
}
const A_pump = (x, y) => pumpkin(x, y + 50, 0.42);
export function garland() {
  let s = ln('M0 60 Q300 150 600 70 Q900 150 1200 60', 4);
  for (let i = 0; i < 12; i++) {
    const x = 50 + i * 100, t = (x % 600) / 600, y = 64 + 90 * t * (1 - t) * 1.9, c = ['#f58a1f', '#14101f', '#9be564'][i % 3];
    s += cel(P(`M${x - 24} ${y} L${x + 24} ${y} L${x} ${y + 46}Z`), c, c === '#14101f' ? '#000' : c === '#f58a1f' ? '#c9600a' : '#6fb53e', 5, 3) +
      (i % 3 === 0 ? plain(P(`M${x - 8} ${y + 10} l5 6 l-8 2z M${x + 8} ${y + 10} l-5 6 l8 2z M${x - 8} ${y + 24} q8 8 16 0z`), '#14101f') : i % 3 === 1 ? `<circle cx="${x - 6}" cy="${y + 14}" r="3" fill="#f4efe6"/><circle cx="${x + 6}" cy="${y + 14}" r="3" fill="#f4efe6"/>` : bat(x, y + 16, 0.3));
  }
  return s;
}
export const floorOnly = () => `<rect width="${W}" height="${H}" fill="#33284f"/><rect width="${W}" height="${H}" fill="url(#grain)"/>` + [150, 330, 510, 690].map((y, i) => `<rect y="${y}" width="${W}" height="5" fill="#2a2042"/><rect x="${200 + i * 230}" y="${y - 180}" width="5" height="180" fill="#2a2042"/><circle cx="${214 + i * 230}" cy="${y - 14}" r="3" fill="#1b1230"/><circle cx="${190 + i * 230}" cy="${y - 14}" r="3" fill="#1b1230"/>`).join('') +
  `<path d="M0 0 L500 0 L900 800 L0 800Z" fill="#f6dc7a" opacity=".1"/><path d="M0 0 L240 0 L560 800 L0 800Z" fill="#f6dc7a" opacity=".06"/>` + rug(1040, 760, 300, 120) + `<g fill="#fff" opacity=".35"><circle cx="300" cy="200" r="3"/><circle cx="420" cy="420" r="2"/><circle cx="180" cy="520" r="2.5"/><circle cx="520" cy="620" r="2"/><circle cx="120" cy="300" r="2"/></g>`;
// Silhouette d'invité déguisé qui danse.
export function dancer(x, y, s, c, hat) {
  const i = `<ellipse cx="0" cy="2" rx="60" ry="9" fill="#000" opacity=".25"/>` + plain(P('M-34 0 Q-40 -150 0 -160 Q40 -150 34 0Z'), c) + plain(E(0, -196, 38, 40), c) +
    `<path d="M-30 -140 L-74 -230 M30 -140 L78 -220" stroke="${c}" stroke-width="22" stroke-linecap="round"/>` +
    (hat === 'witch' ? plain(P('M-56 -222 L56 -222 L8 -246 L-4 -318 L-20 -246Z'), c) + plain(P('M-40 -150 l-30 110 l30 -20 M40 -150 l30 110 l-30 -20'), c) : hat === 'horns' ? plain(P('M-30 -224 L-40 -262 L-14 -234Z M30 -224 L40 -262 L14 -234Z'), c) + `<path d="M30 -40 q40 10 30 -50 l10 6 l-4 -16 l-12 10" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>` : plain(P('M-30 -226 L-24 -256 L-10 -234 L0 -260 L10 -234 L24 -256 L30 -226Z'), c)) +
    `<ellipse cx="-13" cy="-200" rx="6" ry="8" fill="#fff3a8" opacity=".55"/><ellipse cx="13" cy="-200" rx="6" ry="8" fill="#fff3a8" opacity=".55"/><path d="M-12 -180 q12 9 24 0" fill="none" stroke="#fff3a8" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>` + lt('M-28 -150 Q-34 -80 -28 -10', 4, 0.12);
  return G(x, y, s, i);
}

// Le salon de Mme Morticia : papier peint défraîchi, cheminée, photographies anciennes.
export function salon(o = {}) {
  const d = o.dark;
  let s = `<rect width="${W}" height="${H}" fill="${d ? '#5e5078' : '#8d7ca6'}"/>` + stripes(d ? '#574a70' : '#84729e') + wainscot(510, 90, d ? '#4a3d63' : '#6f5d8a', d ? '#52446c' : '#7a6896') +
    floorBoards(600, d ? '#4a3226' : '#6d4a36', d ? '#3c281e' : '#5a3b2a') + cornice(d ? '#3a2f52' : '#5a4a78') +
    // papier peint décollé, fissure, toiles d'araignée
    plain(P('M1200 44 V150 Q1170 120 1176 44Z'), d ? '#4a3d63' : '#b5a8c8', THIN) + dk('M18 60 l14 40 l-10 30 l16 44 M32 100 l18 12', 2.5, 0.35) + cobweb(0, 42, 1) + cobweb(W, 42, 0.8, -1) +
    rug(560, 730, 440, 56);
  for (const [x, y, sc] of o.frames || [[110, 190, 1.5], [250, 300, 1.2], [380, 170, 1.3], [540, 260, 1.6], [700, 180, 1.2]]) s += wallFrame(x, y, sc);
  s += sconce(640, 380, 0.8);
  if (o.fire !== false) s += fireplace(960, 600) + plant(1150, 640, 0.9) + (d ? '' : `<circle cx="960" cy="520" r="260" fill="#f58a1f" opacity=".08"/>`);
  else s += bookshelf(930, 600, 230, 400, 4);
  return s;
}
export function fireplace(x, y, o = {}) {
  let bricks = '';
  for (let r = 0; r < 9; r++) { bricks += `M-150 ${-280 + r * 31} H150`; for (let k = 0; k < 7; k++) bricks += `M${-150 + k * 50 + (r % 2) * 25} ${-280 + r * 31} v31`; }
  const i = `<ellipse cx="0" cy="-20" rx="230" ry="60" fill="#f58a1f" opacity=".12"/>` + cel(R(-150, -280, 300, 280, 6), '#a59fb3', '#7f7890', 12, 0) + clip(R(-150, -280, 300, 280, 6), dk(bricks, 2, 0.28)) +
    cel(P('M-104 0 V-150 Q-104 -210 0 -210 Q104 -210 104 -150 V0Z'), '#241728', '#140c18', 8, 0) + lt('M-96 -4 V-150 Q-96 -200 0 -202', 3, 0.12) +
    // chenets, bûches, braises
    ln('M-80 0 V-50 M80 0 V-50', 7) + `<circle cx="-80" cy="-56" r="8" fill="#b08a2e" stroke="${OUT}" stroke-width="2.5"/><circle cx="80" cy="-56" r="8" fill="#b08a2e" stroke="${OUT}" stroke-width="2.5"/>` +
    `<g transform="rotate(-8 0 -16)">${cel(R(-70, -30, 140, 24, 12), '#6a4433', '#3a2418', 4, 4)}</g><g transform="rotate(10 0 -34)">${cel(R(-56, -48, 112, 22, 11), '#7a5236', '#4e3024', 4, 4)}</g>` + `<ellipse cx="-58" cy="-14" rx="8" ry="10" fill="#c98a3e" stroke="${OUT}" stroke-width="2"/>` +
    plain(P('M-70 -10 Q-92 -80 -50 -110 Q-44 -70 -24 -94 Q-30 -150 6 -182 Q4 -120 34 -110 Q30 -140 52 -150 Q90 -80 70 -10Z'), '#f58a1f', THIN) +
    plain(P('M-46 -10 Q-58 -60 -28 -78 Q-22 -50 -6 -108 Q22 -70 16 -50 Q30 -70 40 -64 Q54 -40 44 -10Z'), '#f6b01f') + plain(P('M-22 -10 Q-30 -40 -12 -54 Q-8 -30 4 -64 Q22 -40 20 -10Z'), '#fff3a8') +
    [[-40, -150], [30, -170], [10, -196], [-16, -178]].map(([sx, sy]) => `<circle cx="${sx}" cy="${sy}" r="3" fill="#fff3a8"/>`).join('') +
    cel(R(-174, -306, 348, 30, 6), '#8d86a8', '#6b6485', 6, 4) + flat(R(-162, -278, 324, 12, 3), '#7f7890') + dk('M-150 -290 H150', 2, 0.3) + flat(P('M-150 -150 q14 -10 20 -40 v-76 h-20z'), '#8d86a8') + flat(P('M150 -150 q-14 -10 -20 -40 v-76 h20z'), '#8d86a8') +
    (o.clock ? clock(0, -362, 44, o.clock[0], o.clock[1]) + flat(R(-50, -318, 100, 14, 3), '#7d5f17') + prop('candle', -120, -330, 1.1) + thin(P('M96 -306 q-8 -30 6 -50 h16 q14 20 6 50z'), '#5e8fb0') + ln('M110 -356 q-12 -30 -2 -44 M112 -356 q10 -24 20 -30', 3, '#4f7a3a')
      : prop('candle', -130, -330, 1.1) + prop('candle', -100, -324, 0.85) + wallFrame(40, -344, 1.05) + thin(P('M96 -306 q-8 -30 6 -50 h16 q14 20 6 50z'), '#5e8fb0') + ln('M110 -356 q-12 -30 -2 -44 M112 -356 q10 -24 20 -30', 3, '#4f7a3a') + `<circle cx="106" cy="-402" r="7" fill="#c8343f" stroke="${OUT}" stroke-width="2"/><circle cx="132" cy="-388" r="6" fill="#e58a8a" stroke="${OUT}" stroke-width="2"/>`) +
    // serviteur de cheminée
    ln('M186 0 V-110 M176 0 H196', 5) + ln('M186 -110 q-10 -12 0 -20 q10 8 0 20', 4);
  return G(x, y, 1, i);
}

// L'entrée : porte fermée à clé, miroir.
export function hall(o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="#8d7ca6"/>` + stripes('#84729e') + wainscot(510, 90, '#6f5d8a', '#7a6896') + floorBoards(600, '#6d4a36', '#5a3b2a') + cornice('#5a4a78') + runner(690, 70) + cobweb(0, 42, 0.9);
  const dx = o.doorX || 900;
  s += cel(R(dx - 116, 150, 232, 454, 6), '#4e3024', '#3a2418', 6, 0) +
    // imposte en vitrail
    flat(P(`M${dx - 96} 190 Q${dx} 120 ${dx + 96} 190Z`), '#2a2360') + clip(P(`M${dx - 96} 190 Q${dx} 120 ${dx + 96} 190Z`), `<path d="M${dx - 96} 190 L${dx - 40} 130 L${dx} 190Z" fill="#7a5a9a"/><path d="M${dx} 190 L${dx - 40} 130 L${dx + 40} 130Z" fill="#b08a2e" opacity=".8"/><path d="M${dx} 190 L${dx + 40} 130 L${dx + 96} 190Z" fill="#5e8fb0"/>`) + ln(`M${dx} 190 V150 M${dx - 50} 190 L${dx - 30} 158 M${dx + 50} 190 L${dx + 30} 158`, 3) +
    cel(R(dx - 96, 192, 192, 410, 4), '#7a5236', '#5f3f28', 10, 0) + dk(`M${dx - 60} 200 q8 190 -4 396 M${dx + 30} 200 q-10 200 6 396`, 2, 0.14) +
    cel(R(dx - 70, 222, 140, 150, 4), '#6a4433', '#4e3024', 5, 4) + cel(R(dx - 70, 400, 140, 170, 4), '#6a4433', '#4e3024', 5, 4) + flat(R(dx - 54, 238, 108, 118, 3), '#74492f') + flat(R(dx - 54, 416, 108, 138, 3), '#74492f') +
    // heurtoir, fente à courrier, verrou, chaîne
    flat(R(dx - 30, 378, 60, 14, 4), '#b08a2e') + `<circle cx="${dx}" cy="290" r="16" fill="none" stroke="${OUT}" stroke-width="9"/><circle cx="${dx}" cy="290" r="16" fill="none" stroke="#f2c230" stroke-width="4.5"/><circle cx="${dx}" cy="272" r="7" fill="#f2c230" stroke="${OUT}" stroke-width="2.5"/>` +
    flat(R(dx - 88, 370, 34, 70, 6), '#b08a2e') + `<circle cx="${dx - 71}" cy="392" r="12" fill="#f2c230" ${THIN}/><circle cx="${dx - 74}" cy="389" r="3.5" fill="#fff3a8"/><circle cx="${dx - 71}" cy="422" r="5" fill="${OUT}"/><rect x="${dx - 73}" y="422" width="4" height="12" fill="${OUT}"/>` +
    flat(R(dx + 60, 330, 26, 12, 3), '#8d98a3') + ln(`M${dx + 84} 336 q20 14 34 -4`, 3, '#c9d2de') + flat(R(dx - 86, 220, 14, 30, 3), '#8d98a3') + flat(R(dx - 86, 520, 14, 30, 3), '#8d98a3') +
    // paillasson, porte-parapluies
    thin(P(`M${dx - 90} 612 H${dx + 90} L${dx + 104} 640 H${dx - 104}Z`), '#8a6a3a') + dk(`M${dx - 70} 620 H${dx + 70} M${dx - 78} 630 H${dx + 78}`, 2, 0.3) +
    cel(P(`M${dx + 150} 520 h60 l-8 100 h-44z`), '#3d6b6b', '#2a4a4a', 5, 3) + ln(`M${dx + 170} 524 L${dx + 160} 400 q-2 -16 12 -16`, 5) + ln(`M${dx + 190} 524 L${dx + 200} 420`, 5, '#7a1f3a');
  if (o.mirror) {
    const [mx, my, mr] = o.mirror;
    s += `<ellipse cx="${mx + 14}" cy="${my + 16}" rx="${mr * 0.8 + 22}" ry="${mr + 22}" fill="#000" opacity=".18"/>` + cel(E(mx, my, mr * 0.8 + 22, mr + 22), '#b08a2e', '#7d5f17', 6, 4) +
      Array.from({ length: 20 }, (_, k) => { const a = (k / 20) * Math.PI * 2; return `<circle cx="${f1(mx + Math.cos(a) * (mr * 0.8 + 11))}" cy="${f1(my + Math.sin(a) * (mr + 11))}" r="5" fill="#f2c230" stroke="${OUT}" stroke-width="1.5"/>`; }).join('') +
      flat(P(`M${mx - 36} ${my - mr - 20} Q${mx} ${my - mr - 70} ${mx + 36} ${my - mr - 20}Z`), '#b08a2e') + `<circle cx="${mx}" cy="${my - mr - 34}" r="9" fill="#c8343f" stroke="${OUT}" stroke-width="2.5"/>` + flat(E(mx, my, mr * 0.8, mr), '#bcd3e0') +
      clip(E(mx, my, mr * 0.8 - 3, mr - 3), (o.mirrorInner || '') + `<path d="M${mx - mr} ${my - mr * 0.2} l${mr * 0.9} ${-mr * 0.9} l${mr * 0.3} 0 l${-mr * 0.9} ${mr * 0.9}z" fill="#fff" opacity=".3"/><path d="M${mx - mr * 0.5} ${my + mr * 0.5} l${mr * 0.9} ${-mr * 0.9} l${mr * 0.1} 0 l${-mr * 0.9} ${mr * 0.9}z" fill="#fff" opacity=".2"/>`);
  } else {
    for (const [x, y, sc] of [[130, 220, 1.4], [290, 320, 1.2], [450, 200, 1.5], [610, 310, 1.2]]) s += wallFrame(x, y, sc);
    // portemanteau : chapeau, manteau, écharpe
    s += ln('M690 600 V250 M660 600 H720', 9) + ln('M690 600 V250 M660 600 H720', 4, '#6a4433') + ln('M690 290 l-34 -24 M690 290 l34 -24 M690 330 l-30 -16 M690 330 l30 -16', 6) + `<circle cx="690" cy="244" r="9" fill="#8a5f40" stroke="${OUT}" stroke-width="3"/>` +
      cel(P('M640 262 q16 -34 34 0 q10 4 16 10 h-66 q6 -6 16 -10z'), '#3a3350', '#221a38', 4, 3) + cel(P('M704 282 q30 -6 40 20 l8 190 h-52z'), '#5a6b4e', '#3e4c36', 6, 0) + dk('M724 310 v170 M712 360 h30', 2) + ln('M664 316 q-8 80 4 150', 12, OUT) + ln('M664 316 q-8 80 4 150', 7, '#c8343f');
    s += sconce(560, 420, 0.75);
  }
  return s;
}

export function kitchen(o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="#b9d1c6"/><rect width="${W}" height="330" fill="url(#wp)"/><rect y="330" width="${W}" height="150" fill="#e4eee8"/>`;
  for (let x = 0; x < W; x += 50) s += `<rect x="${x}" y="330" width="3" height="150" fill="#b9d1c6"/>`;
  for (let k = 0; k < 24; k++) if (k % 3 === 1) s += `<path d="M${k * 50 + 26} ${350 + (k % 2) * 50} l10 14 l-10 14 l-10 -14z" fill="#7fa394" opacity=".7"/>`;
  s += `<rect y="380" width="${W}" height="3" fill="#b9d1c6"/><rect y="430" width="${W}" height="3" fill="#b9d1c6"/><rect y="327" width="${W}" height="5" fill="${OUT}"/>`;
  // sol en damier
  s += `<rect y="650" width="${W}" height="150" fill="#e9e2cf"/>`;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 16; c++) if ((r + c) % 2) s += `<rect x="${c * 80 - 20}" y="${650 + r * 50}" width="80" height="50" fill="#b9a98a"/>`;
  s += `<rect y="647" width="${W}" height="6" fill="${OUT}"/>` + cornice('#7fa394') +
    cel(R(-10, 500, 950, 152, 0), '#7fa394', '#5f8374', 0, -8) + plain(R(-10, 632, 950, 20), '#4e6b5f') +
    [90, 300, 510, 720].map((x, k) => cel(R(x, 522, 180, 100, 6), '#8fb3a4', '#6f9384', 5, 4) + flat(R(x + 16, 536, 148, 72, 4), '#9cc0b1') + `<circle cx="${x + (k % 2 ? 24 : 156)}" cy="572" r="7" fill="#f2c230" ${THIN}/>`).join('') +
    cel(R(-10, 470, 960, 32, 4), '#eadcb4', '#c9b78b', 0, -8) + dk('M0 486 H940', 1.6, 0.2) +
    // fenêtre à rideaux
    flat(R(110, 110, 260, 180, 6), '#4e3024') + plain(R(124, 124, 232, 152), '#2a2360') + clip(R(124, 124, 232, 152), moon(300, 180, 26) + tree(170, 290, 0.5) + `<circle cx="210" cy="150" r="2" fill="#fff3a8"/><circle cx="340" cy="230" r="2" fill="#fff3a8"/><circle cx="250" cy="250" r="1.6" fill="#fff3a8"/>`) + ln('M240 124 V276 M124 200 H356', 5) +
    cel(P('M104 100 H200 Q190 190 120 240 H104Z'), '#f4efe6', '#d5cdb8', 5, 3) + cel(P('M376 100 H280 Q290 190 360 240 H376Z'), '#f4efe6', '#d5cdb8', 5, 3) + [[130, 140], [150, 180], [120, 200], [350, 140], [330, 180], [360, 200]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#c8343f" opacity=".6"/>`).join('') + flat(R(96, 92, 288, 14, 5), '#8a5f40') + cel(R(100, 290, 280, 16, 4), '#eadcb4', '#c9b78b', 4, 3) + plant(150, 292, 0.32) +
    // étagère garnie, ustensiles suspendus, horloge
    flat(R(470, 150, 330, 16, 4), '#8a5f40') + flat(P('M490 166 l10 30 h-10z M780 166 l-10 30 h10z'), '#6a4433') + prop('jar', 520, 126, 1.2) + thin(R(570, 108, 40, 42, 6), '#f58a1f') + thin(R(572, 100, 36, 10, 3), '#6a4433') + thin(R(626, 96, 34, 54, 6), '#8fd3ff') + thin(E(700, 140, 30, 12), '#fbf7ee') + thin(E(700, 132, 30, 12), '#fbf7ee') + thin(P('M750 150 q-4 -40 16 -40 q20 0 16 40z'), '#c8343f') +
    ln('M470 240 H800', 5) + [500, 560, 620, 680, 740].map((ux, k) => ln(`M${ux} 240 v14`, 3) + (k === 0 ? thin(E(ux, 290, 22, 28), '#c9d2de') + ln(`M${ux} 254 v10`, 5) : k === 1 ? thin(P(`M${ux - 4} 254 h8 v36 q10 8 10 24 h-28 q0 -16 10 -24z`), '#8a5f40') : k === 2 ? thin(R(ux - 14, 262, 28, 44, 4), '#c9d2de') + dk(`M${ux - 6} 270 v28 M${ux} 270 v28 M${ux + 6} 270 v28`, 2, 0.5) + ln(`M${ux} 254 v10`, 5) : k === 3 ? thin(P(`M${ux} 254 q-18 20 -14 44 q14 16 28 0 q4 -24 -14 -44z`), '#f8f3e6') + prop('garlic', ux, 310, 0.6) + prop('garlic', ux - 10, 292, 0.5) + prop('garlic', ux + 10, 290, 0.5) : thin(P(`M${ux - 3} 254 h6 v50 h-6z`), '#8a5f40') + thin(E(ux, 312, 12, 16), '#c9d2de'))).join('') +
    clock(880, 110, 40, 11, 52) +
    // évier, bouilloire, corbeille de fruits, planche
    cel(R(40, 452, 160, 24, 6), '#c9d2de', '#8d98a3', 5, 3) + ln('M120 452 V410 q0 -18 22 -18 v12', 9) + ln('M120 452 V410 q0 -18 22 -18 v12', 4.5, '#c9d2de') +
    cel(P('M830 470 q-6 -50 26 -52 q32 2 26 52z'), '#c8343f', '#96202b', 5, 4) + ln('M880 440 q20 -6 22 -22', 7) + ln('M880 440 q20 -6 22 -22', 3.5, '#c8343f') + ln('M838 420 q18 -30 38 0', 5) + `<circle cx="856" cy="414" r="5" fill="#14101f"/>` +
    thin(P('M246 470 q4 -22 44 -22 q40 0 44 22z'), '#8a5f40') + `<circle cx="270" cy="446" r="13" fill="#e0425a" stroke="${OUT}" stroke-width="2.5"/><circle cx="296" cy="440" r="13" fill="#f58a1f" stroke="${OUT}" stroke-width="2.5"/><circle cx="318" cy="448" r="11" fill="#9be564" stroke="${OUT}" stroke-width="2.5"/>`;
  if (o.fridge !== false) s += `<ellipse cx="1065" cy="656" rx="130" ry="10" fill="#000" opacity=".2"/>` + cel(R(960, 150, 210, 500, 14), '#eef3f5', '#c5d0d9', 12, 0) + ln('M960 330 H1170', 5) + cel(R(980, 220, 14, 80, 6), '#8d98a3', '#6b757f', 3, 3) + cel(R(980, 360, 14, 120, 6), '#8d98a3', '#6b757f', 3, 3) +
    // aimants, dessin, liste de courses
    `<g transform="rotate(-4 1090 240)">${thin(R(1060, 196, 64, 82, 2), '#fbf7ee')}${pumpkin(1092, 262, 0.3)}<circle cx="1092" cy="200" r="6" fill="#c8343f" stroke="${OUT}" stroke-width="2"/></g>` +
    `<g transform="rotate(5 1100 420)">${thin(R(1070, 380, 56, 76, 2), '#fbf3c8')}${dk('M1078 396 h40 M1078 408 h40 M1078 420 h30 M1078 432 h36', 2, 0.4)}<circle cx="1098" cy="382" r="6" fill="#2f4f9a" stroke="${OUT}" stroke-width="2"/></g>` +
    `<circle cx="1036" cy="250" r="8" fill="#f58a1f" stroke="${OUT}" stroke-width="2"/><path d="M1030 520 l8 -14 l8 14 l-8 6z" fill="#9be564" stroke="${OUT}" stroke-width="2"/>` + flat(R(968, 640, 194, 12, 3), '#8d98a3') + cel(R(990, 110, 150, 44, 6), '#c98a3e', '#9a6426', 5, 3) + thin(R(1010, 84, 60, 28, 4), '#f4efe6');
  return s;
}

export function stairs() {
  let s = `<rect width="${W}" height="${H}" fill="#4a3f7d"/>` + stripes('#443873', 0, W, 0, H) + cornice('#2a2148') + cobweb(0, 42, 1.1) + sconce(600, 170, 0.9) + sconce(300, 440, 0.7);
  for (const [x, y, sc] of [[120, 150, 1.3], [270, 250, 1.1], [150, 380, 1.2], [420, 130, 1.2], [470, 300, 1], [60, 270, 0.9]]) s += wallFrame(x, y, sc);
  for (let i = 0; i < 9; i++) {
    const x = 60 + i * 120, y = 720 - i * 72;
    s += cel(R(x, y, W, 800, 0), i % 2 ? '#7a5236' : '#84593c', '#5f3f28', 0, -10) + `<rect x="${x}" y="${y}" width="${W}" height="14" fill="#a3764f"/><rect x="${x}" y="${y + 14}" width="${W}" height="4" fill="#000" opacity=".25"/>` +
      // tapis d'escalier
      `<rect x="${x}" y="${y}" width="120" height="14" fill="#a54d55"/><rect x="${x}" y="${y + 14}" width="120" height="58" fill="#8f3b46"/><path d="M${x + 30} ${y + 42} l14 -12 l14 12 l-14 12z M${x + 78} ${y + 42} l14 -12 l14 12 l-14 12z" fill="#e8d9a0" opacity=".7"/><rect x="${x}" y="${y + 12}" width="120" height="4" fill="#f2c230"/>` + ln(`M${x} ${y} H${W}`, 5) + ln(`M${x} ${y} V${y + 72}`, 4);
  }
  // rampe et balustres
  for (let i = 0; i < 14; i++) { const bx = 40 + i * 86, by = 596 - i * 51.6; s += cel(P(`M${bx - 7} ${by} h14 l-3 30 q8 20 0 40 l3 40 h-14 l3 -40 q-8 -20 0 -40z`), '#6a4433', '#4e3024', 3, 0); }
  s += `<path d="M0 620 L1200 -100" stroke="${OUT}" stroke-width="29" stroke-linecap="round"/><path d="M0 620 L1200 -100" stroke="#6a4433" stroke-width="19" stroke-linecap="round"/><path d="M0 614 L1200 -106" stroke="#fff" stroke-opacity=".18" stroke-width="5"/>` +
    cel(R(-30, 600, 60, 200, 6), '#6a4433', '#4e3024', 6, 0) + `<circle cx="10" cy="588" r="26" fill="#8a5f40" stroke="${OUT}" stroke-width="5"/><circle cx="2" cy="580" r="7" fill="#fff" opacity=".3"/>`;
  return s;
}

// Le couloir de l'étage : trois portes à gauche, fenêtre au fond.
export function corridor(o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="#4a3f7d"/>` + stripes('#443873') + wainscot(520, 100, '#3b3168', '#443a74') + floorBoards(620, '#3a2c52', '#2f2344') + cornice('#2a2148') + runner(680, 80, '#7a2f3a') + cobweb(0, 42, 1) +
    `<path d="M1040 470 L1160 470 L1200 800 L700 800Z" fill="#f6dc7a" opacity=".16"/><path d="M1070 470 L1140 470 L1200 800 L860 800Z" fill="#f6dc7a" opacity=".1"/>` +
    flat(R(1034, 194, 136, 282, 6), '#2a2148') + plain(R(1052, 212, 100, 246), '#f1dc94') + clip(R(1052, 212, 100, 246), `<circle cx="1102" cy="300" r="60" fill="#fff8d0" opacity=".7"/>` + tree(1140, 470, 0.5, '#8a7a4a')) + ln('M1102 212 V458 M1052 294 H1152 M1052 376 H1152', 5) +
    cel(P('M1030 184 H1076 Q1070 330 1040 480 H1030Z'), '#6a2a48', '#4b1c34', 5, 0) + cel(P('M1174 184 H1128 Q1134 330 1164 480 H1174Z'), '#6a2a48', '#4b1c34', 5, 0) + flat(R(1020, 176, 164, 14, 5), '#b08a2e') + flat(R(1040, 470, 124, 14, 3), '#3b3168');
  [150, 440, 730].forEach((x, i) => {
    const ajar = o.ajar && i === 2;
    s += cel(R(x - 18, 196, 236, 428, 6), '#2a2148', '#1a1438', 5, 0) + (ajar ? plain(R(x, 220, 200, 400), '#14101f') + cel(P(`M${x + 40} 228 L${x + 200} 220 L${x + 200} 620 L${x + 40} 612Z`), '#6a4a66', '#4d3350', 10, 0)
      : cel(R(x, 220, 200, 400, 4), '#6a4a66', '#4d3350', 10, 0) + cel(R(x + 28, 250, 144, 140, 4), '#5d4059', '#4d3350', 5, 4) + cel(R(x + 28, 420, 144, 170, 4), '#5d4059', '#4d3350', 5, 4) + flat(R(x + 44, 266, 112, 108, 3), '#684a64') + flat(R(x + 44, 436, 112, 138, 3), '#684a64') + dk(`M${x + 14} 230 q6 190 -2 380`, 2, 0.16)) +
      flat(R(x + 162, 386, 28, 60, 5), '#b08a2e') + `<circle cx="${x + 176}" cy="404" r="11" fill="#f2c230" ${THIN}/><circle cx="${x + 173}" cy="401" r="3" fill="#fff3a8"/><circle cx="${x + 176}" cy="430" r="4" fill="${OUT}"/>` +
      flat(R(x + 6, 240, 12, 26, 3), '#8d98a3') + flat(R(x + 6, 560, 12, 26, 3), '#8d98a3') + `<rect x="${x}" y="606" width="200" height="14" fill="#f6dc7a" opacity="${i === 2 ? 0.25 : 0}"/>`;
    if (i < 2) s += sconce(x + 268, 340, 0.7) + wallFrame(x + 268, 460, 0.9);
  });
  s += sconce(984, 340, 0.7) + table(988, 620, 0.8, { w: 44, h: 110 }) + thin(P('M972 516 q-6 -26 6 -40 h20 q12 14 6 40z'), '#5e8fb0') + ln('M988 476 q-14 -34 -4 -52 M990 476 q14 -26 22 -30 M988 476 q0 -30 4 -44', 3, '#3e6b3a');
  return s;
}

// La chambre d'Henri. lit: lumière allumée (photos visibles) ; door: 'closed' | 'open'.
export function bedroom(o = {}) {
  const lit = o.lit;
  let s = `<rect width="${W}" height="${H}" fill="${lit ? '#c9b087' : '#463b7c'}"/>` + stripes(lit ? '#bfa57a' : '#403572') + wainscot(520, 100, lit ? '#a88d63' : '#383068', lit ? '#b39970' : '#403572') +
    floorBoards(620, lit ? '#8a5f40' : '#33284f', lit ? '#74502f' : '#2a2042') + cornice(lit ? '#7a5a3a' : '#2a2148') + cobweb(0, 42, 1) + cobweb(W, 42, 0.8, -1) +
    rug(600, 742, 360, 46, lit ? '#3d6b6b' : '#2f4a5a', lit ? '#4f8585' : '#3a5a6c', lit ? '#e8d9a0' : '#8f8ab0');
  const wx = o.winX ?? 330;
  if (o.window !== false) {
    const cur = lit ? '#8a3442' : '#6a2a48', curS = lit ? '#64222f' : '#4b1c34';
    s += flat(R(wx - 14, 136, 308, 348, 6), '#4e3024') + clip(R(wx, 150, 280, 320), `<rect x="${wx}" y="150" width="280" height="320" fill="#2a2360"/><rect x="${wx}" y="150" width="280" height="110" fill="#231c55"/>` +
      [[30, 180], [110, 170], [200, 200], [250, 165], [160, 230], [60, 240]].map(([sx, sy]) => `<circle cx="${wx + sx}" cy="${sy}" r="2" fill="#fff3a8"/>`).join('') + moon(wx + 210, 212, 26) +
      // toits d'en face
      plain(P(`M${wx} 400 l40 -40 l40 40 v-20 h30 v-30 l50 -44 l50 44 v40 h30 l30 -30 l30 30 V470 H${wx}Z`), '#1a1438') + `<rect x="${wx + 130}" y="380" width="14" height="18" fill="#f6dc7a"/><rect x="${wx + 176}" y="380" width="14" height="18" fill="#f58a1f"/><rect x="${wx + 34}" y="420" width="12" height="16" fill="#f6dc7a"/><rect x="${wx}" y="440" width="280" height="30" fill="#231c50"/>` +
      `<circle cx="${wx + 70}" cy="330" r="46" fill="#f6dc7a" opacity=".25"/><circle cx="${wx + 70}" cy="330" r="16" fill="#f6dc7a"/><rect x="${wx + 66}" y="340" width="8" height="130" fill="${OUT}"/><rect x="${wx + 58}" y="338" width="24" height="6" fill="${OUT}"/>` + bat(wx + 120, 196, 0.4) + (o.winInner || '') +
      lt(`M${wx + 20} 300 l70 -90 M${wx + 40} 330 l40 -52`, 5, 0.1)) +
      ln(`M${wx + 140} 150 V470 M${wx} 310 H${wx + 280} M${wx + 70} 150 V310 M${wx + 210} 150 V310`, 6) + cel(R(wx - 24, 470, 328, 18, 4), '#6a4433', '#4e3024', 4, 3) +
      cel(P(`M${wx - 30} 126 H${wx + 46} Q${wx + 36} 300 ${wx + 4} 360 Q${wx + 0} 440 ${wx - 6} 500 H${wx - 44}Z`), cur, curS, 7, 0) + dk(`M${wx - 14} 140 Q${wx - 20} 320 ${wx - 28} 490 M${wx + 6} 140 Q${wx + 2} 300 ${wx - 12} 490 M${wx + 26} 140 Q${wx + 22} 260 ${wx + 2} 360`, 2.5, 0.3) +
      cel(P(`M${wx + 310} 126 H${wx + 234} Q${wx + 244} 300 ${wx + 276} 360 Q${wx + 280} 440 ${wx + 286} 500 H${wx + 324}Z`), cur, curS, 7, 0) + dk(`M${wx + 294} 140 Q${wx + 300} 320 ${wx + 308} 490 M${wx + 274} 140 Q${wx + 278} 300 ${wx + 292} 490 M${wx + 254} 140 Q${wx + 258} 260 ${wx + 278} 360`, 2.5, 0.3) +
      ln(`M${wx - 8} 360 q14 10 22 -4 M${wx + 288} 360 q-14 10 -22 -4`, 6, '#f2c230') + `<circle cx="${wx + 16}" cy="368" r="6" fill="#f2c230" stroke="${OUT}" stroke-width="2"/><circle cx="${wx + 264}" cy="368" r="6" fill="#f2c230" stroke="${OUT}" stroke-width="2"/>` +
      // cantonnière à franges
      cel(P(`M${wx - 44} 112 H${wx + 324} V150 q-23 22 -46 0 q-23 22 -46 0 q-23 22 -46 0 q-23 22 -46 0 q-23 22 -46 0 q-23 22 -46 0 q-23 22 -46 0 q-23 22 -46 0Z`), cur, curS, 6, 4) + flat(R(wx - 50, 106, 380, 14, 6), '#b08a2e') + `<circle cx="${wx - 50}" cy="113" r="10" fill="#f2c230" stroke="${OUT}" stroke-width="3"/><circle cx="${wx + 330}" cy="113" r="10" fill="#f2c230" stroke="${OUT}" stroke-width="3"/>`;
    if (!lit) s += `<path d="M${wx} 488 L${wx + 280} 488 L${wx + 440} 800 L${wx - 160} 800Z" fill="#f6dc7a" opacity=".13"/><path d="M${wx + 136} 488 h8 l24 312 h-56z" fill="#150f2b" opacity=".25"/><path d="M${wx - 70} 640 H${wx + 356} l6 14 H${wx - 78}z" fill="#150f2b" opacity=".2"/>`;
  }
  if (o.photos) for (const [x, y, sc] of [[70, 170, 1.2], [170, 280, 1.4], [70, 400, 1.1], [200, 150, 1], [730, 160, 1.3], [840, 280, 1.1], [730, 380, 1.4], [880, 150, 1], [860, 420, 1], [1160, 300, 1], [660, 280, 0.9], [270, 420, 0.9], [940, 300, 0.8], [1160, 150, 0.9], [1164, 440, 0.9]]) s += wallFrame(x, y, sc);
  else if (o.window !== false && o.sconce !== false) s += sconce(wx + 400, 330, 0.75) + (wx > 240 ? wallFrame(wx - 110, 300, 1.2) + wallFrame(wx - 190, 400, 0.9) : '');
  if (lit) s += ln('M700 44 V84', 4) + `<path d="M620 130 L780 130 L900 420 L500 420Z" fill="#fff8d0" opacity=".1"/>` + cel(P('M650 132 Q650 84 700 84 Q750 84 750 132Z'), '#f4efe6', '#d5cdb8', 6, 4) + plain(E(700, 134, 44, 8), '#fff8d0', THIN) + `<g fill="#fff" opacity=".5"><circle cx="560" cy="250" r="2.5"/><circle cx="640" cy="330" r="2"/><circle cx="800" cy="240" r="2"/><circle cx="760" cy="380" r="2.5"/><circle cx="520" cy="400" r="2"/></g>`;
  if (o.door) {
    const dx = 1050, w1 = lit ? '#7a5236' : '#6a4a66', w2 = lit ? '#5f3f28' : '#4d3350', w3 = lit ? '#6a4433' : '#5d4059';
    s += cel(R(dx - 100, 184, 200, 440, 6), lit ? '#4e3024' : '#2a2148', lit ? '#3a2418' : '#1a1438', 5, 0);
    if (o.door === 'open') s += plain(R(dx - 82, 204, 164, 416), '#f1dc94') + `<path d="M${dx - 82} 620 H${dx + 40} L${dx - 60} 800 H${dx - 300}Z" fill="#f1dc94" opacity=".2"/>` + clip(R(dx - 82, 204, 164, 416), `<rect x="${dx - 82}" y="540" width="164" height="80" fill="#d9b86a"/>` + wallFrame(dx - 30, 330, 1.1) + dk(`M${dx - 82} 540 h164`, 3, 0.4)) +
      cel(P(`M${dx + 40} 196 L${dx + 82} 204 L${dx + 82} 620 L${dx + 40} 632Z`), '#7a5236', '#5f3f28', 5, 0) + `<circle cx="${dx + 50}" cy="412" r="8" fill="#f2c230" ${THIN}/>`;
    else s += cel(R(dx - 82, 204, 164, 416, 4), w1, w2, 10, 0) + cel(R(dx - 58, 232, 116, 140, 4), w3, w2, 5, 4) + cel(R(dx - 58, 400, 116, 180, 4), w3, w2, 5, 4) + flat(R(dx - 44, 246, 88, 112, 3), w1) + flat(R(dx - 44, 414, 88, 152, 3), w1) +
      flat(R(dx - 76, 372, 28, 62, 5), '#b08a2e') + `<circle cx="${dx - 62}" cy="392" r="11" fill="#f2c230" ${THIN}/><circle cx="${dx - 65}" cy="389" r="3" fill="#fff3a8"/><circle cx="${dx - 62}" cy="418" r="4" fill="${OUT}"/><rect x="${dx - 64}" y="418" width="4" height="10" fill="${OUT}"/>` + flat(R(dx + 66, 224, 12, 26, 3), '#8d98a3') + flat(R(dx + 66, 560, 12, 26, 3), '#8d98a3');
  }
  return s;
}

// Perron : porte d'entrée ouverte sur l'intérieur éclairé.
export function porch() {
  let s = `<rect width="${W}" height="${H}" fill="#6456a0"/>`;
  for (let y = 40; y < 660; y += 40) s += `<rect y="${y}" width="${W}" height="4" fill="#554890"/><rect y="${y + 4}" width="${W}" height="3" fill="#fff" opacity=".06"/>`;
  // fenêtre latérale à rideaux
  s += cel(R(960, 190, 200, 280, 6), '#3a2f63', '#2a2148', 5, 0) + plain(R(976, 206, 168, 248), '#f3cf80') + plain(P('M976 206 h70 q-10 120 -70 200z M1144 206 h-70 q10 120 70 200z'), '#e9a84a', THIN) + ln('M1060 206 V454 M976 330 H1144', 6) + cel(R(950, 468, 220, 18, 4), '#c9c2e6', '#9a92c0', 4, 3) + plant(1010, 468, 0.4) + pumpkin(1110, 468, 0.4) +
    cel(R(380, 70, 440, 600, 8), '#c9c2e6', '#9a92c0', 6, 0) + flat(R(404, 104, 392, 566, 4), '#3a2f63') + plain(R(416, 116, 368, 554), '#f3cf80') + plain(R(416, 116, 368, 554), '#f58a1f', 'opacity=".15"') +
    // intérieur : papier peint, cadres, console
    clip(R(416, 116, 368, 554), `<rect x="416" y="116" width="368" height="554" fill="url(#wp)"/><rect x="416" y="560" width="368" height="110" fill="#b5834a"/><rect x="416" y="556" width="368" height="5" fill="${OUT}"/>` + wallFrame(470, 240, 1.3) + wallFrame(730, 220, 1.1) + wallFrame(480, 400, 1) + sconce(720, 380, 0.7) + `<path d="M416 660 L784 660 L900 800 L300 800Z" fill="#f3cf80" opacity=".35"/>`) +
    cel(P('M784 116 L900 80 L900 700 L784 670Z'), '#7a5236', '#5f3f28', 6, 0) + flat(P('M800 150 L884 126 V360 L800 370Z'), '#6a4433') + flat(P('M800 400 L884 396 V660 L800 644Z'), '#6a4433') + `<circle cx="876" cy="386" r="11" fill="#f2c230" ${THIN}/><circle cx="842" cy="250" r="14" fill="none" stroke="#f2c230" stroke-width="5"/>` +
    flat(R(540, 78, 120, 30, 4), '#2a2148') + `<text x="600" y="101" font-family="'Open Sans',sans-serif" font-weight="700" font-size="22" fill="#f2c230" text-anchor="middle">13</text>` +
    `<path d="M300 664 L900 664 L1060 800 L140 800Z" fill="#f3cf80" opacity=".12"/>` +
    cel(R(300, 664, 600, 46, 4), '#a59fb3', '#7f7890', 0, -8) + dk('M420 664 v46 M600 664 v46 M780 664 v46', 2, 0.3) + cel(R(220, 708, 760, 50, 4), '#8d86a8', '#6b6485', 0, -8) + dk('M360 708 v50 M520 708 v50 M680 708 v50 M840 708 v50', 2, 0.3) +
    thin(P('M500 668 H700 L716 700 H484Z'), '#8a6a3a') + dk('M520 678 H680 M512 690 H688', 2, 0.3) +
    `<rect y="756" width="${W}" height="44" fill="#453c78"/><rect y="753" width="${W}" height="5" fill="${OUT}"/>` +
    // lanterne, toile, feuilles
    `<circle cx="207" cy="318" r="150" fill="#f6dc7a" opacity=".08"/><circle cx="207" cy="318" r="100" fill="#f6dc7a" opacity=".12"/>` + ln('M150 250 H207 V276', 7) + cel(P('M176 276 H238 L230 360 H184Z'), '#f6dc7a', '#e0b84a', 5, 4) + ln('M207 276 V360 M180 318 H234', 3) + flat(P('M170 276 L207 250 L244 276Z'), '#2a2148') + flat(R(180, 360, 54, 10, 3), '#2a2148') +
    cobweb(380, 70, 0.9) + plant(120, 756, 0.8) + leaves(9, 700, 790, 12);
  return s;
}

export function closeBG(c1, c2, r = 430) {
  let rays = '';
  for (let i = 0; i < 24; i += 2) { const a1 = (i / 24) * Math.PI * 2, a2 = ((i + 1) / 24) * Math.PI * 2; rays += `<path d="M600 420 L${f1(600 + Math.cos(a1) * 1200)} ${f1(420 + Math.sin(a1) * 1200)} L${f1(600 + Math.cos(a2) * 1200)} ${f1(420 + Math.sin(a2) * 1200)}Z" fill="#fff" opacity=".045"/>`; }
  return `<rect width="${W}" height="${H}" fill="${c1}"/>` + rays + `<circle cx="600" cy="420" r="${r * 1.12}" fill="${c2}" opacity=".5"/><circle cx="600" cy="420" r="${r}" fill="${c2}"/><circle cx="600" cy="420" r="${r}" fill="url(#dots)"/>` +
    [[110, 120], [1090, 100], [80, 640], [1120, 660], [200, 380], [1010, 400]].map(([x, y], k) => `<path d="M${x} ${y - 14} l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4z" fill="#fff" opacity="${k % 2 ? 0.35 : 0.55}"/>`).join('');
}
export const garlicCloud = (x, y, s = 1) => G(x, y, s, `<ellipse cx="6" cy="10" rx="112" ry="72" fill="#000" opacity=".15"/>` + cel(P('M-90 10 Q-120 -30 -70 -50 Q-60 -90 -10 -70 Q30 -100 60 -60 Q110 -60 100 -10 Q120 40 60 50 Q20 80 -20 50 Q-80 70 -90 10Z'), '#b7e07a', '#8fbf52') +
  dk('M-60 -30 q10 -10 20 0 M40 -40 q10 -8 18 2 M-50 30 q10 8 20 0 M50 20 q8 8 18 0', 3, 0.2) + ln('M-110 -70 q-10 -14 2 -24 M120 -50 q12 -10 4 -24 M-120 40 q-14 6 -12 20', 4, '#b7e07a') + prop('garlic', 0, 0, 1.4));

const DEFS = `<defs>` +
  `<pattern id="wp" width="80" height="110" patternUnits="userSpaceOnUse"><g fill="none" stroke="#000" stroke-opacity=".1" stroke-width="2.5" stroke-linecap="round"><path d="M40 8 Q58 30 40 55 Q22 30 40 8Z M40 55 Q52 70 40 86 Q28 70 40 55Z M40 86 V104 M28 98 Q40 88 52 98 M22 30 Q10 26 6 14 M58 30 Q70 26 74 14"/></g><g fill="#fff" fill-opacity=".08"><circle cx="0" cy="55" r="5"/><circle cx="80" cy="55" r="5"/><circle cx="0" cy="0" r="3"/><circle cx="80" cy="0" r="3"/><circle cx="0" cy="110" r="3"/><circle cx="80" cy="110" r="3"/><path d="M40 20 Q48 32 40 44 Q32 32 40 20Z"/></g></pattern>` +
  `<pattern id="grain" width="320" height="60" patternUnits="userSpaceOnUse"><g fill="none" stroke="#000" stroke-opacity=".13" stroke-width="2" stroke-linecap="round"><path d="M10 12 q60 -8 120 0 t120 2 M40 30 q50 6 100 0 M190 28 q50 -6 110 2 M20 48 q70 -6 140 0 M210 50 q40 4 90 -2"/><ellipse cx="170" cy="30" rx="12" ry="5"/><ellipse cx="170" cy="30" rx="5" ry="2"/></g><g fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="2"><path d="M60 20 q60 -6 110 0 M220 40 q40 -4 80 0"/></g></pattern>` +
  `<pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1.8" fill="#000" fill-opacity=".07"/><circle cx="12" cy="12" r="1.8" fill="#000" fill-opacity=".07"/></pattern>` +
  `<radialGradient id="vig" cx=".5" cy=".5" r=".75"><stop offset=".62" stop-color="#0b0718" stop-opacity="0"/><stop offset="1" stop-color="#0b0718" stop-opacity=".5"/></radialGradient></defs>`;
export const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${DEFS}${inner}<rect width="${W}" height="${H}" fill="url(#vig)"/></svg>\n`;
