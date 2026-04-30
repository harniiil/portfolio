// ── Particle network canvas ───────────────────────────
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const N         = window.innerWidth < 768 ? 45 : 90; // responsive count
  const MAX_DIST  = 160;  // max connection distance
  const SPEED     = 0.32;
  // accent blue → purple colour stops
  const C0 = { r: 37,  g: 99,  b: 235 };
  const C1 = { r: 124, g: 58,  b: 237 };

  let W, H, nodes, signals = [];

  function lerp(a, b, t) { return Math.round(a + (b - a) * t); }
  function colour(x, alpha) {
    const t = x / W;
    return `rgba(${lerp(C0.r,C1.r,t)},${lerp(C0.g,C1.g,t)},${lerp(C0.b,C1.b,t)},${alpha})`;
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeNode() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r:  Math.random() * 1.8 + 0.5,
      ph: Math.random() * Math.PI * 2,
      ps: 0.012 + Math.random() * 0.018,
    };
  }

  function init() { nodes = Array.from({ length: N }, makeNode); }

  // A "signal" — a glowing dot travelling along an edge
  function spawnSignal() {
    for (let attempts = 0; attempts < 20; attempts++) {
      const a = nodes[Math.floor(Math.random() * N)];
      const b = nodes[Math.floor(Math.random() * N)];
      if (a === b) continue;
      const dx = a.x - b.x, dy = a.y - b.y;
      if (Math.sqrt(dx * dx + dy * dy) < MAX_DIST) {
        signals.push({ a, b, t: 0, speed: 0.007 + Math.random() * 0.007 });
        return;
      }
    }
  }

  let lastSignalTime = 0;

  function draw(ts) {
    requestAnimationFrame(draw);
    ctx.clearRect(0, 0, W, H);

    // spawn data-packet signals every ~900 ms
    if (ts - lastSignalTime > 900) {
      spawnSignal();
      if (Math.random() < 0.35) spawnSignal(); // occasional double
      lastSignalTime = ts;
    }

    // update nodes
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy; n.ph += n.ps;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // draw edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.28;
          ctx.strokeStyle = colour((a.x + b.x) / 2, alpha);
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // draw signals (data packets)
    signals = signals.filter(s => {
      s.t += s.speed;
      if (s.t > 1) return false;
      const x = s.a.x + (s.b.x - s.a.x) * s.t;
      const y = s.a.y + (s.b.y - s.a.y) * s.t;
      // outer glow
      const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
      g.addColorStop(0, colour(x, 0.85));
      g.addColorStop(1, colour(x, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
      // bright core
      ctx.fillStyle = colour(x, 1);
      ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
      return true;
    });

    // draw nodes
    nodes.forEach(n => {
      const pulse = 0.5 + Math.sin(n.ph) * 0.5;
      // halo glow
      const hR = n.r * 7 * (1 + pulse * 0.5);
      const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, hR);
      grd.addColorStop(0, colour(n.x, 0.28 * pulse));
      grd.addColorStop(1, colour(n.x, 0));
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(n.x, n.y, hR, 0, Math.PI * 2); ctx.fill();
      // core dot
      ctx.fillStyle = colour(n.x, 0.55 + pulse * 0.45);
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (1 + pulse * 0.25), 0, Math.PI * 2); ctx.fill();
    });
  }

  resize();
  init();
  requestAnimationFrame(draw);
  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
})();

// ── Hero parallax — Apple cinematic scroll ────────────
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

// ── Navbar scroll ─────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20));

// ── Mobile menu ───────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ── Interactive Venom Blob + Spikes ───────────────────
const venomBlob = document.querySelector('.venom-blob');
const photoFrame = document.querySelector('.photo-frame');

if (venomBlob && photoFrame) {
  // Irrational frequency ratios → the motion never repeats
  // φ=1.618, √2=1.414, √3=1.732, √5=2.236, π=3.14159, e≈2.718, etc.
  const F = [1.0, 1.6180, 2.4142, 0.7321, 1.7321, 3.1416, 0.5774, 2.2361, 0.4142, 1.4142];
  const P = [0.00, 1.23,  2.47,   0.81,   3.56,   1.92,   4.11,   0.56,   2.88,   1.65];
  const A = [14,   12,    10,     13,     8,      6,      11,     9,      12,     10];

  let t = 0;
  let targetX = 0, targetY = 0, smoothX = 0, smoothY = 0;

  document.addEventListener('mousemove', e => {
    const r = photoFrame.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    const pull = Math.max(0, 1 - dist / 520);
    targetX = ((e.clientX - cx) / 360) * pull;
    targetY = ((e.clientY - cy) / 360) * pull;
  });
  document.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });

  // ── Create 8 spike elements ──────────────────────────
  const SPIKE_N = 8;
  const spikes  = [];
  const photoCircle = photoFrame.querySelector('.photo-circle');
  for (let i = 0; i < SPIKE_N; i++) {
    const el = document.createElement('div');
    el.className = 'venom-spike';
    photoFrame.insertBefore(el, photoCircle); // behind photo, above blob
    spikes.push(el);
  }

  const osc   = i => Math.sin(t * F[i % 10] + P[i % 10]) * A[i % 10];
  const clamp = v => Math.max(20, Math.min(80, v));

  venomBlob.style.animation = 'none'; // JS owns the main blob shape

  (function loop() {
    t += 0.006;
    smoothX += (targetX - smoothX) * 0.042;
    smoothY += (targetY - smoothY) * 0.042;

    const mx = smoothX * 26, my = smoothY * 26;

    // ── Blob border-radius — 8 independent oscillators ──
    const r1 = clamp(50 + osc(0) + osc(5) * 0.4 + mx);
    const r2 = clamp(50 + osc(1) + osc(6) * 0.4 - mx * 0.9);
    const r3 = clamp(50 + osc(2) + osc(7) * 0.4 + my * 0.8);
    const r4 = clamp(50 + osc(3) + osc(8) * 0.4 - my);
    const r5 = clamp(50 + osc(4) + osc(9) * 0.35 - my * 0.7);
    const r6 = clamp(50 + osc(5) + osc(0) * 0.35 + my * 0.9);
    const r7 = clamp(50 + osc(6) + osc(1) * 0.35 - mx * 0.85);
    const r8 = clamp(50 + osc(7) + osc(2) * 0.35 + mx * 0.75);

    venomBlob.style.borderRadius =
      `${r1}% ${100-r1}% ${r2}% ${100-r2}% / ${r3}% ${r4}% ${100-r4}% ${100-r3}%`;
    venomBlob.style.transform = `scale(${1 + Math.sin(t * 0.75) * 0.02})`;

    // ── Spikes ───────────────────────────────────────────
    // Each spike: base sits at blob perimeter, tip points outward
    // transform-origin: 50% 100% = base centre → rotate around base
    const fw = photoFrame.offsetWidth || 340;
    const cx = fw / 2, cy = fw / 2;
    const R  = fw * 0.465; // base radius (~158px for 340px frame)

    spikes.forEach((sp, i) => {
      // Base angle: evenly distributed + independent wobble
      const baseAng = (i / SPIKE_N) * Math.PI * 2;
      const wobble  = Math.sin(t * F[i % 10] + P[i % 10]) * 0.24
                    + Math.cos(t * F[(i+1)%10] * 0.65)    * 0.11;
      const ang = baseAng + wobble
                + smoothX * 0.13 * Math.cos(baseAng)
                + smoothY * 0.13 * Math.sin(baseAng);

      // Spike length: pulses independently per spike (always > 0 via Math.abs)
      const lenMod = 0.45 + Math.abs(Math.sin(t * F[(i+2)%10] + P[(i+1)%10])) * 0.75;
      const h = Math.round(34 * lenMod);
      const w = Math.round(8 + Math.sin(t * F[(i+4)%10]) * 2.5);

      // Base position on perimeter
      const bx = cx + Math.cos(ang) * R;
      const by = cy + Math.sin(ang) * R;

      // CSS positioning: anchor is transform-origin = (w/2, h) from top-left
      sp.style.width  = `${w}px`;
      sp.style.height = `${h}px`;
      sp.style.left   = `${bx - w * 0.5}px`;
      sp.style.top    = `${by - h}px`;
      // +90° converts from polar "right=0" to the triangle's natural upward tip orientation
      sp.style.transform = `rotate(${ang * 180 / Math.PI + 90}deg)`;

      // Opacity pulses out of sync between spikes
      sp.style.opacity = 0.45 + Math.abs(Math.sin(t * F[(i+3)%10] * 0.85)) * 0.5;
    });

    requestAnimationFrame(loop);
  })();
}

// ── Typing animation ──────────────────────────────────
const typedEl = document.querySelector('.typed-text');
if (typedEl) {
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

// ── Stat counter animation ─────────────────────────────
const statNums = document.querySelectorAll('.stat-num, .big-num');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
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
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = num * eased;
      el.textContent = val.toFixed(decimals) + (hasPlus ? '+' : '') + (hasPct ? '%' : '');
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
    counterObs.unobserve(el);
  });
}, { threshold: 0.6 });
statNums.forEach(el => counterObs.observe(el));

// ── Scroll-reveal ─────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('[data-reveal], [data-reveal-right]').forEach(el => revealObs.observe(el));

// Staggered grid reveals
const staggerObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-reveal]').forEach((child, i) =>
        setTimeout(() => child.classList.add('visible'), i * 100));
      staggerObs.unobserve(e.target);
    }
  });
}, { threshold: 0.05 });
document.querySelectorAll('.skills-grid, .projects-grid').forEach(g => staggerObs.observe(g));

// ── Active nav link on scroll ─────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
const secObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting)
      navLinks.forEach(l => l.classList.toggle('active-link', l.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => secObs.observe(s));
