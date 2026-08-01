/**
 * custom.js — AgriGuardian AI shared utilities
 * Loaded on every page.
 *  - Dark mode (persisted to localStorage, respects system preference)
 *  - Cart logic (localStorage)
 *  - Cart badge sync on page load
 */

const AGRI_API = 'http://localhost:3001/api';

/* ─── Dark mode ─────────────────────────────────────────────────────────────
   Apply theme ASAP (before DOMContentLoaded) to avoid flash of wrong theme.
   Priority: localStorage value → system preference → light
────────────────────────────────────────────────────────────────────────────── */
(function applyThemeEarly() {
  const stored = localStorage.getItem('agri-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
})();

/**
 * toggleDarkMode — flip between light and dark, persist the choice.
 * Called by the toggle button on every page.
 */
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('agri-theme', isDark ? 'dark' : 'light');
}

/* ─── DOM ready tasks ───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Cart badge
  const badge = document.getElementById('nav-cart-badge');
  if (badge) {
    const cart = JSON.parse(localStorage.getItem('agriCart')) || [];
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    badge.innerText = totalQty > 0 ? totalQty : 0;
  }

  // 2. Inject dark-mode toggle into every nav that has .dark-toggle-slot
  //    (Each page's nav contains a <span class="dark-toggle-slot"></span>)
  document.querySelectorAll('.dark-toggle-slot').forEach(slot => {
    const btn = document.createElement('button');
    btn.className = 'dark-toggle';
    btn.title = 'Toggle dark mode';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.innerHTML = `
      <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
      </svg>
      <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>`;
    btn.addEventListener('click', toggleDarkMode);
    slot.replaceWith(btn);
  });
});

/* ─── Cart helpers ──────────────────────────────────────────────────────────── */

/**
 * addToCart — Add an item to the persistent cart.
 * @param {HTMLElement} button  - The button element clicked (visual feedback)
 * @param {string}      name    - Product name
 * @param {number}      price   - Product price (Rs.)
 * @param {string}      image   - Image src path
 */
function addToCart(button, name, price, image) {
  let cart = JSON.parse(localStorage.getItem('agriCart')) || [];

  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ name, price, image: image || '', quantity: 1 });
  }

  localStorage.setItem('agriCart', JSON.stringify(cart));

  const badge = document.getElementById('nav-cart-badge');
  if (badge) {
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    badge.innerText = totalQty;
  }

  const originalHTML = button.innerHTML;
  button.innerHTML = '<i class="fa-solid fa-check mr-1"></i> Added';
  button.classList.add('bg-canopy', 'text-paper', 'border-canopy');
  button.classList.remove('text-canopy', 'border-canopy/40');
  button.disabled = true;

  setTimeout(() => {
    button.innerHTML = originalHTML;
    button.classList.remove('bg-canopy', 'text-paper', 'border-canopy');
    button.classList.add('text-canopy', 'border-canopy/40');
    button.disabled = false;
  }, 2000);
}

function getCartCount() {
  const cart = JSON.parse(localStorage.getItem('agriCart')) || [];
  return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
}
