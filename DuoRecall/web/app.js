// ═══════════════════════════════════════════
// DuoRecall — unofficial Duolingo-style clone
// Portfolio project by otikanelson
// https://github.com/otikanelson/Mini-RN-Projects/tree/main/DuoRecall
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar shadow-on-scroll ---- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 8) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile menu toggle ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.classList.toggle('active', isOpen);
  });
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Dismissable clone-disclaimer banner ---- */
  const banner = document.getElementById('cloneBanner');
  const bannerClose = document.getElementById('cloneBannerClose');
  const BANNER_KEY = 'duorecall_banner_dismissed';
  try {
    if (sessionStorage.getItem(BANNER_KEY) === '1') {
      banner.classList.add('dismissed');
    }
  } catch (e) { /* storage unavailable — banner just stays visible */ }
  bannerClose.addEventListener('click', () => {
    banner.classList.add('dismissed');
    try { sessionStorage.setItem(BANNER_KEY, '1'); } catch (e) {}
  });

  /* ---- Scroll-reveal for [data-anim] elements ---- */
  const animatedEls = document.querySelectorAll('[data-anim]');
  if ('IntersectionObserver' in window && animatedEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    animatedEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: no IntersectionObserver support — just show everything
    animatedEls.forEach(el => el.classList.add('in-view'));
  }

});