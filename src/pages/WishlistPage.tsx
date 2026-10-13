import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/formatters';
import { StarRating } from '../components/common/StarRating';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, moveToCart, toggleWishlist, clearWishlist } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  if (savedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-neutral-900 font-display mb-2">
          Your Wishlist Is Empty
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mb-8">
          Save your favourite tailored pieces, horology, and accessories to revisit or purchase later.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-8 py-4 rounded-full uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-6 mb-8">
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
            Saved Creations
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-display">
            My Wishlist ({savedProducts.length})
          </h1>
        </div>

        <button
          onClick={clearWishlist}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline self-start sm:self-auto"
        >
          Clear All Wishlist Items
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {savedProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-3/4 overflow-hidden bg-neutral-100">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-rose-500 rounded-full shadow-xs transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 sm:p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  {product.category}
                </span>
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-1">
                  <StarRating rating={product.rating} count={product.reviewCount} />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-base font-bold text-neutral-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-neutral-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 pt-0">
              <button
                onClick={() => moveToCart(product.id)}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move to Bag</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
