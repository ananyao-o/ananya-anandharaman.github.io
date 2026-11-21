/* core.js — pulsing core/plasma effect for the contact section */

(() => {
  const section = document.getElementById('core');
  const canvas = document.getElementById('core-canvas');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let t = 0;

  function resize() {
    const rect = section.getBoundingClientRect();
    width = canvas.width = Math.max(1, Math.round(rect.width));
    height = canvas.height = Math.max(1, Math.round(rect.height));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    t += prefersReducedMotion ? 0.004 : 0.01;

    const cx = width * 0.5;
    const cy = height * 0.58;

    // Soft shell layers, like concentric thermal pulses.
    for (let i = 6; i >= 0; i -= 1) {
      const r = 42 + i * 52 + Math.sin(t * 0.8 + i) * 10;
      const alpha = 0.028 + i * 0.012;
      const hue = 28 + i * 8;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${alpha})`;
      ctx.lineWidth = 8;
      ctx.stroke();
    }

    // Gentle inner glow.
    const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180);
    glow.addColorStop(0, 'rgba(255, 228, 150, 0.18)');
    glow.addColorStop(0.45, 'rgba(255, 160, 40, 0.08)');
    glow.addColorStop(1, 'rgba(255, 120, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, 180, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();
