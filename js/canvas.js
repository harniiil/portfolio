function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const N        = window.innerWidth < 768 ? 45 : 90;
  const MAX_DIST = 160;
  const SPEED    = 0.32;
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

    if (ts - lastSignalTime > 900) {
      spawnSignal();
      if (Math.random() < 0.35) spawnSignal();
      lastSignalTime = ts;
    }

    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy; n.ph += n.ps;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.strokeStyle = colour((a.x + b.x) / 2, (1 - dist / MAX_DIST) * 0.28);
          ctx.lineWidth = 0.9;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }

    signals = signals.filter(s => {
      s.t += s.speed;
      if (s.t > 1) return false;
      const x = s.a.x + (s.b.x - s.a.x) * s.t;
      const y = s.a.y + (s.b.y - s.a.y) * s.t;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
      g.addColorStop(0, colour(x, 0.85));
      g.addColorStop(1, colour(x, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = colour(x, 1);
      ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
      return true;
    });

    nodes.forEach(n => {
      const pulse = 0.5 + Math.sin(n.ph) * 0.5;
      const hR = n.r * 7 * (1 + pulse * 0.5);
      const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, hR);
      grd.addColorStop(0, colour(n.x, 0.28 * pulse));
      grd.addColorStop(1, colour(n.x, 0));
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(n.x, n.y, hR, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = colour(n.x, 0.55 + pulse * 0.45);
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r * (1 + pulse * 0.25), 0, Math.PI * 2); ctx.fill();
    });
  }

  resize();
  init();
  requestAnimationFrame(draw);
  window.addEventListener('resize', () => { resize(); init(); }, { passive: true });
}
