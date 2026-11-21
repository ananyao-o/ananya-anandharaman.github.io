/* surface.js — anthropogenic surface noise with configurable vehicle doodles */

(() => {
  const section = document.getElementById('surface');
  const canvas = document.getElementById('surface-canvas');
  const cfg = window.SITE_CONFIG || {};
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vehicleDefs = Array.isArray(cfg.vehicles) ? cfg.vehicles : [];
  const loadedImages = new Map();
  const imageStates = new Map();

  let width = 0;
  let height = 0;
  let roadY = 0;
  let groundY = 0;
  let vehicles = [];
  let t = 0;

  // Expose vehicle positions so waves.js can add vehicle-generated seismic spikes.
  // waves.js reads window.surfaceState.vehicles and window.surfaceState.width.
  window.surfaceState = { vehicles, width: 0 };

  function resize() {
    const rect = section.getBoundingClientRect();
    width = canvas.width = Math.max(1, Math.round(rect.width));
    height = canvas.height = Math.max(1, Math.round(rect.height));
    roadY = Math.round(height * 0.70);
    groundY = Math.round(height * 0.78);
    window.surfaceState.width = width;
    buildVehicles();
  }

  function loadImage(src) {
    if (!src) return Promise.resolve(null);
    if (imageStates.has(src)) return imageStates.get(src);

    const promise = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        loadedImages.set(src, img);
        resolve(img);
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
    imageStates.set(src, promise);
    return promise;
  }

  async function preload() {
    await Promise.all(vehicleDefs.map(v => loadImage(v.imageSrc)));
    buildVehicles();
  }

  function buildVehicles() {
    vehicles = [];
    if (!width || !height || !vehicleDefs.length) return;

    vehicleDefs.forEach((def) => {
      const small = window.innerWidth < 768;
      const count = Math.max(1, small ? Math.ceil((def.count || 1) / 2) : (def.count || 1));
      const minSpeed = Array.isArray(def.speedRange) ? def.speedRange[0] : 0.4;
      const maxSpeed = Array.isArray(def.speedRange) ? def.speedRange[1] : 1.0;
      for (let i = 0; i < count; i += 1) {
        const dir = i % 2 === 0 ? 1 : -1;
        const speed = (minSpeed + Math.random() * (maxSpeed - minSpeed)) * dir;
        vehicles.push({
          def,
          x: Math.random() * width,
          speed,
          y: Math.round(height * (def.lane || 0.76)) + (Math.random() * 8 - 4),
          bob: Math.random() * Math.PI * 2,
          scale: 0.9 + Math.random() * 0.18
        });
      }
    });
    // Keep the global reference current so waves.js sees live positions
    window.surfaceState.vehicles = vehicles;
    window.surfaceState.width = width;
  }

  function drawBackground() {
    // Road horizon and subtle strata to anchor the scene.
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255,255,255,0.035)';
    ctx.fillRect(0, roadY - 2, width, 1);

    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.fillRect(0, roadY + 6, width, height - roadY);

    // Thin lane hint, intentionally understated.
    ctx.beginPath();
    ctx.moveTo(0, roadY + 1);
    ctx.lineTo(width, roadY + 1);
    ctx.strokeStyle = 'rgba(20,32,48,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // A faint seismic trace running through the surface.
    ctx.beginPath();
    for (let x = 0; x <= width; x += 3) {
      const envelope = 1 + Math.sin((x / width) * Math.PI) * 0.7;
      const base = height * 0.56;
      const noise = Math.sin(x * 0.02 + t * 0.03) * 5
        + Math.sin(x * 0.05 - t * 0.015) * 2.4;
      const y = base + noise * envelope;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(12,28,48,0.28)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  function drawVehicle(v) {
    const img = loadedImages.get(v.def.imageSrc);
    const w = (v.def.width || 60) * v.scale;
    const h = (v.def.height || 24) * v.scale;
    const x = v.x;
    const y = v.y + Math.sin(t * 0.02 + v.bob) * 0.8;

    if (img) {
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.translate(x, y);
      if (v.speed < 0) ctx.scale(-1, 1);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
      return;
    }

    // Elegant fallback placeholder so nothing looks broken while you add SVGs.
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.24)';
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;

    if ((v.def.id || '').includes('bike')) {
      ctx.beginPath();
      ctx.arc(-12, 8, 7, 0, Math.PI * 2);
      ctx.arc(10, 8, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-12, 8);
      ctx.lineTo(-1, -2);
      ctx.lineTo(8, -2);
      ctx.lineTo(2, 8);
      ctx.lineTo(-1, -2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 6);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }

  function update() {
    if (!prefersReducedMotion) {
      t += 1;
      vehicles.forEach((v) => {
        v.x += v.speed;
        if (v.speed > 0 && v.x - 80 > width) v.x = -80;
        if (v.speed < 0 && v.x + 80 < 0) v.x = width + 80;
      });
    }

    drawBackground();
    vehicles.forEach(drawVehicle);
    requestAnimationFrame(update);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();
  preload().finally(() => update());
})();
