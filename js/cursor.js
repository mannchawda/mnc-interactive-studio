/* ═══════════════════════════════════════════
   MNC. Interactive Studios — Custom Cursor
═══════════════════════════════════════════ */

const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

// Ring follows with smooth lag
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect on interactive elements
const hoverEls = document.querySelectorAll(
  'a, button, input, textarea, select, .service-card, .work-card, .tag'
);
hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// ── Click burst particles ─────────────
document.addEventListener('click', e => {
  const count = 10;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const angle  = (i / count) * Math.PI * 2;
    const dist   = 40 + Math.random() * 40;
    const size   = 3 + Math.random() * 4;
    const colors = ['#00d4ff','#ffcc00','#00ff9f','#ff00aa'];
    const color  = colors[Math.floor(Math.random() * colors.length)];

    Object.assign(p.style, {
      position:     'fixed',
      left:         e.clientX + 'px',
      top:          e.clientY + 'px',
      width:        size + 'px',
      height:       size + 'px',
      borderRadius: '50%',
      background:   color,
      boxShadow:    `0 0 ${size * 2}px ${color}`,
      pointerEvents:'none',
      zIndex:       9998,
      transform:    'translate(-50%, -50%)',
      transition:   'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      opacity:      '1',
    });

    document.body.appendChild(p);

    requestAnimationFrame(() => {
      p.style.transform = `translate(
        calc(-50% + ${Math.cos(angle) * dist}px),
        calc(-50% + ${Math.sin(angle) * dist}px)
      )`;
      p.style.opacity = '0';
    });

    setTimeout(() => p.remove(), 600);
  }
});