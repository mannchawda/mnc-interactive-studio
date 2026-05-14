/* ═══════════════════════════════════════════
   MNC. Interactive Studios — Starfield + 3D Hero Canvas
═══════════════════════════════════════════ */

// ── Background starfield ─────────────────
const sfCanvas = document.getElementById('starfield');
const sfCtx    = sfCanvas.getContext('2d');
let stars = [];
const STAR_COUNT = 200;

function sfResize() {
  sfCanvas.width  = window.innerWidth;
  sfCanvas.height = window.innerHeight;
}
function initStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * sfCanvas.width,
      y: Math.random() * sfCanvas.height,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random() * 0.8 + 0.1,
      speed: Math.random() * 0.02 + 0.005,
      flicker: Math.random() * Math.PI * 2,
      color: Math.random() > 0.7
        ? `rgba(0,212,255,`
        : Math.random() > 0.5
          ? `rgba(255,204,0,`
          : `rgba(200,220,255,`
    });
  }
}
function drawStars() {
  sfCtx.clearRect(0, 0, sfCanvas.width, sfCanvas.height);
  for (const s of stars) {
    s.flicker += s.speed;
    const a = s.alpha * (0.5 + 0.5 * Math.sin(s.flicker));
    sfCtx.beginPath();
    sfCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sfCtx.fillStyle = s.color + a + ')';
    sfCtx.fill();
  }
  requestAnimationFrame(drawStars);
}
window.addEventListener('resize', () => { sfResize(); initStars(); });
sfResize(); initStars();
requestAnimationFrame(drawStars);

// ── Hero 3D particle grid ────────────────
const hc  = document.getElementById('heroCanvas');
if (hc) {
  const hCtx = hc.getContext('2d');
  let W, H, particles = [], mouse = { x: 0, y: 0 };
  const COLS = 20, ROWS = 10, DEPTH = 400;

  function hResize() {
    W = hc.width  = hc.offsetWidth;
    H = hc.height = hc.offsetHeight;
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        particles.push({
          ox: (i / (COLS - 1) - 0.5) * W * 1.4,
          oy: (j / (ROWS - 1) - 0.5) * H * 1.2,
          oz: (Math.random() - 0.5) * DEPTH,
          phase: Math.random() * Math.PI * 2,
          speed: 0.003 + Math.random() * 0.004,
        });
      }
    }
  }

  let t = 0;
  function drawHero() {
    hCtx.clearRect(0, 0, W, H);
    t += 0.008;

    const mx = (mouse.x / W - 0.5) * 60;
    const my = (mouse.y / H - 0.5) * 40;

    const projected = particles.map(p => {
      const waveY = Math.sin(p.phase + t + p.ox * 0.003) * 30;
      const waveX = Math.cos(p.phase + t * 0.7 + p.oy * 0.003) * 20;

      const x3 = p.ox + waveX + mx * (p.oz / DEPTH + 0.5);
      const y3 = p.oy + waveY + my * (p.oz / DEPTH + 0.5);
      const z3 = p.oz + Math.sin(t + p.phase) * 50;

      const fov  = 600;
      const scale = fov / (fov + z3 + DEPTH / 2);
      const sx = W / 2 + x3 * scale;
      const sy = H / 2 + y3 * scale;

      return { sx, sy, scale, z3, p };
    });

    // Draw connecting lines
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const a = projected[i], b = projected[j];
        const dist = Math.hypot(a.sx - b.sx, a.sy - b.sy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.18 * a.scale;
          hCtx.beginPath();
          hCtx.moveTo(a.sx, a.sy);
          hCtx.lineTo(b.sx, b.sy);
          hCtx.strokeStyle = `rgba(0,212,255,${alpha})`;
          hCtx.lineWidth   = 0.6;
          hCtx.stroke();
        }
      }
    }

    // Draw dots
    for (const { sx, sy, scale } of projected) {
      const r     = scale * 2.5;
      const alpha = scale * 0.8;
      hCtx.beginPath();
      hCtx.arc(sx, sy, r, 0, Math.PI * 2);
      hCtx.fillStyle = `rgba(0,212,255,${alpha})`;
      hCtx.fill();

      // Glow
      const g = hCtx.createRadialGradient(sx, sy, 0, sx, sy, r * 4);
      g.addColorStop(0, `rgba(0,212,255,${alpha * 0.4})`);
      g.addColorStop(1, 'transparent');
      hCtx.beginPath();
      hCtx.arc(sx, sy, r * 4, 0, Math.PI * 2);
      hCtx.fillStyle = g;
      hCtx.fill();
    }

    requestAnimationFrame(drawHero);
  }

  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.addEventListener('mousemove', e => {
      const r  = heroSection.getBoundingClientRect();
      mouse.x  = e.clientX - r.left;
      mouse.y  = e.clientY - r.top;
    });
  }

  window.addEventListener('resize', () => { hResize(); initParticles(); });
  hResize(); initParticles();
  requestAnimationFrame(drawHero);
}