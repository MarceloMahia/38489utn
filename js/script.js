document.addEventListener('DOMContentLoaded', () => {

  /* 0. Cargar imágenes desde js/images.js (objeto IMAGES).
        Para corregir un link, editá SOLO ese archivo. */
  if (typeof IMAGES !== 'undefined') {
    document.querySelectorAll('[data-img]').forEach((el) => {
      const key = el.getAttribute('data-img');
      const url = IMAGES[key];

      if (!url) {
        console.warn(`[images.js] No existe la clave "${key}" en IMAGES.`);
        return;
      }

      if (el.tagName === 'IMG') {
        el.src = url;
      } else {
        el.style.backgroundImage = `url('${url}')`;
      }
    });
  } else {
    console.warn('js/images.js no se cargó: revisá que esté incluido antes de script.js.');
  }

  /* 1. Menú hamburguesa (responsive) */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.nav-menu a').forEach((link) => {
      link.addEventListener('click', () => {
        if (!link.classList.contains('dropdown-btn')) {
          navMenu.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* 1.b Submenú "Personajes": abrir/cerrar por click (no por hover) */
  const dropdowns = document.querySelectorAll('.dropdown');

  function closeAllDropdowns() {
    dropdowns.forEach((dd) => {
      dd.classList.remove('open');
      const btn = dd.querySelector('.dropdown-btn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  dropdowns.forEach((dropdown) => {
    const btn = dropdown.querySelector('.dropdown-btn');
    if (!btn) return;

    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', (e) => {
      e.preventDefault(); // el link es solo el disparador del submenú
      const willOpen = !dropdown.classList.contains('open');
      closeAllDropdowns();
      if (willOpen) {
        dropdown.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Al elegir un personaje del submenú, cerrarlo (y cerrar el menú mobile)
    dropdown.querySelectorAll('.dropdown-content a').forEach((link) => {
      link.addEventListener('click', () => {
        closeAllDropdowns();
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  });

  // Cerrar si se hace click afuera del submenú
  document.addEventListener('click', (e) => {
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        const btn = dropdown.querySelector('.dropdown-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Cerrar con la tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  /* 2. Lightbox de galería, accesible con teclado */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  let lastFocused = null;

  function openLightbox(item) {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-caption');
    if (!img || !lightbox || !lightboxImg) return;

    lastFocused = document.activeElement;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCaption) lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('is-open');
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    if (lastFocused) lastFocused.focus();
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  /* 3. Validación del formulario de contacto */
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  function setFeedback(message, type) {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.classList.remove('is-error', 'is-ok');
    if (type) formFeedback.classList.add(type);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const mensaje = document.getElementById('mensaje').value.trim();
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!nombre || !email || !mensaje) {
        setFeedback('Completá todos los campos requeridos antes de enviar.', 'is-error');
        return;
      }

      if (!emailValido) {
        setFeedback('Ese correo no parece válido. Revisalo antes de enviar.', 'is-error');
        return;
      }

      setFeedback('¡Mensaje recibido! Nos pondremos en contacto si sobrevivís.', 'is-ok');
      contactForm.reset();

      setTimeout(() => setFeedback('', null), 5000);
    });
  }

  /* 4. Contador de días desde el inicio del brote (easter egg) */
  const dayCounterEl = document.getElementById('dayCounter');
  if (dayCounterEl) {
    const outbreakStart = new Date('2010-10-31T00:00:00');
    const days = Math.floor((Date.now() - outbreakStart.getTime()) / (1000 * 60 * 60 * 24));
    dayCounterEl.textContent = `Día ${days.toLocaleString('es-AR')} desde el primer aviso.`;
  }

});