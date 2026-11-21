/* mantle.js — slow convection-style movement for the mantle section */

(() => {
  const section = document.getElementById('mantle');
  const canvas = document.getElementById('mantle-canvas');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let blobs = [];
  let width = 0;
  let height = 0;
  let t = 0;

  function resize() {
    const rect = section.getBoundingClientRect();
    width = canvas.width = Math.max(1, Math.round(rect.width));
    height = canvas.height = Math.max(1, Math.round(rect.height));

    blobs = Array.from({ length: 7 }, () => ({
      x: Math.random() * width,
      y: height * 0.48 + Math.random() * height * 0.45,
      r: 32 + Math.random() * 60,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -(0.08 + Math.random() * 0.12),
      phase: Math.random() * Math.PI * 2,
      hue: 12 + Math.random() * 22
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    t += prefersReducedMotion ? 0.004 : 0.008;

    blobs.forEach((b) => {
      b.x += b.vx + Math.sin(t + b.phase) * 0.06;
      b.y += b.vy;
      if (b.y < -b.r) {
        b.y = height + b.r;
        b.x = Math.random() * width;
      }
      if (b.x < -b.r) b.x = width + b.r;
      if (b.x > width + b.r) b.x = -b.r;

      const pulse = b.r * (0.9 + Math.sin(t * 1.3 + b.phase) * 0.08);
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, pulse);
      grad.addColorStop(0, `hsla(${b.hue + 18}, 100%, 65%, 0.28)`);
      grad.addColorStop(0.55, `hsla(${b.hue}, 88%, 48%, 0.16)`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(b.x, b.y, pulse, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();
