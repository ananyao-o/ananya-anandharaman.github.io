/* starfield.js — quiet static star field for the deep-space section */

(() => {
  const section = document.getElementById('space');
  const canvas = document.getElementById('starfield-canvas');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const rect = section.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width));
    canvas.height = Math.max(1, Math.round(rect.height));
    seedStars();
    draw();
  }

  function seedStars() {
    const count = Math.max(70, Math.round((canvas.width * canvas.height) / 14000));
    stars = Array.from({ length: count }, () => {
      const r = Math.random();
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.92,
        radius: r < 0.88 ? (Math.random() * 0.9 + 0.25) : (Math.random() * 1.5 + 0.8),
        alpha: r < 0.88 ? (Math.random() * 0.38 + 0.12) : (Math.random() * 0.5 + 0.35),
      };
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Barely-there haze at the top for depth; no twinkling.
    const haze = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.15, 0, canvas.width * 0.5, canvas.height * 0.2, canvas.width * 0.7);
    haze.addColorStop(0, 'rgba(180,210,255,0.07)');
    haze.addColorStop(1, 'rgba(180,210,255,0)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224,236,255,${star.alpha})`;
      ctx.fill();
    }
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  if (!prefersReducedMotion) {
    // A very slow redraw keeps the background crisp if the browser scales the page.
    setInterval(draw, 9000);
  }
})();
