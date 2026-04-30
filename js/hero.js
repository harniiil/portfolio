function initHero() {
  const heroContent = document.querySelector('.hero-content');
  const heroSection = document.getElementById('hero');

  window.addEventListener('scroll', () => {
    if (!heroContent || !heroSection) return;
    const s = window.scrollY;
    const h = heroSection.offsetHeight;
    if (s < h) {
      heroContent.style.transform = `translateY(${s * 0.28}px)`;
      heroContent.style.opacity   = Math.max(0, 1 - (s / h) * 1.6);
    }
  }, { passive: true });

  const typedEl = document.querySelector('.typed-text');
  if (!typedEl) return;

  const phrases = ['Network Engineer', 'Cloud Architect', 'Security Researcher', 'Penetration Tester', 'Systems Builder'];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      typedEl.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) { deleting = true; setTimeout(type, 2000); return; }
    } else {
      typedEl.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 45 : 85);
  }
  setTimeout(type, 800);
}
