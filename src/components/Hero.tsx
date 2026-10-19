import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const Hero: React.FC = () => {
  const { setActiveView, siteMedia } = useStore();

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      "Hello HOOR FAB! I would like to enquire about your latest premium ethnic wear collection."
    );
    window.open(`https://wa.me/918100032281?text=${text}`, '_blank');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf6f0] via-[#f7eee2] to-[#faf5ee] pt-4 pb-10 sm:pt-10 sm:pb-16 border-b border-[#e9ded1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-column split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Copy & Actions (Second on mobile, first on desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-6 space-y-5 sm:space-y-6 pt-2 lg:pt-0">
            {/* Eyebrow with gold accent rule */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#886e53]">
                PREMIUM WOMEN'S ETHNIC WEAR
              </span>
              <div className="h-[1.5px] w-14 bg-[#c8b398]" />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#342a20] tracking-tight leading-[1.1] text-balance">
              Made for the <span className="italic font-normal text-[#755f48]">HOOR</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-[#615141] font-normal leading-relaxed max-w-xl">
              Elegant styles for every occasion — from everyday grace to timeless charm. Handcrafted Pakistani suits, pure lawn, organza, and artisanal embroideries.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <button
                onClick={() => {
                  setActiveView('catalog');
                  window.scrollTo({ top: 600, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 bg-[#786550] hover:bg-[#655340] text-white rounded-full font-medium text-xs sm:text-sm tracking-wide shadow-sm hover:shadow-md transition-all group cursor-pointer"
              >
                <span>View Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleWhatsAppDirect}
                className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 bg-[#f4ece1] hover:bg-[#ebdfd0] text-[#473a2e] border border-[#cfbdab] rounded-full font-medium text-xs sm:text-sm tracking-wide transition-all shadow-sm cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <WhatsAppIcon size={13} color="#ffffff" />
                </div>
                <span>Order on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Column: Model Showcase (First on mobile right below header, second on desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-6 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none group">
              {/* Decorative arch frame background */}
              <div className="absolute -inset-2 bg-gradient-to-t from-[#cbb49b]/30 to-transparent rounded-[2.5rem] -rotate-1 pointer-events-none" />
              
              <div className="relative rounded-[2rem] overflow-hidden shadow-xl border border-[#ded0bf] bg-[#eadecd] aspect-[3/4] max-h-[460px] sm:max-h-[520px] w-full">
                {/* Hero Showcase Image driven from real-time admin panel */}
                <img
                  src={siteMedia.heroImage}
                  alt="HOOR FAB Luxury Ethnic Wear Model"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85';
                  }}
                />
                
                {/* Subtle soft lighting scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#362c22]/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating pill badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#fcf9f5]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#ded0bf] flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-serif font-bold text-[#342a20] text-sm">
                      {siteMedia.heroBadgeTitle || 'Festive Formals Drop'}
                    </span>
                    <span className="text-[#7d6b57]">
                      {siteMedia.heroBadgeSubtitle || 'Raw Silk & Organza Tilla'}
                    </span>
                  </div>
                  <span className="font-semibold text-[#8a7258] uppercase tracking-wider text-[11px]">
                    Available Now
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
