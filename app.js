/**
 * FoodKnock Quick Order — Main App JS v2
 * Premium PWA: routing, cart, localStorage, WhatsApp order, UI, install prompt
 */

/* =========================================================
   CONSTANTS & STATE
   ========================================================= */
const CART_STORAGE_KEY = 'fk_carts_v2';
const PAGE_SHOP_PARAM  = 'shop';

let currentShopId = null;
let carts = {};
let deferredInstallPrompt = null; // PWA install event

/* =========================================================
   LOCAL STORAGE — SAFE READ/WRITE
   ========================================================= */
function loadCarts() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return (typeof parsed === 'object' && parsed !== null) ? parsed : {};
  } catch (e) {
    console.warn('[FK] Cart read error, resetting.', e);
    clearAllCarts();
    return {};
  }
}

function saveCarts() {
  try {
    const serialised = JSON.stringify(carts);
    if (serialised.length > 4 * 1024 * 1024) {
      console.warn('[FK] Cart too large, resetting.');
      clearAllCarts();
      return;
    }
    localStorage.setItem(CART_STORAGE_KEY, serialised);
  } catch (e) {
    console.warn('[FK] Cart write error, resetting.', e);
    clearAllCarts();
  }
}

function clearAllCarts() {
  try { localStorage.removeItem(CART_STORAGE_KEY); } catch (_) {}
  carts = {};
}

function clearShopCart(shopId) {
  delete carts[shopId];
  saveCarts();
}

/* =========================================================
   CART HELPERS
   ========================================================= */
function getCart(shopId)         { return carts[shopId] || {}; }
function getQty(shopId, itemId)  { return (carts[shopId] && carts[shopId][itemId]) ? carts[shopId][itemId] : 0; }

function cartTotal(shopId, menu) {
  const cart = getCart(shopId);
  return menu.reduce((sum, item) => sum + ((cart[item.id] || 0) * item.price), 0);
}

function cartItemCount(shopId) {
  return Object.values(getCart(shopId)).reduce((a, b) => a + b, 0);
}

function setQty(shopId, itemId, qty) {
  if (!carts[shopId]) carts[shopId] = {};
  if (qty <= 0) {
    delete carts[shopId][itemId];
    if (Object.keys(carts[shopId]).length === 0) delete carts[shopId];
  } else {
    carts[shopId][itemId] = qty;
  }
  saveCarts();
}

/* =========================================================
   PWA — SERVICE WORKER REGISTRATION
   ========================================================= */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./service-worker.js')
        .then(reg => {
          console.log('[FK] SW registered:', reg.scope);
        })
        .catch(err => {
          console.warn('[FK] SW registration failed:', err);
        });
    });
  }
}

/* =========================================================
   PWA — INSTALL PROMPT
   ========================================================= */
function initInstallPrompt() {
  const bar        = document.getElementById('fk-install-bar');
  const installBtn = document.getElementById('fk-install-btn');
  const dismissBtn = document.getElementById('fk-install-dismiss');
  if (!bar) return;

  // Don't show if already dismissed this session
  if (sessionStorage.getItem('fk_install_dismissed')) return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    bar.classList.add('visible');
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      console.log('[FK] Install outcome:', outcome);
      deferredInstallPrompt = null;
      bar.classList.remove('visible');
    });
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      bar.classList.remove('visible');
      sessionStorage.setItem('fk_install_dismissed', '1');
    });
  }

  // Hide bar if app is already installed (standalone mode)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    bar.classList.remove('visible');
  }
}

/* =========================================================
   SHOP CARD RENDERING (index.html)
   ========================================================= */
function renderShopCards() {
  const container = document.getElementById('fk-shops-grid');
  if (!container || typeof SHOPS === 'undefined') return;

  container.innerHTML = '';

  SHOPS.forEach((shop, i) => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-lg-3';
    col.setAttribute('role', 'listitem');
    col.style.cssText = `animation: fadeUp 0.5s ${i * 80}ms both ease;`;

    col.innerHTML = `
      <a href="shop.html?shop=${encodeURIComponent(shop.id)}"
         class="fk-shop-card"
         style="--shop-accent:${shop.accent};--shop-accent-lt:${shop.accentLight};--shop-gradient:${shop.gradient}"
         aria-label="Open ${shop.name} — ${shop.tagline}">
        <div class="fk-shop-card-top">
          <div class="fk-shop-emoji-wrap" style="--shop-gradient:${shop.gradient}" aria-hidden="true">
            ${shop.emoji}
          </div>
          <div class="fk-shop-item-badge" style="--shop-accent:${shop.accent};--shop-accent-lt:${shop.accentLight}">
            ${shop.menu.length} items
          </div>
        </div>
        <div class="fk-shop-name">${shop.name}</div>
        <div class="fk-shop-tagline">${shop.tagline}</div>
        <div class="fk-shop-category-tag">
          <i class="bi bi-tag-fill" aria-hidden="true"></i>${shop.category}
        </div>
        <div class="fk-shop-cta-row">
          <div class="fk-shop-cta-link" style="--shop-accent:${shop.accent}">
            Order Now
            <span class="arrow" style="background:${shop.accent}">
              <i class="bi bi-arrow-right" aria-hidden="true"></i>
            </span>
          </div>
        </div>
      </a>`;

    container.appendChild(col);
  });
}

/* =========================================================
   SHOP PAGE INIT (shop.html)
   ========================================================= */
function initShopPage() {
  if (typeof SHOPS === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  currentShopId = params.get(PAGE_SHOP_PARAM);
  const shop = SHOPS.find(s => s.id === currentShopId);

  if (!shop) {
    document.body.innerHTML = `
      <div style="text-align:center;padding:80px 20px;color:var(--text-muted);font-family:'Nunito',sans-serif">
        <div style="font-size:3rem;margin-bottom:16px">🚫</div>
        <p style="font-size:1rem;font-weight:700;color:var(--text-secondary)">Shop not found.</p>
        <a href="index.html" style="color:var(--brand-orange);font-weight:800">← Back to all shops</a>
      </div>`;
    return;
  }

  // Apply shop accent CSS variables globally
  document.documentElement.style.setProperty('--shop-accent',    shop.accent);
  document.documentElement.style.setProperty('--shop-accent-lt', shop.accentLight);
  document.documentElement.style.setProperty('--shop-gradient',  shop.gradient);

  // Update meta / title
  document.title = `${shop.name} — FoodKnock`;

  // Fill shop header
  setText('fk-shop-emoji',     shop.emoji);
  setText('fk-shop-name',      shop.name);
  setText('fk-shop-cat',       shop.category);
  setText('fk-shop-tagline-h', shop.tagline);

  // Render menu: shimmer → real data
  renderMenuShimmer();
  setTimeout(() => {
    renderMenu(shop, shop.menu);
    refreshCartFAB(shop);
    refreshCartPanel(shop);
  }, 320);

  // Live search
  const searchInput = document.getElementById('fk-search');
  if (searchInput) {
    let searchTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        const q = searchInput.value.trim().toLowerCase();
        const filtered = q
          ? shop.menu.filter(item => item.name.toLowerCase().includes(q))
          : shop.menu;
        renderMenu(shop, filtered, q);
      }, 120);
    });

    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        renderMenu(shop, shop.menu);
        searchInput.blur();
      }
    });
  }
}

/* ── Shimmer Loader ── */
function renderMenuShimmer() {
  const list = document.getElementById('fk-menu-list');
  if (!list) return;
  list.innerHTML = Array.from({ length: 7 }, () => `<div class="fk-shimmer"></div>`).join('');
}

/* ── Menu Renderer ── */
function renderMenu(shop, items, query = '') {
  const list = document.getElementById('fk-menu-list');
  if (!list) return;

  if (items.length === 0) {
    list.innerHTML = `
      <div class="fk-no-results">
        <div class="fk-no-icon">🔍</div>
        <p style="font-weight:700;color:var(--text-secondary);margin-bottom:4px">No matches for "${escapeHtml(query)}"</p>
        <small>Try a different keyword or clear search</small>
      </div>`;
    return;
  }

  list.innerHTML = items.map(item => {
    const qty = getQty(shop.id, item.id);
    return `
      <div class="fk-menu-item" id="item-row-${item.id}" role="listitem">
        <div class="fk-item-info">
          <div class="fk-item-name">${highlightMatch(escapeHtml(item.name), query)}</div>
          <div class="fk-item-price">₹${item.price}</div>
        </div>
        <div class="fk-item-controls" id="ctrl-${item.id}">
          ${qty === 0 ? renderAddBtn(shop.id, item.id) : renderQtyCtrl(shop.id, item.id, qty)}
        </div>
      </div>`;
  }).join('');
}

function renderAddBtn(shopId, itemId) {
  return `<button class="fk-btn-add" onclick="addItem('${shopId}','${itemId}')" aria-label="Add to cart">
    <i class="bi bi-plus-lg" aria-hidden="true"></i> Add
  </button>`;
}

function renderQtyCtrl(shopId, itemId, qty) {
  return `
    <div class="fk-qty-wrap" role="group" aria-label="Quantity control">
      <button class="fk-qty-btn" onclick="changeQty('${shopId}','${itemId}',-1)" aria-label="Decrease quantity">
        <i class="bi bi-dash" aria-hidden="true"></i>
      </button>
      <span class="fk-qty-num" id="qty-${itemId}" aria-live="polite">${qty}</span>
      <button class="fk-qty-btn" onclick="changeQty('${shopId}','${itemId}',1)" aria-label="Increase quantity">
        <i class="bi bi-plus" aria-hidden="true"></i>
      </button>
    </div>`;
}

/* =========================================================
   CART ACTIONS
   ========================================================= */
function addItem(shopId, itemId) {
  setQty(shopId, itemId, 1);
  refreshItemControl(shopId, itemId);
  const shop = SHOPS.find(s => s.id === shopId);
  refreshCartFAB(shop);
  refreshCartPanel(shop);
  const item = shop.menu.find(i => i.id === itemId);
  showToast(`✓ ${item.name} added`, 'success');
}

function changeQty(shopId, itemId, delta) {
  const newQty = getQty(shopId, itemId) + delta;
  setQty(shopId, itemId, newQty);
  refreshItemControl(shopId, itemId);
  const shop = SHOPS.find(s => s.id === shopId);
  refreshCartFAB(shop);
  refreshCartPanel(shop);
}

function refreshItemControl(shopId, itemId) {
  const ctrl = document.getElementById(`ctrl-${itemId}`);
  if (!ctrl) return;
  const qty = getQty(shopId, itemId);
  ctrl.innerHTML = qty === 0 ? renderAddBtn(shopId, itemId) : renderQtyCtrl(shopId, itemId, qty);
}

/* =========================================================
   FLOATING CART BUTTON
   ========================================================= */
function refreshCartFAB(shop) {
  const fab   = document.getElementById('fk-cart-fab');
  const badge = document.getElementById('fk-cart-count');
  if (!fab || !shop) return;

  const count = cartItemCount(shop.id);
  if (count === 0) {
    fab.classList.add('hidden');
  } else {
    fab.classList.remove('hidden');
    badge.textContent = count;
  }
}

/* =========================================================
   CART PANEL (Offcanvas)
   ========================================================= */
function openCartPanel() {
  const el = document.getElementById('fk-cart-offcanvas');
  if (!el) return;
  bootstrap.Offcanvas.getOrCreateInstance(el).show();
}

function refreshCartPanel(shop) {
  if (!shop) return;
  const body     = document.getElementById('fk-cart-body');
  const totalEl  = document.getElementById('fk-cart-total');
  const placeBtn = document.getElementById('fk-place-order-btn');
  if (!body) return;

  const cart      = getCart(shop.id);
  const cartItems = shop.menu.filter(item => (cart[item.id] || 0) > 0);

  if (cartItems.length === 0) {
    body.innerHTML = `
      <div class="fk-cart-empty">
        <div class="fk-cart-empty-icon">🛒</div>
        <div class="fk-cart-empty-title">Your cart is empty</div>
        <div class="fk-cart-empty-text">Add items from the menu above.</div>
      </div>`;
    if (totalEl)  totalEl.textContent = '₹0';
    if (placeBtn) placeBtn.disabled = true;
    return;
  }

  body.innerHTML = cartItems.map(item => {
    const qty      = cart[item.id];
    const subtotal = qty * item.price;
    return `
      <div class="fk-cart-row">
        <div class="fk-cart-item-name">${escapeHtml(item.name)}</div>
        <div class="fk-cart-item-qty">×${qty}</div>
        <div class="fk-cart-item-price">₹${subtotal}</div>
        <button class="fk-cart-remove" onclick="removeCartItem('${shop.id}','${item.id}')" aria-label="Remove ${escapeHtml(item.name)}">
          <i class="bi bi-trash3" aria-hidden="true"></i>
        </button>
      </div>`;
  }).join('');

  const total = cartTotal(shop.id, shop.menu);
  if (totalEl)  totalEl.textContent  = `₹${total}`;
  if (placeBtn) placeBtn.disabled    = false;
}

function removeCartItem(shopId, itemId) {
  setQty(shopId, itemId, 0);
  refreshItemControl(shopId, itemId);
  const shop = SHOPS.find(s => s.id === shopId);
  refreshCartFAB(shop);
  refreshCartPanel(shop);
}

/* =========================================================
   WHATSAPP ORDER
   ========================================================= */
function placeOrder() {
  const shop = SHOPS.find(s => s.id === currentShopId);
  if (!shop) return;

  const cart      = getCart(shop.id);
  const cartItems = shop.menu.filter(item => (cart[item.id] || 0) > 0);
  if (cartItems.length === 0) return;

  const lines = cartItems.map(item => {
    const qty = cart[item.id];
    return `• ${item.name} x${qty} = ₹${qty * item.price}`;
  });

  const total   = cartTotal(shop.id, shop.menu);
  const message =
    `🛒 *FoodKnock New Order*\n` +
    `📍 Shop: ${shop.name}\n\n` +
    `*Items:*\n${lines.join('\n')}\n\n` +
    `💰 *Total: ₹${total}*\n\n` +
    `Thank you! 🙏`;

  window.open(`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');

  // Clear + reset UI
  clearShopCart(shop.id);
  carts = loadCarts();
  refreshCartFAB(shop);
  refreshCartPanel(shop);
  renderMenu(shop, shop.menu);

  // Close offcanvas
  const el = document.getElementById('fk-cart-offcanvas');
  if (el) bootstrap.Offcanvas.getInstance(el)?.hide();

  showToast('✅ Order sent via WhatsApp!', 'success');
}

/* =========================================================
   TOAST NOTIFICATIONS
   ========================================================= */
function showToast(message, type = '') {
  let wrap = document.getElementById('fk-toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'fk-toast-wrap';
    wrap.className = 'fk-toast-wrap';
    wrap.setAttribute('role', 'status');
    wrap.setAttribute('aria-live', 'polite');
    document.body.appendChild(wrap);
  }

  const toast = document.createElement('div');
  toast.className = `fk-toast${type ? ' ' + type : ''}`;
  toast.textContent = message;
  wrap.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 2400);
}

/* =========================================================
   UTILITY
   ========================================================= */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function highlightMatch(html, query) {
  if (!query) return html;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return html.replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark style="background:rgba(255,122,0,0.22);color:inherit;border-radius:3px;padding:0 2px">$1</mark>'
  );
}

/* ── Inject global keyframe animation once ── */
function injectGlobalAnimation() {
  if (document.getElementById('fk-anim-style')) return;
  const s = document.createElement('style');
  s.id = 'fk-anim-style';
  s.textContent = `
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0);    }
    }`;
  document.head.appendChild(s);
}

/* =========================================================
   INIT ON DOM READY
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Register SW + init install prompt
  registerServiceWorker();
  initInstallPrompt();

  // Load persisted carts
  carts = loadCarts();
  injectGlobalAnimation();

  const isShopPage = !!document.getElementById('fk-menu-list');
  const isHomePage = !!document.getElementById('fk-shops-grid');

  if (isHomePage) renderShopCards();
  if (isShopPage) initShopPage();
});
