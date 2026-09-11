// ==========================================
// 1. INICIALIZACIÓN GLOBAL AL CARGAR LA PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

  // --- A. Menú de navegación móvil ---
  inicializarMenuMovil();

  // --- B. Carrusel de imágenes automático ---
  inicializarCarrusel();

  // --- C. Carga del Versículo Diario desde API ---
  obtenerVersiculoApi();

  // --- D. Formulario de Contacto ---
  inicializarFormulario();

  // --- E. Acceso Secreto Administrador ---
  inicializarAccesoAdmin();

});


// ==========================================
// 2. FUNCIONES DE INICIALIZACIÓN (LÓGICA)
// ==========================================

// A. Función para el Menú Responsive
function inicializarMenuMovil() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

// B. Función para el Carrusel de Imágenes
function inicializarCarrusel() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (slides.length === 0) return;

  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }
  }

  function nextSlide() { showSlide(currentSlide + 1); }
  function prevSlide() { showSlide(currentSlide - 1); }

  function startAutoplay() {
    slideInterval = setInterval(nextSlide, 5000); // Cambia cada 5 segundos
  }

  function resetAutoplay() {
    clearInterval(slideInterval);
    startAutoplay();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      resetAutoplay();
    });
  });

  startAutoplay();
}

// C. Función API Versículo Bíblico
async function obtenerVersiculoApi() {
  const verseElement = document.getElementById('bibleVerse');
  const refElement = document.getElementById('verseReference');
  const copyBtn = document.getElementById('copyVerseBtn');
  const shareBtn = document.getElementById('shareVerseBtn');

  if (!verseElement) return;

  let textoCompartir = '';

  try {
    const response = await fetch('https://bible-api.com/?random=verse&translation=rvr');
    const data = await response.json();

    const textoLimpio = data.text.replace(/\n/g, ' ').trim();
    const cita = data.reference;

    verseElement.textContent = `"${textoLimpio}"`;
    refElement.textContent = `— ${cita}`;

    textoCompartir = `"${textoLimpio}" — ${cita}\n\nIglesia Alto Refugio Comalcalco`;
  } catch (error) {
    const textoBase = "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.";
    const citaBase = "Salmos 46:1";

    verseElement.textContent = `"${textoBase}"`;
    refElement.textContent = `— ${citaBase}`;

    textoCompartir = `"${textoBase}" — ${citaBase}\n\nIglesia Alto Refugio Comalcalco`;
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(textoCompartir).then(() => {
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> ¡Copiado!';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copiar Versículo';
        }, 2000);
      });
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Alto Refugio Comalcalco',
            text: textoCompartir,
            url: window.location.href
          });
        } catch (err) {}
      } else {
        if (copyBtn) copyBtn.click();
      }
    });
  }
}

// D. Función para el Formulario de Contacto
function inicializarFormulario() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const mensaje = document.getElementById('mensaje').value.trim();

      if (nombre && email && mensaje) {
        formStatus.style.color = '#16a34a';
        formStatus.textContent = '¡Gracias por contactarnos! Responderemos a la brevedad.';
        contactForm.reset();
      } else {
        formStatus.style.color = '#dc2626';
        formStatus.textContent = 'Por favor, completa todos los campos.';
      }
    });
  }
}

// E. Función para Control de Acceso Secreto al Panel Admin
function inicializarAccesoAdmin() {
  const loginSection = document.getElementById('loginSection');
  if (!loginSection) return;

  // 1. Detectar parámetro ?admin=true en la URL
  const urlParams = new URLSearchParams(window.location.search);
  const esRutaAdmin = urlParams.get('admin') === 'true';

  if (esRutaAdmin) {
    loginSection.classList.remove('hidden');
  } else {
    loginSection.classList.add('hidden');
  }

  // 2. Atajo de teclado adicional (Ctrl + Shift + A) para alternar el login
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
      loginSection.classList.toggle('hidden');
    }
  });
}
