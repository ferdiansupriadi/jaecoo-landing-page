// Language switching functionality
let currentLang = 'id'; // Default language

// NOTE: Carousel & Video init moved to inline script in index.html for guaranteed execution
// ─────────────────────────────────────────────────────────────────────────────

// ─── SHS Video Lazy Loader ────────────────────────────────────────────────────
// Video SHS di-load hanya ketika elemen masuk viewport (pakai MP4 5.6 MB bukan WebM 10.6 MB).
(function initShsVideo() {
    const video = document.getElementById('shs-video');
    if (!video) return;

    const loadVideo = () => {
        video.querySelectorAll('source[data-src]').forEach(s => {
            s.setAttribute('src', s.dataset.src);
            s.removeAttribute('data-src');
        });
        video.load();
        video.play().catch(() => {});
        observer.disconnect();
    };

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) loadVideo();
    }, { rootMargin: '200px' });

    observer.observe(video);
})();
// ─────────────────────────────────────────────────────────────────────────────

// Function to switch language
function switchLanguage(lang) {
    currentLang = lang;
    
    // Update all elements with data-en and data-id attributes
    document.querySelectorAll('[data-en], [data-id]').forEach(element => {
        if (element.dataset[lang]) {
            element.textContent = element.dataset[lang];
        }
    });
    
    // Update placeholder attributes
    document.querySelectorAll('[data-en-placeholder], [data-id-placeholder]').forEach(element => {
        if (element.dataset[`${lang}Placeholder`]) {
            element.placeholder = element.dataset[`${lang}Placeholder`];
        }
    });
    
    // Update active button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.id === `lang-${lang}` || btn.id === `mobile-lang-${lang}`) {
            btn.classList.add('active');
            btn.classList.remove('border');
        } else {
            btn.classList.remove('active');
            btn.classList.add('border', 'border-white');                }
    });
    
    // Update floating contact tooltips
    const whatsappTooltip = document.querySelector('.whatsapp-btn .contact-tooltip');
    const phoneTooltip = document.querySelector('.phone-btn .contact-tooltip');
    
    if (lang === 'en') {
        whatsappTooltip.textContent = 'Chat via WhatsApp';
        phoneTooltip.textContent = 'Call Us';
    } else {
        whatsappTooltip.textContent = 'Chat via WhatsApp';
        phoneTooltip.textContent = 'Hubungi Kami';
    }
}

// Initialize language buttons
document.getElementById('lang-en').addEventListener('click', () => switchLanguage('en'));
document.getElementById('lang-id').addEventListener('click', () => switchLanguage('id'));
document.getElementById('mobile-lang-en').addEventListener('click', () => switchLanguage('en'));
document.getElementById('mobile-lang-id').addEventListener('click', () => switchLanguage('id'));

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('nav-scrolled');
    } else {
        navbar.classList.remove('nav-scrolled');
    }
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenu = document.getElementById('close-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
});

// Close mobile menu when clicking a link
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close menu when clicking outside (on body)
document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(e.target) && 
        !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Keyboard navigation for mobile menu
if (getConfig('enableKeyboardNavigation')) {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            mobileMenuBtn.focus();
        }
    });
    
    // Trap focus within mobile menu when open
    const menuLinks = mobileMenu.querySelectorAll('a, button');
    const firstLink = menuLinks[0];
    const lastLink = menuLinks[menuLinks.length - 1];
    
    if (menuLinks.length > 0) {
        document.addEventListener('keydown', (e) => {
            if (mobileMenu.classList.contains('active') && e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstLink) {
                    e.preventDefault();
                    lastLink.focus();
                } else if (!e.shiftKey && document.activeElement === lastLink) {
                    e.preventDefault();
                    firstLink.focus();
                }
            }
        });
    }
}

// Intersection Observer for fade-in animations (refactored with CSS classes)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('fade-in-pending');
            entry.target.classList.add('fade-in-visible');
        }
    });
}, observerOptions);

// Observe all model cards and sections
document.querySelectorAll('.model-card, section > div').forEach(el => {
    el.classList.add('fade-in-pending');
    observer.observe(el);
});

// WhatsApp Form Submission with Validation
const contactForm = document.getElementById('contact-form');

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone.trim()) && phone.trim().length >= 10;
}

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Check if all fields are filled
    if (!name || !email || !phone || !message) {
        const errorMsg = currentLang === 'en' 
            ? 'Please fill in all fields.' 
            : 'Mohon isi semua field.';
        alert(errorMsg);
        return false;
    }
    
    // Validate email format
    if (!validateEmail(email)) {
        const errorMsg = currentLang === 'en' 
            ? 'Please enter a valid email address.' 
            : 'Mohon masukkan alamat email yang valid.';
        alert(errorMsg);
        return false;
    }
    
    // Validate phone format
    if (!validatePhone(phone)) {
        const errorMsg = currentLang === 'en' 
            ? 'Please enter a valid phone number.' 
            : 'Mohon masukkan nomor telepon yang valid.';
        alert(errorMsg);
        return false;
    }
    
    // Validate message length
    if (message.length < 10) {
        const errorMsg = currentLang === 'en' 
            ? 'Message must be at least 10 characters.' 
            : 'Pesan minimal harus 10 karakter.';
        alert(errorMsg);
        return false;
    }
    
    return true;
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
        return;
    }
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    
    // Create WhatsApp message
    const whatsappMessage = `Halo JAECOO Indonesia,

Saya tertarik dengan produk JAECOO dan ingin mendapatkan informasi lebih lanjut.

Berikut data saya:
- Nama: ${name}
- Email: ${email}
- Telepon: ${phone}

Pesan:
${message}

Terima kasih.`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Get WhatsApp number from config (not hardcoded)
    const whatsappNumber = getConfig('whatsappNumber');
    
    if (!whatsappNumber) {
        alert(currentLang === 'en' 
            ? 'Error: WhatsApp number not configured.' 
            : 'Error: Nomor WhatsApp tidak dikonfigurasi.');
        return;
    }
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
    
    // Show success message
    alert(currentLang === 'en' 
        ? 'Thank you! Your message is being redirected to WhatsApp.' 
        : 'Terima kasih! Pesan Anda sedang dialihkan ke WhatsApp.');
    
    // Reset form
    contactForm.reset();
});

// Testimonial Carousel Auto-Scroll (Improved - Dynamic slide count)
const carousel = document.getElementById('testimonial-carousel');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');

if (carousel) {
    let currentIndex = 0;
    const slideWidth = window.innerWidth > 768 ? 33.333 : 100;
    
    // Count actual testimonial slides instead of hardcoding
    const testimonialSlides = document.querySelectorAll('.testimonial-slide, [data-testimonial-slide]');
    const totalSlides = testimonialSlides.length || 10; // Fallback to 10 if selector fails

    function updateCarousel() {
        const offset = (currentIndex * slideWidth) / 100;
        carousel.style.transform = `translateX(-${offset * carousel.offsetWidth}px)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    let autoScrollInterval = setInterval(nextSlide, getConfig('autoScrollInterval') || 2000);

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(autoScrollInterval);
            nextSlide();
            autoScrollInterval = setInterval(nextSlide, getConfig('autoScrollInterval') || 2000);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(autoScrollInterval);
            prevSlide();
            autoScrollInterval = setInterval(nextSlide, getConfig('autoScrollInterval') || 2000);
        });
    }

    carousel.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    carousel.addEventListener('mouseleave', () => {
        autoScrollInterval = setInterval(nextSlide, getConfig('autoScrollInterval') || 2000);
    });
}

// Visitor Counter
const visitorCountElement = document.getElementById('visitor-count');

if (getConfig('enableVisitorCounter') && visitorCountElement) {
    fetch('./backend/visitor-count.php')
        .then(response => {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
        })
        .then(data => {
            if (data.success && data.value) {
                visitorCountElement.textContent = Number(data.value).toLocaleString('id-ID');
            }
        })
        .catch(() => {
            visitorCountElement.textContent = '—';
        });
}
