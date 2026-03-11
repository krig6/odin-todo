export const showToast = (message, type) => {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return

  const toast = document.createElement('div');
  toast.classList.add('toast__item', `toast--${type}`)
  toast.textContent = message;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast__item--show'));

  setTimeout(() => {
    toast.classList.remove('toast__item--show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 2500);
}
