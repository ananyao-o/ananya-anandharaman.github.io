/* main.js — content injection, navigation state, fade-ins, and small utilities */

(() => {
  const cfg = window.SITE_CONFIG || window.__PORTFOLIO_CONFIG__;
  if (!cfg) {
    console.error('SITE_CONFIG is missing. Load js/config.js before main.js.');
    return;
  }

  let initialised = false;

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function svgIcon(name) {
    const common = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
    switch (name) {
      case 'email':
        return `<svg ${common}><rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="M3 7.5 12 13l9-5.5"/></svg>`;
      case 'github':
        return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.75 5.57.75 11.87c0 5.02 3.27 9.28 7.81 10.77.57.11.78-.25.78-.54 0-.27-.01-.99-.02-1.94-3.18.71-3.84-1.57-3.84-1.57-.52-1.35-1.27-1.71-1.27-1.71-1.04-.72.08-.71.08-.71 1.15.08 1.75 1.2 1.75 1.2 1.02 1.79 2.68 1.27 3.33.97.1-.75.4-1.27.73-1.56-2.54-.29-5.21-1.31-5.21-5.83 0-1.29.45-2.34 1.19-3.17-.12-.29-.52-1.48.11-3.08 0 0 .97-.32 3.2 1.21a10.8 10.8 0 0 1 5.83 0c2.23-1.53 3.2-1.21 3.2-1.21.63 1.6.24 2.79.12 3.08.74.83 1.19 1.88 1.19 3.17 0 4.53-2.68 5.54-5.23 5.82.41.36.78 1.06.78 2.14 0 1.55-.02 2.8-.02 3.18 0 .29.2.65.79.54A11.37 11.37 0 0 0 23.25 11.87C23.25 5.57 18.27.5 12 .5Z"/></svg>`;
      case 'cv':
        return `<svg ${common}><path d="M7 2.75h7L19.25 8v13.25H7A2.25 2.25 0 0 1 4.75 19V5A2.25 2.25 0 0 1 7 2.75Z"/><path d="M14 2.75V8h5.25"/><path d="M9 12.5h6"/><path d="M9 15.75h6"/></svg>`;
      case 'research':
        return `<svg ${common}><path d="M4 19.5h16"/><path d="M7 19.5V10l4-2.5 4 2.5v9.5"/><path d="M9.5 19.5v-4.75h5V19.5"/><path d="M12 7.5V5"/></svg>`;
      case 'linkedin':
        return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
      case 'media':
        return `<svg ${common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m7 14 2.5-2.5L13 15l2-2 2 2.5"/><circle cx="10" cy="9" r="1.4"/></svg>`;
      default:
        return '';
    }
  }

  function create(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value == null) continue;
      if (key === 'class') el.className = value;
      else if (key === 'html') el.innerHTML = value;
      else if (key === 'text') el.textContent = value;
      else if (key.startsWith('data-')) el.setAttribute(key, value);
      else if (key === 'target') el.target = value;
      else if (key === 'rel') el.rel = value;
      else if (key === 'href') el.href = value;
      else if (key === 'download') el.download = value;
      else el.setAttribute(key, value);
    }
    for (const child of children) {
      if (child == null) continue;
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else el.appendChild(child);
    }
    return el;
  }

  function renderHero() {
    const root = qs('#hero-content');
    if (!root) return;
    root.innerHTML = '';

    const eyebrow = create('span', { class: 'hero-eyebrow', text: cfg.tagline });
    const title = create('h1', { class: 'hero-name', html: `${cfg.name.split(' ').slice(0, 1)[0]}<br><span>${cfg.name.split(' ').slice(1).join(' ')}</span>` });
    const sub = create('p', { class: 'hero-subtitle', text: cfg.institution });
    const note = create('p', { class: 'hero-note', html: cfg.heroQuote });

    const tags = create('div', { class: 'hero-tags' }, cfg.tags.map(tag => create('span', { class: 'htag', text: tag })));

    const ctas = create('div', { class: 'hero-ctas' });
    const researchBtn = create('a', { class: 'btn-primary', href: '#research', text: 'View research' });
    const mediaBtn = create('a', { class: 'btn-ghost', href: 'media.html', text: 'Open media' });
    ctas.append(researchBtn, mediaBtn);

    root.append(eyebrow, title, sub, note, tags, ctas);
  }

  function renderAbout() {
    const root = qs('#about-content');
    if (!root) return;
    root.innerHTML = '';

    const eyebrow = create('span', { class: 'section-eyebrow', text: 'About · Listening across scales' });
    const title = create('h2', { class: 'section-title', html: cfg.heroQuote });
    const body = create('p', { class: 'section-body', text: cfg.bio });

    const grid = create('div', { class: 'about-grid' });
    const cells = [
      ['Based', cfg.about.base],
      ['Affiliations', cfg.about.affiliations],
      ['Toolkit', cfg.about.toolkit],
      ['Languages', cfg.about.languages],
    ];
    cells.forEach(([label, value]) => {
      grid.appendChild(create('div', { class: 'about-cell' }, [
        create('span', { class: 'about-cell-label', text: label }),
        create('div', { class: 'about-cell-value', text: value }),
      ]));
    });

    root.append(eyebrow, title, body, grid);
  }

  function renderResearch() {
    const root = qs('#research-cards');
    if (!root) return;
    root.innerHTML = '';

    cfg.research.forEach(item => {
      const card = create('article', { class: 'rcard' });
      const badge = create('span', {
        class: `rcard-badge ${item.badgeType === 'blue' ? 'blue' : 'warm'}`,
        text: item.badge
      });
      const title = create('h3', { text: item.title });
      const desc = create('p', { text: item.description });
      const tools = create('div', { class: 'tool-chips' }, item.tools.map(tool => create('span', { class: 'tool-chip', text: tool })));

      card.append(badge, title, desc, tools);

      if (item.link) {
        card.append(create('a', { class: 'rcard-link', href: item.link, target: '_blank', rel: 'noreferrer', text: 'Open link ↗' }));
      }
      root.appendChild(card);
    });
  }

  function renderProjects() {
    const root = qs('#side-projects-cards');
    if (!root) return;
    root.innerHTML = '';

    cfg.sideProjects.forEach(item => {
      const card = create('article', { class: 'scard' });
      card.append(
        create('div', { class: 'scard-icon', text: item.icon || '•' }),
        create('h3', { text: item.title }),
        create('p', { text: item.description })
      );
      if (item.link) {
        card.append(create('a', { class: 'scard-link', href: item.link, target: '_blank', rel: 'noreferrer', text: 'Open project ↗' }));
      }
      root.appendChild(card);
    });
  }

  function renderWorkshops() {
    const root = qs('#workshops-cards');
    if (!root) return;
    root.innerHTML = '';

    cfg.workshops.forEach(item => {
      const card = create('article', { class: 'wcard' });
      card.append(
        create('span', { class: 'wcard-year', text: item.year }),
        create('h3', { text: item.title }),
        create('p', { text: item.description }),
      );
      root.appendChild(card);
    });
  }

  function renderCertifications() {
    const root = qs('#cert-cards');
    if (!root) return;
    root.innerHTML = '';

    cfg.certifications.forEach(item => {
      const card = create('article', { class: 'cert-card' });
      card.append(
        create('span', { class: 'cert-card-label', text: item.label }),
        create('p', { text: item.content }),
      );
      root.appendChild(card);
    });
  }

  function renderContact() {
    const root = qs('#contact-links');
    if (!root) return;
    root.innerHTML = '';

    const items = [
      cfg.contact.email1 && { label: cfg.contact.email1, href: `mailto:${cfg.contact.email1}`, icon: svgIcon('email') },
      cfg.contact.email2 && { label: cfg.contact.email2, href: `mailto:${cfg.contact.email2}`, icon: svgIcon('email') },
      cfg.contact.github && { label: cfg.contact.githubHandle || 'GitHub', href: cfg.contact.github, icon: svgIcon('github') },
      cfg.contact.cv && { label: 'Download CV', href: cfg.contact.cv, icon: svgIcon('cv'), download: '' },
      cfg.contact.linkedin && { label: 'LinkedIn', href: cfg.contact.linkedin, icon: svgIcon('linkedin') }
    ].filter(Boolean);

    items.forEach(item => {
      const a = create('a', {
        class: 'contact-link',
        href: item.href,
        target: item.href.startsWith('mailto:') ? '_self' : '_blank',
        rel: item.href.startsWith('mailto:') ? null : 'noreferrer',
        download: Object.prototype.hasOwnProperty.call(item, 'download') ? '' : null,
        html: `${item.icon}<span>${item.label}</span>`
      });
      root.appendChild(a);
    });
  }

  function setupCvButton() {
    const btn = qs('#cv-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (!cfg.contact.cv) return;
      window.open(cfg.contact.cv, '_blank', 'noopener,noreferrer');
    });
  }

  function setupFadeIns() {
    const els = qsa('.fade-in');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.16 });

    els.forEach(el => io.observe(el));
  }

  function setupDepthBar() {
    const dots = qsa('#depth-bar .depth-dot');
    const sections = ['space', 'cosmos', 'research', 'surface', 'crust', 'mantle', 'core']
      .map(id => document.getElementById(id))
      .filter(Boolean);

    function activeSection() {
      const mid = window.innerHeight * 0.48;
      let candidate = sections[0] || null;
      let candidateScore = Number.POSITIVE_INFINITY;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const score = Math.abs(rect.top + rect.height / 2 - mid);
        if (score < candidateScore) {
          candidateScore = score;
          candidate = section;
        }
      });

      return candidate;
    }

    function sync() {
      const current = activeSection();
      const id = current ? current.id : null;

      dots.forEach(dot => {
        const match = dot.dataset.section === id;
        dot.classList.toggle('active', match);
      });
    }

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const target = document.getElementById(dot.dataset.section);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(sync);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    sync();
  }

  function setupNavState() {
    const navLinks = qsa('#main-nav .nav-links a');
    const sections = ['space', 'cosmos', 'research', 'surface', 'crust', 'mantle', 'core']
      .map(id => document.getElementById(id))
      .filter(Boolean);

    const setActive = () => {
      const y = window.scrollY + window.innerHeight * 0.42;
      let currentId = sections[0]?.id || null;

      for (const sec of sections) {
        if (y >= sec.offsetTop) currentId = sec.id;
      }

      navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const hash = href.includes('#') ? href.slice(href.indexOf('#') + 1) : '';
        const isActive = hash === currentId;
        link.classList.toggle('active', isActive);
      });
    };

    window.addEventListener('scroll', () => requestAnimationFrame(setActive), { passive: true });
    window.addEventListener('resize', () => requestAnimationFrame(setActive));
    setActive();
  }

  function init() {
    if (initialised) return;
    initialised = true;

    renderHero();
    renderAbout();
    renderResearch();
    renderProjects();
    renderWorkshops();
    renderCertifications();
    renderContact();

    if (!cfg.showMedia) {
      qsa('a[href="media.html"]').forEach(a => (a.closest('li') || a).remove());
    }

    setupCvButton();
    setupFadeIns();
    setupDepthBar();
    setupNavState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
