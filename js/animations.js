/* ═══════════════════════════════════════════
   MNC. Interactive Studios — Animations
═══════════════════════════════════════════ */

// ── Scroll progress bar ───────────────
window.addEventListener('scroll', () => {
  const total = document.body.scrollHeight - window.innerHeight;
  const pct   = (window.scrollY / total * 100).toFixed(1);
  document.documentElement.style.setProperty('--scroll-progress', pct + '%');
});

// ── Typewriter ────────────────────────
const phrases = [
  'Building Games From Scratch.',
  'Crafting 3D Worlds in Blender.',
  'Shipping Full-Stack Web Apps.',
  'Turning Ideas Into Experiences.',
];
const tw   = document.getElementById('typewriter');
let pi = 0, ci = 0, deleting = false;

function typeLoop() {
  const phrase = phrases[pi];
  if (!deleting) {
    tw.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    setTimeout(typeLoop, 55);
  } else {
    tw.textContent = phrase.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(typeLoop, 300); return; }
    setTimeout(typeLoop, 28);
  }
}
setTimeout(typeLoop, 1400);

// ── 3D Card tilt ─────────────────────
document.querySelectorAll('.service-card, .work-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const x   = e.clientX - r.left - r.width  / 2;
    const y   = e.clientY - r.top  - r.height / 2;
    const rx  = (-y / r.height * 14).toFixed(1);
    const ry  = ( x / r.width  * 14).toFixed(1);
    card.style.transform =
      `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.boxShadow =
      `${-ry/2}px ${rx/2}px 40px rgba(0,212,255,0.2), 0 0 60px rgba(0,212,255,0.1)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});

// ── Reveal on scroll ─────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = entry.target.closest('.services-grid, .work-grid, .about-grid, .process-track');
      if (siblings) {
        const all = siblings.querySelectorAll('.reveal');
        all.forEach((el, idx) => {
          setTimeout(() => el.classList.add('visible'), idx * 120);
        });
      } else {
        setTimeout(() => entry.target.classList.add('visible'), 100);
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── Stat counter animation ────────────────
const statNums = document.querySelectorAll('.stat-num');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start  = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => counterObserver.observe(el));

// ── Active nav link on scroll ─────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// Active nav link style
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--white); }
.nav-links a.active::after { transform: scaleX(1); }`;
document.head.appendChild(style);