import React, { useState, useMemo, useEffect } from 'react';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Grid3X3,
  List,
  ChevronDown,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { CategoryId, Product } from '../types';
import { formatPrice } from '../utils/formatters';
import { StarRating } from '../components/common/StarRating';

export const ShopPage: React.FC = () => {
  const { products, categories, addToCart, toggleWishlist, isInWishlist } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from query params
  const categoryParam = searchParams.get('category') as CategoryId | null;
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(
    categoryParam || 'all'
  );
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<
    'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'
  >('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination / Load More state
  const [visibleCount, setVisibleCount] = useState(8);

  // Keep search params in sync if changed via URL
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam !== undefined && searchParam !== searchTerm) {
      setSearchTerm(searchParam);
    }
  }, [categoryParam, searchParam]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(8);
  }, [selectedCategory, searchTerm, minRating, maxPrice, inStockOnly, sortBy]);

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Search Term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTag = p.tagline.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchDesc && !matchTag) return false;
        }
        // Price
        if (p.price > maxPrice) {
          return false;
        }
        // Rating
        if (minRating > 0 && p.rating < minRating) {
          return false;
        }
        // Stock
        if (inStockOnly && p.stock <= 0) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest')
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // default featured
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchTerm, maxPrice, minRating, inStockOnly, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchTerm('');
    setMinRating(0);
    setMaxPrice(25000);
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (searchTerm ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (maxPrice < 25000 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
              Curated Catalog
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight font-display">
              The YASHU Collection
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-xl">
              Precision design, natural textiles, and timeless silhouettes. Every piece is crafted for enduring elegance.
            </p>
          </div>

          <div className="text-xs text-neutral-500 font-medium">
            Showing <strong className="text-neutral-900">{displayedProducts.length}</strong> of{' '}
            <strong className="text-neutral-900">{filteredProducts.length}</strong> creations
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block space-y-8 pr-4">
          {/* Active filter count & reset */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-neutral-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Filter Catalog
              </h3>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold hover:underline"
              >
                Reset All ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Search in Shop */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
              Search Pieces
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Keywords, fabric, style..."
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-8 py-2.5 outline-none focus:border-neutral-900 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
              Categories
            </h4>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchParams({});
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <span>All Collections</span>
                <span className="text-[11px] opacity-75">{products.length}</span>
              </button>

              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.id).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSearchParams({ category: cat.id });
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Max Price
              </h4>
              <span className="text-xs font-semibold text-neutral-900">
                {formatPrice(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="25000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-neutral-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
              <span>₹1,000</span>
              <span>₹25,000</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
              Minimum Rating
            </h4>
            <div className="space-y-1">
              {[4, 3, 0].map((star) => (
                <button
                  key={star}
                  onClick={() => setMinRating(star)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                    minRating === star
                      ? 'bg-neutral-100 text-neutral-900 font-semibold border border-neutral-300'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {star > 0 ? (
                      <>
                        <StarRating rating={star} />
                        <span>& Above</span>
                      </>
                    ) : (
                      <span>All Ratings</span>
                    )}
                  </div>
                  {minRating === star && (
                    <span className="w-2 h-2 rounded-full bg-neutral-900" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Availability */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 accent-neutral-900"
              />
              <span className="text-xs font-medium text-neutral-700">In Stock Pieces Only</span>
            </label>
          </div>
        </aside>

        {/* MAIN PRODUCT CATALOG */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Bar: Mobile filter button, Sorting, View Toggle */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Mobile Filter toggle button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters ({activeFiltersCount})</span>
            </button>

            {/* Active filter pill tags */}
            <div className="hidden sm:flex items-center gap-2 flex-wrap">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-full border border-neutral-200">
                  <span>Category: {selectedCategory}</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-neutral-950"
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchParams({});
                    }}
                  />
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-full border border-neutral-200">
                  <span>Search: &quot;{searchTerm}&quot;</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-neutral-950"
                    onClick={() => setSearchTerm('')}
                  />
                </span>
              )}
              {maxPrice < 25000 && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-full border border-neutral-200">
                  <span>Under {formatPrice(maxPrice)}</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-neutral-950"
                    onClick={() => setMaxPrice(25000)}
                  />
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-full border border-neutral-200">
                  <span>{minRating}★ & Above</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-neutral-950"
                    onClick={() => setMinRating(0)}
                  />
                </span>
              )}
            </div>

            {/* Right: Sort and View mode switch */}
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-neutral-50 border border-neutral-200 text-xs font-semibold text-neutral-800 rounded-xl px-3 py-2 outline-none focus:border-neutral-900 cursor-pointer"
                >
                  <option value="featured">Featured / Curated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>

              {/* View switch */}
              <div className="hidden sm:flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                  aria-label="Grid layout"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                  aria-label="List layout"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Cards Layout */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">No creations found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No products match your current filter criteria. Try clearing search keywords or expanding your price threshold.
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-6 py-3 rounded-full transition-colors uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {displayedProducts.map((product) => {
                const isSaved = isInWishlist(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 hover:shadow-lg transition-all"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full sm:w-48 h-56 object-cover rounded-xl bg-neutral-100 shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            {product.category}
                          </span>
                          <StarRating rating={product.rating} count={product.reviewCount} />
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-neutral-900 hover:text-amber-800 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-neutral-500 font-medium mt-0.5">{product.tagline}</p>

                        <p className="text-xs text-neutral-600 line-clamp-2 mt-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 mt-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-neutral-900">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-neutral-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                          {product.discountPercentage && (
                            <span className="text-xs font-bold text-emerald-700">
                              {product.discountPercentage}% OFF
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`p-2.5 rounded-xl border transition-colors ${
                              isSaved
                                ? 'bg-rose-50 border-rose-200 text-rose-600'
                                : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                            }`}
                            aria-label="Wishlist"
                          >
                            <span className="text-xs font-semibold">{isSaved ? 'Saved' : 'Wishlist'}</span>
                          </button>
                          <button
                            onClick={() => addToCart(product, 1)}
                            className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors uppercase tracking-wider"
                          >
                            Add to Bag
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination / Load More button */}
          {hasMore && (
            <div className="text-center pt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 text-xs font-bold px-8 py-3.5 rounded-full transition-all uppercase tracking-wider shadow-xs hover:shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Load More Creations</span>
              </button>
              <p className="text-[11px] text-neutral-400 mt-2">
                Showing {displayedProducts.length} of {filteredProducts.length} products
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 shadow-2xl ml-auto animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                Filters
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Category
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchParams({});
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                    selectedCategory === 'all' ? 'bg-neutral-900 text-white' : 'text-neutral-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCategory(c.id);
                      setSearchParams({ category: c.id });
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                      selectedCategory === c.id ? 'bg-neutral-900 text-white' : 'text-neutral-700'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-neutral-900">Max Price</span>
                <span className="font-semibold">{formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-neutral-900"
              />
            </div>

            {/* Mobile Reset & Apply */}
            <div className="pt-4 border-t border-neutral-200 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-neutral-900 text-white text-xs font-semibold py-3 rounded-xl uppercase tracking-wider"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full bg-neutral-100 text-neutral-700 text-xs font-semibold py-2.5 rounded-xl uppercase tracking-wider"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
