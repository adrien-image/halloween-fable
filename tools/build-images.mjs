// Génère une illustration SVG par slide dans site/images/.
// Chaque scène est composée à partir des mêmes personnages, décors et
// accessoires (tools/art-lib.mjs) pour garder un style cohérent.
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as A from './art-lib.mjs';

const { hero, morticia, henri, medic, cat, prop, G, P, R, E, plain, flat, cel, clip, line } = A;
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'site/images');
mkdirSync(out, { recursive: true });

const Y = 730; // ligne de sol des personnages
const dim = (o = 0.35) => `<rect width="1200" height="800" fill="#150f2b" opacity="${o}"/>`;
const bats = (list) => list.map(([x, y, s]) => A.bat(x, y, s)).join('');
const flash = (x, y, c = '#8fd3ff') => `<circle cx="${x}" cy="${y}" r="230" fill="${c}" opacity=".22"/>`;
const sniff = (x, y) => line(`M${x} ${y} q14 -10 28 0 M${x + 4} ${y + 18} q14 -10 28 0 M${x} ${y + 36} q14 -10 28 0`, 5, '#f4efe6');
const shadowFigure = (x, y, s) => G(x, y, s, plain(P('M-70 0 Q-80 -250 -40 -270 Q-50 -360 0 -372 Q50 -360 40 -270 Q80 -250 70 0Z'), '#14101f') +
  `<ellipse cx="-17" cy="-318" rx="8" ry="6" fill="#f6dc4a"/><ellipse cx="17" cy="-318" rx="8" ry="6" fill="#f6dc4a"/>`);
// Chambre d'Henri (branche A : pénombre), fauteuil devant la fenêtre.
const room = (o = {}) => A.bedroom({ door: 'closed', ...o });
const chair = (o = {}) => A.chairBack(380, Y, 1.35, o);
const bedside = () => A.table(590, Y, 1.1, { w: 60, h: 90, drawer: true });
// Fin : la lune, la maison au loin, et l'objet-souvenir de la branche.
const fin = (kind, o = {}, s = 6) => A.sky({ band: 520 }) + A.moon(600, 350, 235) + bats([[200, 170, 1.5], [1000, 230, 1.2], [860, 90, 0.9], [330, 330, 0.8]]) +
  plain(P('M0 640 Q300 560 600 640 Q900 560 1200 640 V800 H0Z'), '#231c50') + A.house(170, 690, 0.5, { upLit: true }) + A.pumpkin(1010, 740, 1.1) + A.pumpkin(1110, 760, 0.7) +
  (kind === 'cat' ? cat(600, 560, 2.3, o) : prop(kind, 600, 350, s, o));
const mini = (inner, x, y, s) => G(x, y, s, inner);
const hollywood = plain(R(-200, -120, 400, 240), '#8fd3ff') + plain(E(0, 120, 220, 110), '#d9a85a') + plain(E(-120, 130, 120, 70), '#c08f45') +
  [-60, -36, -12, 12, 36, 60].map((x, i) => `<rect x="${x - 9}" y="${18 - (i % 2) * 5}" width="18" height="26" fill="#fff" stroke="${A.OUT}" stroke-width="2"/>`).join('') +
  line('M-120 110 Q-116 30 -104 -20', 7, '#6a4433') + plain(P('M-104 -20 q-40 -20 -56 10 q30 -14 56 -10 q-10 -40 -44 -44 q34 0 44 44 q20 -38 54 -26 q-36 -2 -54 26 q40 -10 58 20 q-30 -18 -58 -20z'), '#4f7a3a') + `<circle cx="130" cy="-60" r="30" fill="#fff3a8"/>`;

const slides = [
  // 1 — titre
  () => A.sky({ band: 520 }) + A.moon(930, 180, 100) + bats([[220, 150, 1.5], [420, 250, 1], [700, 120, 1.2], [1090, 340, 0.9]]) +
    plain(P('M0 660 Q300 540 600 600 Q900 540 1200 660 V800 H0Z'), '#231c50') + A.house(600, 640, 1.15, { upLit: true }) + A.pumpkin(210, 760, 1.6) + A.pumpkin(1010, 770, 1.25) + A.pumpkin(380, 780, 0.8) + cat(820, 770, 0.9),
  // 2 — le costume de vampire
  () => A.closeBG('#5b2a7a', '#74409a') + A.garland() + prop('calendar', 190, 330, 2.2, { rot: -6 }) + A.pumpkin(1010, 760, 1.5) +
    bats([[980, 250, 1.4], [1100, 380, 0.9]]) + hero(600, 800, 1.75, { expr: 'smile', L: 'reach', R: 'chin' }),
  // 3 — la fête, 23 h 30, un chat sur la piste
  () => A.party() + A.clock(1060, 230, 56, 11, 30) + A.dancer(150, 700, 1.25, '#3d1b56', 'witch') + A.dancer(960, 690, 1.2, '#3d1b56', 'horns') + A.dancer(1120, 740, 1.3, '#33154a', 'crown') +
    `<ellipse cx="660" cy="735" rx="130" ry="26" fill="#fff3a8" opacity=".35"/>` + hero(390, Y, 1.25, { expr: 'happy', L: 'up', R: 'up', look: 1 }) + cat(660, 740, 1.25),
  // 4 — le médaillon, la maison d'en face
  () => A.party({ dim: true }) + flat(R(800, 150, 330, 300, 6), '#4e3024') + clip(R(816, 166, 298, 268), A.sky() + A.house(965, 470, 0.72, { upLit: true })) + line('M965 166 V434', 6) +
    cat(470, 790, 3.1, { bigMedal: true, look: 1 }) + hero(1010, 1010, 1.5, { expr: 'smile', look: -1, L: 'reach' }),
  // 5 — sur le perron
  () => A.porch() + morticia(600, 668, 1.3, { expr: 'happy', R: 'up' }) + A.pumpkin(960, 712, 0.9) + hero(250, 790, 1.4, { expr: 'smile', look: 1, L: 'front', R: 'front', item: 'cat' }),
  // 6 — le salon d'un autre temps
  () => A.salon() + A.sofa(340, 720, 1.15) + hero(300, 716, 1.2, { expr: 'neutral', look: 1, sit: true }) + morticia(660, Y, 1.25, { expr: 'happy', L: 'reach', look: -1 }),
  // 7 — l'histoire de Minou
  () => A.salon() + A.sofa(340, 720, 1.15) + hero(300, 716, 1.2, { expr: 'smile', look: 1, sit: true, R: 'hold', item: 'cup' }) + morticia(680, Y, 1.25, { expr: 'happy', L: 'front', R: 'front', item: 'cat' }),
  // 8 — Boum ! à l'étage
  () => A.salon() + A.burst(600, 30, 120) + line('M470 110 v40 M600 150 v50 M730 110 v40', 6, '#f4efe6') + A.sofa(340, 720, 1.15) +
    hero(300, 716, 1.2, { expr: 'scared', sit: true, L: 'up', R: 'up' }) + cat(520, 742, 0.9, { alert: true }) + morticia(720, Y, 1.25, { expr: 'smile', R: 'up', L: 'hold', hand: 'L', item: 'cup', itemO: { steam: false } }),
  // 9 — l'escalier
  () => A.stairs() + hero(600, 436, 1.1, { expr: 'worried', look: 1, R: 'hold', item: 'glass', noShadow: true }),
  // 10 — troisième porte à gauche
  () => A.corridor() + hero(1000, 750, 1.2, { expr: 'worried', look: -1, L: 'reach', R: 'hold', item: 'glass' }),
  // 11 — la silhouette devant la fenêtre
  () => room({ door: null }) + chair({ head: 'back' }) + bedside(),
  // 12 — premier choix
  () => room({ door: 'open' }) + chair({ head: 'back' }) + bedside() + hero(900, 750, 1.2, { expr: 'worried', look: -1, L: 'hold', hand: 'L', item: 'glass' }),
  // 13 — « Très réussi, ce costume ! »
  () => room() + chair({ head: 'turn', expr: 'smile', look: 1 }) + bedside() + hero(880, 750, 1.2, { expr: 'smile', look: -1, L: 'hold', hand: 'L', item: 'glass' }),
  // 14 — le souvenir d'Yvonne
  () => room() + chair({ head: 'turn', expr: 'sad' }) + A.bubble(200, 220, 150, 120, prop('frame', -50, 0, 2.6) + prop('heart', 70, 0, 2.2), { thought: true, tail: [400, 370] }) + bedside() +
    hero(880, 750, 1.2, { expr: 'worried', look: -1 }),
  // 15 — la porte claque, 23 h 44
  () => room() + A.clock(830, 250, 50, 11, 44) + A.burst(1050, 300, 110) + chair() + henri(640, Y, 1.25, { expr: 'smile', look: 1, float: true }) + hero(880, 750, 1.2, { expr: 'scared', look: 1, L: 'up', R: 'up' }),
  // 15 bis — « vous tombez à pic ! »
  () => room() + A.clock(830, 250, 50, 11, 44) + chair() + henri(630, Y, 1.3, { expr: 'grin', look: 1, R: 'reach' }) + hero(900, 750, 1.2, { expr: 'scared', look: -1, L: 'up', R: 'up' }),
  // 16 — il renifle
  () => room({ door: null, winX: 80 }) + dim(0.2) + henri(430, 1150, 2.3, { expr: 'neutral', look: 1 }) + sniff(580, 440) + hero(860, 1160, 2.2, { expr: 'scared', look: -1 }),
  // 17 — « DE L'AIL ?! »
  () => room() + chair() + henri(630, Y, 1.3, { expr: 'disgust', L: 'up', R: 'up' }) + A.garlicCloud(770, 240, 0.95) + hero(880, 750, 1.2, { expr: 'surprised', look: -1 }),
  // 18 — le plaisir interdit
  () => A.closeBG('#463b7c', '#5a4d99') + henri(400, 1120, 2.3, { expr: 'worried', R: 'chin' }) +
    A.bubble(860, 280, 250, 200, plain(R(-260, -210, 520, 420), '#2a2360') + [-180, -100, 100, 180].map((x) => plain(P(`M${x} 200 L${x - 50} 200 L${x} -40 L${x + 50} 200Z M${x} 80 L${x - 40} 80 L${x} -110 L${x + 40} 80Z`), '#1d3a34')).join('') + prop('garlic', 0, 30, 5.5), { thought: true, tail: [560, 420] }),
  // 19 — reprendre son destin en main
  () => room() + chair() + henri(630, Y, 1.3, { expr: 'worried', R: 'chin', look: 1 }) + A.garlicCloud(760, 250, 0.7) + hero(860, 750, 1.25, { expr: 'angry', look: -1, R: 'up' }),
  // 20 — l'haleine à l'ail
  () => room({ door: 'open' }) + A.burst(1050, 240, 90) + chair() + henri(630, Y, 1.3, { expr: 'disgust', L: 'up', R: 'hold' }) +
    cel(P('M560 330 Q620 280 690 320 Q720 360 690 400 Q620 440 560 400 Q520 370 560 330Z'), '#b7e07a', '#8fbf52') + line('M700 350 h60 M700 372 h50', 6, '#b7e07a') + hero(840, 750, 1.25, { expr: 'surprised', look: -1 }),
  // 21 — « Vous partez déjà ? »
  () => A.hall() + morticia(560, Y, 1.25, { expr: 'smile', look: -1, key: true }) + hero(240, 750, 1.25, { expr: 'scared', look: 1, L: 'up', R: 'up' }),
  // 22 — la clé autour du cou
  () => A.hall() + A.bubble(200, 130, 150, 90, line('M-80 -20 q14 -18 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 M-70 20 q14 -18 28 0 t28 0 t28 0 t28 0', 7, '#74553f'), { tail: [360, 10] }) +
    morticia(560, 800, 1.7, { expr: 'happy', look: -1, key: true, R: 'chin' }) + hero(1000, 760, 1.25, { expr: 'scared', look: -1 }),
  // 23 — que faire ?
  () => A.hall() + morticia(330, Y, 1.2, { expr: 'smile', look: 1, key: true }) + hero(700, 1010, 2.1, { expr: 'scared', look: -1 }),
  // 24 — le faux appel
  () => A.hall() + morticia(480, Y, 1.25, { expr: 'neutral', look: -1, key: true }) + hero(230, 750, 1.25, { expr: 'worried', look: 1, R: 'ear', item: 'phone', itemO: { off: true } }),
  // 25 — la clé arrachée
  () => A.hall() + morticia(520, Y, 1.25, { expr: 'angry', look: 1, R: 'hold' }) + hero(740, 750, 1.25, { expr: 'scared', look: 1, L: 'hold', hand: 'R', R: 'reach', item: 'key', itemS: 1.3 }),
  // 26 — le lendemain matin
  () => A.sky({ day: true, band: 520 }) + `<circle cx="980" cy="170" r="80" fill="#fff3a8"/><rect y="640" width="1200" height="160" fill="#8fbf52"/><rect y="637" width="1200" height="5" fill="${A.OUT}"/>` +
    flat(R(180, 420, 26, 260, 4), '#6a4433') + cel(P('M110 420 V340 Q110 290 190 290 H290 V420Z'), '#c8343f', '#96202b') + flat(R(286, 310, 10, 50, 3), '#f2c230') +
    hero(640, 1010, 2.1, { expr: 'worried', dots: true, R: 'hold', item: 'card', itemS: 1.3 }),
  // 27 — FIN
  () => fin('card'),
  // 28 — trois tasses
  () => A.salon() + A.sofa(340, 720, 1.15) + hero(300, 716, 1.2, { expr: 'smile', look: 1, sit: true }) + morticia(760, Y, 1.25, { expr: 'happy', look: -1 }) +
    A.table(560, 770, 1.3, { w: 120, h: 50 }) + prop('cup', 470, 668, 1.5) + prop('cup', 560, 668, 1.5) + prop('cup', 650, 668, 1.5),
  // 29 — les paupières lourdes
  () => A.salon() + A.sofa(340, 720, 1.15) + hero(300, 716, 1.2, { expr: 'dizzy', sit: true }) + morticia(520, Y, 1.25, { expr: 'smile', look: -1, L: 'reach' }) +
    A.table(820, 770, 1.3, { w: 120, h: 50 }) + prop('cup', 760, 668, 1.5, { steam: false }) + prop('cup', 870, 668, 1.5),
  // 30 — Henri descend
  () => A.salon({ dark: true }) + A.sofa(340, 720, 1.15) + hero(300, 716, 1.2, { expr: 'dizzy', sit: true }) + henri(560, Y, 1.25, { expr: 'grin', look: -1 }) + morticia(800, Y, 1.25, { expr: 'sad', look: -1 }) +
    prop('candle', 80, 700, 2) + prop('candle', 1120, 720, 2.4),
  // 31 — le souffle glacé
  () => A.salon({ dark: true, fire: false }) + dim(0.3) + hero(760, 1100, 2.3, { expr: 'scared', look: -1 }) + henri(360, 1130, 2.3, { expr: 'grin', look: 1, R: 'reach' }) + prop('candle', 1100, 700, 3),
  // 32 — la nouvelle photo
  () => `<rect width="1200" height="800" fill="#8d7ca6"/>` + [[120, 200, 2.2], [1070, 220, 2.4], [150, 470, 1.8], [1060, 500, 2]].map(([x, y, s]) => A.wallFrame(x, y, s)).join('') +
    cel(R(-10, 690, 1220, 120), '#8a5f40', '#5f3f28', 0, -10) + flat(R(330, 110, 540, 590, 8), '#6a4433') + flat(R(360, 140, 480, 530, 4), '#b08a2e') +
    clip(R(376, 156, 448, 498), `<rect x="376" y="156" width="448" height="498" fill="#e9dfc8"/>` + henri(470, 700, 1.05, { expr: 'smile', noShadow: true }) + morticia(735, 700, 1.05, { expr: 'happy', noShadow: true }) + hero(600, 720, 1.1, { expr: 'smile', noShadow: true })) +
    R(376, 156, 448, 498)(`fill="none" stroke="${A.OUT}" stroke-width="5"`) + prop('candle', 960, 660, 2.2),
  // 33 — FIN
  () => fin('frame', { trio: true }),
  // 34 — le pacte
  () => room() + chair() + henri(630, Y, 1.3, { expr: 'grin', look: 1, R: 'reach' }) + hero(830, 750, 1.25, { expr: 'smile', look: -1, L: 'reach' }),
  // 35 — deux petits points noirs
  () => room({ door: 'open' }) + chair() + henri(630, Y, 1.25, { expr: 'smile', look: 1 }) + hero(880, 750, 1.3, { expr: 'worried', look: 1, R: 'up', handDots: 'R' }) +
    A.bubble(1040, 150, 90, 80, `<circle r="60" fill="#e6e1f2"/><circle cx="-14" cy="0" r="9" fill="#5a0f1c"/><circle cx="14" cy="0" r="9" fill="#5a0f1c"/>`, { tail: [1010, 290] }),
  // 36 — le réfrigérateur
  () => A.kitchen() + prop('garlic', 420, 446, 1.5) + prop('garlic', 480, 450, 1.2) + hero(760, 760, 1.25, { expr: 'smile', look: 1, R: 'hold', item: 'garlic', itemS: 1.2 }),
  // 37 — la touche finale
  () => A.kitchen() + prop('garlic', 200, 446, 1.5) + prop('knife', 290, 452, 1.4, { rot: 70 }) + prop('toast', 400, 446, 1.8) + prop('toast', 450, 450, 1.8) +
    hero(700, 760, 1.25, { expr: 'neutral', R: 'chin', L: 'hold', hand: 'L', item: 'plate', itemS: 1.3 }),
  // 38 — « c'est délicieux ! »
  () => room() + chair() + henri(630, Y, 1.3, { expr: 'happy', L: 'front', R: 'front', item: 'plate' }) + prop('heart', 600, 250, 1.6) + prop('heart', 660, 190, 1) + hero(840, 750, 1.25, { expr: 'happy', look: -1 }),
  // 39 — l'allergie
  () => room() + chair() + henri(630, Y, 1.3, { expr: 'worried', swollen: true, L: 'up', R: 'up' }) + prop('plate', 620, 716, 1.6, { empty: true }) + hero(860, 750, 1.25, { expr: 'scared', look: -1, R: 'ear', item: 'phone' }),
  // 40 — le SAMU
  () => room({ door: 'open' }) + flash(330, 300) + flash(600, 300, '#e0425a') + chair() + henri(630, Y, 1.25, { expr: 'dizzy', swollen: true }) + medic(830, 740, 1.25, { expr: 'neutral', look: -1, L: 'reach' }) + hero(1040, 770, 1.2, { expr: 'worried', look: -1 }),
  // 41 — « morte il y a six ans »
  () => A.kitchen() + medic(430, 760, 1.3, { expr: 'neutral', look: 1, R: 'reach' }) + hero(760, 760, 1.3, { expr: 'surprised', look: -1 }),
  // 42 — la tasse fume encore
  () => A.kitchen({ fridge: false }) + dim(0.15) + cel(R(-10, 600, 1220, 220), '#8a5f40', '#5f3f28', 0, -12) + prop('cup', 380, 560, 4.2) + prop('note', 700, 610, 4.2, { rot: -5 }) +
    prop('garlic', 1000, 580, 2.6) + prop('garlic', 1080, 600, 2) + prop('plate', 130, 640, 2.6, { empty: true }),
  // 43 — FIN
  () => fin('cup'),
  // 44 — le pain grillé
  () => room() + chair() + henri(630, Y, 1.3, { expr: 'sad', R: 'hold', item: 'toast', itemS: 1.2 }) + hero(820, 750, 1.25, { expr: 'worried', look: -1, L: 'front', R: 'front', item: 'tray', itemS: 1 }),
  // 45 — « Un pacte est un pacte »
  () => room() + chair() + henri(630, Y, 1.35, { expr: 'angry', look: 1, R: 'reach' }) + hero(900, 750, 1.2, { expr: 'scared', look: -1, L: 'up', R: 'up' }),
  // 46 — la fuite
  () => A.street() + A.house(330, 580, 0.95, { upLit: true }) + A.lamppost(760, 600, 1) + A.house(1040, 590, 0.7, { party: true }) + hero(620, 770, 1.2, { expr: 'scared', look: 1, L: 'up', R: 'up' }),
  // 47 — plus rien
  () => A.kitchen({ fridge: false }) + hero(520, 1010, 2.1, { expr: 'sad', redNose: true, R: 'hold', item: 'jar', itemS: 1.3 }) +
    A.bubble(960, 230, 150, 130, prop('garlic', 0, 0, 4) + line('M-80 -80 L80 80', 16, '#c8343f'), { thought: true, tail: [700, 380] }),
  // 48 — le message
  () => A.closeBG('#231c50', '#372e78') + G(600, 420, 1, flat(R(-190, -350, 380, 700, 44), '#2a2540') + plain(R(-166, -310, 332, 620, 16), '#e6f3fb') +
    cel(R(-146, -250, 250, 150, 26), '#ffffff', '#cdd8e0', 6, 5) + line('M-120 -210 h190 M-120 -175 h190 M-120 -140 h120', 9, '#8d86a8') +
    cel(R(-146, -50, 250, 150, 26), '#ffffff', '#cdd8e0', 6, 5) + line('M-120 -10 h190 M-120 25 h190 M-120 60 h90', 9, '#8d86a8') + prop('garlic', 96, 190, 2.4) + A.bat(-70, 200, 1.6)),
  // 49 — FIN
  () => fin('garlic'),
  // 50 — le cadre tombe
  () => A.floorOnly() + prop('frame', 560, 430, 6.5, { rot: -14 }) + A.burst(930, 250, 90) + prop('glass', 1010, 610, 3),
  // 51 — BAM !
  () => room() + A.burst(1050, 300, 120) + chair({ head: 'back' }) + bedside() + prop('glass', 590, 596, 1.1) + hero(860, 750, 1.25, { expr: 'surprised', look: 1, L: 'hold', hand: 'L', item: 'frame' }),
  // 52 — « Qui va là ? »
  () => room() + dim(0.2) + chair() + henri(630, Y, 1.35, { expr: 'angry', look: 1, R: 'up' }) + hero(940, 750, 1.15, { expr: 'scared', look: -1 }),
  // 53 — la porte est coincée
  () => `<rect width="1200" height="800" fill="#463b7c"/>` + flat(R(560, -20, 560, 840, 6), '#2a2148') + cel(R(590, 10, 500, 800, 4), '#6a4a66', '#4d3350', 14, 0) + flat(R(640, 60, 400, 300, 6), '#5d4059') + flat(R(640, 420, 400, 400, 6), '#5d4059') +
    `<circle cx="640" cy="400" r="26" fill="#f2c230" stroke="${A.OUT}" stroke-width="5"/>` + dim(0.25) + shadowFigure(210, 820, 1.7) + hero(830, 1000, 1.9, { expr: 'scared', look: -1, L: 'reach' }),
  // 54 — un homme très âgé, presque transparent
  () => room() + dim(0.2) + chair() + henri(630, Y, 1.4, { expr: 'sad', look: 1, ghost: 0.6 }) + hero(880, 750, 1.25, { expr: 'worried', look: -1 }),
  // 55 — choix : le cadre ou la porte
  () => room() + chair() + henri(630, Y, 1.25, { expr: 'sad', look: 1, ghost: 0.6 }) + prop('frame', 600, 720, 1.8, { rot: -75 }) + hero(800, 750, 1.25, { expr: 'worried' }),
  // 56 — « Yvonne… »
  () => room() + chair() + henri(630, Y, 1.35, { expr: 'sad', L: 'front', R: 'front', item: 'frame' }) + hero(840, 750, 1.25, { expr: 'sad', look: -1 }),
  // 57 — « je tiens toujours mes promesses »
  () => room() + chair({ head: 'turn', expr: 'smile', look: 1 }) + bedside() + prop('frame', 590, 590, 1.2) + hero(880, 750, 1.25, { expr: 'worried', look: -1 }),
  // 58 — choix : l'amour ou l'échiquier
  () => room({ winX: 120 }) + A.chairBack(260, Y, 1.35, { head: 'turn', expr: 'neutral', look: 1 }) + A.chessTable(620, 740, 1.5) + hero(880, 750, 1.25, { expr: 'worried', R: 'chin' }),
  // 59 — votre grand amour
  () => room({ door: null }) + chair({ head: 'turn', expr: 'happy' }) + A.bed(960, 740, 1.2) + hero(880, 716, 1.2, { expr: 'happy', look: -1, sit: true, L: 'reach' }) + A.bubble(1000, 160, 110, 90, prop('heart', 0, -4, 3.4), { tail: [930, 300] }),
  // 60 — l'alliance
  () => A.closeBG('#463b7c', '#5a4d99') + `<circle cx="600" cy="400" r="170" fill="#fff3a8" opacity=".25"/>` +
    `<path d="M-40 620 L470 470" stroke="${A.OUT}" stroke-width="150" stroke-linecap="round"/><path d="M-40 620 L470 470" stroke="#74553f" stroke-width="136" stroke-linecap="round"/><circle cx="500" cy="462" r="74" fill="#ddd6c6" stroke="${A.OUT}" stroke-width="7"/>` +
    `<path d="M1240 620 L730 520" stroke="${A.OUT}" stroke-width="150" stroke-linecap="round"/><path d="M1240 620 L730 520" stroke="#2f2a4d" stroke-width="136" stroke-linecap="round"/><circle cx="700" cy="514" r="74" fill="#e6e1f2" stroke="${A.OUT}" stroke-width="7"/>` +
    prop('ring', 600, 370, 5),
  // 61 — retour à la fête
  () => A.street() + A.house(250, 580, 0.8, { upLit: true }) + A.lamppost(520, 600, 1) + A.house(930, 600, 1, { party: true }) + hero(600, 770, 1.2, { expr: 'smile', look: 1, R: 'hold', item: 'ring', itemS: 0.8 }),
  // 62 — le journal
  () => A.kitchen({ fridge: false }) + cel(R(-10, 620, 1220, 200), '#8a5f40', '#5f3f28', 0, -12) + prop('newspaper', 560, 420, 7.5, { rot: -4 }) + prop('cup', 1060, 600, 3.6) + prop('toast', 110, 660, 3.5),
  // 63 — la promesse
  () => A.closeBG('#f7c98a', '#fbe0b0') + [[230, 230, 2], [990, 200, 2.6], [1040, 520, 1.6], [180, 520, 1.4]].map(([x, y, s]) => prop('heart', x, y, s)).join('') +
    hero(600, 1010, 2.1, { expr: 'happy', R: 'hold', item: 'ring', itemS: 1.3 }),
  // 64 — FIN
  () => fin('ring', {}, 9),
  // 65 — « Vous jouez aux échecs ? »
  () => room({ winX: 120 }) + A.chairBack(260, Y, 1.35) + henri(400, Y, 1.3, { expr: 'happy', L: 'up', R: 'up' }) + A.chessTable(640, 740, 1.5) + hero(900, 750, 1.25, { expr: 'smile', look: -1, L: 'reach' }),
  // 66 — la partie commence
  () => room({ winX: 460, door: null }) + A.chairFront(300, 734, 1.3) + henri(300, 724, 1.3, { expr: 'smile', look: 1, sit: true, R: 'hold' }) + hero(880, 724, 1.3, { expr: 'smile', look: -1, sit: true, L: 'hold' }) + A.chessTable(605, 760, 1.6),
  // 67 — le cavalier
  () => A.closeBG('#463b7c', '#5a4d99') + henri(260, 1150, 2.3, { expr: 'smile', look: 1 }) + hero(960, 1160, 2.2, { expr: 'surprised', look: -1 }) +
    `<circle cx="610" cy="330" r="150" fill="#fff3a8" opacity=".25"/>` + prop('knight', 610, 330, 7, { dark: true }),
  // 68 — Mme Morticia ouvre la porte
  () => room({ window: false, door: null }) + flat(R(410, 80, 380, 560, 6), '#2a2148') + plain(R(430, 100, 340, 520), '#f1dc94') + cel(P('M770 100 L880 70 L880 660 L770 620Z'), '#6a4a66', '#4d3350', 6, 0) +
    morticia(600, 650, 1.35, { expr: 'angry', look: 1 }) + A.chessTable(1000, 760, 1.4) + hero(220, 760, 1.3, { expr: 'surprised', look: 1 }),
  // 69 — le fauteuil est vide
  () => room({ winX: 120, door: 'open' }) + A.chairFront(330, Y, 1.35) + A.chessTable(620, 750, 1.5) + hero(860, 750, 1.25, { expr: 'scared', look: -1, L: 'reach' }) + morticia(1080, 760, 1.2, { expr: 'angry', look: -1 }),
  // 70 — une silhouette à la fenêtre
  () => A.street({ moonX: 180 }) + A.lamppost(1080, 600, 1) + A.house(700, 600, 1.25, { upLit: true, fig: true }) + hero(250, 790, 1.4, { expr: 'worried', look: 1 }),
  // 71 — « Échec et mat. »
  () => `<rect width="1200" height="800" fill="#6456a0"/>` + [80, 180, 280, 380, 480, 580, 680].map((y) => `<rect y="${y}" width="1200" height="4" fill="#554890"/>`).join('') +
    flat(R(250, 60, 700, 700, 8), '#3a2f63') + clip(R(280, 90, 640, 640), `<rect x="280" y="90" width="640" height="640" fill="#f6dc7a"/><circle cx="600" cy="420" r="300" fill="#fff8d0"/>` + henri(600, 1090, 2.3, { expr: 'angry', noShadow: true, ghost: 0.85 })) +
    line('M600 90 V730 M280 410 H920', 12) + plain(P('M1000 0 L940 180 L1010 170 L930 400 L1090 130 L1020 140 L1080 0Z'), '#fff3a8', `stroke="${A.OUT}" stroke-width="5" stroke-linejoin="round"`) + prop('knight', 150, 650, 4, { dark: true }),
  // 72 — FIN
  () => fin('knight', { dark: true }),
  // 73 — la lumière s'allume
  () => room({ lit: true, photos: true }) + chair() + henri(630, Y, 1.3, { expr: 'neutral', look: 1 }) + A.burst(930, 400, 46) + thinSwitch(930, 400) + hero(870, 750, 1.25, { expr: 'surprised', look: -1, R: 'up' }),
  // 74 — 31 octobre 1932
  () => room({ lit: true, photos: true, window: false }) + flat(R(330, 90, 330, 400, 6), '#6a4433') + clip(R(354, 114, 282, 300), `<rect x="354" y="114" width="282" height="300" fill="#d9d4c8"/>` + G(495, 300, 0.42, A.house(0, 160, 1, {})) +
    G(440, 420, 0.5, henriGrey()) + G(550, 420, 0.5, yvonneGrey())) + plain(R(354, 420, 282, 46), '#f8f1dd') +
    `<text x="495" y="452" font-family="'Open Sans',sans-serif" font-weight="700" font-size="24" fill="${A.OUT}" text-anchor="middle">31 octobre 1932</text>` +
    henri(170, 760, 1.2, { expr: 'neutral', look: 1 }) + hero(880, 750, 1.25, { expr: 'worried', look: 1, R: 'reach', item: 'opener', itemS: 1.3, itemO: { rot: 80 } }),
  // 75 — les lettres sur la table
  () => room({ lit: true, photos: true }) + chair({ head: 'turn', expr: 'neutral', look: 1 }) + A.table(730, 750, 1.4, { w: 90, h: 80 }) + prop('envelope', 690, 608, 1.3, { stamp: true, rot: -8 }) + prop('envelope', 770, 606, 1.3, { typed: true, rot: 6 }) +
    hero(940, 750, 1.2, { expr: 'worried', look: -1 }),
  // 76 — choix : deux lettres
  () => `<rect width="1200" height="800" fill="#8a5f40"/>` + [200, 400, 600].map((y) => `<rect y="${y}" width="1200" height="5" fill="#74502f"/>`).join('') +
    prop('envelope', 330, 400, 6.4, { stamp: true, rot: -7 }) + prop('envelope', 880, 420, 6.4, { typed: true, rot: 5 }),
  // 77 — la lettre d'Élise
  () => room({ lit: true, photos: true, window: false }) + A.bubble(270, 210, 240, 170, hollywood, { thought: true, tail: [720, 400] }) + A.chairBack(540, Y, 1.3, { head: 'turn', expr: 'sad', look: 1 }) +
    hero(820, 750, 1.3, { expr: 'smile', L: 'front', R: 'front', item: 'paper', itemS: 1.3 }),
  // 78 — Minou se faufile
  () => room({ lit: true, photos: true, door: 'open' }) + chair() + henri(630, Y, 1.3, { expr: 'sad', look: -1, L: 'down' }) + cat(480, 750, 1.15, { look: 1 }) + hero(900, 750, 1.2, { expr: 'smile', look: -1 }),
  // 79 — au revoir, Minou
  () => A.porch() + henri(600, 668, 1.25, { expr: 'smile', look: -1, L: 'reach' }) + hero(280, 790, 1.4, { expr: 'happy', look: 1, L: 'front', R: 'front', item: 'cat' }),
  // 80 — FIN
  () => fin('cat'),
  // 81 — la lettre du notaire
  () => room({ lit: true, photos: true, window: false, door: null }) + prop('paper', 420, 400, 9.5, { typed: true, rot: -4 }) + hero(930, 1010, 2, { expr: 'surprised', look: -1 }),
  // 82 — une longue histoire
  () => room({ lit: true, photos: true, winX: 60 }) + A.chairFront(480, Y, 1.35) + henri(480, 716, 1.3, { expr: 'sad', sit: true, R: 'reach' }) + hero(860, 750, 1.25, { expr: 'worried', look: -1 }),
  // 83 — la pendule arrêtée à 23 h 44
  () => room({ lit: true, door: null, winX: 120 }) + G(0, 20, 1, A.fireplace(900, 600, { clock: [11, 44] })) + henri(330, Y, 1.3, { expr: 'sad', look: -1, ghost: 0.75 }) + hero(660, 750, 1.2, { expr: 'worried', look: 1 }),
  // 84 — la porte s'entrouvre
  () => room({ lit: true, photos: true, door: 'open' }) + chair({ head: 'turn', expr: 'smile', look: 1 }) + hero(900, 750, 1.25, { expr: 'surprised', look: -1 }),
  // 85 — le miroir de l'entrée
  () => A.hall({ doorX: 1010, mirror: [430, 320, 250], mirrorInner: `<rect x="200" y="50" width="460" height="540" fill="#bcd3e0"/>` + henri(430, 640, 1.05, { expr: 'smile', noShadow: true, ghost: 0.45 }) + hero(330, 660, 1.05, { expr: 'surprised', noShadow: true }) + morticia(540, 650, 1.05, { expr: 'happy', noShadow: true }) }) +
    hero(180, 790, 1.3, { expr: 'surprised', look: 1 }) + morticia(790, 770, 1.3, { expr: 'happy', look: -1, L: 'reach' }),
  // 86 — FIN
  () => A.sky({ band: 520 }) + A.moon(600, 350, 235) + bats([[200, 170, 1.5], [1000, 230, 1.2], [860, 90, 0.9]]) + plain(P('M0 640 Q300 560 600 640 Q900 560 1200 640 V800 H0Z'), '#231c50') + A.house(170, 690, 0.5, { upLit: true }) + A.pumpkin(1010, 740, 1.1) +
    cel(E(600, 360, 150, 200), '#b08a2e', '#7d5f17', 8, 5) + flat(E(600, 360, 126, 176), '#bcd3e0') + clip(E(600, 360, 122, 172), henri(600, 640, 1.15, { expr: 'smile', noShadow: true, ghost: 0.4 }) + `<path d="M480 330 l150 -150 l40 0 l-150 150z" fill="#fff" opacity=".35"/>`),
];

function thinSwitch(x, y) { return flat(R(x - 14, y - 20, 28, 40, 4), '#fbf7ee') + flat(R(x - 5, y - 10, 10, 18, 2), '#cfc7b0'); }
// Le couple sur les vieilles photographies (tons gris).
function henriGrey() { return plain(P('M-40 0 Q-46 -150 0 -160 Q46 -150 40 0Z'), '#3b3a44') + plain(E(0, -200, 36, 44), '#a9a39a') + plain(P('M-12 -160 L0 -110 L12 -160Z'), '#e6e1dc'); }
function yvonneGrey() { return plain(P('M-56 0 Q-40 -150 0 -160 Q40 -150 56 0Z'), '#f4f2ee') + plain(P('M-44 -120 Q-52 -240 0 -246 Q52 -240 44 -120Z'), '#e6e1dc') + plain(E(0, -196, 32, 38), '#a9a39a'); }

if (slides.length !== 87) throw new Error(`87 scènes attendues, ${slides.length} définies`);
slides.forEach((draw, i) => {
  A.resetIds();
  writeFileSync(join(out, `slide-${String(i + 1).padStart(2, '0')}.svg`), A.svg(draw()));
});
console.log(`${slides.length} illustrations écrites dans site/images/`);
