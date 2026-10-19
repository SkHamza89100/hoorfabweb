import React from 'react';
import { ArrowRight, Instagram } from 'lucide-react';

const INSTA_ITEMS = [
  {
    id: 'ig-1',
    image: 'https://images.unsplash.com/photo-1610030469668-932d44933a3c?auto=format&fit=crop&w=600&q=80',
    caption: 'Pure velvet & antique marori tilla embroidery details'
  },
  {
    id: 'ig-2',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
    caption: 'Emerald green scalloped organza dupatta with hand-tucked pearls'
  },
  {
    id: 'ig-3',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    caption: 'Champagne raw silk festive formal ready to ship'
  },
  {
    id: 'ig-4',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80',
    caption: 'Pastel bliss in pure combed lawn and organza'
  },
  {
    id: 'ig-5',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    caption: 'Deep plum back silhouette with delicate tassel ties'
  }
];

export const InstagramGrid: React.FC = () => {
  const handleInstagramClick = () => {
    window.open('https://instagram.com', '_blank');
  };

  return (
    <section className="py-12 sm:py-16 bg-[#faf6f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#886e53]">
                FOLLOW US ON INSTAGRAM
              </span>
              <div className="h-[1px] w-12 bg-[#c8b398]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#342a20] tracking-tight">
              See More Collection
            </h2>
          </div>

          <button
            onClick={handleInstagramClick}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#75614d] hover:text-[#382d22] transition-colors group"
          >
            <span>See Our Instagram</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 5 Photos Grid matching screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {INSTA_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={handleInstagramClick}
              className="group relative aspect-square rounded-xl overflow-hidden bg-[#e8ded0] border border-[#e2d5c4] cursor-pointer shadow-sm"
            >
              <img
                src={item.image}
                alt={item.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80';
                }}
              />
              
              {/* Overlay with Instagram logo and handle */}
              <div className="absolute inset-0 bg-[#34291f]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center text-white">
                <Instagram className="w-6 h-6 mb-1.5" />
                <span className="text-[11px] font-semibold tracking-wider uppercase">
                  @hoorfab_official
                </span>
                <span className="text-[10px] text-[#decbb8] line-clamp-2 mt-1">
                  {item.caption}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
