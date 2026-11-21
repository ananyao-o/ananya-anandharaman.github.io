/* cbc.js — compact binary inspiral animation */

(() => {
  const section = document.getElementById('space');
  const canvas = document.getElementById('cbc-canvas');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame = 0;

  function resize() {
    const rect = section.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width));
    canvas.height = Math.max(1, Math.round(rect.height));
  }

  function drawOrbitingBodies(cx, cy, phase, separation, bodyScale) {
    const x1 = cx + Math.cos(phase) * separation * 0.56;
    const y1 = cy + Math.sin(phase) * separation * 0.30;
    const x2 = cx - Math.cos(phase) * separation * 0.56;
    const y2 = cy - Math.sin(phase) * separation * 0.30;

    const r1 = 11 * bodyScale;
    const r2 = 8.5 * bodyScale;

    const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1 * 2.2);
    g1.addColorStop(0, 'rgba(255,255,255,0.95)');
    g1.addColorStop(0.4, 'rgba(190,215,255,0.75)');
    g1.addColorStop(1, 'rgba(107,159,212,0)');
    ctx.beginPath();
    ctx.arc(x1, y1, r1, 0, Math.PI * 2);
    ctx.fillStyle = g1;
    ctx.fill();

    const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2 * 2.2);
    g2.addColorStop(0, 'rgba(255,255,255,0.93)');
    g2.addColorStop(0.45, 'rgba(215,190,255,0.68)');
    g2.addColorStop(1, 'rgba(150,110,210,0)');
    ctx.beginPath();
    ctx.arc(x2, y2, r2, 0, Math.PI * 2);
    ctx.fillStyle = g2;
    ctx.fill();

    return { x1, y1, x2, y2 };
  }

  function drawRipples(cx, cy, t, pulse) {
    const ripples = 5;
    for (let i = 0; i < ripples; i += 1) {
      const age = (t * 0.004 + i / ripples) % 1;
      const radius = 32 + age * 250 * (0.85 + pulse * 0.3);
      const alpha = (1 - age) * 0.16;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * 1.15, radius * 0.56, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(107,159,212,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function drawTrail(cx, cy, phase, separation) {
    ctx.beginPath();
    for (let i = 0; i < 68; i += 1) {
      const age = i / 68;
      const trailPhase = phase - age * 0.18;
      const trailSep = separation * 0.5 + age * 90;
      const x = cx + Math.cos(trailPhase) * trailSep;
      const y = cy + Math.sin(trailPhase) * trailSep * 0.48 + Math.sin(age * 10 + phase) * 2;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(185,210,255,0.08)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width * 0.5;
    const cy = canvas.height * 0.38;

    // One full inspiral cycle with the orbit tightening and chirping.
    const cycle = (frame % 720) / 720; // 0..1
    const chirp = 0.85 + cycle * 6.0;
    const phase = frame * 0.018 * chirp;
    const separation = Math.max(16, 105 * (1 - cycle * 0.84));
    const bodyScale = 1 - Math.min(0.42, cycle * 0.24);

    drawRipples(cx, cy, frame, cycle);
    const { x1, y1, x2, y2 } = drawOrbitingBodies(cx, cy, phase, separation, bodyScale);
    drawTrail(cx, cy, phase, separation);

    if (cycle > 0.90) {
      const flash = (cycle - 0.90) / 0.10;
      ctx.beginPath();
      ctx.arc(cx, cy, 22 + flash * 26, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,235,255,${0.34 * flash})`;
      ctx.fill();
    }

    // A faint guiding arc around the pair.
    ctx.beginPath();
    ctx.ellipse(cx, cy, 112, 54, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    ctx.stroke();

    frame += prefersReducedMotion ? 0.16 : 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();
