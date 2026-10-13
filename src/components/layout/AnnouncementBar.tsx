import React, { useState } from 'react';
import { Tag, Sparkles, X, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-neutral-900 text-neutral-200 text-xs py-2 px-4 border-b border-neutral-800 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2 text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Authentic Products • Complimentary 7-Day Returns</span>
        </div>

        <div className="flex-1 sm:flex-initial text-center flex items-center justify-center gap-2 font-medium">
          <span className="inline-flex items-center gap-1.5 text-amber-300">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>FESTIVE PRIVILEGE:</span>
          </span>
          <span>Flat 20% OFF Orders Above ₹999</span>
          <span className="hidden md:inline text-neutral-400">with code</span>
          <span className="font-mono bg-neutral-800 text-amber-300 px-1.5 py-0.5 rounded border border-neutral-700 text-[10px] tracking-wider font-semibold">
            YASHU20
          </span>
          <Link
            to="/shop"
            className="hidden md:inline underline text-neutral-300 hover:text-white ml-2 transition-colors"
          >
            Shop Now →
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-neutral-400">
            <Tag className="w-3 h-3" />
            <span>FREE Express Delivery on ₹1,999+</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-neutral-500 hover:text-neutral-200 p-0.5 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
