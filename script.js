/**
 * The AI Forum — Human Version
 * Vanilla JS, no dependencies.
 * Handles: accessible subscribe modal (focus trap, Esc to close,
 * fade-in on content) and a lightweight email validation on submit.
 */

(function () {
  'use strict';

  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('subscribe-modal');
  const modalContent = document.getElementById('modal-fade-content');
  // Two Subscribe buttons exist in the DOM (one inside the hero card for
  // desktop, one below the card for mobile) — only one is visible at a
  // time via CSS, but both should open the same modal.
  const openTriggers = document.querySelectorAll('[data-subscribe-trigger]');
  const closeBtn = document.getElementById('modal-close');
  const form = document.getElementById('subscribe-form');
  const emailInput = document.getElementById('subscribe-email');
  const emailError = document.getElementById('subscribe-email-error');
  const successMsg = document.getElementById('modal-success');

  let lastFocusedElement = null;

  /* ---------------- Modal open/close ---------------- */

  function getFocusableElements() {
    return modal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  }

  function openModal() {
    lastFocusedElement = document.activeElement;
    overlay.hidden = false;

    // Restart the fade-in animation each time the modal opens
    modalContent.style.animation = 'none';
    // Force reflow so the animation can be re-triggered
    void modalContent.offsetWidth;
    modalContent.style.animation = '';

    const focusable = getFocusableElements();
    if (focusable.length) {
      focusable[0].focus();
    }

    document.addEventListener('keydown', handleKeydown);
  }

  function closeModal() {
    overlay.hidden = true;
    document.removeEventListener('keydown', handleKeydown);

    resetFormState();

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      closeModal();
      return;
    }

    if (event.key === 'Tab') {
      trapFocus(event);
    }
  }

  function trapFocus(event) {
    const focusable = Array.from(getFocusableElements());
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ---------------- Form validation ---------------- */

  function isValidEmail(value) {
    // Simple, readable pattern — good enough for client-side UX validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function resetFormState() {
    form.hidden = false;
    successMsg.hidden = true;
    emailError.hidden = true;
    emailInput.removeAttribute('aria-invalid');
    form.reset();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const value = emailInput.value;

    if (!isValidEmail(value)) {
      emailError.hidden = false;
      emailInput.setAttribute('aria-invalid', 'true');
      emailInput.focus();
      return;
    }

    emailError.hidden = true;
    emailInput.removeAttribute('aria-invalid');

    // NOTE: destination pending confirmation (see index.html comments).
    // Placeholder success state — swap for a real API/newsletter call.
    form.hidden = true;
    successMsg.hidden = false;
    successMsg.focus?.();
  }

  /* ---------------- Wire up events ---------------- */

  openTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', openModal);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (overlay) {
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) {
        closeModal();
      }
    });
  }

  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
})();
