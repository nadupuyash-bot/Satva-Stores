import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useNotification();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    showToast('Thank you for subscribing! Your 20% privilege code is YASHU20', 'success', 'Subscribed');
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800">
      {/* Service Highlights strip */}
      <div className="border-b border-neutral-900 bg-neutral-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Express Shipping</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Complimentary delivery on orders over ₹1,999 across India</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">7-Day Free Returns</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Hassle-free doorstep exchanges & full refunds</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Genuine Luxury</h4>
              <p className="text-xs text-neutral-400 mt-0.5">Curated with direct atelier verification</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Dedicated Concierge</h4>
              <p className="text-xs text-neutral-400 mt-0.5">24/7 client care via chat, phone, & WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer links and newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white text-neutral-950 rounded-xl flex items-center justify-center font-black tracking-tighter text-xl">
                Y
              </div>
              <span className="font-extrabold text-2xl tracking-[0.25em] uppercase font-display text-white">
                YASHU
              </span>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              YASHU is a contemporary e-commerce label dedicated to minimal elegance,
              craftsmanship, and enduring design across fashion, horology, leather accessories, and acoustic essentials.
            </p>

            <div className="space-y-2 text-xs text-neutral-400 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>YASHU Atelier, 802 Palladium Mall, Senapati Bapat Marg, Lower Parel, Mumbai 400013</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>+91 1800 210 9274 (Toll-Free Mon–Sat 9AM–8PM IST)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>concierge@yashu-store.com</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Collections
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/shop?category=fashion" className="hover:text-white transition-colors">
                  Fashion & Clothing
                </Link>
              </li>
              <li>
                <Link to="/shop?category=shoes" className="hover:text-white transition-colors">
                  Shoes & Sneakers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=watches" className="hover:text-white transition-colors">
                  Watches & Accessories
                </Link>
              </li>
              <li>
                <Link to="/shop?category=electronics" className="hover:text-white transition-colors">
                  Electronics & Audio
                </Link>
              </li>
              <li>
                <Link to="/shop?category=bags" className="hover:text-white transition-colors">
                  Bags & Backpacks
                </Link>
              </li>
              <li>
                <Link to="/shop?category=home" className="hover:text-white transition-colors">
                  Home & Lifestyle
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links & Support */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Assistance
            </h3>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Brand Heritage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Customer Care & FAQs
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Cart & Pricing
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-amber-400 transition-colors font-medium">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">
              Privilege Newsletter
            </h3>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Subscribe to unlock private sales, early runway access, and secret discount coupons.
            </p>

            {subscribed ? (
              <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>You&apos;re subscribed! Enjoy 20% off with promo code <strong>YASHU20</strong>.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-neutral-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bg-white text-neutral-950 hover:bg-neutral-200 p-1.5 rounded-lg transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500">
                  By subscribing you agree to our Privacy Policy. Unsubscribe at any time.
                </p>
              </form>
            )}

            {/* Payment acceptance badges */}
            <div className="pt-6">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block mb-2">
                Supported Payment Methods
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['UPI', 'Google Pay', 'PhonePe', 'Paytm', 'RuPay', 'Visa', 'Mastercard', 'NetBanking', 'COD'].map((method) => (
                  <span
                    key={method}
                    className="text-[10px] font-mono bg-neutral-900 text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded font-medium"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-neutral-900 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} YASHU Inc. All rights reserved. Built with precision & modern web standards.</p>
          <div className="flex items-center space-x-6 text-neutral-400">
            <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
