function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );

  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting)
        navLinks.forEach(l =>
          l.classList.toggle('active-link', l.getAttribute('href') === '#' + e.target.id)
        );
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => secObs.observe(s));
}
