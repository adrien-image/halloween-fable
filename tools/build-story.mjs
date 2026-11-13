// Transforme story/Halloween_version_2.md en site/story.js.
// Le texte est repris tel quel : seuls les marqueurs de structure
// (PAGE n, CHOIX x, SI CHOIX x, OU, ---) sont retirés.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const md = readFileSync(join(root, 'story/Halloween_version_2.md'), 'utf8');

const bare = (l) => l.replace(/[#*]/g, '').replace(/\s+/g, ' ').trim();
const LABEL = '([AB](?:\\.\\d)*)';
const rePage = /^PAGE (\d+)$/;
const reChoice = new RegExp(`^CHOIX ${LABEL}\\s*:?$`, 'i');
const reIf = new RegExp(`^SI CHOIX ${LABEL}\\b`, 'i');

const slides = [];
let cur = null; // slide en cours
let choice = null; // choix en cours
let pendingLabel = null;
let para = [];

const flush = () => {
  if (para.length && cur) (choice ? choice.text : cur.text).push(para.join('\n'));
  para = [];
};

for (const raw of md.split('\n')) {
  const line = raw.replace(/\s+$/, '');
  const b = bare(line);
  let m;
  if (line.trim() === '') { flush(); continue; }
  if ((m = b.match(rePage))) {
    flush();
    cur = { id: slides.length + 1, page: m[1], text: [], choices: [] };
    if (pendingLabel) { cur.label = pendingLabel; pendingLabel = null; }
    choice = null;
    slides.push(cur);
    continue;
  }
  if ((m = b.match(reIf))) {
    flush();
    const label = m[1].toUpperCase();
    // Cas "PAGE 59" placé avant son titre "SI CHOIX B.1.1"
    if (cur && !cur.text.length && !cur.choices.length && !cur.label) cur.label = label;
    else pendingLabel = label;
    choice = null;
    continue;
  }
  if ((m = b.match(reChoice))) {
    flush();
    choice = { label: m[1].toUpperCase(), text: [] };
    cur.choices.push(choice);
    continue;
  }
  if (b === 'OU' || /^-{3,}$/.test(line.trim()) || /^# /.test(line)) { flush(); continue; }
  para.push(line.trim());
}
flush();

// Liens entre slides
const byLabel = Object.fromEntries(slides.filter((s) => s.label).map((s) => [s.label, s.id]));
slides.forEach((s, i) => {
  s.image = `images/slide-${String(s.id).padStart(2, '0')}.svg`;
  s.end = s.text.length === 1 && bare(s.text[0]) === 'FIN !';
  if (s.choices.length) {
    for (const c of s.choices) {
      c.to = byLabel[c.label];
      if (!c.to) throw new Error(`Choix ${c.label} sans conséquence`);
    }
  } else if (!s.end) {
    const next = slides[i + 1];
    if (!next || next.label) throw new Error(`Page ${s.page} sans suite`);
    s.next = next.id;
  }
  if (s.choices.length !== 0 && s.choices.length !== 2) throw new Error(`Page ${s.page}: ${s.choices.length} choix`);
});

writeFileSync(join(root, 'site/story.js'), `window.STORY = ${JSON.stringify(slides, null, 1)};\n`);
console.log(`${slides.length} slides, ${slides.filter((s) => s.end).length} fins, ${slides.filter((s) => s.choices.length).length} embranchements`);
