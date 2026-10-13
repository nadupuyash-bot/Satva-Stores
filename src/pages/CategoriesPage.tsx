import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export const CategoriesPage: React.FC = () => {
  const { categories, products } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-2">
          Curated Realms
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight font-display">
          Explore Our Collections
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-3 leading-relaxed">
          From architectural apparel to precision horology and acoustic engineering,
          explore each category sculpted for the modern aesthete.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => {
          const categoryProducts = products.filter((p) => p.category === category.id);

          return (
            <div
              key={category.id}
              className="group bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image showcase */}
                <div className="relative aspect-4/3 overflow-hidden bg-neutral-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                      {categoryProducts.length} Creations
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-900 group-hover:text-amber-800 transition-colors font-display">
                    {category.name}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Highlights list */}
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                      Popular Highlights:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {categoryProducts.slice(0, 3).map((p) => (
                        <Link
                          key={p.id}
                          to={`/product/${p.id}`}
                          className="text-[11px] bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-700 px-2.5 py-1 rounded-lg transition-colors truncate max-w-[200px]"
                        >
                          {p.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <Link
                  to={`/shop?category=${category.id}`}
                  className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider shadow-xs"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
