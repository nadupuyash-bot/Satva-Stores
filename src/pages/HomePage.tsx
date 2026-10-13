import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock,
  Star,
  CheckCircle2,
  Copy,
  Check,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { useNotification } from '../context/NotificationContext';
import { formatPrice } from '../utils/formatters';

export const HomePage: React.FC = () => {
  const { products, categories } = useStore();
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState<'trending' | 'featured' | 'new'>('trending');
  const [copiedCode, setCopiedCode] = useState(false);

  // Countdown timer for Deal of the Day (24 hour loop)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast(`Coupon code ${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const trendingProducts = products.filter((p) => p.isTrending);
  const featuredProducts = products.filter((p) => p.isFeatured);
  const newProducts = products.filter((p) => p.isNewArrival);

  const displayedProducts =
    activeTab === 'trending'
      ? trendingProducts
      : activeTab === 'featured'
      ? featuredProducts
      : newProducts;

  const testimonials = [
    {
      id: 1,
      name: 'Aanya Sharma',
      location: 'Mumbai',
      quote:
        'The wool blazer and titanium timepiece I ordered surpassed every expectation. The craftsmanship rivals luxury European houses, delivered right to my door in 48 hours.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      purchasedItem: 'Structured Oversized Wool Blazer',
    },
    {
      id: 2,
      name: 'Devendra K.',
      location: 'Bengaluru',
      quote:
        'Finally a homegrown Indian luxury brand with genuine architectural sensibility. The Planar Headphones have become the centerpiece of my studio setup.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      purchasedItem: 'Acoustic One Wireless Planar Headphones',
    },
    {
      id: 3,
      name: 'Tanvi Kapoor',
      location: 'New Delhi',
      quote:
        'Seamless checkout, express delivery, and impeccable packaging. The Cordura backpack is built like a tank yet looks ultra-minimal. Highly recommended.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      purchasedItem: 'Ventura Cordura Everyday Backpack 24L',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-neutral-900 text-white">
        {/* Background glow and subtle mesh */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=85"
            alt="YASHU Modern Luxury"
            className="w-full h-full object-cover opacity-25 filter grayscale contrast-125 scale-105 transform motion-safe:animate-pulse duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 lg:py-40">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-700/80 text-xs font-semibold text-neutral-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>THE 2026 AUTUMN / WINTER CURATION</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-display text-white leading-[1.08]">
              Modern Living, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-300 to-amber-200">
                Refined Elegance.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-xl">
              Discover a curated collective of premium apparel, horology, leather goods, and acoustics.
              Engineered with uncompromising precision for the discerning individual.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/shop"
                className="bg-white hover:bg-neutral-100 text-neutral-950 text-xs sm:text-sm font-bold px-8 py-4 rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 uppercase tracking-wider"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/categories"
                className="bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-white text-xs sm:text-sm font-semibold px-8 py-4 rounded-full transition-all backdrop-blur-md uppercase tracking-wider"
              >
                Browse Categories
              </Link>
            </div>

            {/* Micro proof metrics */}
            <div className="pt-8 border-t border-neutral-800/80 grid grid-cols-3 gap-6 text-neutral-400 text-xs">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-display">50,000+</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Discerning Patrons</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-display">100%</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Certified Authentic</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white font-display">4.9 / 5.0</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Client Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-2">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-display">
              Explore By Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-amber-700 flex items-center gap-1.5 uppercase tracking-wider mt-3 md:mt-0 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className="group relative rounded-2xl overflow-hidden aspect-3/4 bg-neutral-100 flex flex-col justify-end p-4 border border-neutral-200/60 shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent" />

              <div className="relative z-10 text-white">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-300 block mb-0.5">
                  {category.itemCount} Items
                </span>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors leading-tight">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS WITH TABBED SWITCHER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-2">
              Signature Edits
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-display">
              Essential Pieces
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex p-1 bg-neutral-100 rounded-full border border-neutral-200 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'trending'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Trending Now
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'featured'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Best Sellers
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'new'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              New Arrivals
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center pt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-8 py-4 rounded-full transition-all uppercase tracking-wider shadow-md hover:shadow-lg"
          >
            <span>View All {products.length} Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. DEAL OF THE DAY / PROMO BANNER WITH COUNTDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-950 text-white border border-neutral-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="p-8 sm:p-12 lg:p-16 space-y-6">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                <span>LIMITED TIME EXCLUSIVE OFFER</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
                Up to 30% Off on Horology & Acoustics
              </h2>

              <p className="text-neutral-300 text-sm leading-relaxed max-w-lg">
                Elevate your daily rhythm with sapphire crystal chronographs and planar magnetic audio.
                Complimentary luxury gift box included with every timepiece this week.
              </p>

              {/* Countdown timer blocks */}
              <div className="flex items-center gap-3 pt-2">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-center min-w-[70px]">
                  <span className="text-2xl font-bold font-mono text-white">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] uppercase tracking-wider text-neutral-400 mt-0.5">Hours</span>
                </div>
                <span className="text-xl font-bold text-neutral-500">:</span>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-center min-w-[70px]">
                  <span className="text-2xl font-mono font-bold text-white">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] uppercase tracking-wider text-neutral-400 mt-0.5">Mins</span>
                </div>
                <span className="text-xl font-bold text-neutral-500">:</span>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-center min-w-[70px]">
                  <span className="text-2xl font-mono font-bold text-amber-400">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="block text-[10px] uppercase tracking-wider text-neutral-400 mt-0.5">Secs</span>
                </div>
              </div>

              {/* Promo code copy badge */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-2.5 gap-3">
                  <span className="text-xs text-neutral-400">Code:</span>
                  <span className="font-mono text-sm font-bold text-amber-300">YASHU20</span>
                  <button
                    onClick={() => handleCopyCode('YASHU20')}
                    className="p-1 hover:text-white text-neutral-400 transition-colors"
                    aria-label="Copy code"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <Link
                  to="/shop?category=watches"
                  className="bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold px-6 py-3.5 rounded-xl transition-all uppercase tracking-wider"
                >
                  Shop The Privilege
                </Link>
              </div>
            </div>

            {/* Image right */}
            <div className="relative h-72 sm:h-96 lg:h-full min-h-[350px]">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"
                alt="Horology Special"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-950 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED CUSTOMER REVIEWS & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-2">
            Patron Testimonials
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-display">
            Loved By Over 50,000 Discerning Shoppers
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            Read verified reviews from patrons who have embraced the YASHU standard of craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <span>{t.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </h4>
                    <span className="text-[11px] text-neutral-400">{t.location} • Verified Buyer</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BRAND PROMISE / WHY YASHU */}
      <section className="bg-neutral-100/70 border-y border-neutral-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-display">
                Uncompromising Quality
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Every fabric yarn, leather hide, movement gear, and stitch undergoes strict multi-stage atelier testing before release.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                <Truck className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-display">
                Complimentary Express Logistics
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Enjoy insured doorstep priority air-delivery with real-time tracking, tamper-proof packaging, and zero delivery fee above ₹1,999.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                <RotateCcw className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-display">
                7-Day Effortless Returns
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                If the fit or finish isn&apos;t absolute perfection, our couriers will collect the parcel from your doorstep with prompt UPI or card refunds.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
