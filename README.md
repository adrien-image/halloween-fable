# Une soirée d’Halloween presque parfaite ?

Histoire interactive d’Halloween (« dont vous êtes le héros »), publiée sur GitHub Pages.

- `story/Halloween_version_2.md` — le texte source, repris tel quel par le site.
- `tools/build-story.mjs` — découpe le texte en slides (`site/story.js`) : une slide par `PAGE`, avec ses choix.
- `tools/build-images.mjs` + `tools/art-lib.mjs` — génèrent une illustration SVG par slide (`site/images/`), style cartoon cel-shadé.
- `site/` — le site statique (HTML, CSS, JS, images).
- `.github/workflows/pages.yml` — régénère et déploie le site sur GitHub Pages à chaque commit.

## En local

```bash
node tools/build-story.mjs
```

```bash
node tools/build-images.mjs
```

```bash
npx serve site
```
