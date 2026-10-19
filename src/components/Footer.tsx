import React from 'react';
import { useStore } from '../context/StoreContext';
import { HoorFabLogo } from './HoorFabLogo';
import { Instagram, Phone, Lock, MapPin } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const Footer: React.FC = () => {
  const { setActiveView } = useStore();

  const STORE_MAP_URL =
    'https://www.google.com/maps/place/Regent+Market,Amtala,+PG+PathLabs+and+Scan+Clinic/@22.3679172,88.2691324,17z/data=!3m1!4b1!4m6!3m5!1s0x3a0264594097da81:0x8088f77cc3a1f86a!8m2!3d22.3679123!4d88.2717073!16s%2Fg%2F11gd_s55mg?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D';

  const handleWhatsApp = () => {
    window.open('https://wa.me/918100032281?text=Hello%20HOOR%20FAB', '_blank');
  };

  const handleInstagram = () => {
    window.open('https://instagram.com', '_blank');
  };

  const handleContact = () => {
    window.open('tel:+918100032281', '_blank');
  };

  const handleStoreMap = () => {
    window.open(STORE_MAP_URL, '_blank');
  };

  return (
    <footer className="bg-[#786550] text-[#fbf7f2] pt-12 pb-8 border-t border-[#655340]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top zone: Logo on left, vertical divider, links on right */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 py-2">
          
          {/* Logo - Exact replica of user brand logo */}
          <div className="shrink-0">
            <HoorFabLogo variant="light" size="lg" layout="stacked" />
          </div>

          {/* Vertical divider */}
          <div className="hidden md:block w-[1px] h-14 bg-[#a6927d]/50" />

          {/* Contact & Store Location Affordances */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            
            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="flex flex-col items-center gap-2 text-[#efe4d6] hover:text-white transition-colors group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full border border-[#b29f8c] flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <WhatsAppIcon size={20} color="#efe4d6" />
              </div>
              <span className="text-xs tracking-wider uppercase font-medium">WhatsApp</span>
            </button>

            {/* Instagram */}
            <button
              onClick={handleInstagram}
              className="flex flex-col items-center gap-2 text-[#efe4d6] hover:text-white transition-colors group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full border border-[#b29f8c] flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Instagram className="w-5 h-5" />
              </div>
              <span className="text-xs tracking-wider uppercase font-medium">Instagram</span>
            </button>

            {/* Contact */}
            <button
              onClick={handleContact}
              className="flex flex-col items-center gap-2 text-[#efe4d6] hover:text-white transition-colors group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full border border-[#b29f8c] flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-xs tracking-wider uppercase font-medium">Contact</span>
            </button>

            {/* Store Map (Google Maps) */}
            <button
              onClick={handleStoreMap}
              className="flex flex-col items-center gap-2 text-[#efe4d6] hover:text-white transition-colors group cursor-pointer"
              title="View Store Location on Google Maps (Regent Market, Amtala)"
            >
              <div className="w-12 h-12 rounded-full border border-[#b29f8c] flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs tracking-wider uppercase font-medium">Store Map</span>
            </button>

          </div>

        </div>

        {/* Physical Store Address Banner */}
        <div className="mt-6 text-center">
          <button
            onClick={handleStoreMap}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/15 hover:bg-black/25 text-xs text-[#ebd8c5] hover:text-white transition-all border border-[#a6927d]/30 shadow-xs cursor-pointer"
            title="Open Regent Market, Amtala in Google Maps"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="font-medium">Regent Market, Amtala • View Store on Google Maps</span>
          </button>
        </div>

        {/* Bottom Bar: Discreet Admin Access */}
        <div className="mt-8 pt-4 border-t border-[#8e7a66]/30 flex items-center justify-center text-xs">
          <button
            onClick={() => {
              setActiveView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/20 hover:bg-black/35 text-[#f5eee6] hover:text-white transition-all text-xs font-medium border border-[#a6927d]/40 shadow-sm cursor-pointer"
            title="Owner & Manager Access"
          >
            <Lock className="w-3.5 h-3.5 text-[#d5be9b]" />
            <span>Store Admin Login</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
