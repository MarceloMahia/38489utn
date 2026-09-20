/* ========================================================
   images.js — lista central de imágenes del sitio.
   Para corregir o reemplazar una imagen, cambiá SOLO el
   valor acá. No hace falta tocar el HTML ni el CSS.
   ======================================================== */

const IMAGES = {
  // Fondo de la sección Home / también usada en la galería (misma imagen)
  heroBg:        "https://d2thvodm3xyo6j.cloudfront.net/media/2016/06/94fc452b27fce56f-600x338.jpg",

  // Sección "Historia"
  doorsWarning:  "https://cdn.creativefabrica.com/2020/09/14/Dont-Open-Dead-Inside-Zombie-Graphic-Graphics-5482431-1.png",
  leaderBurden:  "https://ew.com/thmb/K1kcM6Su8azTAp8dXoCZstB0VxA=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc()/twd_408_gp_0730_0497-1-2000-cc1867644043498ba0ce83de98a7a6e8.jpg",

  // Sección "Galería"
  hospitalDoors: "https://archive.jsonline.com/Services/image.ashx?domain=www.jsonline.com&file=b99757556z.1_20160708093216_000_ge1gaff8.2-0.jpg&resize=660*444",
  leaderSad:     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN_re4jXg0J4UlDZquSmQjSL5uvgv5JZWMlyHZSxRpSA&s=10",
  cityArrival:   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm9fUyhks81mQlVegt-R_vtePB9c1OPbRdSVW8a9I9EldFmJE8kEfOybT4&s=10",
  daryl:         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZFEcqi5dY6vqXPsa7nmcBZxoBuVADvwgomeiO1q97IA&s=10",
  michonne:      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZofNB5KCqNgXV_uxQgxvUFK_BGnuuAk2fX7Vst6__2g&s=10",
  negan:         "https://www.cinemascomics.com/wp-content/uploads/2020/11/negan-lucille.jpg"
};



/*======================================================== */
/*                  LOGICA IMAGENES                          */
/*======================================================== */
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