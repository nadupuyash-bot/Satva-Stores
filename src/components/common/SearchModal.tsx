import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/formatters';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.tagline.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectProduct = (productId: string) => {
    setIsSearchOpen(false);
    navigate(`/product/${productId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearchOpen(false);
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const trendingTags = ['Blazer', 'Sneakers', 'Sapphire Watch', 'Planar Headphones', 'Cordura', 'Ceramic Diffuser'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-neutral-100 p-4">
          <Search className="w-5 h-5 text-neutral-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product, category, or style (e.g., blazer, watch, leather)..."
            className="w-full text-base sm:text-lg bg-transparent border-none outline-none text-neutral-900 placeholder-neutral-400 font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-neutral-400 hover:text-neutral-700 p-1 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2 py-1 rounded font-mono"
          >
            ESC
          </button>
        </form>

        {/* Content area */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {query.trim() === '' ? (
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-neutral-500" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Featured Recommendations</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.slice(0, 4).map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod.id)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 cursor-pointer border border-transparent hover:border-neutral-200 transition-all group"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-12 h-12 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-neutral-900 truncate group-hover:text-amber-700 transition-colors">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-neutral-500">{formatPrice(prod.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div>
              <div className="text-xs font-medium text-neutral-500 mb-3">
                Found {filteredProducts.length} matching products
              </div>
              <div className="divide-y divide-neutral-100">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod.id)}
                    className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-xl cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                          {prod.category}
                        </span>
                        <h4 className="text-sm font-medium text-neutral-900 group-hover:text-amber-800 transition-colors mt-1">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-semibold text-neutral-900">
                            {formatPrice(prod.price)}
                          </span>
                          {prod.originalPrice && (
                            <span className="text-xs line-through text-neutral-400">
                              {formatPrice(prod.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
              <button
                onClick={handleSearchSubmit}
                className="w-full mt-4 py-2 text-center text-xs font-semibold text-neutral-900 hover:text-amber-700 uppercase tracking-wider border-t border-neutral-100 pt-3"
              >
                View all results for &quot;{query}&quot; →
              </button>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-neutral-500 text-sm">No products found matching &quot;{query}&quot;</p>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  navigate('/shop');
                }}
                className="mt-3 text-xs font-semibold text-neutral-900 hover:underline"
              >
                Browse all products
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className="fixed inset-0 -z-10"
        onClick={() => setIsSearchOpen(false)}
      />
    </div>
  );
};
