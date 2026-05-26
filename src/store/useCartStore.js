import { create } from 'zustand';
import { cmsService } from '../services/cms';
import { d2cService } from '../services/d2cService';

const getInitialCartItems = () => {
  try {
    return JSON.parse(localStorage.getItem('dc_cart_items')) || [];
  } catch (_) {
    return [];
  }
};

const getInitialCoupon = () => {
  try {
    return JSON.parse(localStorage.getItem('dc_cart_coupon')) || null;
  } catch (_) {
    return null;
  }
};

export const useCartStore = create((set, get) => ({
  items: getInitialCartItems(),
  appliedCoupon: getInitialCoupon(),
  deliveryFee: 50,
  taxRate: 0.18, // 18% GST
  cartId: localStorage.getItem('dc_cart_id') || null,
  isLoading: false,
  error: null,

  initializeCart: async (sessionId, customerId) => {
    set({ isLoading: true });
    try {
      const cart = await d2cService.getOrCreateCart(sessionId, customerId);
      if (cart && cart.id) {
        localStorage.setItem('dc_cart_id', cart.id);
        set({ cartId: cart.id });
        // Optionally map cart.items to local items if needed, or keep local-first.
        // Let's stick to local-first to ensure 100% UI stability, and sync on checkout
      }
    } catch (err) {
      console.error('Failed to initialize backend cart:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: (product, variant, quantity = 1) => {
    const { items, cartId } = get();
    const cartItemId = `${product.id}-${variant.id}`;
    const existingIndex = items.findIndex((item) => item.cartItemId === cartItemId);

    let updatedItems = [...items];
    if (existingIndex > -1) {
      updatedItems[existingIndex].quantity += quantity;
    } else {
      updatedItems.push({
        cartItemId,
        product,
        variant,
        quantity,
        price: variant.price,
      });
    }

    localStorage.setItem('dc_cart_items', JSON.stringify(updatedItems));
    set({ items: updatedItems });

    // Background sync to backend cart if cartId exists
    if (cartId) {
      d2cService.addToCart(cartId, {
        product_uuid: product.id,
        quantity,
        variant_id: variant.id
      }).catch(err => console.error('Cart sync error:', err));
    }
  },

  removeItem: (cartItemId) => {
    const { items, cartId } = get();
    const target = items.find(item => item.cartItemId === cartItemId);
    const updatedItems = items.filter((item) => item.cartItemId !== cartItemId);

    localStorage.setItem('dc_cart_items', JSON.stringify(updatedItems));
    set({ items: updatedItems });

    if (cartId && target) {
      d2cService.removeFromCart(cartId, target.product.id).catch(err => console.error('Cart sync error:', err));
    }
  },

  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId);
      return;
    }
    const { items, cartId } = get();
    const target = items.find(item => item.cartItemId === cartItemId);
    const updatedItems = items.map((item) =>
      item.cartItemId === cartItemId ? { ...item, quantity } : item
    );

    localStorage.setItem('dc_cart_items', JSON.stringify(updatedItems));
    set({ items: updatedItems });

    if (cartId && target) {
      d2cService.updateCartItem(cartId, target.product.id, { quantity }).catch(err => console.error('Cart sync error:', err));
    }
  },

  applyCoupon: async (code) => {
    try {
      const res = await cmsService.validateCoupon(code);
      if (!res.valid) {
        return { success: false, message: res.message || 'Invalid coupon code' };
      }

      const coupon = res.coupon;
      const { getSubtotal } = get();
      const subtotal = getSubtotal();

      if (subtotal < coupon.min_order) {
        return {
          success: false,
          message: `Minimum order amount for this coupon is ₹${coupon.min_order}`,
        };
      }

      localStorage.setItem('dc_cart_coupon', JSON.stringify(coupon));
      set({ appliedCoupon: coupon });
      return { success: true, message: 'Coupon applied successfully!' };
    } catch (err) {
      return { success: false, message: err.message || 'Error validating coupon' };
    }
  },

  removeCoupon: () => {
    localStorage.removeItem('dc_cart_coupon');
    set({ appliedCoupon: null });
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getDiscount: () => {
    const { appliedCoupon, getSubtotal } = get();
    if (!appliedCoupon) return 0;

    const subtotal = getSubtotal();
    let discount = 0;

    if (appliedCoupon.type === 'percentage') {
      discount = (subtotal * appliedCoupon.discount) / 100;
      if (appliedCoupon.max_discount) {
        discount = Math.min(discount, appliedCoupon.max_discount);
      }
    } else if (appliedCoupon.type === 'flat') {
      discount = appliedCoupon.discount;
    }

    return Math.min(discount, subtotal);
  },

  getTax: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscount();
    return Math.round((subtotal - discount) * get().taxRate);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscount();
    const tax = get().getTax();
    const delivery = subtotal > 0 ? get().deliveryFee : 0;
    return subtotal - discount + tax + delivery;
  },

  clearCart: () => {
    const { cartId } = get();
    localStorage.removeItem('dc_cart_items');
    localStorage.removeItem('dc_cart_coupon');
    set({ items: [], appliedCoupon: null });
    if (cartId) {
      d2cService.clearCart(cartId).catch(err => console.error('Cart sync error:', err));
    }
  },
}));
