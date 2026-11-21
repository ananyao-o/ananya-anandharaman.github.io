/* constellations.js — real constellations, named, hover to highlight.
   Points are [x, y, magnitude, name?] in projected RA/Dec degrees
   (sky-chart orientation: north up, east left), scaled to fit. */
(() => {
  const section = document.getElementById('cosmos');
  const canvas = document.getElementById('constellation-canvas');
  if (!section || !canvas) return;

  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clusters = [
    { name: 'Orion', at: [0.11, 0.30],
      pts: [[-.8,-9.9,3.5],[-5.8,-7.4,.4,'Betelgeuse'],[1.7,-6.3,1.6],[0,.3,2.2],[-1.05,1.2,1.7],[-2.2,1.9,1.7],[-4,9.7,2.1],[4.4,8.2,.1,'Rigel']],
      edges: [[0,1],[0,2],[1,5],[2,3],[3,4],[4,5],[5,6],[3,7]] },
    { name: 'Cassiopeia', at: [0.87, 0.14],
      pts: [[13.1,-59.1,2.3,'Caph'],[9.3,-56.5,2.2,'Schedar'],[7.2,-60.7,2.5],[3.5,-60.2,2.7],[0,-63.7,3.4]],
      edges: [[0,1],[1,2],[2,3],[3,4]] },
    { name: 'Cygnus', at: [0.90, 0.50],
      pts: [[-8.2,-45.3,1.3,'Deneb'],[-4.3,-40.3,2.2,'Sadr'],[5.7,-28,3.2,'Albireo'],[-9.3,-34,2.5],[2.9,-45.1,2.9]],
      edges: [[0,1],[1,2],[3,1],[1,4]] },
    { name: 'Lyra', at: [0.10, 0.78],
      pts: [[2.2,-38.8,0,'Vega'],[.8,-39.7,4.7],[.6,-37.6,4.3],[-1.3,-36.9,4.2],[-2.2,-32.7,3.2],[-.4,-33.4,3.5]],
      edges: [[0,1],[0,2],[1,2],[2,3],[3,4],[4,5],[5,2]] }
  ];

  let w = 0, h = 0, tick = 0, hovered = -1;

  function layout() {
    const rect = section.getBoundingClientRect();
    w = canvas.width = Math.max(1, Math.round(rect.width));
    h = canvas.height = Math.max(1, Math.round(rect.height));
    const size = Math.min(w, h) * (w < 768 ? 0.2 : 0.24);
    clusters.forEach((c) => {
      const xs = c.pts.map((p) => p[0]), ys = c.pts.map((p) => p[1]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      const k = Math.min(size / (x1 - x0), size / (y1 - y0));
      const cx = c.at[0] * w, cy = c.at[1] * h;
      c.px = c.pts.map((p) => ({
        x: cx + (p[0] - (x0 + x1) / 2) * k,
        y: cy + (p[1] - (y0 + y1) / 2) * k,
        r: Math.max(1.4, 4.6 - p[2] * 0.85),
        name: p[3] || '',
        ph: Math.random() * 6.283
      }));
      c.cx = cx; c.cy = cy;
      c.labelY = cy + ((y1 - y0) * k) / 2 + 26;
    });
  }

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    let best = -1, bd = 140;
    clusters.forEach((c, i) => { const d = Math.hypot(x - c.cx, y - c.cy); if (d < bd) { bd = d; best = i; } });
    hovered = best;
  });
  canvas.addEventListener('pointerleave', () => { hovered = -1; });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    tick += reduced ? 0.004 : 0.01;
    const base = w < 768 ? 0.55 : 1;
    clusters.forEach((c, i) => {
      const on = i === hovered;
      ctx.globalAlpha = base;
      ctx.lineWidth = on ? 1.6 : 1.1;
      ctx.strokeStyle = on ? 'rgba(220,235,255,.8)' : 'rgba(190,215,255,.42)';
      c.edges.forEach(([a, b]) => {
        ctx.beginPath(); ctx.moveTo(c.px[a].x, c.px[a].y); ctx.lineTo(c.px[b].x, c.px[b].y); ctx.stroke();
      });
      c.px.forEach((p) => {
        const pulse = 0.88 + Math.sin(tick + p.ph) * 0.12;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * pulse * (on ? 1.2 : 1), 0, 6.283);
        ctx.fillStyle = on ? '#fff' : 'rgba(235,243,255,.9)'; ctx.fill();
        if (p.name) {
          ctx.font = '500 11px "DM Sans", sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
          ctx.fillStyle = on ? '#fff' : 'rgba(200,220,255,.75)'; ctx.fillText(p.name, p.x + 8, p.y);
        }
      });
      ctx.font = '700 16px "Sora", system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = on ? '#fff' : 'rgba(235,243,255,.7)'; ctx.fillText(c.name, c.cx, c.labelY);
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', layout, { passive: true });
  layout();
  draw();
})();
