function initVenom() {
  const venomBlob  = document.querySelector('.venom-blob');
  const photoFrame = document.querySelector('.photo-frame');
  if (!venomBlob || !photoFrame) return;

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

  // Canvas sits behind the photo-circle (z-index 1) but above CSS blob (z-index 0)
  const OVF = 110;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `position:absolute;top:-${OVF}px;left:-${OVF}px;z-index:1;pointer-events:none;`;
  photoFrame.insertBefore(canvas, venomBlob.nextSibling);

  function resizeCanvas() {
    canvas.width  = photoFrame.offsetWidth  + OVF * 2;
    canvas.height = photoFrame.offsetHeight + OVF * 2;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // CSS blob no longer needed — canvas handles everything
  venomBlob.style.opacity = '0';

  const ctx = canvas.getContext('2d');

  // Blob outline: 32 points, each with independent multi-freq noise
  const BLOB_N = 32;
  const blobSeeds = Array.from({ length: BLOB_N }, (_, i) => ({
    ang: (i / BLOB_N) * Math.PI * 2,
    fa:  [0.29 + i * 0.038, 0.63 + i * 0.025, 1.07 + i * 0.017],
    pa:  [(i * 0.73) % (Math.PI * 2), (i * 1.21) % (Math.PI * 2), (i * 1.89) % (Math.PI * 2)],
    amp: [22 + (i % 5) * 6, 12 + (i % 4) * 4, 7 + (i % 3) * 3],
  }));

  function getBlobPoints(cx, cy, R, t, mx, my) {
    return blobSeeds.map(s => {
      const noise = s.fa.reduce((sum, f, k) =>
        sum + Math.sin(t * f + s.ang * (3 + k * 2) + s.pa[k]) * s.amp[k], 0);
      const r = R + noise + mx * Math.cos(s.ang) * 12 + my * Math.sin(s.ang) * 12;
      return [cx + Math.cos(s.ang) * r, cy + Math.sin(s.ang) * r];
    });
  }

  // White dots — pre-seeded random positions inside blob area
  const DOTS = Array.from({ length: 70 }, () => ({
    ang:   Math.random() * Math.PI * 2,
    rFrac: 0.06 + Math.random() * 0.88,
    size:  0.5 + Math.random() * 1.7,
    phase: Math.random() * Math.PI * 2,
    speed: 0.2 + Math.random() * 0.6,
  }));

  // Tendrils
  const TENDRIL_N = 14;
  const tendrils = Array.from({ length: TENDRIL_N }, (_, i) => ({
    baseAngle: (i / TENDRIL_N) * Math.PI * 2,
    phase:     (i * 1.37) % (Math.PI * 2),
    wSpeed:    0.52 + (i % 5) * 0.13,
    lenScale:  0.7 + (i % 4) * 0.18,
    thickness: 3.5 + (i % 3) * 2.2,
    curl:      ((i % 2 === 0) ? 1 : -1) * (0.28 + (i % 3) * 0.11),
  }));

  (function loop() {
    t += 0.006;
    smoothX += (targetX - smoothX) * 0.042;
    smoothY += (targetY - smoothY) * 0.042;

    const cw = canvas.width, ch = canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    const ccx = cw / 2, ccy = ch / 2;
    const photoR = photoFrame.offsetWidth * 0.46;

    const pts = getBlobPoints(ccx, ccy, photoR, t, smoothX, smoothY);
    const N   = pts.length;

    // ── 1. Blob fill ───────────────────────────────────────────
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const [px, py] = pts[i];
      const [nx, ny] = pts[(i + 1) % N];
      const mx = (px + nx) / 2, my = (py + ny) / 2;
      if (i === 0) ctx.moveTo(mx, my);
      ctx.quadraticCurveTo(px, py, mx, my);
    }
    ctx.closePath();

    const fill = ctx.createRadialGradient(ccx, ccy, 0, ccx, ccy, photoR + 40);
    fill.addColorStop(0,    'rgba(14,  7, 32, 0.98)');
    fill.addColorStop(0.5,  'rgba( 7,  3, 18, 0.97)');
    fill.addColorStop(1,    'rgba( 2,  1,  8, 0.93)');
    ctx.fillStyle = fill;
    ctx.fill();

    // Edge iridescence
    ctx.strokeStyle = 'rgba(75, 32, 170, 0.55)';
    ctx.lineWidth   = 1.8;
    ctx.stroke();

    // ── 2. White dots ──────────────────────────────────────────
    DOTS.forEach(dot => {
      const r  = dot.rFrac * photoR;
      const dx = ccx + Math.cos(dot.ang) * r;
      const dy = ccy + Math.sin(dot.ang) * r;
      const alpha = Math.max(0, 0.3 + Math.sin(t * dot.speed + dot.phase) * 0.28);
      ctx.beginPath();
      ctx.arc(dx, dy, dot.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });

    // ── 3. Tendrils ────────────────────────────────────────────
    tendrils.forEach(ten => {
      const wobble = Math.sin(t * ten.wSpeed + ten.phase) * 0.32
                   + Math.cos(t * ten.wSpeed * 0.61 + ten.phase * 1.4) * 0.14;
      const ang = ten.baseAngle + wobble
                + smoothX * 0.2 * Math.cos(ten.baseAngle)
                + smoothY * 0.2 * Math.sin(ten.baseAngle);

      // Root at blob edge (find nearest blob point for this angle)
      const blobIdx = ((Math.round((ang / (Math.PI * 2)) * N) % N) + N) % N;
      const [bx, by] = pts[blobIdx];
      const edgeR = Math.hypot(bx - ccx, by - ccy);

      const pulse  = 0.75 + Math.abs(Math.sin(t * 0.45 + ten.phase)) * 0.55;
      const length = photoR * 0.5 * ten.lenScale * pulse + 22;

      const sx = ccx + Math.cos(ang) * edgeR;
      const sy = ccy + Math.sin(ang) * edgeR;

      const perpAng = ang + Math.PI / 2;
      const curlAmt = ten.curl * length * 0.5 * Math.sin(t * 0.7 + ten.phase);
      const cpx = ccx + Math.cos(ang) * (edgeR + length * 0.5) + Math.cos(perpAng) * curlAmt;
      const cpy = ccy + Math.sin(ang) * (edgeR + length * 0.5) + Math.sin(perpAng) * curlAmt;

      const tipAng = ang + Math.sin(t * 0.5 + ten.phase * 1.6) * 0.5;
      const ex = ccx + Math.cos(tipAng) * (edgeR + length);
      const ey = ccy + Math.sin(tipAng) * (edgeR + length);

      const alpha = 0.55 + Math.sin(t * 0.85 + ten.phase) * 0.2;
      const thick = ten.thickness * (1 + Math.sin(t * ten.wSpeed * 1.1 + ten.phase) * 0.2);

      const bodyGrad = ctx.createLinearGradient(sx, sy, ex, ey);
      bodyGrad.addColorStop(0,   `rgba(10, 5, 22, ${alpha})`);
      bodyGrad.addColorStop(0.5, `rgba( 6, 2, 14, ${alpha * 0.8})`);
      bodyGrad.addColorStop(1,   `rgba( 2, 0,  6, 0)`);

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(cpx, cpy, ex, ey);
      ctx.strokeStyle = bodyGrad;
      ctx.lineWidth   = thick;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.stroke();

      // Iridescent shimmer on tendril edges
      const shimGrad = ctx.createLinearGradient(sx, sy, ex, ey);
      shimGrad.addColorStop(0,    `rgba(85, 40, 190, ${alpha * 0.45})`);
      shimGrad.addColorStop(0.45, `rgba(37, 99, 235, ${alpha * 0.22})`);
      shimGrad.addColorStop(1,    `rgba( 0,  0,   0, 0)`);

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
