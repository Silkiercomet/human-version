/**
 * The AI Forum — Human Version
 * Vanilla JS, no dependencies.
 * Handles: lightweight email validation on submit for the Contact and
 * Subscribe forms, plus a honeypot anti-spam field on each form.
 * On success, shows a toast notification instead of hiding the form.
 */

(function () {
  'use strict';

  const forms = document.querySelectorAll('.form');
  const toast = document.getElementById('toast');
  let toastTimer = null;

  /* ---------------- Helpers ---------------- */

  function isValidEmail(value) {
    // Simple, readable pattern — good enough for client-side UX validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function showError(input, errorEl) {
    errorEl.hidden = false;
    input.setAttribute('aria-invalid', 'true');
    input.focus();
  }

  function clearError(input, errorEl) {
    errorEl.hidden = true;
    input.removeAttribute('aria-invalid');
  }

  function showToast(message) {
    if (!toast) return;

    // Clear any pending hide timer
    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    toast.textContent = message;
    toast.hidden = false;

    // Force reflow so the animation can re-trigger on repeated shows
    void toast.offsetWidth;
    toast.classList.add('toast--visible');

    toastTimer = setTimeout(function () {
      toast.classList.remove('toast--visible');
      // Wait for the fade-out transition before hiding
      setTimeout(function () {
        toast.hidden = true;
      }, 300);
    }, 3000);
  }

  /* ---------------- Form handling ---------------- */

  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const emailInput = form.querySelector('input[type="email"]');
    const errorEl = form.querySelector('.form__error');
    const honeypot = form.querySelector('.hp-field input');

    // Honeypot: if a bot filled the hidden field, silently "accept" but
    // do nothing — no data is sent and the bot learns nothing.
    if (honeypot && honeypot.value.trim() !== '') {
      return;
    }

    if (!emailInput || !errorEl) {
      return;
    }

    const value = emailInput.value;

    if (!isValidEmail(value)) {
      showError(emailInput, errorEl);
      return;
    }

    clearError(emailInput, errorEl);

    // NOTE: destination pending confirmation (see index.html comments).
    // Placeholder success state — swap for a real API/newsletter call.
    const isSubscribe = form.id === 'form-subscribe';
    showToast(isSubscribe
      ? 'Thanks — you’re on the list.'
      : 'Thanks — we’ll be in touch.');

    form.reset();
  }

  /* ---------------- Wire up events ---------------- */

  forms.forEach(function (form) {
    form.addEventListener('submit', handleSubmit);

    // Clear the error state as soon as the user starts typing again
    const emailInput = form.querySelector('input[type="email"]');
    const errorEl = form.querySelector('.form__error');
    if (emailInput && errorEl) {
      emailInput.addEventListener('input', function () {
        clearError(emailInput, errorEl);
      });
    }
  });
})();