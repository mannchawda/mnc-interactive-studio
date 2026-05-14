/* ═══════════════════════════════════════════
   MNC. Interactive Studios — Contact Form
═══════════════════════════════════════════ */

const form    = document.getElementById('contactForm');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Button loading state
  const original = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';

  // Simulate send (replace with real endpoint / EmailJS / Formspree)
  await new Promise(r => setTimeout(r, 1400));

  // Show success
  form.innerHTML = `
    <div class="form-success show">
      <h3>// Message Received</h3>
      <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
    </div>
  `;
});