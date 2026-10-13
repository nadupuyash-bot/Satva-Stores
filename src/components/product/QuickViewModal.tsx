import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';
import { StarRating } from '../common/StarRating';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist } = useStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImage(0);
      setQuantity(1);
      setSelectedSize(quickViewProduct.sizes ? quickViewProduct.sizes[0] : undefined);
      setSelectedColor(quickViewProduct.colors ? quickViewProduct.colors[0].name : undefined);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isSaved = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedSize, selectedColor);
    setQuickViewProduct(null);
  };

  const handleFullDetails = () => {
    setQuickViewProduct(null);
    navigate(`/product/${quickViewProduct.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-neutral-200 relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-neutral-100 text-neutral-600 backdrop-blur-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Images Column */}
        <div className="md:w-1/2 p-6 bg-neutral-50 flex flex-col justify-between">
          <div className="relative aspect-4/5 rounded-xl overflow-hidden bg-white mb-4 border border-neutral-100 shadow-xs">
            <img
              src={quickViewProduct.images[selectedImage] || quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {quickViewProduct.discountPercentage && (
              <span className="absolute top-3 left-3 bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                {quickViewProduct.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {quickViewProduct.images.length > 1 && (
            <div className="flex gap-2 justify-center">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-neutral-900 ring-2 ring-neutral-900/20' : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information Column */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                {quickViewProduct.category}
              </span>
              <span className="text-xs text-neutral-400">•</span>
              <span className="text-xs text-neutral-500">In Stock ({quickViewProduct.stock})</span>
            </div>

            <h3 className="text-xl font-bold text-neutral-900 tracking-tight leading-snug">
              {quickViewProduct.name}
            </h3>

            <div className="flex items-center gap-2 mt-2 mb-4">
              <StarRating rating={quickViewProduct.rating} count={quickViewProduct.reviewCount} />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-neutral-900">
                {formatPrice(quickViewProduct.price)}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatPrice(quickViewProduct.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-600 line-clamp-3 mb-5 leading-relaxed">
              {quickViewProduct.description}
            </p>

            {/* Colors */}
            {quickViewProduct.colors && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-neutral-900 mb-2">
                  Color: <span className="text-neutral-500 font-normal">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {quickViewProduct.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                        selectedColor === color.name
                          ? 'ring-2 ring-neutral-900 ring-offset-2 border-transparent'
                          : 'border-neutral-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {quickViewProduct.sizes && (
              <div className="mb-5">
                <div className="text-xs font-semibold text-neutral-900 mb-2">
                  Size: <span className="text-neutral-500 font-normal">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-neutral-100 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`p-3.5 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
                aria-label="Save to wishlist"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleFullDetails}
              className="w-full text-center text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:underline pt-1"
            >
              View Full Product Specifications & Reviews →
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-neutral-500">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-neutral-400" />
                <span>Free Ship ₹1,999+</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
                <span>7-Day Returns</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Genuine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 -z-10" onClick={() => setQuickViewProduct(null)} />
    </div>
  );
};
