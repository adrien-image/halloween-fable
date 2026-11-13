(() => {
  const slides = window.STORY;
  const byId = new Map(slides.map((s) => [s.id, s]));
  const root = document.getElementById('slide');
  const art = document.getElementById('art');
  const text = document.getElementById('text');
  const actions = document.getElementById('actions');

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // Le texte est affiché tel quel ; seuls le gras/italique Markdown et les retours à la ligne sont interprétés.
  const inline = (s) => esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
  const paragraphs = (list) => list.map((p) => `<p>${inline(p)}</p>`).join('');

  const button = (cls, html, onClick) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.innerHTML = html;
    b.addEventListener('click', onClick);
    return b;
  };

  const preload = (id) => { const s = byId.get(id); if (s) new Image().src = s.image; };

  function render(slide) {
    art.src = slide.image;
    text.className = 'text' + (slide.id === 1 ? ' cover' : '') + (slide.end ? ' end' : '');
    text.innerHTML = paragraphs(slide.text);
    actions.replaceChildren();
    if (slide.end) {
      actions.append(button('btn-restart', 'Revenir au début', () => go(1)));
    } else if (slide.choices.length) {
      slide.choices.forEach((c, i) => {
        if (i) {
          const or = document.createElement('div');
          or.className = 'or';
          or.textContent = 'OU';
          actions.append(or);
        }
        actions.append(button('btn-choice', paragraphs(c.text), () => go(c.to)));
        preload(c.to);
      });
    } else {
      actions.append(button('btn-next', 'Suite', () => go(slide.next)));
      preload(slide.next);
    }
  }

  let current = null;
  function show(id, animate) {
    const slide = byId.get(id) || byId.get(1);
    if (slide === current) return;
    current = slide;
    const swap = () => {
      render(slide);
      window.scrollTo(0, 0);
      root.classList.remove('leaving');
    };
    if (animate) {
      root.classList.add('leaving');
      setTimeout(swap, 220);
    } else swap();
  }

  function go(id) {
    history.pushState(null, '', id === 1 ? location.pathname : `#${id}`);
    show(id, true);
  }

  const fromHash = () => parseInt(location.hash.slice(1), 10) || 1;
  window.addEventListener('popstate', () => show(fromHash(), true));
  show(fromHash(), false);
})();
