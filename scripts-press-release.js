/* scripts-press-release.js */

// Nav scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// Mobile menu
const menuBtn = document.getElementById('mobile-menu-btn');
const closeBtn = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
}
if (closeBtn && mobileMenu) {
    closeBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
}

// Language switcher
function switchLanguage(lang) {
    document.querySelectorAll('[data-en][data-id]').forEach(el => {
        el.textContent = el.dataset[lang];
    });
    document.querySelectorAll('.lang-btn, #mobile-lang-en, #mobile-lang-id').forEach(btn => {
        btn.classList.remove('active');
    });
    const enBtns = document.querySelectorAll('#lang-en, #mobile-lang-en');
    const idBtns = document.querySelectorAll('#lang-id, #mobile-lang-id');
    if (lang === 'en') enBtns.forEach(b => b.classList.add('active'));
    else idBtns.forEach(b => b.classList.add('active'));
    localStorage.setItem('preferred-lang', lang);
}

document.getElementById('lang-en')?.addEventListener('click', () => switchLanguage('en'));
document.getElementById('lang-id')?.addEventListener('click', () => switchLanguage('id'));
document.getElementById('mobile-lang-en')?.addEventListener('click', () => switchLanguage('en'));
document.getElementById('mobile-lang-id')?.addEventListener('click', () => switchLanguage('id'));

const savedLang = localStorage.getItem('preferred-lang') || 'id';
if (savedLang === 'en') switchLanguage('en');

// Copy press release link
function copyPressLink(e) {
    e.preventDefault();
    const url = 'https://omodajaecoojaksel.id/story-icar-v23-launch.html';
    navigator.clipboard.writeText(url).then(() => showToast('Link disalin!')).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Link disalin!');
    });
}

function showToast(msg) {
    let toast = document.getElementById('copy-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'copy-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}
