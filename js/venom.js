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

  // Canvas for symbiote tendrils
  const OVF = 80;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `position:absolute;top:-${OVF}px;left:-${OVF}px;z-index:1;pointer-events:none;`;
  photoFrame.insertBefore(canvas, venomBlob.nextSibling);

  function resizeCanvas() {
    canvas.width  = photoFrame.offsetWidth  + OVF * 2;
    canvas.height = photoFrame.offsetHeight + OVF * 2;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const ctx = canvas.getContext('2d');

  // Each tendril has an independent character
  const TENDRIL_N = 14;
  const tendrils = Array.from({ length: TENDRIL_N }, (_, i) => ({
    baseAngle:   (i / TENDRIL_N) * Math.PI * 2,
    phase:       (i * 1.37) % (Math.PI * 2),
    wSpeed:      0.55 + (i % 5) * 0.14,
    lenScale:    0.65 + (i % 4) * 0.18,
    thickness:   3.5 + (i % 3) * 2.2,
    curl:        ((i % 2 === 0) ? 1 : -1) * (0.3 + (i % 3) * 0.12),
  }));

  const clamp = v => Math.max(20, Math.min(80, v));
  const osc   = i => Math.sin(t * F[i % 10] + P[i % 10]) * A[i % 10];

  venomBlob.style.animation = 'none';

  (function loop() {
    t += 0.006;
    smoothX += (targetX - smoothX) * 0.042;
    smoothY += (targetY - smoothY) * 0.042;

    const mx = smoothX * 26, my = smoothY * 26;

    // Blob morph
    const r1 = clamp(50 + osc(0) + osc(5) * 0.4 + mx);
    const r2 = clamp(50 + osc(1) + osc(6) * 0.4 - mx * 0.9);
    const r3 = clamp(50 + osc(2) + osc(7) * 0.4 + my * 0.8);
    const r4 = clamp(50 + osc(3) + osc(8) * 0.4 - my);

    venomBlob.style.borderRadius =
      `${r1}% ${100-r1}% ${r2}% ${100-r2}% / ${r3}% ${r4}% ${100-r4}% ${100-r3}%`;
    venomBlob.style.transform = `scale(${1 + Math.sin(t * 0.75) * 0.02})`;

    // Draw tendrils
    const cw = canvas.width, ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    const ccx = cw / 2, ccy = ch / 2;
    const photoR = photoFrame.offsetWidth * 0.46;

    tendrils.forEach(ten => {
      const wobble = Math.sin(t * ten.wSpeed + ten.phase) * 0.32
                   + Math.cos(t * ten.wSpeed * 0.61 + ten.phase * 1.4) * 0.14;
      const ang = ten.baseAngle + wobble
                + smoothX * 0.2 * Math.cos(ten.baseAngle)
                + smoothY * 0.2 * Math.sin(ten.baseAngle);

      const pulse  = 0.75 + Math.abs(Math.sin(t * 0.45 + ten.phase)) * 0.55;
      const length = photoR * 0.52 * ten.lenScale * pulse + 24;

      // Root at photo-circle edge
      const sx = ccx + Math.cos(ang) * photoR;
      const sy = ccy + Math.sin(ang) * photoR;

      // Control point — offset perpendicular to add curl
      const perpAng = ang + Math.PI / 2;
      const curlAmt = ten.curl * length * 0.55 * Math.sin(t * 0.7 + ten.phase);
      const cpx = ccx + Math.cos(ang) * (photoR + length * 0.5) + Math.cos(perpAng) * curlAmt;
      const cpy = ccy + Math.sin(ang) * (photoR + length * 0.5) + Math.sin(perpAng) * curlAmt;

      // Tip
      const tipAng = ang + Math.sin(t * 0.5 + ten.phase * 1.6) * 0.5;
      const ex = ccx + Math.cos(tipAng) * (photoR + length);
      const ey = ccy + Math.sin(tipAng) * (photoR + length);

      const alpha = 0.55 + Math.sin(t * 0.85 + ten.phase) * 0.2;
      const thick = ten.thickness * (1 + Math.sin(t * ten.wSpeed * 1.1 + ten.phase) * 0.2);

      // Main tendril body — dark symbiote ink
      const bodyGrad = ctx.createLinearGradient(sx, sy, ex, ey);
      bodyGrad.addColorStop(0,   `rgba(8, 4, 18, ${alpha})`);
      bodyGrad.addColorStop(0.5, `rgba(5, 2, 12, ${alpha * 0.8})`);
      bodyGrad.addColorStop(1,   `rgba(2, 0,  8, 0)`);

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(cpx, cpy, ex, ey);
      ctx.strokeStyle = bodyGrad;
      ctx.lineWidth   = thick;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.stroke();

      // Edge shimmer — faint blue-purple iridescence
      const shimGrad = ctx.createLinearGradient(sx, sy, ex, ey);
      shimGrad.addColorStop(0,   `rgba(80, 40, 180, ${alpha * 0.45})`);
      shimGrad.addColorStop(0.45,`rgba(37, 99, 235, ${alpha * 0.22})`);
      shimGrad.addColorStop(1,   `rgba(0,  0,   0,  0)`);

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(cpx, cpy, ex, ey);
      ctx.strokeStyle = shimGrad;
      ctx.lineWidth   = thick * 0.35;
      ctx.stroke();
    });

    requestAnimationFrame(loop);
  })();
}
