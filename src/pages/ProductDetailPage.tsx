import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Share2,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  MessageSquare,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, getFutureDeliveryDate } from '../utils/formatters';
import { StarRating } from '../components/common/StarRating';
import { ProductCard } from '../components/product/ProductCard';
import { ReviewModal } from '../components/product/ReviewModal';
import { useNotification } from '../context/NotificationContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getProductById,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useStore();
  const { showToast } = useNotification();

  const product = id ? getProductById(id) : undefined;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'delivery'>('specs');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setActiveImageIndex(0);
      setQuantity(1);
      setSelectedSize(product.sizes ? product.sizes[0] : undefined);
      setSelectedColor(product.colors ? product.colors[0].name : undefined);
      setPincodeStatus(null);
    }
  }, [product, id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Piece Not Found</h2>
        <p className="text-sm text-neutral-500 mb-6">
          The requested product may have been archived or removed from the catalog.
        </p>
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

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate('/checkout');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6 || isNaN(Number(pincode))) {
      setPincodeStatus('invalid');
      return;
    }
    setPincodeStatus('valid');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.tagline,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'success');
    }
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-8 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-neutral-900">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <Link to="/shop" className="hover:text-neutral-900">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <Link
          to={`/shop?category=${product.category}`}
          className="hover:text-neutral-900 capitalize"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="text-neutral-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Product Images Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-4/5 w-full rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-xs">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            {product.discountPercentage && (
              <span className="absolute top-4 left-4 bg-neutral-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.discountPercentage}% OFF
              </span>
            )}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-neutral-700 shadow-md transition-all"
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-neutral-900 ring-2 ring-neutral-900/10'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Actions & Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-xs text-neutral-400">•</span>
              <span className="text-xs text-neutral-500 font-mono">
                SKU: {product.id.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight font-display">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
              {product.tagline}
            </p>

            {/* Ratings */}
            <div className="flex items-center gap-3 mt-3">
              <StarRating rating={product.rating} count={product.reviewCount} size="md" />
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-xs text-neutral-500 hover:text-neutral-900 underline"
              >
                Read {product.reviews?.length || product.reviewCount} customer reviews
              </button>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-neutral-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Inclusive of all taxes & GST
              </span>
            </div>
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2.5">
                Color Choice: <span className="text-neutral-500 font-normal">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2.5">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'ring-2 ring-neutral-900 ring-offset-2 border-transparent'
                          : 'border-neutral-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {isSelected && (
                        <Check className="w-4 h-4 text-white mix-blend-difference" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Select Size: <span className="text-neutral-500 font-normal">{selectedSize}</span>
                </label>
                <span className="text-xs text-neutral-500 underline cursor-pointer hover:text-neutral-900">
                  Size Guide
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        isSelected
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                          : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Stock */}
          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center border border-neutral-300 rounded-xl bg-white p-1">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="p-2 text-neutral-600 hover:text-neutral-900"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-neutral-900">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
                className="p-2 text-neutral-600 hover:text-neutral-900"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs">
              {product.stock > 0 ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock ({product.stock} units ready to dispatch)
                </span>
              ) : (
                <span className="text-rose-600 font-semibold">Currently Out of Stock</span>
              )}
            </div>
          </div>

          {/* Action Buttons: Add to Bag, Buy Now, Wishlist */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-4 rounded-xl transition-all uppercase tracking-wider shadow-md"
            >
              Instant Buy Now →
            </button>
          </div>

          {/* PIN Code Delivery Estimator */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-800">
              <Truck className="w-4 h-4 text-neutral-600" />
              <span>Check Delivery Availability</span>
            </div>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit PIN code (e.g. 400001)"
                className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-neutral-900"
              />
              <button
                type="submit"
                className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Check
              </button>
            </form>
            {pincodeStatus === 'valid' && (
              <div className="text-xs text-emerald-700 font-medium flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>Express courier available. Estimated arrival: <strong>{getFutureDeliveryDate(3)}</strong></span>
              </div>
            )}
            {pincodeStatus === 'invalid' && (
              <div className="text-xs text-rose-600 animate-in fade-in">
                Please enter a valid 6-digit Indian PIN code.
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-neutral-600">
            <div className="p-2.5 rounded-xl bg-white border border-neutral-100 flex flex-col items-center">
              <Truck className="w-4 h-4 text-neutral-700 mb-1" />
              <span>Free Delivery (₹1,999+)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-neutral-100 flex flex-col items-center">
              <RotateCcw className="w-4 h-4 text-neutral-700 mb-1" />
              <span>7-Day Return Window</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-neutral-100 flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
              <span>100% Verified Authentic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications, Reviews, Logistics */}
      <div className="mt-16 sm:mt-24 border-t border-neutral-200 pt-10">
        <div className="flex border-b border-neutral-200 space-x-8">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'specs'
                ? 'text-neutral-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Specifications & Craft
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'reviews'
                ? 'text-neutral-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Client Reviews ({product.reviews?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'delivery'
                ? 'text-neutral-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Delivery & Care
          </button>
        </div>

        {/* Tab 1: Specifications */}
        {activeTab === 'specs' && (
          <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">
                Technical Specifications
              </h3>
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden bg-white">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3.5 text-xs">
                    <span className="font-semibold text-neutral-500">{key}</span>
                    <span className="font-medium text-neutral-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4">
                Hallmark Features
              </h3>
              <ul className="space-y-3 text-xs text-neutral-700">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-5 bg-neutral-50 rounded-2xl border border-neutral-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                  Atelier Guarantee
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Each piece is handcrafted in limited batches using certified ethically-sourced
                  materials. Individually serial numbered and inspected before dispatch.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div className="py-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-neutral-50 rounded-2xl border border-neutral-200">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-neutral-900 font-display">
                    {product.rating}
                  </div>
                  <div className="mt-1">
                    <StarRating rating={product.rating} />
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Based on {product.reviewCount} reviews
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-6 py-3.5 rounded-full uppercase tracking-wider transition-colors shadow-sm"
              >
                Write a Verified Review
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-900">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400">{rev.date}</span>
                    </div>

                    <StarRating rating={rev.rating} />

                    <p className="text-xs text-neutral-700 leading-relaxed pt-1">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-neutral-50 rounded-2xl">
                  <p className="text-xs text-neutral-500 mb-3">No reviews yet for this creation.</p>
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="text-xs font-bold text-neutral-900 underline"
                  >
                    Be the first to review
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Delivery & Care */}
        {activeTab === 'delivery' && (
          <div className="py-8 max-w-3xl space-y-6 text-xs text-neutral-700 leading-relaxed">
            <div>
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Logistics & Dispatch
              </h4>
              <p>
                All orders are dispatched from our automated fulfillment center in Mumbai within 24
                hours of order confirmation. We partner with BlueDart, Delhivery, and DTDC Express.
                Deliveries to metros take 2-3 business days, and other regions 3-5 business days.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 uppercase tracking-wider mb-2">
                Complimentary 7-Day Doorstep Returns
              </h4>
              <p>
                Should the fit or aesthetics not meet your expectations, schedule a return via your
                YASHU account. Our courier partner will collect the item in original packaging with
                tags intact. Instant refund via UPI or source payment card upon handover.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Showcase */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-neutral-200 pt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
                You May Also Admire
              </span>
              <h3 className="text-2xl font-bold text-neutral-900 font-display">
                Complementary Pieces
              </h3>
            </div>
            <Link
              to={`/shop?category=${product.category}`}
              className="text-xs font-bold text-neutral-900 hover:underline uppercase tracking-wider"
            >
              View All {product.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Review Modal Component */}
      <ReviewModal
        productId={product.id}
        productName={product.name}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
};
