import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, formatDate } from '../utils/formatters';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useStore();

  const order = orderId ? getOrderById(orderId) : undefined;

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Order Not Located</h2>
        <p className="text-xs sm:text-sm text-neutral-500 mb-6">
          We couldn&apos;t find an order matching that identifier.
        </p>
        <Link
          to="/"
          className="bg-neutral-900 text-white text-xs font-bold px-6 py-3 rounded-full uppercase tracking-wider"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const steps = [
    { title: 'Order Confirmed', date: 'Just now', completed: true },
    { title: 'Atelier Preparation', date: 'Today', completed: true },
    { title: 'Priority Courier', date: 'Expected tomorrow', completed: false },
    { title: 'Doorstep Handover', date: order.estimatedDeliveryDate, completed: false },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Success banner */}
      <div className="text-center space-y-4 mb-10">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
          Payment & Order Confirmed
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-display">
          Thank you for choosing YASHU!
        </h1>

        <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
          Your order has been recorded in our atelier systems. A copy of your invoice and tracking
          link has been dispatched to <strong>{order.shippingAddress.email}</strong>.
        </p>

        <div className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-800 px-4 py-2 rounded-xl font-mono text-sm font-bold border border-neutral-200">
          <span>Order ID: {order.orderNumber}</span>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs mb-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-6 font-display">
          Fulfillment Timeline
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
          {steps.map((st, i) => (
            <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                  st.completed ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {st.completed ? '✓' : i + 1}
              </div>
              <span className="text-xs font-bold text-neutral-900">{st.title}</span>
              <span className="text-[11px] text-neutral-500 mt-0.5">{st.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden mb-8">
        <div className="p-6 sm:p-8 border-b border-neutral-100 flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="text-xs text-neutral-400 block">Date of Purchase</span>
            <span className="text-xs font-semibold text-neutral-900">{formatDate(order.createdAt)}</span>
          </div>

          <div>
            <span className="text-xs text-neutral-400 block">Payment Method</span>
            <span className="text-xs font-semibold uppercase text-neutral-900 font-mono">
              {order.paymentMethod} • {order.paymentStatus}
            </span>
          </div>

          <div>
            <span className="text-xs text-neutral-400 block">Estimated Arrival</span>
            <span className="text-xs font-bold text-amber-700">{order.estimatedDeliveryDate}</span>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>
        </div>

        {/* Ordered Items Table */}
        <div className="p-6 sm:p-8 divide-y divide-neutral-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
            Purchased Creations ({order.items.length})
          </h4>
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 first:pt-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-20 object-cover rounded-xl bg-neutral-100 border border-neutral-100"
                />
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-neutral-900">{item.productName}</h5>
                  <div className="flex gap-2 text-[11px] text-neutral-500 mt-1">
                    <span>Qty: {item.quantity}</span>
                    {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                    {item.selectedColor && <span>• Color: {item.selectedColor}</span>}
                  </div>
                </div>
              </div>
              <span className="text-sm font-bold text-neutral-900">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Price Math */}
        <div className="bg-neutral-50 p-6 sm:p-8 border-t border-neutral-100">
          <div className="max-w-xs ml-auto space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount ({order.couponCode})</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Shipping</span>
              <span className="font-semibold text-neutral-900">
                {order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
              <span>Final Total Paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address footer */}
        <div className="p-6 sm:p-8 border-t border-neutral-100 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <h5 className="font-bold uppercase tracking-wider text-neutral-900 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-500" />
              <span>Delivering To</span>
            </h5>
            <p className="text-neutral-700 font-medium">{order.shippingAddress.fullName}</p>
            <p className="text-neutral-500">{order.shippingAddress.addressLine1}</p>
            <p className="text-neutral-500">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
            </p>
            <p className="text-neutral-500">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-wider text-neutral-900 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>Tracking Reference</span>
            </h5>
            <p className="font-mono text-neutral-800 font-medium">
              Tracking #{order.trackingNumber || 'BLUEDART-8891290'}
            </p>
            <p className="text-neutral-500 mt-1">
              Real-time SMS updates will be dispatched as your parcel transitions across hubs.
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/shop"
          className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-8 py-4 rounded-full uppercase tracking-wider text-center transition-all shadow-md hover:shadow-lg"
        >
          Explore More Creations
        </Link>
        <Link
          to="/account"
          className="w-full sm:w-auto bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-900 text-xs font-bold px-8 py-4 rounded-full uppercase tracking-wider text-center transition-all"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};
