import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Globe,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative bg-neutral-900 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80"
            alt="YASHU Heritage"
            className="w-full h-full object-cover opacity-20 filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 text-amber-300 text-xs font-semibold tracking-wider uppercase border border-neutral-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The YASHU Manifesto</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display text-white">
            Architecture in Form. <br />
            Substance in Everyday Living.
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light max-w-2xl mx-auto">
            Founded with the conviction that true luxury is not marked by loud logos,
            but by the weight of the weave, the precision of the movement, and the enduring integrity of every stitch.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
              Our Genesis
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-display">
              Born from a pursuit of timeless, functional minimalism.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              YASHU originated as an answer to the churn of ephemeral fashion cycles.
              We asked a foundational question: What if modern consumers could access
              the same artisanal textiles and horological engineering typically reserved for
              couture houses, delivered with absolute digital convenience?
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              From our flagship studio in Mumbai to artisan workshops in Jaipur, Como,
              and Nagano, every creation is designed to integrate effortlessly into the modern wardrobe
              and architectural habitat.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
              <div>
                <h4 className="text-2xl font-bold font-display text-neutral-900">100%</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Ethically Certified Raw Materials</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold font-display text-neutral-900">Zero</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Middlemen Markups & Waste</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border border-neutral-200">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80"
              alt="Atelier Tailoring"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-neutral-100/60 py-16 sm:py-24 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
              Core Tenets
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-display">
              The Pillars of YASHU
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 bg-neutral-900 text-amber-400 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-display">
                Uncompromising Quality
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We select virgin wool, Supima cotton, vegetable-tanned bridle leather,
                and sapphire crystals. Every batch undergoes strict stress, wash, and scratch tests.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 bg-neutral-900 text-amber-400 rounded-2xl flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-display">
                Customer Centricity
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Free express shipping on all orders over ₹1,999, instant doorstep returns,
                transparent pricing, and genuine humans managing our concierge helpdesk.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 bg-neutral-900 text-amber-400 rounded-2xl flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 font-display">
                Conscious Longevity
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We build pieces designed to be cherished for years, not weeks.
                Sustainable packaging, biodegradable mailers, and carbon-neutral air logistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight font-display">
          Experience YASHU in Person
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
          Explore our latest collection and welcome timeless minimalist elegance into your daily life.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-8 py-4 rounded-full uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
        >
          <span>Explore The Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
