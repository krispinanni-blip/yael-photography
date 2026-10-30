document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 600);
  });

  const heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      let nextSlide = Math.floor(Math.random() * heroSlides.length);
      if (nextSlide === currentSlide) nextSlide = (nextSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.remove('active');
      heroSlides[nextSlide].classList.add('active');
      currentSlide = nextSlide;
    }, 4500);
  }

  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  let lastFocused = null;
  const openLightbox = img => {
    lastFocused = document.activeElement;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    lightboxClose.focus();
  };
  document.querySelectorAll('.masonry-item img').forEach(img => {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', img.alt ? `View larger image: ${img.alt}` : 'View larger image');
    img.addEventListener('click', () => openLightbox(img));
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(img); }
    });
  });
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    if (lastFocused) lastFocused.focus();
  };
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  const revealEls = document.querySelectorAll('.section-heading, .about-text, .about-image, .contact-item, .blog-card');
  revealEls.forEach(el => el.classList.add('reveal'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => observer.observe(el));

  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.full-gallery .masonry-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.style.display = match ? '' : 'none';
      });
    });
  });

  const a11yToggle = document.getElementById('a11yToggle');
  const a11yPanel = document.getElementById('a11yPanel');
  if (a11yToggle && a11yPanel) {
    const root = document.documentElement;
    const FONT_STEPS = [100, 112.5, 125, 137.5, 150];
    let fontIndex = 0;

    const readStored = key => { try { return localStorage.getItem(key); } catch (e) { return null; } };
    const writeStored = (key, val) => { try { localStorage.setItem(key, val); } catch (e) {} };

    const applyFont = () => { root.style.fontSize = FONT_STEPS[fontIndex] + '%'; };

    const storedFont = parseInt(readStored('a11yFontIndex'), 10);
    if (!isNaN(storedFont) && storedFont >= 0 && storedFont < FONT_STEPS.length) {
      fontIndex = storedFont;
      applyFont();
    }
    if (readStored('a11yContrast') === '1') root.classList.add('a11y-contrast');
    if (readStored('a11yUnderline') === '1') root.classList.add('a11y-underline');

    const closePanel = () => {
      a11yPanel.hidden = true;
      a11yToggle.setAttribute('aria-expanded', 'false');
    };
    a11yToggle.addEventListener('click', () => {
      const open = a11yPanel.hidden;
      a11yPanel.hidden = !open;
      a11yToggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => {
      if (!a11yPanel.hidden && !a11yPanel.contains(e.target) && !a11yToggle.contains(e.target)) closePanel();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !a11yPanel.hidden) closePanel();
    });

    a11yPanel.querySelectorAll('button[data-a11y]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.a11y;
        if (action === 'font-inc') {
          fontIndex = Math.min(fontIndex + 1, FONT_STEPS.length - 1);
          applyFont();
          writeStored('a11yFontIndex', String(fontIndex));
        } else if (action === 'font-dec') {
          fontIndex = Math.max(fontIndex - 1, 0);
          applyFont();
          writeStored('a11yFontIndex', String(fontIndex));
        } else if (action === 'contrast') {
          root.classList.toggle('a11y-contrast');
          writeStored('a11yContrast', root.classList.contains('a11y-contrast') ? '1' : '0');
        } else if (action === 'underline') {
          root.classList.toggle('a11y-underline');
          writeStored('a11yUnderline', root.classList.contains('a11y-underline') ? '1' : '0');
        } else if (action === 'reset') {
          fontIndex = 0;
          root.style.fontSize = '';
          root.classList.remove('a11y-contrast', 'a11y-underline');
          writeStored('a11yFontIndex', '0');
          writeStored('a11yContrast', '0');
          writeStored('a11yUnderline', '0');
        }
      });
    });
  }
});
