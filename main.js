const config = window.BUSINESS_CONFIG || {};
const qsa = (s) => [...document.querySelectorAll(s)];

// Apply easy business configuration.
qsa('[data-business-name]').forEach(el => el.textContent = config.businessName || 'GATOR');
qsa('[data-phone-display]').forEach(el => el.textContent = config.phoneDisplay || '(305) 555-0148');
qsa('[data-phone-link]').forEach(el => el.href = `tel:${config.phoneHref || '+13055550148'}`);
qsa('[data-service-area]').forEach(el => el.textContent = config.serviceArea || 'Your Area');
qsa('[data-hours-short]').forEach(el => el.textContent = config.hoursShort || 'Mon–Sat');
qsa('[data-hours-full]').forEach(el => el.innerHTML = config.hoursFull || 'By appointment');
qsa('[data-area-description]').forEach(el => el.textContent = config.areaDescription || 'Mobile service in your area.');
qsa('[data-instagram-link]').forEach(el => el.href = config.instagram || '#');
qsa('[data-facebook-link]').forEach(el => el.href = config.facebook || '#');
qsa('[data-tiktok-link]').forEach(el => el.href = config.tiktok || '#');
if (config.accentColor) document.documentElement.style.setProperty('--accent', config.accentColor);
if (config.accentDark) document.documentElement.style.setProperty('--accent-dark', config.accentDark);

document.title = `${config.fullBusinessName || 'Gator Mobile Oil Services'} | Mobile Oil Change`;

document.getElementById('year').textContent = new Date().getFullYear();

const tags = document.querySelector('[data-area-tags]');
if (tags && Array.isArray(config.areaTags)) tags.innerHTML = config.areaTags.map(x => `<span>${x}</span>`).join('');

// Mobile menu.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
qsa('.nav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

// Reveal animation.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
qsa('.reveal').forEach(el => observer.observe(el));

// Service cards jump to booking and preselect service.
qsa('.service-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const serviceName = card.querySelector('h3')?.textContent?.trim();
    const select = document.querySelector('#service');
    if (select) {
      const option = [...select.options].find(o => o.text.toLowerCase() === serviceName.toLowerCase());
      if (option) select.value = option.value;
    }
    document.querySelector('#book')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Appointment request form:
// Primary path uses Web3Forms' documented JSON/AJAX format.
// If an in-app browser blocks the AJAX request, the form falls back to a normal
// HTML POST to Web3Forms and redirects back to this page with ?sent=1.
const bookingForm = document.getElementById('bookingForm');
const formStatus = document.getElementById('formStatus');
const submitButton = bookingForm?.querySelector('.submit-btn');

function showFormStatus(type, message) {
  if (!formStatus) return;
  formStatus.className = `form-status ${type || ''}`.trim();
  formStatus.textContent = message;
}

// Show confirmation after the native fallback redirects back to the site.
const pageUrl = new URL(window.location.href);
if (pageUrl.searchParams.get('sent') === '1') {
  showFormStatus('success', 'Request sent! Gator will contact you to confirm your appointment.');
  pageUrl.searchParams.delete('sent');
  history.replaceState({}, '', `${pageUrl.pathname}${pageUrl.search}${pageUrl.hash}`);
}

bookingForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!bookingForm.reportValidity()) return;

  const formData = new FormData(bookingForm);
  const name = formData.get('name') || 'Customer';
  const service = formData.get('service') || 'Service';

  // Keep the key in both HTML and JS so the normal HTML POST fallback also works.
  formData.set('access_key', config.web3FormsAccessKey || 'e246e65f-e772-4a4f-b0c9-d65e3fc33a49');
  formData.set('subject', `New appointment request — ${service} — ${name}`);
  formData.set('from_name', config.fullBusinessName || 'Gator Mobile Oil Services');
  formData.set('Website', config.formUrl || window.location.href.split('#')[0]);

  const payload = Object.fromEntries(formData.entries());

  if (!payload.access_key) {
    showFormStatus('error', "We couldn't send the request. Please call or text (352) 933-5038.");
    return;
  }

  showFormStatus('', 'Sending your appointment request…');

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.dataset.originalText = submitButton.innerHTML;
    submitButton.innerHTML = 'Sending…';
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Web3Forms rejected the request.');
    }

    showFormStatus('success', 'Request sent! Gator will contact you to confirm your appointment.');
    bookingForm.reset();
  } catch (error) {
    console.error('Web3Forms AJAX error; using normal form fallback:', error);

    // Normal form POST is more tolerant of restrictive in-app browsers.
    // HTMLFormElement.submit() bypasses this submit handler, preventing a loop.
    showFormStatus('', 'Sending your appointment request…');
    bookingForm.submit();
    return;
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = submitButton.dataset.originalText || 'Send request <span>→</span>';
    }
  }
});

