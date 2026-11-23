/**
 * Yoora Jewels - E-Commerce Core Engine
 * Features:
 * - 30 Dynamic Curated Luxury Products (Rings, Necklaces, Earrings, Bracelets, Anklets)
 * - 3D Card Perspective Tilt Effect
 * - Category Filtering & Instant Live Search & Sorting
 * - Cart Management (Add, Quantity, Remove, Free Shipping Progress, Promo Codes)
 * - Wishlist / Favorites System
 * - Checkout Modal with COD & Simulated Online UPI/Card Payment Gateway
 * - Order Confirmation Success Screen with Unique Tracking ID
 * - Direct 1-Click WhatsApp Purchase Integration
 * - Quick View Modal
 * - LocalStorage Persistence
 */

(function () {
  'use strict';

  // State Management
  const state = {
    products: typeof PRODUCTS !== 'undefined' ? PRODUCTS : [],
    cart: JSON.parse(localStorage.getItem('yoora_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('yoora_wishlist') || '[]'),
    activeCategory: 'All',
    searchQuery: '',
    sortBy: 'featured',
    appliedPromo: null,
    discountAmount: 0
  };

  const PROMO_CODES = {
    'YOORA10': { discountPercent: 10, minOrder: 0, label: '10% Extra Off' },
    'WATERPROOF': { discountFlat: 100, minOrder: 500, label: '₹100 Off on orders above ₹500' }
  };

  const FREE_SHIPPING_THRESHOLD = 499;
  const STANDARD_SHIPPING_FEE = 49;
  const BUSINESS_WHATSAPP = '919310356197';

  // DOM Elements cache
  const elements = {
    productGrid: document.getElementById('product-grid'),
    productCount: document.getElementById('product-count'),
    categoryFilterBar: document.getElementById('category-filter-bar'),
    catalogSearch: document.getElementById('catalog-search'),
    sortSelect: document.getElementById('sort-select'),
    
    // Badges & Counters
    cartCountBadges: document.querySelectorAll('.cart-badge-count'),
    wishlistCountBadges: document.querySelectorAll('.wishlist-badge-count'),
    
    // Drawers & Modals
    cartDrawer: document.getElementById('cart-drawer'),
    cartDrawerBackdrop: document.getElementById('cart-backdrop'),
    cartItemsContainer: document.getElementById('cart-items-container'),
    cartSubtotal: document.getElementById('cart-subtotal'),
    cartDiscountRow: document.getElementById('cart-discount-row'),
    cartDiscount: document.getElementById('cart-discount'),
    cartShipping: document.getElementById('cart-shipping'),
    cartTotal: document.getElementById('cart-total'),
    shippingProgressFill: document.getElementById('shipping-progress-fill'),
    shippingProgressText: document.getElementById('shipping-progress-text'),
    promoInput: document.getElementById('promo-input'),
    promoMessage: document.getElementById('promo-message'),

    wishlistDrawer: document.getElementById('wishlist-drawer'),
    wishlistBackdrop: document.getElementById('wishlist-backdrop'),
    wishlistItemsContainer: document.getElementById('wishlist-items-container'),

    checkoutModal: document.getElementById('checkout-modal'),
    checkoutBackdrop: document.getElementById('checkout-backdrop'),
    checkoutForm: document.getElementById('checkout-form'),
    checkoutSummaryItems: document.getElementById('checkout-summary-items'),
    checkoutTotal: document.getElementById('checkout-total'),
    onlinePaymentSection: document.getElementById('online-payment-section'),

    orderSuccessModal: document.getElementById('order-success-modal'),
    orderSuccessBackdrop: document.getElementById('order-success-backdrop'),
    orderSummaryContent: document.getElementById('order-summary-content'),

    quickViewModal: document.getElementById('quick-view-modal'),
    quickViewBackdrop: document.getElementById('quick-view-backdrop'),
    quickViewContent: document.getElementById('quick-view-content'),

    toastContainer: document.getElementById('toast-container')
  };

  // --- INITIALIZATION ---
  function init() {
    renderProducts();
    updateCartUI();
    updateWishlistUI();
    bindEvents();
    setup3DTilt();
  }

  // --- SAVE STATE ---
  function saveCart() {
    localStorage.setItem('yoora_cart', JSON.stringify(state.cart));
    updateCartUI();
  }

  function saveWishlist() {
    localStorage.setItem('yoora_wishlist', JSON.stringify(state.wishlist));
    updateWishlistUI();
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, type = 'success') {
    if (!elements.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slide-up`;
    const icon = type === 'success' ? '✨' : type === 'wishlist' ? '❤️' : '🔔';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-msg">${message}</span>
    `;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // --- FILTER & SORT PRODUCTS ---
  function getFilteredProducts() {
    let list = [...state.products];

    // Filter by Category
    if (state.activeCategory !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === state.activeCategory.toLowerCase());
    }

    // Filter by Search Query
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.badge.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (state.sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
        break;
      case 'featured':
      default:
        list.sort((a, b) => a.id - b.id);
        break;
    }

    return list;
  }

  // --- RENDER PRODUCTS GRID ---
  function renderProducts() {
    if (!elements.productGrid) return;
    const filtered = getFilteredProducts();

    if (elements.productCount) {
      elements.productCount.textContent = `Showing ${filtered.length} of ${state.products.length} luxury everyday pieces`;
    }

    if (filtered.length === 0) {
      elements.productGrid.innerHTML = `
        <div class="empty-catalog text-center">
          <div class="empty-icon">💎</div>
          <h3>No jewellery pieces found</h3>
          <p>Try searching for a different keyword or view all collections.</p>
          <button type="button" class="btn btn-secondary btn-pill reset-filter-btn" style="margin-top:15px;">View All 30 Pieces</button>
        </div>
      `;
      const resetBtn = elements.productGrid.querySelector('.reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.activeCategory = 'All';
          state.searchQuery = '';
          if (elements.catalogSearch) elements.catalogSearch.value = '';
          updateCategoryTabs();
          renderProducts();
        });
      }
      return;
    }

    elements.productGrid.innerHTML = filtered.map(p => {
      const isFav = state.wishlist.some(item => item.id === p.id);
      const discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      const waText = encodeURIComponent(`Hi Yoora Jewels, I would like to order the *${p.name}* (Price: ₹${p.price}). Please share ordering details!`);

      return `
        <article class="card product-card" data-id="${p.id}" data-category="${p.category}">
          <div class="product-media">
            <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80'">
            <span class="status-pill status-${getBadgeClass(p.badge)}">${p.badge}</span>
            <button type="button" class="wishlist-btn ${isFav ? 'active' : ''}" data-id="${p.id}" aria-label="Add ${p.name} to favorites" title="Favorite">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="${isFav ? '#e11d48' : 'none'}" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button type="button" class="quick-view-btn" data-id="${p.id}">Quick View</button>
          </div>
          <div class="product-content">
            <div class="product-header-row">
              <span class="product-cat">${p.category}</span>
              <div class="product-rating">
                <span class="star-icon">★</span>
                <span class="rating-val">${p.rating.toFixed(1)}</span>
                <span class="reviews-count">(${p.reviewsCount})</span>
              </div>
            </div>
            <h3 class="product-name" title="${p.name}">${p.name}</h3>
            <p class="product-desc">${p.description}</p>
            <div class="price-row">
              <span class="product-price">₹${p.price}</span>
              <span class="original-price">₹${p.originalPrice}</span>
              <span class="discount-tag">${discountPercent}% OFF</span>
            </div>
            <div class="product-actions-grid">
              <button type="button" class="btn btn-primary btn-sm btn-pill add-to-cart-btn" data-id="${p.id}">
                <span class="btn-icon">🛍️</span> Add to Bag
              </button>
              <a href="https://wa.me/${BUSINESS_WHATSAPP}?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn-wa-direct btn-sm btn-pill" title="Direct WhatsApp Buy">
                <span class="btn-icon">💬</span> WhatsApp
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');

    setup3DTilt();
  }

  function getBadgeClass(badge) {
    if (badge.includes('Shower')) return 'shower';
    if (badge.includes('Sweat')) return 'sweat';
    if (badge.includes('Sleep')) return 'sleep';
    if (badge.includes('Bestseller')) return 'bestseller';
    if (badge.includes('18K')) return 'gold';
    return 'trending';
  }

  // --- 3D TILT EFFECT ON PRODUCT CARDS ---
  function setup3DTilt() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
      });
    });
  }

  // --- CART MANAGEMENT ---
  function addToCart(productId, quantity = 1) {
    const product = state.products.find(p => p.id === parseInt(productId, 10));
    if (!product) return;

    const existingIndex = state.cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += quantity;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        quantity: quantity
      });
    }

    saveCart();
    showToast(`Added "${product.name}" to your Bag!`, 'success');
  }

  function updateQuantity(productId, delta) {
    const index = state.cart.findIndex(item => item.id === parseInt(productId, 10));
    if (index === -1) return;

    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
      showToast('Item removed from bag', 'info');
    }
    saveCart();
  }

  function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== parseInt(productId, 10));
    saveCart();
    showToast('Item removed from bag', 'info');
  }

  function getCartSubtotal() {
    return state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  function calculateCartTotals() {
    const subtotal = getCartSubtotal();
    let discount = 0;

    if (state.appliedPromo) {
      if (state.appliedPromo.discountPercent) {
        discount = Math.round((subtotal * state.appliedPromo.discountPercent) / 100);
      } else if (state.appliedPromo.discountFlat) {
        discount = state.appliedPromo.discountFlat;
      }
    }

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
    const finalTotal = Math.max(0, subtotal - discount + shipping);

    return { subtotal, discount, shipping, finalTotal };
  }

  function updateCartUI() {
    const totalCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);

    // Update badges
    elements.cartCountBadges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    });

    if (!elements.cartItemsContainer) return;

    if (state.cart.length === 0) {
      elements.cartItemsContainer.innerHTML = `
        <div class="cart-empty-state text-center">
          <div class="empty-bag-icon">🛍️</div>
          <h4>Your Jewellery Bag is Empty</h4>
          <p>Indulge in everyday waterproof & anti-tarnish rings, chains and cuffs.</p>
          <button type="button" class="btn btn-primary btn-pill close-cart-btn" style="margin-top:16px;">Explore Collections</button>
        </div>
      `;
      const closeBtn = elements.cartItemsContainer.querySelector('.close-cart-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeCartDrawer);
      }
    } else {
      elements.cartItemsContainer.innerHTML = state.cart.map(item => `
        <div class="cart-item-card" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <span class="cart-item-cat">${item.category}</span>
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-pricing">
              <span class="cart-item-price">₹${item.price}</span>
              <span class="cart-item-original">₹${item.originalPrice}</span>
            </div>
            <div class="cart-qty-row">
              <div class="qty-selector">
                <button type="button" class="qty-btn minus-btn" data-id="${item.id}">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button type="button" class="qty-btn plus-btn" data-id="${item.id}">+</button>
              </div>
              <button type="button" class="cart-item-remove" data-id="${item.id}" title="Remove item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Totals & Progress
    const { subtotal, discount, shipping, finalTotal } = calculateCartTotals();

    if (elements.cartSubtotal) elements.cartSubtotal.textContent = `₹${subtotal}`;
    if (elements.cartShipping) {
      elements.cartShipping.textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
      elements.cartShipping.className = shipping === 0 ? 'text-green' : '';
    }

    if (elements.cartDiscountRow) {
      if (discount > 0) {
        elements.cartDiscountRow.style.display = 'flex';
        if (elements.cartDiscount) elements.cartDiscount.textContent = `-₹${discount}`;
      } else {
        elements.cartDiscountRow.style.display = 'none';
      }
    }

    if (elements.cartTotal) elements.cartTotal.textContent = `₹${finalTotal}`;

    // Free shipping bar
    if (elements.shippingProgressFill && elements.shippingProgressText) {
      const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
      if (remaining <= 0) {
        elements.shippingProgressFill.style.width = '100%';
        elements.shippingProgressText.innerHTML = '🎉 You unlocked <strong>FREE Express Shipping</strong>!';
      } else {
        const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        elements.shippingProgressFill.style.width = `${percent}%`;
        elements.shippingProgressText.innerHTML = `Add <strong>₹${remaining}</strong> more to unlock <strong>FREE Express Shipping</strong>`;
      }
    }
  }

  // --- WISHLIST MANAGEMENT ---
  function toggleWishlist(productId) {
    const product = state.products.find(p => p.id === parseInt(productId, 10));
    if (!product) return;

    const index = state.wishlist.findIndex(item => item.id === product.id);
    if (index > -1) {
      state.wishlist.splice(index, 1);
      showToast(`Removed "${product.name}" from Favorites`, 'info');
    } else {
      state.wishlist.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        badge: product.badge
      });
      showToast(`Added "${product.name}" to Favorites ❤️`, 'wishlist');
    }

    saveWishlist();
    renderProducts(); // refresh heart states
  }

  function removeFromWishlist(productId) {
    state.wishlist = state.wishlist.filter(item => item.id !== parseInt(productId, 10));
    saveWishlist();
    renderProducts();
    showToast('Item removed from Favorites', 'info');
  }

  function updateWishlistUI() {
    const totalCount = state.wishlist.length;
    elements.wishlistCountBadges.forEach(badge => {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    });

    if (!elements.wishlistItemsContainer) return;

    if (state.wishlist.length === 0) {
      elements.wishlistItemsContainer.innerHTML = `
        <div class="wishlist-empty-state text-center">
          <div class="empty-heart-icon">🤍</div>
          <h4>No Favorites Saved Yet</h4>
          <p>Tap the heart icon on any jewellery piece to build your dream everyday stack.</p>
          <button type="button" class="btn btn-primary btn-pill close-wishlist-btn" style="margin-top:16px;">Browse Pieces</button>
        </div>
      `;
      const closeBtn = elements.wishlistItemsContainer.querySelector('.close-wishlist-btn');
      if (closeBtn) closeBtn.addEventListener('click', closeWishlistDrawer);
    } else {
      elements.wishlistItemsContainer.innerHTML = state.wishlist.map(item => `
        <div class="wishlist-item-card" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="wishlist-item-img">
          <div class="wishlist-item-info">
            <span class="wishlist-item-cat">${item.category}</span>
            <h4 class="wishlist-item-title">${item.name}</h4>
            <div class="wishlist-item-pricing">
              <span class="wishlist-item-price">₹${item.price}</span>
              <span class="wishlist-item-original">₹${item.originalPrice}</span>
            </div>
            <div class="wishlist-item-actions">
              <button type="button" class="btn btn-primary btn-sm btn-pill move-to-cart-btn" data-id="${item.id}">
                Move to Bag
              </button>
              <button type="button" class="wishlist-remove-btn" data-id="${item.id}" title="Remove from favorites">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // --- DRAWER & MODAL CONTROLLERS ---
  function openCartDrawer() {
    if (elements.cartDrawer) elements.cartDrawer.classList.add('open');
    if (elements.cartDrawerBackdrop) elements.cartDrawerBackdrop.classList.add('active');
    document.body.classList.add('drawer-open');
  }

  function closeCartDrawer() {
    if (elements.cartDrawer) elements.cartDrawer.classList.remove('open');
    if (elements.cartDrawerBackdrop) elements.cartDrawerBackdrop.classList.remove('active');
    document.body.classList.remove('drawer-open');
  }

  function openWishlistDrawer() {
    if (elements.wishlistDrawer) elements.wishlistDrawer.classList.add('open');
    if (elements.wishlistBackdrop) elements.wishlistBackdrop.classList.add('active');
    document.body.classList.add('drawer-open');
  }

  function closeWishlistDrawer() {
    if (elements.wishlistDrawer) elements.wishlistDrawer.classList.remove('open');
    if (elements.wishlistBackdrop) elements.wishlistBackdrop.classList.remove('active');
    document.body.classList.remove('drawer-open');
  }

  // --- CHECKOUT MODAL FLOW ---
  function openCheckoutModal() {
    if (state.cart.length === 0) {
      showToast('Your bag is empty! Add products to proceed.', 'error');
      return;
    }
    closeCartDrawer();

    const { subtotal, discount, shipping, finalTotal } = calculateCartTotals();

    // Render Order Items Summary in Checkout
    if (elements.checkoutSummaryItems) {
      elements.checkoutSummaryItems.innerHTML = state.cart.map(item => `
        <div class="checkout-item-row">
          <img src="${item.image}" alt="${item.name}" class="checkout-item-thumb">
          <div class="checkout-item-meta">
            <div class="checkout-item-title">${item.name}</div>
            <div class="checkout-item-qty">Qty: ${item.quantity} × ₹${item.price}</div>
          </div>
          <div class="checkout-item-total">₹${item.price * item.quantity}</div>
        </div>
      `).join('');
    }

    if (elements.checkoutTotal) {
      elements.checkoutTotal.textContent = `₹${finalTotal}`;
    }

    if (elements.checkoutModal) elements.checkoutModal.classList.add('active');
    if (elements.checkoutBackdrop) elements.checkoutBackdrop.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeCheckoutModal() {
    if (elements.checkoutModal) elements.checkoutModal.classList.remove('active');
    if (elements.checkoutBackdrop) elements.checkoutBackdrop.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  // --- ORDER SUCCESS MODAL ---
  function showOrderSuccess(orderDetails) {
    closeCheckoutModal();

    if (elements.orderSummaryContent) {
      const itemsListHtml = orderDetails.items.map(i => `
        <li class="order-receipt-item">
          <span>${i.name} (x${i.quantity})</span>
          <span>₹${i.price * i.quantity}</span>
        </li>
      `).join('');

      const waOrderMsg = encodeURIComponent(
        `Hi Yoora Jewels! I just placed an order:\n\n` +
        `*Order ID:* ${orderDetails.orderId}\n` +
        `*Customer:* ${orderDetails.customerName}\n` +
        `*Phone:* ${orderDetails.phone}\n` +
        `*Address:* ${orderDetails.address}, ${orderDetails.city} - ${orderDetails.pincode}\n` +
        `*Payment Method:* ${orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Instant UPI (' + (orderDetails.upiId || 'Verified') + ')'}\n` +
        `*Total Amount:* ₹${orderDetails.totalAmount}\n\n` +
        `Items:\n` +
        orderDetails.items.map(i => `- ${i.name} x${i.quantity} (₹${i.price * i.quantity})`).join('\n') +
        `\n\nPlease confirm dispatch!`
      );

      elements.orderSummaryContent.innerHTML = `
        <div class="order-success-card text-center">
          <div class="success-icon-badge">✓</div>
          <h2 class="order-success-title">Order Placed Successfully!</h2>
          <p class="order-success-subtitle">Thank you, <strong>${orderDetails.customerName}</strong>! Your everyday waterproof jewellery is being prepared with love.</p>
          
          <div class="order-meta-box">
            <div class="order-meta-item">
              <span class="meta-label">Order Number</span>
              <span class="meta-value highlight-gold">${orderDetails.orderId}</span>
            </div>
            <div class="order-meta-item">
              <span class="meta-label">Payment Method</span>
              <span class="meta-value">${orderDetails.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '⚡ Instant UPI ' + (orderDetails.upiId ? '(' + orderDetails.upiId + ')' : '(Verified)')}</span>
            </div>
            <div class="order-meta-item">
              <span class="meta-label">Estimated Delivery</span>
              <span class="meta-value">3 - 5 Business Days</span>
            </div>
          </div>

          <div class="order-receipt-box">
            <h4>Order Summary</h4>
            <ul class="order-receipt-list">
              ${itemsListHtml}
            </ul>
            <div class="order-receipt-total">
              <span>Total Paid/Payable</span>
              <strong>₹${orderDetails.totalAmount}</strong>
            </div>
          </div>

          <div class="order-delivery-preview">
            <h4>Delivering To:</h4>
            <p>${orderDetails.address}, ${orderDetails.city}, ${orderDetails.state} - ${orderDetails.pincode}</p>
            <p>Contact: ${orderDetails.phone}</p>
          </div>

          <div class="order-success-actions">
            <a href="https://wa.me/${BUSINESS_WHATSAPP}?text=${waOrderMsg}" target="_blank" rel="noopener noreferrer" class="btn btn-wa-direct btn-pill">
              <span>💬</span> Track Order on WhatsApp
            </a>
            <button type="button" class="btn btn-secondary btn-pill continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      `;

      const continueBtn = elements.orderSummaryContent.querySelector('.continue-shopping-btn');
      if (continueBtn) {
        continueBtn.addEventListener('click', closeOrderSuccessModal);
      }
    }

    if (elements.orderSuccessModal) elements.orderSuccessModal.classList.add('active');
    if (elements.orderSuccessBackdrop) elements.orderSuccessBackdrop.classList.add('active');
    document.body.classList.add('modal-open');

    // Clear cart after successful order
    state.cart = [];
    state.appliedPromo = null;
    saveCart();
  }

  function closeOrderSuccessModal() {
    if (elements.orderSuccessModal) elements.orderSuccessModal.classList.remove('active');
    if (elements.orderSuccessBackdrop) elements.orderSuccessBackdrop.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  // --- QUICK VIEW MODAL ---
  function openQuickView(productId) {
    const product = state.products.find(p => p.id === parseInt(productId, 10));
    if (!product || !elements.quickViewContent) return;

    const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const waText = encodeURIComponent(`Hi Yoora Jewels, I want to order the *${product.name}* (₹${product.price}). Please assist!`);

    elements.quickViewContent.innerHTML = `
      <div class="quick-view-grid">
        <div class="quick-view-media">
          <img src="${product.image}" alt="${product.name}" class="quick-view-img">
          <span class="status-pill status-${getBadgeClass(product.badge)}">${product.badge}</span>
        </div>
        <div class="quick-view-details">
          <span class="quick-view-cat">${product.category}</span>
          <h2 class="quick-view-title">${product.name}</h2>
          <div class="quick-view-rating">
            <span class="star-icon">★★★★★</span>
            <span>${product.rating.toFixed(1)} (${product.reviewsCount} customer reviews)</span>
          </div>
          <div class="quick-view-pricing">
            <span class="product-price">₹${product.price}</span>
            <span class="original-price">₹${product.originalPrice}</span>
            <span class="discount-tag">${discountPercent}% OFF</span>
          </div>
          <p class="quick-view-desc">${product.description}</p>
          
          <div class="quick-view-badges">
            <div class="spec-pill">🚿 100% Shower-Safe</div>
            <div class="spec-pill">🏃‍♀️ Sweat & Humidity Proof</div>
            <div class="spec-pill">🌙 Sleep-Friendly Nickel-Free</div>
            <div class="spec-pill">✨ 18K Anti-Tarnish PVD</div>
          </div>

          <div class="quick-view-actions">
            <button type="button" class="btn btn-primary btn-pill qv-add-to-cart" data-id="${product.id}">
              🛍️ Add to Bag
            </button>
            <a href="https://wa.me/${BUSINESS_WHATSAPP}?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn-wa-direct btn-pill">
              💬 Buy on WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;

    const qvAddBtn = elements.quickViewContent.querySelector('.qv-add-to-cart');
    if (qvAddBtn) {
      qvAddBtn.addEventListener('click', () => {
        addToCart(product.id);
        closeQuickView();
        openCartDrawer();
      });
    }

    if (elements.quickViewModal) elements.quickViewModal.classList.add('active');
    if (elements.quickViewBackdrop) elements.quickViewBackdrop.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeQuickView() {
    if (elements.quickViewModal) elements.quickViewModal.classList.remove('active');
    if (elements.quickViewBackdrop) elements.quickViewBackdrop.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  // --- CATEGORY TABS HELPER ---
  function updateCategoryTabs() {
    if (!elements.categoryFilterBar) return;
    const buttons = elements.categoryFilterBar.querySelectorAll('.filter-tab');
    buttons.forEach(btn => {
      if (btn.getAttribute('data-category') === state.activeCategory) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // --- EVENT BINDINGS ---
  function bindEvents() {
    // Category tabs
    if (elements.categoryFilterBar) {
      elements.categoryFilterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-tab');
        if (!btn) return;
        state.activeCategory = btn.getAttribute('data-category') || 'All';
        updateCategoryTabs();
        renderProducts();
      });
    }

    // Search bar live
    if (elements.catalogSearch) {
      elements.catalogSearch.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderProducts();
      });
    }

    // Sort select
    if (elements.sortSelect) {
      elements.sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        renderProducts();
      });
    }

    // Product Grid clicks (Delegation)
    if (elements.productGrid) {
      elements.productGrid.addEventListener('click', (e) => {
        // Add to cart
        const addBtn = e.target.closest('.add-to-cart-btn');
        if (addBtn) {
          const id = addBtn.getAttribute('data-id');
          addToCart(id);
          return;
        }

        // Wishlist
        const wishBtn = e.target.closest('.wishlist-btn');
        if (wishBtn) {
          const id = wishBtn.getAttribute('data-id');
          toggleWishlist(id);
          return;
        }

        // Quick View
        const qvBtn = e.target.closest('.quick-view-btn');
        if (qvBtn) {
          const id = qvBtn.getAttribute('data-id');
          openQuickView(id);
          return;
        }
      });
    }

    // Cart Drawer triggers
    document.querySelectorAll('.open-cart-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCartDrawer();
      });
    });

    document.querySelectorAll('.close-cart-trigger').forEach(btn => {
      btn.addEventListener('click', closeCartDrawer);
    });

    if (elements.cartDrawerBackdrop) {
      elements.cartDrawerBackdrop.addEventListener('click', closeCartDrawer);
    }

    // Cart Quantity & Item Delegation
    if (elements.cartItemsContainer) {
      elements.cartItemsContainer.addEventListener('click', (e) => {
        const plus = e.target.closest('.plus-btn');
        if (plus) {
          updateQuantity(plus.getAttribute('data-id'), 1);
          return;
        }

        const minus = e.target.closest('.minus-btn');
        if (minus) {
          updateQuantity(minus.getAttribute('data-id'), -1);
          return;
        }

        const remove = e.target.closest('.cart-item-remove');
        if (remove) {
          removeFromCart(remove.getAttribute('data-id'));
          return;
        }
      });
    }

    // Promo code apply
    const applyPromoBtn = document.getElementById('apply-promo-btn');
    if (applyPromoBtn && elements.promoInput) {
      applyPromoBtn.addEventListener('click', () => {
        const code = elements.promoInput.value.trim().toUpperCase();
        if (!code) return;

        if (PROMO_CODES[code]) {
          state.appliedPromo = PROMO_CODES[code];
          if (elements.promoMessage) {
            elements.promoMessage.innerHTML = `<span class="text-green">✓ Promo code "${code}" applied: ${PROMO_CODES[code].label}!</span>`;
          }
          showToast(`Coupon "${code}" applied successfully!`, 'success');
        } else {
          state.appliedPromo = null;
          if (elements.promoMessage) {
            elements.promoMessage.innerHTML = `<span class="text-red">Invalid promo code. Try "YOORA10" for 10% off!</span>`;
          }
          showToast('Invalid promo code. Try YOORA10', 'error');
        }
        updateCartUI();
      });
    }

    // Checkout Trigger from Cart
    const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');
    if (proceedCheckoutBtn) {
      proceedCheckoutBtn.addEventListener('click', openCheckoutModal);
    }

    // Buy Cart on WhatsApp Button
    const waCartBtn = document.getElementById('wa-cart-order-btn');
    if (waCartBtn) {
      waCartBtn.addEventListener('click', () => {
        if (state.cart.length === 0) {
          showToast('Your bag is empty!', 'error');
          return;
        }
        const { subtotal, discount, shipping, finalTotal } = calculateCartTotals();
        const text = encodeURIComponent(
          `Hi Yoora Jewels! I want to place an order from your website:\n\n` +
          `Items in Bag:\n` +
          state.cart.map(i => `- ${i.name} (x${i.quantity}) - ₹${i.price * i.quantity}`).join('\n') +
          `\n\nSubtotal: ₹${subtotal}\n` +
          (discount > 0 ? `Discount: -₹${discount}\n` : '') +
          `Shipping: ${shipping === 0 ? 'FREE' : '₹' + shipping}\n` +
          `*Grand Total: ₹${finalTotal}*\n\n` +
          `Please confirm my order and share payment details!`
        );
        window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${text}`, '_blank');
      });
    }

    // Wishlist Drawer triggers
    document.querySelectorAll('.open-wishlist-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openWishlistDrawer();
      });
    });

    document.querySelectorAll('.close-wishlist-trigger').forEach(btn => {
      btn.addEventListener('click', closeWishlistDrawer);
    });

    if (elements.wishlistBackdrop) {
      elements.wishlistBackdrop.addEventListener('click', closeWishlistDrawer);
    }

    // Wishlist items delegation
    if (elements.wishlistItemsContainer) {
      elements.wishlistItemsContainer.addEventListener('click', (e) => {
        const moveBtn = e.target.closest('.move-to-cart-btn');
        if (moveBtn) {
          const id = moveBtn.getAttribute('data-id');
          addToCart(id);
          removeFromWishlist(id);
          openCartDrawer();
          return;
        }

        const removeBtn = e.target.closest('.wishlist-remove-btn');
        if (removeBtn) {
          const id = removeBtn.getAttribute('data-id');
          removeFromWishlist(id);
          return;
        }
      });
    }

    // Checkout Modal close triggers
    document.querySelectorAll('.close-checkout-trigger').forEach(btn => {
      btn.addEventListener('click', closeCheckoutModal);
    });

    if (elements.checkoutBackdrop) {
      elements.checkoutBackdrop.addEventListener('click', closeCheckoutModal);
    }

    // Payment method radio selection
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (elements.onlinePaymentSection) {
          elements.onlinePaymentSection.style.display = radio.value === 'online' ? 'block' : 'none';
        }
      });
    });

    // Checkout Form Submit
    if (elements.checkoutForm) {
      elements.checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(elements.checkoutForm);
        const name = formData.get('fullName')?.toString().trim();
        const phone = formData.get('phone')?.toString().trim();
        const address = formData.get('address')?.toString().trim();
        const city = formData.get('city')?.toString().trim();
        const stateName = formData.get('state')?.toString().trim();
        const pincode = formData.get('pincode')?.toString().trim();
        const paymentMethod = formData.get('paymentMethod')?.toString() || 'cod';
        const upiId = formData.get('upiId')?.toString().trim();

        if (!name || !phone || !address || !city || !pincode) {
          showToast('Please fill all mandatory delivery details', 'error');
          return;
        }

        if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
          showToast('Please enter a valid 10-digit mobile number', 'error');
          return;
        }

        const { finalTotal } = calculateCartTotals();
        const orderId = `YJ-${Math.floor(100000 + Math.random() * 900000)}`;

        const orderDetails = {
          orderId,
          customerName: name,
          phone,
          address,
          city,
          state: stateName || 'India',
          pincode,
          paymentMethod,
          upiId: upiId || null,
          totalAmount: finalTotal,
          items: [...state.cart],
          placedAt: new Date().toISOString()
        };

        // If online payment, simulate brief gateway processing modal
        if (paymentMethod === 'online') {
          const submitBtn = elements.checkoutForm.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>⏳ Processing Secure Payment...</span>';
          }
          setTimeout(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = '<span>Place Order</span>';
            }
            showOrderSuccess(orderDetails);
          }, 1400);
        } else {
          showOrderSuccess(orderDetails);
        }
      });
    }

    // Direct WhatsApp Buy from Checkout Form
    const checkoutWaBtn = document.getElementById('checkout-via-wa-btn');
    if (checkoutWaBtn && elements.checkoutForm) {
      checkoutWaBtn.addEventListener('click', () => {
        const formData = new FormData(elements.checkoutForm);
        const name = formData.get('fullName')?.toString().trim() || 'Valued Customer';
        const phone = formData.get('phone')?.toString().trim() || 'Provided on Chat';
        const address = formData.get('address')?.toString().trim() || 'Provided on Chat';
        const city = formData.get('city')?.toString().trim() || '';
        const pincode = formData.get('pincode')?.toString().trim() || '';
        const { finalTotal } = calculateCartTotals();

        const text = encodeURIComponent(
          `Hi Yoora Jewels! I want to confirm my order:\n\n` +
          `Customer: ${name}\n` +
          `Phone: ${phone}\n` +
          `Address: ${address}, ${city} ${pincode}\n\n` +
          `Items Ordered:\n` +
          state.cart.map(i => `- ${i.name} (x${i.quantity}) - ₹${i.price * i.quantity}`).join('\n') +
          `\n\n*Total Amount:* ₹${finalTotal}\n\n` +
          `Please confirm my delivery dispatch!`
        );

        window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${text}`, '_blank');
      });
    }

    // Quick View Modal close triggers
    document.querySelectorAll('.close-quickview-trigger').forEach(btn => {
      btn.addEventListener('click', closeQuickView);
    });

    if (elements.quickViewBackdrop) {
      elements.quickViewBackdrop.addEventListener('click', closeQuickView);
    }

    // Order Success close triggers
    document.querySelectorAll('.close-success-trigger').forEach(btn => {
      btn.addEventListener('click', closeOrderSuccessModal);
    });

    if (elements.orderSuccessBackdrop) {
      elements.orderSuccessBackdrop.addEventListener('click', closeOrderSuccessModal);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
