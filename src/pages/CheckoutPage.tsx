import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Building,
  Check,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/formatters';
import { PaymentMethod, ShippingAddress } from '../types';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, cartShippingFee, cartDiscount, cartTotal, placeOrder, user } = useStore();
  const navigate = useNavigate();

  // Shipping Form State
  const defaultAddress = user?.addresses[0];
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: defaultAddress?.fullName || user?.name || '',
    email: defaultAddress?.email || user?.email || '',
    phone: defaultAddress?.phone || '+91 98765 43210',
    addressLine1: defaultAddress?.addressLine1 || '802 Palladium Residency, High Street Phoenix',
    addressLine2: defaultAddress?.addressLine2 || 'Senapati Bapat Marg',
    city: defaultAddress?.city || 'Mumbai',
    state: defaultAddress?.state || 'Maharashtra',
    pinCode: defaultAddress?.pinCode || '400013',
    notes: 'Please call before delivery.',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('yashu@okaxis');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '•••• •••• •••• 4242',
    nameOnCard: formData.fullName || 'Yashu Verma',
    expiry: '08/29',
    cvv: '•••',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">No items to checkout</h2>
        <p className="text-sm text-neutral-500 mb-6">Your shopping bag is currently empty.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-neutral-900 text-white text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider"
        >
          <span>Return to Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@'))
      errs.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 10)
      errs.phone = 'Valid 10-digit phone number is required';
    if (!formData.addressLine1.trim()) errs.addressLine1 = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.pinCode.trim() || formData.pinCode.length !== 6)
      errs.pinCode = 'Valid 6-digit PIN code is required';

    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      errs.upiId = 'Valid UPI ID (e.g. name@okhdfcbank) is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate payment gateway delay (1.5 seconds)
    setTimeout(() => {
      const order = placeOrder(formData, paymentMethod);
      setIsProcessing(false);

      // Confetti burst
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#09090b', '#d97706', '#10b981', '#f59e0b'],
        });
      } catch {
        // fallback
      }

      navigate(`/order-success/${order.id}`);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="border-b border-neutral-200 pb-6 mb-8">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
          Secure Checkout
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-display">
          Delivery & Payment
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Delivery Address & Payment (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Contact & Shipping Address */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center font-mono">
                    1
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-display">
                    Shipping Address
                  </h2>
                </div>
                <span className="text-xs text-neutral-400 font-medium">Step 1 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all"
                  />
                  {errors.fullName && <p className="text-[11px] text-rose-600 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all"
                  />
                  {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Email Address (for invoice & tracking updates) *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all"
                  />
                  {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Street Address / Flat / Building *
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all"
                  />
                  {errors.addressLine1 && <p className="text-[11px] text-rose-600 mt-1">{errors.addressLine1}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all"
                  />
                  {errors.city && <p className="text-[11px] text-rose-600 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all"
                  />
                  {errors.state && <p className="text-[11px] text-rose-600 mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all font-mono"
                  />
                  {errors.pinCode && <p className="text-[11px] text-rose-600 mt-1">{errors.pinCode}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Leave with security desk"
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-3 outline-none focus:border-neutral-900 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center font-mono">
                    2
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-display">
                    Payment Selection
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <Lock className="w-3 h-3" />
                  <span>256-Bit Encrypted</span>
                </div>
              </div>

              {/* Payment Method Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'upi'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'card'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'cod'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Cash on Del.</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    paymentMethod === 'netbanking'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  <Building className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">NetBanking</span>
                </button>
              </div>

              {/* Payment Details Sub-form */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-3">
                {paymentMethod === 'upi' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900">Instant UPI Payment</span>
                      <span className="text-[11px] text-neutral-500 font-mono">Google Pay / PhonePe / Paytm</span>
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-1">Enter your UPI ID / VPA</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okaxis"
                        className="w-full bg-white border border-neutral-200 rounded-lg p-2.5 outline-none font-mono text-xs focus:border-neutral-900"
                      />
                      {errors.upiId && <p className="text-[11px] text-rose-600 mt-1">{errors.upiId}</p>}
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-neutral-200 flex items-center gap-3">
                      <div className="w-12 h-12 bg-neutral-900 text-white rounded flex items-center justify-center shrink-0">
                        <QrCode className="w-7 h-7 text-amber-300" />
                      </div>
                      <div className="text-[11px] text-neutral-600">
                        <span>A simulated payment authorization request will be approved upon checkout.</span>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900">Credit / Debit Card (Simulated Test Mode)</span>
                      <span className="text-[10px] bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded font-mono">
                        Demo Mode
                      </span>
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        readOnly
                        value={cardDetails.cardNumber}
                        className="w-full bg-white border border-neutral-200 rounded-lg p-2.5 outline-none font-mono text-xs text-neutral-700"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-neutral-600 mb-1">Expiry</label>
                        <input
                          type="text"
                          readOnly
                          value={cardDetails.expiry}
                          className="w-full bg-white border border-neutral-200 rounded-lg p-2.5 font-mono text-xs text-neutral-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-600 mb-1">CVV</label>
                        <input
                          type="text"
                          readOnly
                          value={cardDetails.cvv}
                          className="w-full bg-white border border-neutral-200 rounded-lg p-2.5 font-mono text-xs text-neutral-700"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      Safe simulated sandbox. No real card details are stored or transmitted.
                    </p>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="space-y-2">
                    <span className="font-bold text-neutral-900 block">Cash on Delivery</span>
                    <p className="text-neutral-600 text-xs leading-relaxed">
                      Pay safely via Cash or UPI QR to the delivery personnel at the time of doorstep handover.
                      Inspected tamper-proof sealed box guaranteed.
                    </p>
                    <div className="flex items-center gap-2 text-emerald-700 font-semibold text-[11px] pt-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Zero additional COD convenience fee</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-2">
                    <span className="font-bold text-neutral-900 block">Net Banking</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((b) => (
                        <div key={b} className="p-2 bg-white rounded border border-neutral-200 font-medium">
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Review & Final Total (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs space-y-6 sticky top-28">
              <h2 className="text-base font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3 font-display">
                Order Review ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
              </h2>

              {/* Items preview list */}
              <div className="divide-y divide-neutral-100 max-h-60 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover rounded-lg bg-neutral-100"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-neutral-500">
                          Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-neutral-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2.5 text-xs border-t border-neutral-100 pt-4">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatPrice(cartSubtotal)}</span>
                </div>

                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount Coupon</span>
                    <span>-{formatPrice(cartDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>Priority Courier</span>
                  <span>
                    {cartShippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[10px]">FREE</span>
                    ) : (
                      formatPrice(cartShippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-extrabold text-neutral-900 pt-3 border-t border-neutral-200">
                  <span>Total Amount</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider disabled:bg-neutral-400"
              >
                {isProcessing ? (
                  <span>Authorizing Order & Payment...</span>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[11px] text-neutral-500 text-center space-y-1">
                <p>By placing this order you agree to YASHU terms & condition.</p>
                <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-semibold pt-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Full Buyer Protection & Free Exchanges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
