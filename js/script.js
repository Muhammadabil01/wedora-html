(() => {
  const one = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];

  const menuButton = one('[data-menu-toggle]');
  const mobileNav = one('[data-mobile-nav]');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menuButton.setAttribute('aria-label', open ? 'Buka menu' : 'Tutup menu');
      mobileNav.hidden = open;
    });
  }

  all('[data-accordion]').forEach((accordion) => {
    all('button[aria-controls]', accordion).forEach((button) => {
      button.addEventListener('click', () => {
        const opening = button.getAttribute('aria-expanded') !== 'true';
        all('button[aria-controls]', accordion).forEach((other) => {
          other.setAttribute('aria-expanded', 'false');
          const panel = document.getElementById(other.getAttribute('aria-controls'));
          if (panel) panel.hidden = true;
        });
        if (opening) {
          button.setAttribute('aria-expanded', 'true');
          const panel = document.getElementById(button.getAttribute('aria-controls'));
          if (panel) panel.hidden = false;
        }
      });
    });
  });

  const catalog = one('[data-catalog]');
  if (catalog) {
    const search = one('[data-template-search]', catalog);
    const sort = one('[data-template-sort]', catalog);
    const grid = one('[data-template-grid]', catalog);
    const empty = one('[data-empty-state]', catalog);
    const count = one('[data-result-count]', catalog);
    const filters = all('[data-category]', one('.filter-row', catalog));
    let category = 'All';
    const update = () => {
      const query = search.value.trim().toLowerCase();
      const cards = all('[data-template-card]', grid);
      cards.sort((a, b) => {
        if (sort.value === 'low') return +a.dataset.price - +b.dataset.price;
        if (sort.value === 'high') return +b.dataset.price - +a.dataset.price;
        if (sort.value === 'new') return +b.dataset.new - +a.dataset.new;
        return +b.dataset.rating - +a.dataset.rating;
      }).forEach(card => grid.append(card));
      let visible = 0;
      cards.forEach(card => {
        const show = (category === 'All' || card.dataset.category === category) && card.dataset.name.includes(query);
        card.classList.toggle('is-hidden', !show);
        if (show) visible += 1;
      });
      count.textContent = visible;
      empty.hidden = visible > 0;
      grid.hidden = visible === 0;
    };
    search.addEventListener('input', update);
    sort.addEventListener('change', update);
    filters.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.category;
      filters.forEach(item => { item.classList.toggle('btn-primary', item === button); item.classList.toggle('btn-outline', item !== button); });
      update();
    }));
    one('[data-reset-search]', catalog).addEventListener('click', () => {
      search.value = ''; category = 'All'; sort.value = 'popular';
      filters.forEach(item => { const active = item.dataset.category === 'All'; item.classList.toggle('btn-primary', active); item.classList.toggle('btn-outline', !active); });
      update();
    });
  }

  const preview = one('[data-device-preview]');
  const switcher = one('[data-device-switch]');
  if (preview && switcher) all('[data-device]', switcher).forEach(button => button.addEventListener('click', () => {
    preview.classList.remove('desktop', 'tablet', 'mobile');
    preview.classList.add(button.dataset.device);
    all('[data-device]', switcher).forEach(item => { const active = item === button; item.classList.toggle('btn-primary', active); item.classList.toggle('btn-ghost', !active); });
  }));

  const form = one('[data-order-form]');
  if (form) form.addEventListener('submit', (event) => {
    let valid = true;
    all('[required]', form).forEach(field => {
      const message = !field.value.trim() ? 'Wajib diisi' : field.type === 'email' && !/^[^@]+@[^@]+\.[^@]+$/.test(field.value) ? 'Masukkan email yang valid' : '';
      field.setAttribute('aria-invalid', String(Boolean(message)));
      const error = field.parentElement.querySelector('.field-error');
      if (error) error.textContent = message;
      if (message) valid = false;
    });
    if (!valid) { event.preventDefault(); one('[aria-invalid="true"]', form)?.focus(); return; }
    event.preventDefault();
    const submit = one('[data-submit-order]', form);
    submit.disabled = true; submit.textContent = 'Mengirim pesanan...';
    window.setTimeout(() => { window.location.href = form.action; }, 700);
  });
})();

(() => {
  const form = document.querySelector('[data-order-form]');
  if (!form) return;
  const params = new URLSearchParams(window.location.search);
  ['template', 'package'].forEach((key) => {
    const value = params.get(key);
    const select = form.querySelector(`select[name="${key}"]`);
    if (value && select) select.value = value;
  });
})();
