/* ============================================
   FORM VALIDATION
   Client-side contact form validation
   ============================================ */

export function initFormValidation() {
  const form = document.querySelector('[data-validate]');
  if (!form) return;

  const rules = {
    name: {
      required: true,
      minLength: 2,
      message: 'Please enter your full name'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    phone: {
      required: false,
      pattern: /^[\d\s\-+()]{7,}$/,
      message: 'Please enter a valid phone number'
    },
    message: {
      required: true,
      minLength: 10,
      message: 'Message must be at least 10 characters'
    }
  };

  function validateField(input) {
    const name = input.name;
    const value = input.value.trim();
    const rule = rules[name];
    const errorEl = input.closest('.form__group')?.querySelector('.form__error');

    if (!rule) return true;

    let isValid = true;

    if (rule.required && !value) {
      isValid = false;
    } else if (value && rule.pattern && !rule.pattern.test(value)) {
      isValid = false;
    } else if (value && rule.minLength && value.length < rule.minLength) {
      isValid = false;
    }

    input.classList.toggle('is-error', !isValid);
    if (errorEl) {
      errorEl.textContent = rule.message;
      errorEl.classList.toggle('is-visible', !isValid);
    }

    return isValid;
  }

  // Validate on blur
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-error')) {
        validateField(input);
      }
    });
  });

  // Validate on submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // Show success message
      form.style.display = 'none';
      const success = document.querySelector('.form__success');
      if (success) success.classList.add('is-visible');
    }
  });
}
