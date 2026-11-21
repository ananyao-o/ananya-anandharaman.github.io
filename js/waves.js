/* waves.js — scientifically grounded waveforms + wave-type announcement
   ──────────────────────────────────────────────────────────────────────
   GW section        → CBC inspiral chirp  (f & A increase → merger → ringdown)
   Radio section     → AM carrier wave     (uniform sinusoid with envelope)
   Surface section   → Microseismic noise  (anthropogenic spikes from vehicles)
   Crust section     → Scrolling seismogram with P- and S-wave arrivals
   Mantle/Core       → Long-period dispersive surface waves (Love + Rayleigh)
*/

(() => {
  const canvas  = document.getElementById('wave-canvas');
  const labelEl = document.getElementById('wave-type-text');
  if (!canvas) return;

  const ctx      = canvas.getContext('2d');
  const sections = Array.from(document.querySelectorAll('section[data-wave]'));
  const reduced  = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Wave metadata ─────────────────────────────────────────── */
  const WAVE_META = {
    'gw':            { label: 'Gravitational waves', desc: 'Inspiral chirp, merger, ringdown',      r:130, g:175, b:255 },
    'radio':         { label: 'Radio waves',         desc: 'Amplitude-modulated carrier',            r:200, g:160, b:255 },
    'infra':         { label: 'Infrasound',          desc: 'Narrowband microbaroms from ocean swell', r:125, g:215, b:235 },
    'seismic-noisy': { label: 'Seismic noise',       desc: 'Microseisms plus passing vehicles',      r:255, g:195, b:100 },
    'seismic':       { label: 'Body waves',          desc: 'P arrives first, then the larger S',     r:120, g:220, b:160 },
    'seismic-deep':  { label: 'Surface waves',       desc: 'Love and Rayleigh, dispersive',          r:255, g:150, b: 80 },
    'modes':         { label: 'Normal modes',        desc: 'The whole Earth ringing like a bell',    r:255, g:222, b:110 },
  };

  /* ── State ─────────────────────────────────────────────────── */
  let width = 0, height = 100, t = 0;
  let currentWave   = 'gw';
  let transPulse    = 0;      // 1→0, boosts visibility on wave-type change
  let annTimeout    = null;
  let quakeState = { active: false, elapsed: 0 };
  let lastQuake;

  /* ── Resize ────────────────────────────────────────────────── */
  function resize() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = 100;
  }

  /* ── Section detection ─────────────────────────────────────── */
  function activeSection() {
    const mid = window.innerHeight * 0.55;
    let best = Infinity, chosen = sections[0];
    sections.forEach(s => {
      const r = s.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - mid);
      if (d < best) { best = d; chosen = s; }
    });
    return chosen;
  }

  /* ── Announcement bubble ───────────────────────────────────── */
  function showAnnouncement(meta) {
    const ann = document.getElementById('wave-ann');
    if (!ann) return;
    ann.querySelector('.wave-ann-name').textContent = meta.label;
    ann.querySelector('.wave-ann-desc').textContent = meta.desc;
    // Colour the accent bar to match wave colour
    const bar = ann.querySelector('.wave-ann-bar');
    if (bar) bar.style.background = `rgb(${meta.r},${meta.g},${meta.b})`;
    ann.style.setProperty('--c', `rgb(${meta.r},${meta.g},${meta.b})`);
    ann.classList.add('visible');
    clearTimeout(annTimeout);
    ann.classList.remove('flash'); void ann.offsetWidth; ann.classList.add('flash');
  }

  function updateType() {
    const sec     = activeSection();
    const newWave = (sec && sec.dataset.wave) || 'gw';
    if (newWave === currentWave) return;
    currentWave = newWave;
    transPulse  = 1.0;
    const meta  = WAVE_META[currentWave] || WAVE_META['gw'];
    if (labelEl) labelEl.textContent = meta.label;
    showAnnouncement(meta);
  }

  /* ══════════════════════════════════════════════════════════════
     WAVEFORM GENERATORS — one per physical wave type
     All return a y-offset from the canvas mid-line.
  ══════════════════════════════════════════════════════════════ */

  /* ── Gravitational wave: inspiral chirp ────────────────────────
     h(t) ∝ (t_c − t)^{−1/4} cos φ(t)
     φ(t) = −2(t_c − t)^{5/8} / M^{5/8}  (PN approximation)
     We approximate: frequency and amplitude both increase toward
     merger, then a sharp ringdown decays exponentially.          */
  function gwChirp(x, layer, time) {
    const cycleLen  = 900;
    const ct        = (time % cycleLen) / cycleLen;          // 0→1
    const preMerger = ct < 0.88;
    const mParam    = preMerger ? Math.pow(ct / 0.88, 0.55) : 0;
    const ringdown  = preMerger ? 1.0 : Math.exp(-(ct - 0.88) * 16);

    const fInst = 0.007 + mParam * 0.036;                   // frequency chirp
    const amp   = (3.5 + mParam * 14) * ringdown;           // amplitude envelope

    const phi = x * fInst + time * 0.013 * (1 + mParam * 4) + layer * 0.65;
    return Math.sin(phi) * amp
         + Math.sin(phi * 2.15) * amp * 0.22 * mParam;      // overtone near merger
  }

  /* ── Radio: amplitude-modulated carrier ────────────────────────
     r(t) = A(t) · cos(2π f_c t)  where A(t) is slow envelope.  */
  function radioWave(x, layer, time) {
    const carrier  = Math.sin(x * 0.064 + time * 0.023 + layer * 0.88);
    const envelope = 0.68 + 0.32 * Math.sin(x * 0.011 + time * 0.005);
    return carrier * envelope * 13;
  }

  /* ── Seismic surface noise: microseismic + vehicle spikes ──────
     Background: primary (0.05–0.1 Hz) and secondary (0.1–0.2 Hz)
     microseismic peaks from ocean swell.
     Foreground: impulsive transients when vehicles pass overhead. */
  function seismicNoisy(x, layer, time) {
    // Background microseismic (ocean-driven)
    let y = Math.sin(x * 0.014 + time * 0.009 + layer)      * 7.0   // primary peak
           + Math.sin(x * 0.028 + time * 0.016)              * 4.0   // secondary peak
           + Math.sin(x * 0.060 + time * 0.022 + layer * 2)  * 2.5   // cultural noise
           + Math.sin(x * 0.120 - time * 0.019)              * 1.5;  // high-freq

    // Vehicle-generated transients (reads live positions from surface.js)
    const state = window.surfaceState;
    if (state && state.vehicles && state.width > 0) {
      state.vehicles.forEach(v => {
        const vx      = (v.x / state.width) * width;
        const dist    = Math.abs(x - vx);
        if (dist < 180) {
          const falloff = Math.pow(1 - dist / 180, 2.2);
          const spd     = Math.abs(v.speed || 0.5);
          const mass    = ((v.def && v.def.width) || 50) / 45;
          y += Math.sin(dist * 0.22 + time * 0.07 * spd) * falloff * spd * mass * 22;
          y += Math.cos(dist * 0.38 + time * 0.13 * spd) * falloff * spd * mass * 10;
        }
      });
    }
    return y;
  }

  /* ── Seismic body waves: scrolling seismogram ──────────────────
     Simulates a real seismogram with periodic events.
     P-wave (compressional): arrives first, ~6–8 Hz, small amplitude.
     S-wave (shear):  arrives ~1.73× later (Vp/Vs ratio), ~3–4 Hz,
                      larger amplitude.
     The wave scrolls left so the rightmost edge is "now".         */
  function seismicBody(x, layer, time) {
    const scroll  = time * 1.4;
    const sampleT = scroll - x * 0.85;          // scrolling seismogram
    const cycle   = 700;
    const phase   = ((sampleT % cycle) + cycle) % cycle;

    // Pre-event microseismic floor
    const bg = Math.sin(sampleT * 0.040 + layer * 1.1) * 1.2
             + Math.sin(sampleT * 0.075 + layer * 0.6) * 0.7;

    // P-wave arrival: phase window 270–360
    const pp   = phase - 270;
    const pEnv = (pp > 0 && pp < 90) ? Math.exp(-0.5 * Math.pow((pp - 38) / 18, 2)) : 0;
    const pWave = Math.sin(sampleT * 0.24) * pEnv * 11;  // ~higher freq

    // S-wave arrival: phase window 420–570  (delay ratio ≈ 1.73)
    const sp   = phase - 420;
    const sEnv = (sp > 0 && sp < 150) ? Math.exp(-0.5 * Math.pow((sp - 62) / 34, 2)) : 0;
    const sWave = Math.sin(sampleT * 0.13) * sEnv * 24;  // ~lower freq, larger amp

    return bg + pWave + sWave;
  }

  /* ── Deep seismic: dispersive surface waves ────────────────────
     Love waves:    transverse, ~20–200 s period
     Rayleigh waves: retrograde-elliptical, slightly shorter period
     Coda:          dispersive tail, earlier short-period arrivals  */
  function seismicDeep(x, layer, time) {
    const love     = Math.sin(x * 0.008 + time * 0.004 + layer * 0.5) * 14;
    const rayleigh = Math.sin(x * 0.012 - time * 0.004 + layer * 0.3) * 10;
    const coda     = Math.sin(x * 0.020 + time * 0.007 + layer)       *  5;
    return love + rayleigh + coda;
  }

  /* ── Earthquake P/S overlay ────────────────────────────────────
     Called when earthquake.js sets window.earthquakeActive = true.
     Overlays a sudden high-amplitude burst that decays.           */
  function earthquakeOverlay(x, layer, elapsed) {
    if (elapsed <= 0) return 0;
    const decay = Math.exp(-elapsed * 0.018);

    // P-wave front: sharp, high-freq, arrives at low x first
    const pFront = Math.max(0, 1 - Math.abs(x - elapsed * 2.8) / 90);
    const pWave  = Math.sin(x * 0.28 + elapsed * 0.2) * pFront * 28 * decay;

    // S-wave front: arrives later (1.73× P travel time), larger amp
    const sOffset = elapsed - width / 3.2;   // S starts after P has crossed ~1/3 width
    const sFront  = sOffset > 0 ? Math.max(0, 1 - Math.abs(x - sOffset * 1.6) / 120) : 0;
    const sWave   = Math.sin(x * 0.16 + elapsed * 0.12) * sFront * 40 * decay;

    // Coda: diffuse ringing that fills the whole trace
    const coda    = Math.sin(x * 0.06 + elapsed * 0.08 + layer) * decay * 14;

    return pWave + sWave + coda;
  }

  /* ── Infrasound (upper atmosphere): microbaroms ────────────────
     Narrowband ~0.2 Hz pressure waves generated by ocean swell, the
     atmospheric counterpart of the secondary microseism.           */
  function infrasound(x, layer, time) {
    const packet = 0.35 + 0.65 * Math.abs(Math.sin(x * 0.007 + time * 0.003));
    return Math.sin(x * 0.045 + time * 0.02 + layer * 0.5) * packet * 15
         + Math.sin(x * 0.09 + time * 0.03) * packet * 2.5;
  }

  /* ── Core: Earth's free oscillations (normal modes) ────────────
     Two closely spaced modes beating against each other.          */
  function normalModes(x, layer, time) {
    return Math.sin(x * 0.010 + time * 0.005 + layer * 0.4) * 11
         + Math.sin(x * 0.0113 + time * 0.0052) * 11;
  }

  /* ── Master dispatcher ─────────────────────────────────────── */
  function getWaveY(x, type, layer, time) {
    const base = height * 0.5;
    let raw;
    switch (type) {
      case 'gw':            raw = gwChirp(x, layer, time);      break;
      case 'radio':         raw = radioWave(x, layer, time);    break;
      case 'seismic-noisy': raw = seismicNoisy(x, layer, time); break;
      case 'seismic':       raw = seismicBody(x, layer, time);  break;
      case 'seismic-deep':  raw = seismicDeep(x, layer, time);  break;
      case 'infra':         raw = infrasound(x, layer, time);   break;
      case 'modes':         raw = normalModes(x, layer, time);  break;
      default:              raw = Math.sin(x * 0.03 + time * 0.01 + layer) * 10;
    }

    // Boost amplitude briefly when wave type changes
    const boost = 1 + transPulse * 1.3;

    // Add earthquake P/S overlay if triggered
    const quake = window.earthquakeActive
      ? earthquakeOverlay(x, layer, quakeState.elapsed)
      : 0;

    return base + raw * boost + quake;
  }

  /* ── Draw loop ─────────────────────────────────────────────── */
  function draw() {
    ctx.clearRect(0, 0, width, height);
    t          += reduced ? 0.3 : 1;
    transPulse  = Math.max(0, transPulse - 0.010);

    if (window.earthquakeStamp !== lastQuake) { lastQuake = window.earthquakeStamp; quakeState.elapsed = 0; }
    // Tick earthquake elapsed counter
    if (window.earthquakeActive) {
      quakeState.elapsed += 1;
      if (quakeState.elapsed > 280) {
        window.earthquakeActive = false;
        quakeState.elapsed = 0;
      }
    }

    const meta      = WAVE_META[currentWave] || WAVE_META['gw'];
    const { r, g, b } = meta;
    const baseAlpha = 0.85 + transPulse * 0.15;

    /* Three layered traces (back → front) */
    for (let layer = 2; layer >= 0; layer--) {
      const alpha = Math.max(0.07, baseAlpha - layer * 0.08);
      const lw    = layer === 1 ? 1.9 : 1.2;

      ctx.beginPath();
      for (let x = 0; x <= width; x += 3) {
        const y = getWaveY(x, currentWave, layer, t);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth   = lw;
      ctx.stroke();
    }

    /* Soft glow halo on the middle trace during transition / quake */
    const glowAmt = Math.max(transPulse, window.earthquakeActive ? 0.6 : 0);
    if (glowAmt > 0.04) {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 6) {
        const y = getWaveY(x, currentWave, 1, t);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${r},${g},${b},${glowAmt * 0.22})`;
      ctx.lineWidth   = 10;
      ctx.stroke();
    }

    /* Faint baseline */
    ctx.beginPath();
    ctx.moveTo(0, height * 0.5);
    ctx.lineTo(width, height * 0.5);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth   = 1;
    ctx.stroke();

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', updateType, { passive: true });
  resize();
  showAnnouncement(WAVE_META[currentWave]);
  updateType();
  draw();
})();
