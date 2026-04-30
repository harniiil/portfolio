function initAnimations() {
  const statNums = document.querySelectorAll('.stat-num, .big-num');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const raw = el.textContent;
      const num = parseFloat(raw);
      if (isNaN(num)) return;
      const hasPlus = raw.includes('+');
      const hasPct  = raw.includes('%');
      const decimals = (raw.split('.')[1] || '').replace(/[^0-9]/g, '').length;
      let start = null;
      const duration = 1400;
      (function tick(ts) {
        if (!start) start = ts;
        const p     = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (num * eased).toFixed(decimals) + (hasPlus ? '+' : '') + (hasPct ? '%' : '');
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
      counterObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  statNums.forEach(el => counterObs.observe(el));

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal], [data-reveal-right]').forEach(el => revealObs.observe(el));

  const staggerObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-reveal]').forEach((child, i) =>
          setTimeout(() => child.classList.add('visible'), i * 100)
        );
        staggerObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.skills-grid, .projects-grid').forEach(g => staggerObs.observe(g));
}
