/* ===== Script for CaseByYou ===== */
(function() {
  'use strict';

  // ===== WhatsApp Configuration =====
  const WHATSAPP_NUMBER = '6281234567890'; // Ganti dengan nomor WhatsApp Anda

  // ===== Navbar Scroll Effect =====
  const navbar = document.querySelector('.navbar');
  
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ===== Mobile Menu =====
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navbarNav = document.querySelector('.navbar-nav');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      navbarNav.classList.toggle('active');
      document.body.style.overflow = navbarNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking nav links
    navbarNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navbarNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== iPhone Model Selector =====
  const modelChips = document.querySelectorAll('.model-chip');
  let selectedModel = '';

  modelChips.forEach(chip => {
    chip.addEventListener('click', () => {
      modelChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedModel = chip.dataset.model;
    });
  });

  // ===== WhatsApp Links =====
  function generateWhatsAppLink(message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  }

  // Order buttons
  document.querySelectorAll('[data-wa-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.dataset.waAction;
      let message = '';

      switch(action) {
        case 'order':
          const productName = btn.dataset.productName || 'Custom Case';
          const model = selectedModel || 'Belum dipilih';
          message = `Halo! Saya tertarik untuk memesan casing "${productName}".\n\nModel iPhone: ${model}\n\nMohon info lebih lanjut ya. Terima kasih! 🙏`;
          break;
        case 'couple':
          message = `Halo! Saya tertarik memesan Couple Case untuk iPhone.\n\nModel iPhone: ${selectedModel || 'Belum dipilih'}\n\nMohon info desain couple case yang tersedia ya. Terima kasih! 💕`;
          break;
        case 'custom':
          message = `Halo! Saya ingin request custom design casing iPhone.\n\nModel iPhone: ${selectedModel || 'Belum dipilih'}\nKonsep/Tema: (silakan deskripsikan)\n\nMohon info lebih lanjut ya. Terima kasih! 🎨`;
          break;
        case 'general':
          message = `Halo! Saya tertarik dengan casing iPhone dari CaseByYou.\n\nModel iPhone: ${selectedModel || 'Belum dipilih'}\n\nMohon info lebih lanjut ya. Terima kasih! 😊`;
          break;
        case 'model-order':
          message = `Halo! Saya ingin memesan casing untuk ${selectedModel || 'iPhone'}.\n\nMohon info katalog dan harga yang tersedia ya. Terima kasih! 📱`;
          break;
        default:
          message = `Halo! Saya tertarik dengan produk casing iPhone dari CaseByYou. Mohon info lebih lanjut ya!`;
      }

      window.open(generateWhatsAppLink(message), '_blank');
    });
  });

  // Floating WhatsApp
  const waFloat = document.querySelector('.whatsapp-float a');
  if (waFloat) {
    waFloat.href = generateWhatsAppLink('Halo! Saya tertarik dengan casing iPhone dari CaseByYou. Mohon info lebih lanjut ya! 😊');
  }

  // ===== Lightbox Gallery =====
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightboxImg && lightbox) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ===== Scroll Reveal Animation =====
  const revealElements = document.querySelectorAll('.reveal');

  function revealOnScroll() {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight * 0.85) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== Parallax Effect on Hero =====
  const heroImage = document.querySelector('.hero-image-main');
  
  window.addEventListener('scroll', () => {
    if (heroImage && window.innerWidth > 768) {
      const scrolled = window.scrollY;
      heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
  });

  // ===== Counter Animation =====
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(counter => {
      const target = parseInt(counter.dataset.count);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      function updateCounter() {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString() + '+';
        }
      }

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          updateCounter();
          observer.disconnect();
        }
      });

      observer.observe(counter);
    });
  }

  animateCounters();

})();
