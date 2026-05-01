/* ═══════════════════════════════════════════════════════════
   DuoRecall Landing Page – GSAP Animations
═══════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ── Scroll progress bar ── */
const progressBar = document.createElement('div');
progressBar.id = 'progress-bar';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / total * 100) + '%';
});

/* ── Navbar shadow on scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

/* ── Hamburger menu ── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = mobileMenu.classList.contains('open');
  gsap.to(spans[0], { rotation: isOpen ? 45 : 0,  y: isOpen ? 7.5 : 0, duration: .25 });
  gsap.to(spans[1], { opacity:  isOpen ? 0  : 1,              duration: .2  });
  gsap.to(spans[2], { rotation: isOpen ? -45 : 0, y: isOpen ? -7.5 : 0, duration: .25 });
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    gsap.to(spans[0], { rotation: 0, y: 0, duration: .25 });
    gsap.to(spans[1], { opacity: 1,        duration: .2  });
    gsap.to(spans[2], { rotation: 0, y: 0, duration: .25 });
  });
});

/* ── Hero entrance ── */
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

tl.to('.hero-text', {
    opacity: 1,
    y: 0,
    duration: .9,
    delay: .2,
  })
  .from('.hero-title', {
    y: 40,
    opacity: 0,
    duration: .7,
  }, '<')
  .from('.hero-btns .btn', {
    y: 30,
    opacity: 0,
    duration: .6,
    stagger: .15,
  }, '-=.4')
  .to('.hero-visual', {
    opacity: 1,
    y: 0,
    duration: .9,
    ease: 'power2.out',
  }, '-=.7')
  .from('.hero-phone', {
    y: 60,
    duration: .9,
    ease: 'power2.out',
  }, '<')
  .from('.hero-owl-float', {
    scale: 0,
    rotation: -20,
    duration: .7,
    ease: 'back.out(1.7)',
  }, '-=.4');

/* ── Feature rows ── */
document.querySelectorAll('.feature-row').forEach((row) => {
  const dir = row.classList.contains('reverse') ? 80 : -80;
  gsap.fromTo(row,
    { opacity: 0, x: dir },
    {
      opacity: 1, x: 0,
      duration: .9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: row,
        start: 'top 82%',
        toggleActions: 'play none none none',
      }
    }
  );
});

/* ── Science section ── */
gsap.fromTo('.science-section',
  { opacity: 0, y: 60 },
  {
    opacity: 1, y: 0,
    duration: .9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.science-section',
      start: 'top 80%',
    }
  }
);

gsap.from('.science-inner > *', {
  opacity: 0,
  y: 40,
  duration: .7,
  stagger: .2,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.science-section',
    start: 'top 75%',
  }
});

/* ── Extra feature ── */
gsap.fromTo('.extra-feature',
  { opacity: 0, y: 60 },
  {
    opacity: 1, y: 0,
    duration: .9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.extra-feature',
      start: 'top 80%',
    }
  }
);

/* ── Download CTA ── */
gsap.fromTo('.download-cta',
  { opacity: 0, y: 60 },
  {
    opacity: 1, y: 0,
    duration: .9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.download-cta',
      start: 'top 82%',
    }
  }
);

gsap.from('.download-owl', {
  scale: 0,
  rotation: -15,
  duration: .8,
  ease: 'back.out(1.7)',
  scrollTrigger: {
    trigger: '.download-cta',
    start: 'top 78%',
  }
});

gsap.from('.download-inner h2, .download-inner .hero-btns, .download-inner .store-badges', {
  opacity: 0,
  y: 30,
  duration: .6,
  stagger: .18,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.download-cta',
    start: 'top 75%',
  }
});

/* ── Footer social icons hover pulse ── */
document.querySelectorAll('.social-icon').forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    gsap.to(icon, { scale: 1.2, duration: .2, ease: 'back.out(2)' });
  });
  icon.addEventListener('mouseleave', () => {
    gsap.to(icon, { scale: 1, duration: .2 });
  });
});

/* ── Store badge hover lift ── */
document.querySelectorAll('.badge-link').forEach(badge => {
  badge.addEventListener('mouseenter', () => {
    gsap.to(badge, { y: -4, duration: .2, ease: 'power2.out' });
  });
  badge.addEventListener('mouseleave', () => {
    gsap.to(badge, { y: 0, duration: .2 });
  });
});

/* ── Parallax on hero phone ── */
window.addEventListener('scroll', () => {
  const phone = document.querySelector('.hero-phone');
  if (!phone) return;
  const offset = window.scrollY * 0.18;
  phone.style.transform = `translateY(${offset}px)`;
});

/* ── Smooth active nav highlight ── */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAs.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? 'var(--green)'
          : '';
      });
    }
  });
}, { threshold: .4 });

sections.forEach(s => observer.observe(s));
