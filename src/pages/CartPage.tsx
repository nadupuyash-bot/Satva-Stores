import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/formatters';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartShippingFee,
    cartDiscount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);
  const navigate = useNavigate();

  const freeShippingThreshold = 1999;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (res.success) {
      setCouponMsg({ text: res.message, error: false });
      setCouponCode('');
    } else {
      setCouponMsg({ text: res.message, error: true });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-900 font-display mb-2">
          Your Shopping Bag Is Empty
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mb-8">
          Explore our signature collections across clothing, watches, leather bags, and acoustics.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-8 py-4 rounded-full uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
        >
          <span>Discover The Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="border-b border-neutral-200 pb-6 mb-8">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
          Review Selection
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-display">
          Your Shopping Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
        </h1>
      </div>

      {/* Free Shipping Alert banner */}
      <div className="bg-neutral-900 text-white p-4 sm:p-5 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Truck className="w-4 h-4 text-amber-400" />
            {remainingForFreeShipping > 0 ? (
              <span>
                Add <strong className="text-amber-300">{formatPrice(remainingForFreeShipping)}</strong> more to unlock <span className="underline decoration-emerald-400">FREE Express Delivery</span>
              </span>
            ) : (
              <span className="text-emerald-400">🎉 Congratulations! You have unlocked FREE Express Delivery</span>
            )}
          </div>
          <p className="text-[11px] text-neutral-400">
            Orders above ₹1,999 qualify for priority air-courier delivery with zero shipping fee.
          </p>
        </div>

        <div className="w-full sm:w-48 bg-neutral-800 h-2 rounded-full overflow-hidden self-center">
          <div
            className={`h-full transition-all duration-500 ${
              progressPercent >= 100 ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Cart Items Table (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs divide-y divide-neutral-100 overflow-hidden">
            {cart.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                className="p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                {/* Product info & image */}
                <div className="flex gap-4 items-center">
                  <Link to={`/product/${item.product.id}`}>
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl bg-neutral-100 shrink-0 border border-neutral-100"
                    />
                  </Link>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {item.product.category}
                    </span>
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="text-sm sm:text-base font-bold text-neutral-900 hover:text-amber-800 transition-colors mt-1">
                        {item.product.name}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-neutral-500">
                      {item.selectedSize && (
                        <span className="bg-neutral-100 px-2 py-0.5 rounded">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="bg-neutral-100 px-2 py-0.5 rounded">
                          Color: {item.selectedColor}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-neutral-900 mt-2 sm:hidden">
                      {formatPrice(item.product.price)} each
                    </div>
                  </div>
                </div>

                {/* Controls & price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-neutral-100">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 p-1">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity - 1,
                          item.selectedSize,
                          item.selectedColor
                        )
                      }
                      className="p-1.5 text-neutral-600 hover:text-neutral-900"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-neutral-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity + 1,
                          item.selectedSize,
                          item.selectedColor
                        )
                      }
                      className="p-1.5 text-neutral-600 hover:text-neutral-900"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[90px]">
                    <div className="text-base font-bold text-neutral-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-[10px] text-neutral-400">
                        {formatPrice(item.product.price)} / unit
                      </div>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() =>
                      removeFromCart(item.product.id, item.selectedSize, item.selectedColor)
                    }
                    className="p-2 text-neutral-400 hover:text-rose-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="text-xs font-bold text-neutral-900 hover:text-amber-800 uppercase tracking-wider"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3 font-display">
              Order Summary
            </h2>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-semibold text-neutral-900">{formatPrice(cartSubtotal)}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(cartDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Estimated Shipping</span>
                <span>
                  {cartShippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[10px]">
                      FREE
                    </span>
                  ) : (
                    formatPrice(cartShippingFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Estimated Taxes (GST 18%)</span>
                <span className="text-neutral-500 italic">Included in prices</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-3 border-t border-neutral-200">
                <span>Total Amount</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Coupon Code section */}
            <div className="pt-2 border-t border-neutral-100">
              <span className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                Apply Privilege Coupon
              </span>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Tag className="w-4 h-4" />
                    <span>{appliedCoupon.code} (-{formatPrice(cartDiscount)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-emerald-900 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponMsg(null);
                      }}
                      placeholder="e.g. YASHU20"
                      className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-neutral-900 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors uppercase tracking-wider"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p
                      className={`text-xs ${
                        couponMsg.error ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {couponMsg.text}
                    </p>
                  )}
                </form>
              )}

              {/* Sample Coupons hints */}
              {!appliedCoupon && (
                <div className="mt-3 text-[11px] text-neutral-500 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                  <span className="font-semibold text-neutral-700 block mb-1">Available Coupons:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCouponCode('YASHU20')}
                      className="font-mono bg-white border border-neutral-200 px-2 py-0.5 rounded text-neutral-800 hover:border-neutral-900"
                    >
                      YASHU20
                    </button>
                    <button
                      type="button"
                      onClick={() => setCouponCode('FIRST10')}
                      className="font-mono bg-white border border-neutral-200 px-2 py-0.5 rounded text-neutral-800 hover:border-neutral-900"
                    >
                      FIRST10
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Checkout Action */}
            <div className="pt-2">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
