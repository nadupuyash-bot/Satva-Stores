import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  User,
  Coupon,
  ShippingAddress,
  PaymentMethod,
  OrderStatus,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_USER,
  INITIAL_ORDERS,
} from '../data/sampleData';
import { generateOrderNumber, getFutureDeliveryDate } from '../utils/formatters';
import { useNotification } from './NotificationContext';

interface StoreContextType {
  // Catalog
  products: Product[];
  categories: Category[];
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
  resetCatalog: () => void;
  addReview: (productId: string, rating: number, comment: string, userName: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartShippingFee: number;
  cartDiscount: number;
  cartTotal: number;
  cartItemCount: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (productId: string) => void;
  clearWishlist: () => void;

  // Orders
  orders: Order[];
  placeOrder: (shippingAddress: ShippingAddress, paymentMethod: PaymentMethod) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Auth & User
  user: User | null;
  login: (email: string, role?: 'customer' | 'admin', name?: string) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  addSavedAddress: (address: ShippingAddress) => void;

  // UI state
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 1999;
const STANDARD_SHIPPING_FEE = 99;

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useNotification();

  // 1. Products state (persisted)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('yashu_products');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('yashu_products', JSON.stringify(products));
  }, [products]);

  // Categories
  const categories = INITIAL_CATEGORIES;

  // 2. Cart state (persisted)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('yashu_cart');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedSize: 'M',
        selectedColor: 'Onyx Black',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('yashu_cart', JSON.stringify(cart));
  }, [cart]);

  // 3. Wishlist state (persisted)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('yashu_wishlist');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return ['prod-shoe-01', 'prod-wat-01'];
  });

  useEffect(() => {
    localStorage.setItem('yashu_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // 4. Orders state (persisted)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem('yashu_orders');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('yashu_orders', JSON.stringify(orders));
  }, [orders]);

  // 5. User state (persisted)
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('yashu_user');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('yashu_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('yashu_user');
    }
  }, [user]);

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Helper getters
  const getProductById = useCallback((id: string) => {
    return products.find((p) => p.id === id);
  }, [products]);

  const getOrderById = useCallback((orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  }, [orders]);

  // Cart operations
  const addToCart = useCallback(
    (product: Product, quantity = 1, selectedSize?: string, selectedColor?: string) => {
      setCart((prev) => {
        const defaultSize = selectedSize || (product.sizes ? product.sizes[0] : undefined);
        const defaultColor = selectedColor || (product.colors ? product.colors[0].name : undefined);

        const existingIndex = prev.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.selectedSize === defaultSize &&
            item.selectedColor === defaultColor
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = updated[existingIndex].quantity + quantity;
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: Math.min(newQty, product.stock),
          };
          return updated;
        }

        return [
          ...prev,
          {
            product,
            quantity: Math.min(quantity, product.stock),
            selectedSize: defaultSize,
            selectedColor: defaultColor,
          },
        ];
      });

      showToast(`Added "${product.name}" to your bag`, 'success', 'Cart Updated');
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (productId: string, selectedSize?: string, selectedColor?: string) => {
      setCart((prev) =>
        prev.filter(
          (item) =>
            !(
              item.product.id === productId &&
              item.selectedSize === selectedSize &&
              item.selectedColor === selectedColor
            )
        )
      );
      showToast('Item removed from cart', 'info');
    },
    [showToast]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
      if (quantity <= 0) {
        removeFromCart(productId, selectedSize, selectedColor);
        return;
      }
      setCart((prev) =>
        prev.map((item) => {
          if (
            item.product.id === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          ) {
            return {
              ...item,
              quantity: Math.min(quantity, item.product.stock),
            };
          }
          return item;
        })
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Cart math
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartShippingFee = useMemo(() => {
    if (cart.length === 0) return 0;
    return cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  }, [cartSubtotal, cart.length]);

  const cartDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (cartSubtotal < appliedCoupon.minOrderValue) return 0;

    if (appliedCoupon.discountPercent) {
      return Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    }
    if (appliedCoupon.flatDiscount) {
      return Math.min(appliedCoupon.flatDiscount, cartSubtotal);
    }
    return 0;
  }, [appliedCoupon, cartSubtotal]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal + cartShippingFee - cartDiscount);
  }, [cartSubtotal, cartShippingFee, cartDiscount]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Coupons
  const applyCoupon = useCallback(
    (code: string) => {
      const cleanCode = code.trim().toUpperCase();
      const found = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === cleanCode);

      if (!found) {
        return { success: false, message: 'Invalid coupon code. Try YASHU20 or FIRST10' };
      }

      if (cartSubtotal < found.minOrderValue) {
        return {
          success: false,
          message: `Minimum order of ₹${found.minOrderValue} required for coupon ${cleanCode}`,
        };
      }

      setAppliedCoupon(found);
      showToast(`Coupon "${cleanCode}" applied successfully!`, 'success', 'Discount Added');
      return { success: true, message: `Coupon applied: ${found.description}` };
    },
    [cartSubtotal, showToast]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  }, [showToast]);

  // Wishlist
  const toggleWishlist = useCallback(
    (productId: string) => {
      const prod = products.find((p) => p.id === productId);
      const name = prod?.name || 'Item';

      setWishlist((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast(`Removed "${name}" from your wishlist`, 'info');
          return prev.filter((id) => id !== productId);
        } else {
          showToast(`Saved "${name}" to your wishlist`, 'success', 'Saved');
          return [...prev, productId];
        }
      });
    },
    [products, showToast]
  );

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.includes(productId);
    },
    [wishlist]
  );

  const moveToCart = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        addToCart(product, 1);
        setWishlist((prev) => prev.filter((id) => id !== productId));
      }
    },
    [products, addToCart]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    showToast('Wishlist cleared', 'info');
  }, [showToast]);

  // Order placement
  const placeOrder = useCallback(
    (shippingAddress: ShippingAddress, paymentMethod: PaymentMethod): Order => {
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: generateOrderNumber(),
        createdAt: new Date().toISOString(),
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0],
          price: item.product.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
        })),
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'Pending COD' : 'Paid',
        status: 'Processing',
        subtotal: cartSubtotal,
        shippingFee: cartShippingFee,
        discount: cartDiscount,
        couponCode: appliedCoupon?.code,
        total: cartTotal,
        estimatedDeliveryDate: getFutureDeliveryDate(3),
        trackingNumber: `YSH-${Math.floor(10000000 + Math.random() * 90000000)}`,
      };

      // Reduce product inventory
      setProducts((prev) =>
        prev.map((prod) => {
          const cartItem = cart.find((c) => c.product.id === prod.id);
          if (cartItem) {
            return {
              ...prod,
              stock: Math.max(0, prod.stock - cartItem.quantity),
            };
          }
          return prod;
        })
      );

      // Add to orders list
      setOrders((prev) => [newOrder, ...prev]);

      // Clear cart & coupon
      setCart([]);
      setAppliedCoupon(null);

      showToast(`Order #${newOrder.orderNumber} placed successfully!`, 'success', 'Order Confirmed');
      return newOrder;
    },
    [cart, cartSubtotal, cartShippingFee, cartDiscount, cartTotal, appliedCoupon, showToast]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
      );
      showToast(`Order status updated to ${status}`, 'info', 'Status Updated');
    },
    [showToast]
  );

  // Catalog administration
  const addProduct = useCallback(
    (newProdData: Omit<Product, 'id' | 'createdAt'>) => {
      const newProduct: Product = {
        ...newProdData,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`Added product "${newProduct.name}" to catalog`, 'success', 'Product Created');
    },
    [showToast]
  );

  const updateProduct = useCallback(
    (updatedProduct: Product) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      showToast(`Updated product "${updatedProduct.name}"`, 'success', 'Product Updated');
    },
    [showToast]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      const prod = products.find((p) => p.id === id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast(`Deleted "${prod?.name || 'Product'}"`, 'info', 'Product Removed');
    },
    [products, showToast]
  );

  const updateStock = useCallback(
    (id: string, newStock: number) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p))
      );
      showToast('Inventory level adjusted', 'info');
    },
    [showToast]
  );

  const resetCatalog = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem('yashu_products');
    showToast('Catalog restored to default inventory', 'info', 'Catalog Reset');
  }, [showToast]);

  const addReview = useCallback(
    (productId: string, rating: number, comment: string, userName: string) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productId) {
            const currentReviews = p.reviews || [];
            const newRev = {
              id: `rev-${Date.now()}`,
              userName,
              rating,
              comment,
              date: new Date().toISOString().split('T')[0],
              verifiedPurchase: true,
            };
            const updatedReviews = [newRev, ...currentReviews];
            const avgRating = Number(
              (
                updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
                updatedReviews.length
              ).toFixed(1)
            );
            return {
              ...p,
              rating: avgRating,
              reviewCount: updatedReviews.length,
              reviews: updatedReviews,
            };
          }
          return p;
        })
      );
      showToast('Thank you! Your verified review has been published.', 'success', 'Review Added');
    },
    [showToast]
  );

  // Auth & Profile
  const login = useCallback(
    (email: string, role: 'customer' | 'admin' = 'customer', name = 'Yashu Shopper') => {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        addresses: [
          {
            fullName: name,
            email,
            phone: '+91 98765 43210',
            addressLine1: 'Penthouse 1402, Skyline Heights, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pinCode: '400050',
          },
        ],
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      showToast(`Welcome back, ${name}! (${role === 'admin' ? 'Admin Access' : 'Shopper'})`, 'success', 'Signed In');
    },
    [showToast]
  );

  const logout = useCallback(() => {
    setUser(null);
    showToast('You have been signed out.', 'info');
  }, [showToast]);

  const updateUserProfile = useCallback(
    (data: Partial<User>) => {
      setUser((prev) => {
        if (!prev) return null;
        return { ...prev, ...data };
      });
      showToast('Profile information updated', 'success', 'Profile Saved');
    },
    [showToast]
  );

  const addSavedAddress = useCallback(
    (address: ShippingAddress) => {
      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          addresses: [...prev.addresses, address],
        };
      });
      showToast('Shipping address saved to your profile', 'success');
    },
    [showToast]
  );

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        resetCatalog,
        addReview,

        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartShippingFee,
        cartDiscount,
        cartTotal,
        cartItemCount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,

        wishlist,
        toggleWishlist,
        isInWishlist,
        moveToCart,
        clearWishlist,

        orders,
        placeOrder,
        updateOrderStatus,
        getOrderById,

        user,
        login,
        logout,
        updateUserProfile,
        addSavedAddress,

        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
