function initVenom() {
  const venomBlob  = document.querySelector('.venom-blob');
  const photoFrame = document.querySelector('.photo-frame');
  if (!venomBlob || !photoFrame) return;

  const F = [1.0, 1.6180, 2.4142, 0.7321, 1.7321, 3.1416, 0.5774, 2.2361, 0.4142, 1.4142];
  const P = [0.00, 1.23,  2.47,   0.81,   3.56,   1.92,   4.11,   0.56,   2.88,   1.65];
  const A = [14,   12,    10,     13,     8,      6,      11,     9,      12,     10];

  let t = 0;
  let targetX = 0, targetY = 0, smoothX = 0, smoothY = 0;

  document.addEventListener('mousemove', e => {
    const r  = photoFrame.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    const pull = Math.max(0, 1 - dist / 520);
    targetX = ((e.clientX - cx) / 360) * pull;
    targetY = ((e.clientY - cy) / 360) * pull;
  });
  document.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; });

  const SPIKE_N   = 8;
  const spikes    = [];
  const photoCircle = photoFrame.querySelector('.photo-circle');
  for (let i = 0; i < SPIKE_N; i++) {
    const el = document.createElement('div');
    el.className = 'venom-spike';
    photoFrame.insertBefore(el, photoCircle);
    spikes.push(el);
  }

  const osc   = i => Math.sin(t * F[i % 10] + P[i % 10]) * A[i % 10];
  const clamp = v => Math.max(20, Math.min(80, v));

  venomBlob.style.animation = 'none';

  (function loop() {
    t += 0.006;
    smoothX += (targetX - smoothX) * 0.042;
    smoothY += (targetY - smoothY) * 0.042;

    const mx = smoothX * 26, my = smoothY * 26;

    const r1 = clamp(50 + osc(0) + osc(5) * 0.4 + mx);
    const r2 = clamp(50 + osc(1) + osc(6) * 0.4 - mx * 0.9);
    const r3 = clamp(50 + osc(2) + osc(7) * 0.4 + my * 0.8);
    const r4 = clamp(50 + osc(3) + osc(8) * 0.4 - my);

    venomBlob.style.borderRadius =
      `${r1}% ${100-r1}% ${r2}% ${100-r2}% / ${r3}% ${r4}% ${100-r4}% ${100-r3}%`;
    venomBlob.style.transform = `scale(${1 + Math.sin(t * 0.75) * 0.02})`;

    const fw = photoFrame.offsetWidth || 410;
    const cx = fw / 2, cy = fw / 2;
    const R  = fw * 0.465;

    spikes.forEach((sp, i) => {
      const baseAng = (i / SPIKE_N) * Math.PI * 2;
      const wobble  = Math.sin(t * F[i % 10] + P[i % 10]) * 0.24
                    + Math.cos(t * F[(i+1)%10] * 0.65) * 0.11;
      const ang = baseAng + wobble
                + smoothX * 0.13 * Math.cos(baseAng)
                + smoothY * 0.13 * Math.sin(baseAng);

      const lenMod = 0.45 + Math.abs(Math.sin(t * F[(i+2)%10] + P[(i+1)%10])) * 0.75;
      const h = Math.round(34 * lenMod);
      const w = Math.round(8 + Math.sin(t * F[(i+4)%10]) * 2.5);
      const bx = cx + Math.cos(ang) * R;
      const by = cy + Math.sin(ang) * R;

      sp.style.width     = `${w}px`;
      sp.style.height    = `${h}px`;
      sp.style.left      = `${bx - w * 0.5}px`;
      sp.style.top       = `${by - h}px`;
      sp.style.transform = `rotate(${ang * 180 / Math.PI + 90}deg)`;
      sp.style.opacity   = 0.45 + Math.abs(Math.sin(t * F[(i+3)%10] * 0.85)) * 0.5;
    });

    requestAnimationFrame(loop);
  })();
}
