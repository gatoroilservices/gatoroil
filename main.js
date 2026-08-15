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
// Send directly to FormSubmit without navigating away from the website.
// `no-cors` prevents embedded browsers (Instagram/Facebook) from trying to
// inspect FormSubmit's cross-origin response, which caused the previous false error.
const bookingForm = document.getElementById('bookingForm');
const formStatus = document.getElementById('formStatus');
const submitButton = bookingForm?.querySelector('.submit-btn');

bookingForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!bookingForm.reportValidity()) return;

  const formData = new FormData(bookingForm);
  const name = formData.get('name') || 'Customer';
  const service = formData.get('service') || 'Service';

  // FormSubmit formatting fields.
  formData.set('_subject', `New appointment request — ${service} — ${name}`);
  formData.set('_template', 'table');

  // Explicitly identify the exact page that owns this form. This prevents
  // FormSubmit from relying only on the browser's cross-origin referrer.
  formData.set('_url', config.formUrl || window.location.href.split('#')[0]);

  // Once FormSubmit sends the Invisible Email ID, use it instead of exposing
  // the email address in the endpoint. Until then, the normal email endpoint
  // remains available so the form can still be activated/tested.
  const formSubmitTarget = (config.formSubmitId || '').trim();
  const formSubmitEndpoint = formSubmitTarget
    ? `https://formsubmit.co/${formSubmitTarget}`
    : `https://formsubmit.co/${config.email || 'GatorOilServices@gmail.com'}`;

  if (formStatus) {
    formStatus.className = 'form-status';
    formStatus.textContent = 'Sending your appointment request…';
  }

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.dataset.originalText = submitButton.innerHTML;
    submitButton.innerHTML = 'Sending…';
  }

  try {
    await fetch(formSubmitEndpoint, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    });

    if (formStatus) {
      formStatus.className = 'form-status success';
      formStatus.textContent = 'Request sent! Gator will contact you to confirm your appointment.';
    }

    bookingForm.reset();
  } catch (error) {
    if (formStatus) {
      formStatus.className = 'form-status error';
      formStatus.textContent = "We couldn't send the request. Please call or text (352) 933-5038.";
    }
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = submitButton.dataset.originalText || 'Send request <span>→</span>';
    }
  }
});
