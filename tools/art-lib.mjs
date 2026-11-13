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
    `<g clip-path="url(#${id})">${shape(`fill="${fill}" transform="translate(${-dx} ${-dy})"`)}</g>` +
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
  const a = 'fill="none" stroke-linecap="round" stroke-linejoin="round"';
  return `<polyline points="${p}" ${a} stroke="${OUT}" stroke-width="${w + 9}"/><polyline points="${p}" ${a} stroke="${color}" stroke-width="${w}"/>`;
}

// --- visages ---------------------------------------------------------------
function face(cx, cy, expr = 'neutral', { look = 0, fangs = 0, my = 26, sp = 19, browC = OUT } = {}) {
  const ey = cy, m = cy + my;
  const eye = (x, r, pr) => `<ellipse cx="${x}" cy="${ey}" rx="${r}" ry="${r * 1.15}" fill="#fff" stroke="${OUT}" stroke-width="3"/><circle cx="${x + look * r * 0.45}" cy="${ey + 1}" r="${pr}" fill="${OUT}"/>`;
  const eyes = (r, pr) => eye(cx - sp, r, pr) + eye(cx + sp, r, pr);
  const arcs = (k) => ln(`M${cx - sp - 9} ${ey} q9 ${k} 18 0`) + ln(`M${cx + sp - 9} ${ey} q9 ${k} 18 0`);
  const brows = (inn, out) => {
    let s = '';
    for (const sg of [-1, 1]) {
      const d = `M${cx + sg * (sp + 12)} ${ey - 20 + out} L${cx + sg * (sp - 10)} ${ey - 20 + inn}`;
      s += browC === OUT ? ln(d, 4.5) : ln(d, 11) + ln(d, 6, browC);
    }
    return s;
  };
  const openM = (w, h, f) => {
    let s = `<path d="M${cx - w} ${m} Q${cx} ${m + h * 2} ${cx + w} ${m} Z" fill="#7a1f2b" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>`;
    if (f) for (const sg of [-1, 1]) s += `<path d="M${cx + sg * w * 0.55 - 4} ${m + 1} l4 ${f} l4 ${-f} z" fill="#fff" stroke="${OUT}" stroke-width="1.5" stroke-linejoin="round"/>`;
    return s;
  };
  switch (expr) {
    case 'smile': return eyes(9, 4.5) + brows(-2, 0) + openM(17, 10, fangs);
    case 'happy': return arcs(-11) + brows(-4, -2) + openM(17, 11, fangs);
    case 'scared': return eyes(13, 3) + brows(-9, 3) +
      `<ellipse cx="${cx}" cy="${m + 6}" rx="13" ry="10" fill="#7a1f2b" stroke="${OUT}" stroke-width="3.5"/>` +
      `<path d="M${cx + 46} ${cy - 34} q9 16 0 22 q-9 -6 0 -22z" fill="#8fd3ff" stroke="${OUT}" stroke-width="2"/>`;
    case 'surprised': return eyes(12, 4) + brows(-9, -7) + `<ellipse cx="${cx}" cy="${m + 5}" rx="7" ry="9" fill="#7a1f2b" stroke="${OUT}" stroke-width="3.5"/>`;
    case 'sad': return eyes(9, 4.5) + brows(-9, 3) + ln(`M${cx - 11} ${m + 8} q11 -10 22 0`);
    case 'angry': return eyes(9, 4) + brows(9, -6) + `<path d="M${cx - 15} ${m + 10} q15 -15 30 0 z" fill="#fff" stroke="${OUT}" stroke-width="3.5" stroke-linejoin="round"/>`;
    case 'grin': return eyes(10, 3.5) + brows(7, -5) + openM(24, 13, fangs || 13);
    case 'dizzy': {
      let s = brows(-6, 2);
      for (const x of [cx - sp, cx + sp]) s += ln(`M${x - 8} ${ey - 8} l16 16 M${x + 8} ${ey - 8} l-16 16`);
      return s + ln(`M${cx - 14} ${m + 5} q4 -7 7 0 q4 7 7 0 q4 -7 7 0 q4 7 7 0`);
    }
    case 'disgust': return ln(`M${cx - sp - 8} ${ey - 7} l15 7 l-15 7`) + ln(`M${cx + sp + 8} ${ey - 7} l-15 7 l15 7`) + brows(7, -3) +
      ln(`M${cx - 14} ${m + 6} l7 -7 l7 7 l7 -7 l7 7`);
    case 'sleep': return arcs(9) + brows(0, 0) + ln(`M${cx - 6} ${m + 4} h12`);
    case 'worried': return eyes(10, 4) + brows(-9, 2) + ln(`M${cx - 11} ${m + 5} q5 -7 11 0 q6 7 11 0`);
    default: return eyes(9, 4.5) + brows(0, 0) + ln(`M${cx - 10} ${m} q10 8 20 0`);
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
        ? bust(-10, '#3b3a44') + bust(10, '#77727f', true) + plain(P('M-8 24 Q-10 2 0 2 Q10 2 8 24Z'), '#1b1230') + plain(E(0, -5, 6, 7), '#e6e1f2') + plain(P('M-6 -8 Q0 -16 6 -8 L0 -6Z'), '#1b1230')
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
  front: [[6, 48], [-28, 60]], reach: [[42, -2], [88, -10]], chin: [[16, 34], [-22, -18]],
};

function figure(x, y, s, o, cfg) {
  const drop = o.sit ? cfg.sitDrop : 0;
  let inner = o.float || o.noShadow ? '' : `<ellipse cx="0" cy="2" rx="${cfg.shadow}" ry="12" fill="#000" opacity=".25"/>`;
  inner += cfg.legs(drop);
  let up = cfg.body(o);
  const hands = {};
  let armSvg = '';
  for (const [side, sg] of [['L', -1], ['R', 1]]) {
    const pts = [[sg * cfg.sx, cfg.sy], ...POSES[o[side] || 'down'].map(([dx, dy]) => [sg * (cfg.sx + dx), cfg.sy + dy])];
    const h = pts[pts.length - 1];
    hands[side] = h;
    armSvg += limb(pts, cfg.sleeve) + `<circle cx="${h[0]}" cy="${h[1]}" r="12" fill="${cfg.skin}" ${ST}/>`;
    if (o.handDots === side) armSvg += `<circle cx="${h[0] - 4}" cy="${h[1] - 1}" r="2.6" fill="#5a0f1c"/><circle cx="${h[0] + 4}" cy="${h[1] - 1}" r="2.6" fill="#5a0f1c"/>`;
  }
  const carry = o.L === 'front' && o.R === 'front';
  if (o.item && carry) up += prop(o.item, 0, cfg.sy + 44, o.itemS || 1.3, o.itemO);
  up += cfg.head(o) + armSvg;
  if (o.item && !carry) { const h = hands[o.hand || 'R']; up += prop(o.item, h[0], h[1] - 16, o.itemS || 1, o.itemO); }
  inner += `<g transform="translate(0 ${drop})">${up}</g>`;
  return G(x, y - (o.float ? 22 : 0), s, inner, o.ghost ? `opacity="${o.ghost}"` : '');
}

// Le héros : costume de vampire (cape noire doublée de rouge, teint blafard, petites dents pointues).
export function hero(x, y, s = 1, o = {}) {
  return figure(x, y, s, o, {
    sx: 44, sy: -214, sleeve: '#2f2a4d', skin: '#e6e1f2', shadow: 100, sitDrop: 60,
    // La cape passe derrière les jambes pour qu'elles restent visibles.
    legs: (d) => `<g transform="translate(0 ${d * 0.5}) scale(1 ${1 - d / 480})">` +
      cel(P('M-58 -238 Q-124 -120 -108 -8 Q-72 -24 -54 -6 Q-27 -24 0 -6 Q27 -24 54 -6 Q72 -24 108 -8 Q124 -120 58 -238 Z'), '#33274f', '#221a38') +
      plain(P('M-44 -228 Q-78 -120 -66 -26 L66 -26 Q78 -120 44 -228 Z'), '#a3202f') + '</g>' +
      flat(R(-31, -112 + d, 27, 104 - d, 6), '#3d3766') + flat(R(4, -112 + d, 27, 104 - d, 6), '#3d3766') +
      flat(E(-22, -4, 22, 10), '#14101f') + flat(E(22, -4, 22, 10), '#14101f'),
    body: () =>
      flat(P('M-40 -238 L-82 -322 L-14 -262 Z'), '#c8343f') + flat(P('M40 -238 L82 -322 L14 -262 Z'), '#c8343f') +
      cel(R(-40, -234, 80, 132, 18), '#2f2a4d', '#211d38') +
      thin(P('M-16 -234 L0 -188 L16 -234 Z'), '#f3efe6') +
      thin(P('M0 -222 L-15 -231 L-15 -213 Z'), '#c8343f') + thin(P('M0 -222 L15 -231 L15 -213 Z'), '#c8343f'),
    head: (o) =>
      cel(E(0, -292, 54, 56), '#e6e1f2', '#bfb6d8') +
      flat(P('M-54 -298 Q-58 -358 0 -356 Q58 -358 54 -298 Q42 -334 15 -332 L0 -306 L-15 -332 Q-42 -334 -54 -298 Z'), '#1b1230') +
      (o.redNose ? `<ellipse cx="0" cy="-272" rx="9" ry="7" fill="#e0425a" stroke="${OUT}" stroke-width="2.5"/>` : '') +
      (o.dots ? `<circle cx="-34" cy="-250" r="3.2" fill="#5a0f1c"/><circle cx="-25" cy="-244" r="3.2" fill="#5a0f1c"/>` : '') +
      face(0, -288, o.expr, { look: o.look, fangs: 9 }),
  });
}

// Mme Morticia (Yvonne) : longue robe sombre, collier de perles, chignon blanc.
export function morticia(x, y, s = 1, o = {}) {
  return figure(x, y, s, o, {
    sx: 40, sy: -186, sleeve: '#4f3a6e', skin: '#f0c7a3', shadow: 90, sitDrop: 0,
    legs: () => '',
    body: (o) => {
      let b = cel(P('M-44 -204 Q-54 -100 -84 -4 L84 -4 Q54 -100 44 -204 Q0 -220 -44 -204 Z'), '#4f3a6e', '#382850') + ln('M-70 -22 Q0 -8 70 -22', 3, '#6d5690');
      for (let i = -3; i <= 3; i++) b += `<circle cx="${i * 10}" cy="${-190 - (9 - i * i) * -1.2 - 10}" r="5.5" fill="#fbf7ee" stroke="${OUT}" stroke-width="2"/>`;
      if (o.key) b += ln('M0 -188 V-166', 2.5, '#f2c230') + prop('key', 0, -150, 0.8);
      return b;
    },
    head: (o) =>
      flat(E(0, -318, 23, 21), '#f4f2ee') +
      cel(E(0, -252, 50, 50), '#f0c7a3', '#d6a17c') +
      cel(P('M-52 -252 Q-58 -310 0 -308 Q58 -310 52 -252 Q32 -290 0 -288 Q-32 -290 -52 -252Z'), '#f4f2ee', '#cfcbd6', 6, 4) +
      `<ellipse cx="-30" cy="-232" rx="9" ry="6" fill="#e58a8a" opacity=".6"/><ellipse cx="30" cy="-232" rx="9" ry="6" fill="#e58a8a" opacity=".6"/>` +
      face(0, -250, o.expr, { look: o.look, my: 24 }) +
      ln('M-40 -256 l-6 -3 M-40 -250 l-7 1 M40 -256 l6 -3 M40 -250 l7 1', 2, '#b07c58'),
  });
}

function henriHead(o = {}) {
  const sw = o.swollen;
  return (sw ? '' : flat(E(-42, -4, 17, 20), '#f4f2ee') + flat(E(42, -4, 17, 20), '#f4f2ee')) +
    cel(sw ? E(0, 0, 64, 62) : E(0, 0, 44, 58), sw ? '#ec8f7e' : '#ddd6c6', sw ? '#c9604f' : '#b5ac99') +
    (sw ? '' : ln('M-12 -52 q4 -10 10 -2 M4 -54 q6 -8 10 2', 3, '#f4f2ee')) +
    face(0, -6, o.expr, { look: o.look, my: 34, sp: 18, browC: '#f4f2ee', fangs: o.expr === 'grin' ? 13 : 0 }) +
    ln('M0 2 q-5 9 2 11', 3, '#8f8674') +
    thin(P('M-22 22 Q-11 10 0 18 Q11 10 22 22 Q11 27 0 23 Q-11 27 -22 22Z'), '#f4f2ee');
}

// Henri : vieil homme élégant d'un autre temps (veste brune, nœud papillon, moustache blanche).
export function henri(x, y, s = 1, o = {}) {
  return figure(x, y, s, o, {
    sx: 40, sy: -232, sleeve: '#74553f', skin: '#ddd6c6', shadow: 80, sitDrop: 62,
    legs: (d) => flat(R(-27, -132 + d, 23, 124 - d, 5), '#3d3a50') + flat(R(4, -132 + d, 23, 124 - d, 5), '#3d3a50') +
      flat(E(-20, -4, 20, 9), '#2a1c18') + flat(E(20, -4, 20, 9), '#2a1c18'),
    body: () =>
      cel(P('M-42 -252 Q-50 -170 -44 -118 L44 -118 Q50 -170 42 -252 Q0 -264 -42 -252Z'), '#74553f', '#573d2c') +
      thin(P('M-15 -256 L0 -176 L15 -256 Z'), '#f3efe6') + ln('M0 -236 V-180', 2) +
      thin(P('M0 -244 L-15 -254 L-15 -234 Z'), '#7a1f3a') + thin(P('M0 -244 L15 -254 L15 -234 Z'), '#7a1f3a'),
    head: (o) => `<g transform="translate(0 -314)">${henriHead(o)}</g>`,
  });
}

// Secouriste du SAMU.
export function medic(x, y, s = 1, o = {}) {
  return figure(x, y, s, o, {
    sx: 44, sy: -216, sleeve: '#eef2f5', skin: '#e8b48c', shadow: 85, sitDrop: 0,
    legs: () => flat(R(-30, -112, 25, 104, 6), '#2f4f9a') + flat(R(5, -112, 25, 104, 6), '#2f4f9a') + flat(E(-22, -4, 21, 9), '#14101f') + flat(E(22, -4, 21, 9), '#14101f'),
    body: () => cel(R(-42, -236, 84, 134, 18), '#eef2f5', '#c5d0d9') + plain(R(-42, -150, 84, 12), '#2f4f9a') + plain(R(-42, -128, 84, 8), '#c9d24a') +
      plain(P('M18 -214 h8 v8 h8 v8 h-8 v8 h-8 v-8 h-8 v-8 h8z'), '#2f4f9a'),
    head: (o) => cel(E(0, -290, 50, 52), '#e8b48c', '#c98e66') +
      flat(P('M-50 -296 Q-54 -350 0 -348 Q54 -350 50 -296 Q30 -322 0 -320 Q-30 -322 -50 -296Z'), '#5a3524') + face(0, -284, o.expr, { look: o.look }),
  });
}

// Minou, le chat noir au médaillon.
export function cat(x, y, s = 1, o = {}) {
  const c = '#4b4570', sh = '#322d52';
  const ear = (sg) => flat(P(`M${sg * 36} -120 L${sg * 30} -162 L${sg * 6} -134 Z`), c) + plain(P(`M${sg * 30} -128 L${sg * 28} -148 L${sg * 15} -134 Z`), '#e58a8a');
  const eye = (cx) => `<ellipse cx="${cx}" cy="-106" rx="10" ry="${o.alert ? 13 : 11}" fill="#f6dc4a" stroke="${OUT}" stroke-width="3"/><ellipse cx="${cx + (o.look || 0) * 3}" cy="-106" rx="${o.alert ? 2 : 3.5}" ry="9" fill="${OUT}"/>`;
  const i = (o.noShadow ? '' : `<ellipse cx="0" cy="2" rx="52" ry="9" fill="#000" opacity=".25"/>`) +
    ln('M26 -10 Q86 -6 74 -62', 21) + ln('M26 -10 Q86 -6 74 -62', 12, c) +
    cel(P('M-36 0 Q-46 -72 0 -86 Q46 -72 36 0 Z'), c, sh, 6, 4) +
    ear(-1) + ear(1) + cel(E(0, -104, 42, 35), c, sh, 6, 4) +
    eye(-17) + eye(17) + plain(P('M-5 -92 h10 l-5 6z'), '#e58a8a') +
    ln('M-24 -88 l-26 -5 M-24 -84 l-26 4 M24 -88 l26 -5 M24 -84 l26 4', 1.8, '#d9d4e8') +
    ln('M-22 -70 Q0 -60 22 -70', 6, '#c8343f') + `<circle cx="0" cy="-58" r="${o.bigMedal ? 13 : 9}" fill="#f2c230" stroke="${OUT}" stroke-width="3"/>` +
    (o.bigMedal ? ln('M-6 -60 h12 M-6 -55 h8', 1.6, '#8a6a10') : '') +
    flat(E(-14, -3, 13, 8), c) + flat(E(14, -3, 13, 8), c);
  return G(x, y, s, i);
}

// Fauteuil vu de dos (devant la fenêtre) ; head: 'back' = sommet du crâne, 'turn' = Henri tourne la tête.
export function chairBack(x, y, s = 1, o = {}) {
  let i = `<ellipse cx="0" cy="2" rx="125" ry="14" fill="#000" opacity=".25"/>`;
  if (o.head === 'back') i += flat(E(-34, -246, 15, 17), '#f4f2ee') + flat(E(34, -246, 15, 17), '#f4f2ee') + cel(E(0, -250, 38, 40), '#ddd6c6', '#b5ac99');
  if (o.head === 'turn') i += `<g transform="translate(0 -262)">${henriHead(o)}</g>`;
  i += flat(R(-88, -20, 22, 22, 4), '#3a2418') + flat(R(66, -20, 22, 22, 4), '#3a2418') +
    cel(P('M-96 -18 L-96 -170 Q-96 -236 0 -236 Q96 -236 96 -170 L96 -18 Z'), '#8a3442', '#64222f', 12, 6) +
    ln('M-56 -180 Q0 -205 56 -180', 3, '#64222f') + `<circle cx="-30" cy="-120" r="5" fill="#64222f"/><circle cx="30" cy="-120" r="5" fill="#64222f"/><circle cx="0" cy="-70" r="5" fill="#64222f"/>` +
    cel(R(-124, -120, 40, 104, 16), '#9a3d4c', '#64222f', 5, 4) + cel(R(84, -120, 40, 104, 16), '#9a3d4c', '#64222f', 5, 4);
  return G(x, y, s, i);
}

// Fauteuil vu de face.
export function chairFront(x, y, s = 1) {
  const i = `<ellipse cx="0" cy="2" rx="125" ry="14" fill="#000" opacity=".25"/>` +
    flat(R(-88, -20, 22, 22, 4), '#3a2418') + flat(R(66, -20, 22, 22, 4), '#3a2418') +
    cel(P('M-92 -60 L-92 -230 Q-92 -292 0 -292 Q92 -292 92 -230 L92 -60 Z'), '#8a3442', '#64222f', 12, 6) +
    cel(R(-96, -92, 192, 76, 14), '#9a3d4c', '#64222f', 6, 5) +
    cel(R(-126, -140, 42, 124, 16), '#9a3d4c', '#64222f', 5, 4) + cel(R(84, -140, 42, 124, 16), '#9a3d4c', '#64222f', 5, 4);
  return G(x, y, s, i);
}

export function sofa(x, y, s = 1) {
  const i = `<ellipse cx="0" cy="2" rx="230" ry="14" fill="#000" opacity=".25"/>` +
    flat(R(-190, -18, 22, 20, 4), '#3a2418') + flat(R(168, -18, 22, 20, 4), '#3a2418') +
    cel(R(-190, -200, 380, 140, 34), '#7f9160', '#5f6f45', 12, 6) +
    cel(R(-196, -96, 392, 80, 16), '#8fa26c', '#5f6f45', 6, 5) +
    cel(R(-224, -136, 52, 122, 20), '#8fa26c', '#5f6f45', 5, 4) + cel(R(172, -136, 52, 122, 20), '#8fa26c', '#5f6f45', 5, 4);
  return G(x, y, s, i);
}

export function table(x, y, s = 1, o = {}) {
  const w = o.w || 110, h = o.h || 70;
  const i = `<ellipse cx="0" cy="2" rx="${w * 0.9}" ry="10" fill="#000" opacity=".25"/>` +
    flat(R(-w + 14, -h, 14, h, 3), '#4e3024') + flat(R(w - 28, -h, 14, h, 3), '#4e3024') +
    cel(R(-w, -h - 16, w * 2, 22, 6), o.c || '#8a5f40', '#5f3f28', 6, 4) +
    (o.drawer ? flat(R(-w + 22, -h + 8, w * 2 - 44, 30, 4), '#7a5236') + `<circle cx="0" cy="${-h + 23}" r="5" fill="#f2c230" stroke="${OUT}" stroke-width="2"/>` : '');
  return G(x, y, s, i);
}

// Table d'échecs avec partie en cours.
export function chessTable(x, y, s = 1) {
  let board = '';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) board += `<rect x="${-80 + c * 20}" y="${-124 + r * 9}" width="20" height="9" fill="${(r + c) % 2 ? '#3a3350' : '#f4efe0'}"/>`;
  const i = table(0, 0, 1, { w: 100, h: 84 }) + `<g>${board}</g>` + R(-80, -124, 160, 36)(`fill="none" ${THIN}`) +
    prop('pawn', -60, -128, 0.9) + prop('pawn', -22, -132, 0.9, { dark: true }) + prop('knight', 18, -138, 0.8, { dark: true }) + prop('pawn', 56, -128, 0.9) + prop('knight', -40, -116, 0.8);
  return G(x, y, s, i);
}

export function bed(x, y, s = 1) {
  const i = `<ellipse cx="0" cy="2" rx="210" ry="14" fill="#000" opacity=".25"/>` +
    cel(R(150, -210, 40, 210, 10), '#6a4433', '#4e3024') + flat(R(-190, -40, 30, 40, 4), '#4e3024') +
    cel(R(-200, -110, 380, 76, 18), '#d9d4e8', '#aaa2c4', 8, 6) + cel(R(-204, -86, 300, 60, 14), '#5e8fb0', '#426d8c', 8, 6) +
    cel(R(96, -146, 78, 44, 18), '#fbf7ee', '#cfc7b0', 5, 4);
  return G(x, y, s, i);
}

// --- décor & éléments d'ambiance ---------------------------------------------
export function pumpkin(x, y, s = 1) {
  const i = `<ellipse cx="0" cy="2" rx="62" ry="10" fill="#000" opacity=".25"/>` + flat(P('M-6 -92 Q-4 -112 12 -116 L16 -104 Q8 -102 8 -90Z'), '#4f7a3a') +
    cel(E(0, -48, 62, 48), '#f58a1f', '#c9600a') + ln('M-26 -90 Q-44 -48 -26 -6 M26 -90 Q44 -48 26 -6 M0 -96 V0', 3, '#c9600a') +
    plain(P('M-34 -66 l18 -4 l-6 18z M34 -66 l-18 -4 l6 18z'), '#fff3a8', THIN) + plain(P('M-34 -34 Q0 -8 34 -34 l-10 2 l-6 -8 l-8 8 l-10 -8 l-10 8 l-8 -8 l-8 8 z'), '#fff3a8', THIN);
  return G(x, y, s, i);
}
export const bat = (x, y, s = 1) => G(x, y, s, plain(P('M0 0 Q-8 -12 -14 -2 Q-26 -18 -44 -8 Q-34 -6 -32 6 Q-24 0 -18 8 Q-10 2 0 12 Q10 2 18 8 Q24 0 32 6 Q34 -6 44 -8 Q26 -18 14 -2 Q8 -12 0 0Z'), '#14101f'));
export const moon = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r * 1.25}" fill="#fff3a8" opacity=".12"/>` + cel(E(x, y, r, r), '#fbefb0', '#e2cc7a', r * 0.14, r * 0.08) +
  `<circle cx="${x - r * 0.3}" cy="${y - r * 0.25}" r="${r * 0.14}" fill="#e2cc7a"/><circle cx="${x + r * 0.25}" cy="${y + r * 0.3}" r="${r * 0.1}" fill="#e2cc7a"/>`;
export function sky(o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="${o.day ? '#f7c98a' : '#2a2360'}"/><rect y="${o.band || 380}" width="${W}" height="${H}" fill="${o.day ? '#fbe0b0' : '#372e78'}"/>`;
  if (!o.day) for (const [x, y, r] of [[80, 90, 3], [210, 200, 2], [330, 70, 2.5], [470, 150, 2], [640, 60, 3], [760, 210, 2], [860, 90, 2.5], [1010, 250, 2], [1120, 60, 3], [150, 320, 2], [560, 290, 2.5], [1150, 330, 2]])
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff3a8"/>`;
  return s;
}
export function burst(x, y, r, c = '#fff3a8', n = 10) {
  let d = '';
  for (let i = 0; i < n * 2; i++) { const a = (Math.PI * i) / n, rr = i % 2 ? r * 0.55 : r; d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)}`; }
  return flat(P(d + 'Z'), c);
}
export function bubble(x, y, rx, ry, inner, o = {}) {
  const [tx, ty] = o.tail || [x, y + ry + 60];
  let s = '';
  if (o.thought) for (const t of [0.35, 0.65, 0.9]) s += `<circle cx="${x + (tx - x) * t}" cy="${y + (ty - y) * t}" r="${16 - t * 10}" fill="#fff" ${THIN}/>`;
  else s += flat(P(`M${x - 24} ${y + ry * 0.6} L${tx} ${ty} L${x + 24} ${y + ry * 0.6}Z`), '#fff');
  return s + flat(E(x, y, rx, ry), '#fff') + (o.thought ? '' : plain(P(`M${x - 21} ${y + ry * 0.6} L${tx} ${ty - 6} L${x + 21} ${y + ry * 0.6}Z`), '#fff')) + clip(E(x, y, rx - 4, ry - 4), `<g transform="translate(${x} ${y})">${inner}</g>`);
}
export function clock(x, y, r, hh, mm) {
  const ha = ((hh % 12) + mm / 60) * 30 - 90, ma = mm * 6 - 90, rad = Math.PI / 180;
  let t = '';
  for (let i = 0; i < 12; i++) t += `<circle cx="${x + Math.cos(i * 30 * rad) * r * 0.8}" cy="${y + Math.sin(i * 30 * rad) * r * 0.8}" r="${r * 0.045}" fill="${OUT}"/>`;
  return cel(E(x, y, r * 1.14, r * 1.14), '#b08a2e', '#7d5f17', 5, 4) + flat(E(x, y, r, r), '#fbf7ee') + t +
    ln(`M${x} ${y} L${x + Math.cos(ha * rad) * r * 0.5} ${y + Math.sin(ha * rad) * r * 0.5}`, r * 0.11) +
    ln(`M${x} ${y} L${x + Math.cos(ma * rad) * r * 0.75} ${y + Math.sin(ma * rad) * r * 0.75}`, r * 0.07) + `<circle cx="${x}" cy="${y}" r="${r * 0.07}" fill="#c8343f"/>`;
}
// Petit cadre mural.
export const wallFrame = (x, y, s = 1, o = {}) => prop('frame', x, y, s, { bg: '#cfc6b4', ...o });

// La maison des Morticia vue de la rue.
export function house(x, y, s = 1, o = {}) {
  const lit = '#f6dc7a', dark = '#1f1840';
  const win = (wx, wy, on, fig) => flat(R(wx, wy, 62, 74, 4), on ? lit : dark) + ln(`M${wx + 31} ${wy} v74 M${wx} ${wy + 37} h62`, 3) +
    (fig ? plain(P(`M${wx + 14} ${wy + 74} Q${wx + 14} ${wy + 40} ${wx + 31} ${wy + 40} Q${wx + 48} ${wy + 40} ${wx + 48} ${wy + 74}Z`), OUT) + plain(E(wx + 31, wy + 28, 13, 16), OUT) : '');
  const i = flat(R(90, -430, 36, 90), '#463a73') +
    cel(R(-170, -270, 340, 270), o.party ? '#b0507f' : '#6456a0', o.party ? '#8a3a62' : '#4a3f7d', 14, 0) +
    cel(P('M-204 -266 L0 -410 L204 -266 Z'), '#3a2f63', '#2a2148', 14, 6) +
    flat(E(0, -318, 22, 22), o.party ? '#9be564' : dark) +
    win(-128, -236, !!o.upLit, o.fig) + win(66, -236, !!o.party) + win(-128, -118, !!o.downLit || !!o.party) + win(66, -118, !!o.downLit || !!o.party) +
    cel(R(-32, -112, 64, 112, 6), '#6a4433', '#4e3024', 5, 0) + `<circle cx="18" cy="-54" r="5" fill="#f2c230" stroke="${OUT}" stroke-width="2"/>` +
    flat(R(-52, -8, 104, 14, 3), '#8d86a8');
  return G(x, y, s, i);
}
export function lamppost(x, y, s = 1) {
  return G(x, y, s, `<path d="M-26 -300 L26 -300 L120 0 L-120 0Z" fill="#f6dc7a" opacity=".16"/>` + flat(R(-6, -300, 12, 300, 4), '#2a2148') + flat(R(-16, -6, 32, 10, 3), '#2a2148') +
    cel(P('M-22 -300 L22 -300 L14 -340 L-14 -340Z'), '#f6dc7a', '#e0b84a', 4, 3) + flat(P('M-20 -340 L20 -340 L0 -358Z'), '#2a2148'));
}
export function street(o = {}) {
  return sky() + moon(o.moonX || 1010, 130, 62) +
    plain(P('M0 560 Q150 470 300 540 Q420 480 560 550 L560 600 L0 600Z'), '#231c50') + plain(P('M700 560 Q900 470 1050 540 Q1130 500 1200 540 L1200 600 L700 600Z'), '#231c50') +
    `<rect y="560" width="${W}" height="70" fill="#6a60a0"/><rect y="560" width="${W}" height="6" fill="${OUT}"/><rect y="626" width="${W}" height="174" fill="#453c78"/><rect y="622" width="${W}" height="6" fill="${OUT}"/>` +
    [60, 320, 580, 840, 1100].map((dx) => `<rect x="${dx}" y="706" width="110" height="12" rx="4" fill="#8d86a8"/>`).join('');
}

function stripes(c, x0 = 0, x1 = W, y0 = 0, y1 = 600) {
  let s = '';
  for (let x = x0 + 30; x < x1; x += 80) s += `<rect x="${x}" y="${y0}" width="22" height="${y1 - y0}" fill="${c}"/>`;
  return s;
}
function floorBoards(y, c, lc) {
  let s = `<rect y="${y}" width="${W}" height="${H - y}" fill="${c}"/><rect y="${y - 3}" width="${W}" height="6" fill="${OUT}"/>`;
  for (const [yy, off] of [[y + 66, 0], [y + 132, 140]]) {
    s += `<rect y="${yy}" width="${W}" height="3" fill="${lc}"/>`;
    for (let x = off + 90; x < W; x += 280) s += `<rect x="${x}" y="${yy - 66}" width="3" height="66" fill="${lc}"/>`;
  }
  return s;
}

// La fête chez les amis.
export function party(o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="#5b2a7a"/>` + stripes('#532571') + floorBoards(600, '#3d1b56', '#33154a');
  for (const [x, c] of [[160, '#f58a1f'], [480, '#9be564'], [800, '#e0425a'], [1080, '#8fd3ff']])
    s += `<path d="M${x - 16} 0 L${x + 16} 0 L${x + 190} 800 L${x - 190} 800Z" fill="${c}" opacity="${o.dim ? 0.1 : 0.2}"/>`;
  return s + garland();
}
export function garland() {
  let s = ln('M0 60 Q300 150 600 70 Q900 150 1200 60', 4);
  for (let i = 0; i < 12; i++) {
    const x = 50 + i * 100, t = (x % 600) / 600, y = 64 + 90 * t * (1 - t) * 1.9;
    s += flat(P(`M${x - 24} ${y} L${x + 24} ${y} L${x} ${y + 46}Z`), ['#f58a1f', '#14101f', '#9be564'][i % 3]);
  }
  return s;
}
export const floorOnly = () => `<rect width="${W}" height="${H}" fill="#33284f"/>` + [150, 330, 510, 690].map((y, i) => `<rect y="${y}" width="${W}" height="5" fill="#2a2042"/><rect x="${200 + i * 230}" y="${y - 180}" width="5" height="180" fill="#2a2042"/>`).join('') +
  `<path d="M0 0 L500 0 L900 800 L0 800Z" fill="#f6dc7a" opacity=".1"/>`;
// Silhouette d'invité déguisé qui danse.
export function dancer(x, y, s, c, hat) {
  const i = plain(P('M-34 0 Q-40 -150 0 -160 Q40 -150 34 0Z'), c) + plain(E(0, -196, 38, 40), c) +
    `<path d="M-30 -140 L-74 -230 M30 -140 L78 -220" stroke="${c}" stroke-width="22" stroke-linecap="round"/>` +
    (hat === 'witch' ? plain(P('M-56 -222 L56 -222 L8 -246 L-4 -318 L-20 -246Z'), c) : hat === 'horns' ? plain(P('M-30 -224 L-40 -262 L-14 -234Z M30 -224 L40 -262 L14 -234Z'), c) : plain(P('M-30 -226 L-24 -256 L-10 -234 L0 -260 L10 -234 L24 -256 L30 -226Z'), c));
  return G(x, y, s, i);
}

// Le salon de Mme Morticia : papier peint défraîchi, cheminée, photographies anciennes.
export function salon(o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="${o.dark ? '#5e5078' : '#8d7ca6'}"/>` + stripes(o.dark ? '#574a70' : '#84729e') +
    `<rect y="510" width="${W}" height="90" fill="${o.dark ? '#4a3d63' : '#6f5d8a'}"/><rect y="507" width="${W}" height="5" fill="${OUT}"/>` +
    floorBoards(600, o.dark ? '#4a3226' : '#6d4a36', o.dark ? '#3c281e' : '#5a3b2a') +
    plain(E(560, 730, 440, 56), '#8f3b46', THIN) + plain(E(560, 730, 380, 40), '#a54d55');
  for (const [x, y, sc] of o.frames || [[110, 190, 1.5], [250, 300, 1.2], [380, 170, 1.3], [540, 260, 1.6], [700, 180, 1.2]]) s += wallFrame(x, y, sc);
  if (o.fire !== false) s += fireplace(960, 600);
  return s;
}
export function fireplace(x, y, o = {}) {
  const i = cel(R(-150, -280, 300, 280, 6), '#a59fb3', '#7f7890', 12, 0) + flat(R(-104, -200, 208, 200, 8), '#241728') +
    plain(P('M-70 0 Q-90 -70 -50 -100 Q-44 -60 -24 -84 Q-30 -140 6 -170 Q4 -110 34 -100 Q30 -130 52 -140 Q88 -70 70 0Z'), '#f58a1f', THIN) +
    plain(P('M-36 0 Q-46 -40 -18 -60 Q-10 -30 6 -84 Q26 -50 36 0Z'), '#fff3a8') +
    cel(R(-174, -306, 348, 30, 6), '#8d86a8', '#6b6485', 6, 4) + (o.clock ? clock(0, -362, 44, o.clock[0], o.clock[1]) + flat(R(-50, -318, 100, 14, 3), '#7d5f17') : prop('candle', -110, -330, 1.1) + wallFrame(60, -348, 1.1));
  return G(x, y, 1, i);
}

// L'entrée : porte fermée à clé, miroir.
export function hall(o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="#8d7ca6"/>` + stripes('#84729e') + `<rect y="510" width="${W}" height="90" fill="#6f5d8a"/><rect y="507" width="${W}" height="5" fill="${OUT}"/>` +
    floorBoards(600, '#6d4a36', '#5a3b2a') + plain(R(0, 690, W, 70), '#8f3b46', THIN);
  const dx = o.doorX || 900;
  s += flat(R(dx - 112, 176, 224, 428, 6), '#4e3024') + cel(R(dx - 96, 192, 192, 410, 4), '#7a5236', '#5f3f28', 10, 0) +
    flat(R(dx - 70, 222, 140, 150, 4), '#6a4433') + flat(R(dx - 70, 400, 140, 170, 4), '#6a4433') +
    `<circle cx="${dx - 70}" cy="392" r="12" fill="#f2c230" ${THIN}/><rect x="${dx - 74}" y="414" width="8" height="18" rx="3" fill="${OUT}"/>`;
  if (o.mirror) {
    const [mx, my, mr] = o.mirror;
    s += cel(E(mx, my, mr * 0.8 + 16, mr + 16), '#b08a2e', '#7d5f17', 6, 4) + flat(E(mx, my, mr * 0.8, mr), '#bcd3e0') +
      clip(E(mx, my, mr * 0.8 - 3, mr - 3), (o.mirrorInner || '') + `<path d="M${mx - mr} ${my - mr * 0.2} l${mr * 0.9} ${-mr * 0.9} l${mr * 0.3} 0 l${-mr * 0.9} ${mr * 0.9}z" fill="#fff" opacity=".3"/>`);
  } else for (const [x, y, sc] of [[130, 220, 1.4], [290, 320, 1.2], [450, 200, 1.5], [610, 310, 1.2]]) s += wallFrame(x, y, sc);
  return s;
}

export function kitchen(o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="#b9d1c6"/><rect y="330" width="${W}" height="150" fill="#e4eee8"/>`;
  for (let x = 0; x < W; x += 75) s += `<rect x="${x}" y="330" width="3" height="150" fill="#b9d1c6"/>`;
  s += `<rect y="403" width="${W}" height="3" fill="#b9d1c6"/><rect y="327" width="${W}" height="5" fill="${OUT}"/>` +
    floorBoards(650, '#c9b78b', '#b09c6e') +
    cel(R(-10, 500, 950, 152, 0), '#7fa394', '#5f8374', 0, -8) +
    [90, 300, 510, 720].map((x) => flat(R(x, 522, 180, 110, 6), '#8fb3a4') + `<circle cx="${x + 90}" cy="540" r="7" fill="#f2c230" ${THIN}/>`).join('') +
    cel(R(-10, 470, 960, 32, 4), '#eadcb4', '#c9b78b', 0, -8) +
    flat(R(110, 110, 260, 180, 6), '#4e3024') + plain(R(124, 124, 232, 152), '#2a2360') + moon(300, 180, 26) + ln('M240 124 V276', 5) +
    flat(R(470, 150, 330, 16, 4), '#8a5f40') + prop('jar', 520, 126, 1.2) + thin(R(580, 108, 40, 42, 6), '#f58a1f') + thin(R(640, 96, 34, 54, 6), '#8fd3ff') + thin(E(730, 132, 30, 18), '#fbf7ee');
  if (o.fridge !== false) s += cel(R(960, 150, 210, 500, 14), '#eef3f5', '#c5d0d9', 12, 0) + ln('M960 330 H1170', 5) + flat(R(980, 220, 12, 80, 5), '#8d98a3') + flat(R(980, 360, 12, 120, 5), '#8d98a3') + `<ellipse cx="1065" cy="656" rx="120" ry="10" fill="#000" opacity=".2"/>`;
  return s;
}

export function stairs() {
  let s = `<rect width="${W}" height="${H}" fill="#4a3f7d"/>` + stripes('#443873', 0, W, 0, H);
  for (const [x, y, sc] of [[120, 150, 1.3], [270, 250, 1.1], [150, 380, 1.2], [420, 130, 1.2]]) s += wallFrame(x, y, sc);
  for (let i = 0; i < 9; i++) {
    const x = 60 + i * 120, y = 720 - i * 72;
    s += flat(R(x, y, W, 800, 0), i % 2 ? '#7a5236' : '#84593c') + `<rect x="${x}" y="${y}" width="${W}" height="14" fill="#a3764f"/>` + ln(`M${x} ${y} H${W}`, 5);
  }
  s += `<path d="M0 620 L1200 -100" stroke="${OUT}" stroke-width="27" stroke-linecap="round"/><path d="M0 620 L1200 -100" stroke="#6a4433" stroke-width="17" stroke-linecap="round"/>`;
  return s;
}

// Le couloir de l'étage : trois portes à gauche, fenêtre au fond.
export function corridor(o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="#4a3f7d"/>` + stripes('#443873') + `<rect y="520" width="${W}" height="100" fill="#3b3168"/><rect y="517" width="${W}" height="5" fill="${OUT}"/>` +
    floorBoards(620, '#3a2c52', '#2f2344') + plain(R(0, 680, W, 80), '#7a2f3a', THIN) +
    `<path d="M1040 470 L1160 470 L1200 800 L760 800Z" fill="#f6dc7a" opacity=".16"/>` +
    flat(R(1040, 200, 124, 270, 6), '#2a2148') + plain(R(1052, 212, 100, 246), '#f1dc94') + ln('M1102 212 V458 M1052 335 H1152', 5);
  [150, 440, 730].forEach((x, i) => {
    const ajar = o.ajar && i === 2;
    s += flat(R(x - 14, 206, 228, 416, 6), '#2a2148') + (ajar ? plain(R(x, 220, 200, 400), '#14101f') + cel(P(`M${x + 40} 228 L${x + 200} 220 L${x + 200} 620 L${x + 40} 612Z`), '#6a4a66', '#4d3350', 10, 0)
      : cel(R(x, 220, 200, 400, 4), '#6a4a66', '#4d3350', 10, 0) + flat(R(x + 28, 250, 144, 140, 4), '#5d4059') + flat(R(x + 28, 420, 144, 170, 4), '#5d4059')) +
      `<circle cx="${x + 176}" cy="412" r="11" fill="#f2c230" ${THIN}/>`;
  });
  return s;
}

// La chambre d'Henri. lit: lumière allumée (photos visibles) ; door: 'closed' | 'open'.
export function bedroom(o = {}) {
  const lit = o.lit;
  let s = `<rect width="${W}" height="${H}" fill="${lit ? '#c9b087' : '#463b7c'}"/>` + stripes(lit ? '#bfa57a' : '#403572') +
    `<rect y="520" width="${W}" height="100" fill="${lit ? '#a88d63' : '#383068'}"/><rect y="517" width="${W}" height="5" fill="${OUT}"/>` +
    floorBoards(620, lit ? '#8a5f40' : '#33284f', lit ? '#74502f' : '#2a2042');
  const wx = o.winX ?? 330;
  if (o.window !== false) {
    s += flat(R(wx - 14, 136, 308, 348, 6), '#4e3024') + clip(R(wx, 150, 280, 320), `<rect x="${wx}" y="150" width="280" height="320" fill="#2a2360"/><rect x="${wx}" y="390" width="280" height="80" fill="#231c50"/>` +
      `<circle cx="${wx + 70}" cy="300" r="46" fill="#f6dc7a" opacity=".25"/><circle cx="${wx + 70}" cy="300" r="16" fill="#f6dc7a"/><rect x="${wx + 66}" y="310" width="8" height="160" fill="${OUT}"/>` +
      `<circle cx="${wx + 220}" cy="330" r="34" fill="#f6dc7a" opacity=".25"/><circle cx="${wx + 220}" cy="330" r="11" fill="#f6dc7a"/><rect x="${wx + 217}" y="338" width="6" height="140" fill="${OUT}"/>` + (o.winInner || '')) +
      ln(`M${wx + 140} 150 V470 M${wx} 310 H${wx + 280}`, 6) +
      cel(P(`M${wx - 30} 126 H${wx + 40} Q${wx + 30} 320 ${wx - 10} 500 H${wx - 44}Z`), lit ? '#8a3442' : '#6a2a48', lit ? '#64222f' : '#4b1c34', 7, 0) +
      cel(P(`M${wx + 310} 126 H${wx + 240} Q${wx + 250} 320 ${wx + 290} 500 H${wx + 324}Z`), lit ? '#8a3442' : '#6a2a48', lit ? '#64222f' : '#4b1c34', 7, 0) +
      flat(R(wx - 50, 114, 380, 16, 6), '#b08a2e');
    if (!lit) s += `<path d="M${wx} 470 L${wx + 280} 470 L${wx + 440} 800 L${wx - 160} 800Z" fill="#f6dc7a" opacity=".13"/>`;
  }
  if (o.photos) for (const [x, y, sc] of [[70, 170, 1.2], [170, 280, 1.4], [70, 400, 1.1], [200, 150, 1], [730, 160, 1.3], [840, 280, 1.1], [730, 380, 1.4], [880, 150, 1], [860, 420, 1], [1160, 300, 1]]) s += wallFrame(x, y, sc);
  if (o.door) {
    const dx = 1050;
    s += flat(R(dx - 96, 190, 192, 432, 6), lit ? '#4e3024' : '#2a2148');
    if (o.door === 'open') s += plain(R(dx - 82, 204, 164, 416), '#f1dc94') + cel(P(`M${dx + 40} 196 L${dx + 82} 204 L${dx + 82} 620 L${dx + 40} 632Z`), '#7a5236', '#5f3f28', 5, 0);
    else s += cel(R(dx - 82, 204, 164, 416, 4), lit ? '#7a5236' : '#6a4a66', lit ? '#5f3f28' : '#4d3350', 10, 0) + flat(R(dx - 58, 232, 116, 140, 4), lit ? '#6a4433' : '#5d4059') + flat(R(dx - 58, 400, 116, 180, 4), lit ? '#6a4433' : '#5d4059') +
      `<circle cx="${dx - 62}" cy="392" r="11" fill="#f2c230" ${THIN}/>`;
  }
  return s;
}

// Perron : porte d'entrée ouverte sur l'intérieur éclairé.
export function porch() {
  let s = `<rect width="${W}" height="${H}" fill="#6456a0"/>`;
  for (let y = 60; y < 660; y += 60) s += `<rect y="${y}" width="${W}" height="4" fill="#5548900"/>`.replace('#5548900', '#554890');
  s += flat(R(390, 90, 420, 580, 8), '#3a2f63') + plain(R(416, 116, 368, 554), '#f3cf80') + plain(R(416, 116, 368, 554), '#f58a1f', 'opacity=".15"') +
    cel(P('M784 116 L900 80 L900 700 L784 670Z'), '#7a5236', '#5f3f28', 6, 0) + `<circle cx="876" cy="400" r="11" fill="#f2c230" ${THIN}/>` +
    cel(R(300, 664, 600, 46, 4), '#a59fb3', '#7f7890', 0, -8) + cel(R(220, 708, 760, 50, 4), '#8d86a8', '#6b6485', 0, -8) + `<rect y="756" width="${W}" height="44" fill="#453c78"/><rect y="753" width="${W}" height="5" fill="${OUT}"/>` +
    flat(R(200, 240, 14, 40, 3), '#2a2148') + cel(R(176, 276, 62, 84, 8), '#f6dc7a', '#e0b84a', 5, 4) + `<circle cx="207" cy="318" r="110" fill="#f6dc7a" opacity=".12"/>`;
  return s;
}

export const closeBG = (c1, c2, r = 430) => `<rect width="${W}" height="${H}" fill="${c1}"/><circle cx="600" cy="420" r="${r}" fill="${c2}"/>`;
export const garlicCloud = (x, y, s = 1) => G(x, y, s, cel(P('M-90 10 Q-120 -30 -70 -50 Q-60 -90 -10 -70 Q30 -100 60 -60 Q110 -60 100 -10 Q120 40 60 50 Q20 80 -20 50 Q-80 70 -90 10Z'), '#b7e07a', '#8fbf52') + prop('garlic', 0, 0, 1.4));
export const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${inner}</svg>\n`;
