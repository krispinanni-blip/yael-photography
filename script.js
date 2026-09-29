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
  document.querySelectorAll('.masonry-item img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
    });
  });
  const closeLightbox = () => lightbox.classList.remove('open');
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  const revealEls = document.querySelectorAll('.section-heading, .masonry-item, .about-text, .about-image, .contact-item');
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
});
