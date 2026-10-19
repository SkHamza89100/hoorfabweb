import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';
import { ProductCategory, CategoryMediaItem } from '../types';

export const CategoryGrid: React.FC = () => {
  const { setSelectedCategory, setActiveView, siteMedia } = useStore();

  const categories: CategoryMediaItem[] = siteMedia?.categories || [];

  const handleCategorySelect = (categoryName: ProductCategory) => {
    setSelectedCategory(categoryName);
    setActiveView('catalog');
    const catalogElement = document.getElementById('product-catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#faf6f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Eyebrow and Tagline */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#886e53]">
                SHOP BY CATEGORY
              </span>
              <div className="h-[1px] w-12 bg-[#c8b398]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#342a20] tracking-tight">
              Our Collection
            </h2>
          </div>

          <div>
            <p className="text-sm font-serif italic text-[#7a6552] tracking-wide">
              Trendy. Elegant. Timeless.
            </p>
          </div>
        </div>

        {/* 6 Category Cards Grid - Dynamically Driven from siteMedia */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat.name)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[4/3] bg-[#ece2d4] border border-[#e2d5c4] shadow-sm hover:shadow-lg transition-all duration-500"
            >
              {/* Product Category Photo with hover scale */}
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                }}
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a221b]/80 via-[#2a221b]/25 to-transparent transition-opacity group-hover:from-[#2a221b]/85" />

              {/* Content Label */}
              <div className="absolute inset-0 p-4 sm:p-6 flex items-end justify-between pointer-events-none">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight drop-shadow-sm whitespace-pre-line">
                    {cat.label}
                  </h3>
                  {cat.subtitle && (
                    <p className="text-[11px] sm:text-xs text-[#e4d6c4] font-sans mt-0.5 opacity-90 drop-shadow-sm">
                      {cat.subtitle}
                    </p>
                  )}
                </div>

                {/* Arrow Circle Badge */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/40 bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#382d22] group-hover:border-white transition-all duration-300 shrink-0">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
