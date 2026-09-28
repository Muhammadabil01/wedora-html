# Wedora — Static Website

Pure HTML5 + CSS3 + vanilla JavaScript. No build step, PHP, Node or backend.

- Open `index.html` directly, or with VS Code Live Server.
- GitHub Pages: push the contents of this folder to a repo, then Settings → Pages → deploy from branch (root).

Structure: `index.html`, `pages/*.html` (templates, template-<slug> x8, pricing, how-it-works, faq, order, confirmation, about), `css/style.css`, `js/script.js`, `images/`, `favicon.ico`.

The order form is front-end only: it validates, then goes to `pages/confirmation.html`.
