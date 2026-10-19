import React from 'react';
import { Smartphone, PhoneCall } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const WhatsAppBanner: React.FC = () => {
  const handleSendScreenshot = () => {
    const text = encodeURIComponent(
      "Hi HOOR FAB! I took a screenshot of a design I loved from your collection/Instagram and would like to order or check availability."
    );
    window.open(`https://wa.me/918100032281?text=${text}`, '_blank');
  };

  return (
    <section className="py-10 bg-[#faf6f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Box with exact layout from screenshot */}
        <div className="relative overflow-hidden rounded-3xl border border-[#ded0bf] bg-gradient-to-r from-[#f7f0e6] via-[#f9f3ea] to-[#f4ebe0] p-6 sm:p-10 shadow-sm">
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-10">
            
            {/* Left: Smartphone Outline Illustration */}
            <div className="shrink-0 flex items-center justify-center">
              <div className="relative w-16 h-28 sm:w-20 sm:h-36 rounded-2xl border-2 border-[#8e7b68] bg-[#fbf8f3] flex flex-col items-center justify-center shadow-inner">
                {/* Speaker slit */}
                <div className="w-6 h-1 bg-[#8e7b68]/50 rounded-full mb-auto mt-2" />
                {/* Call icon inside screen */}
                <div className="w-10 h-10 rounded-full bg-[#f2e7da] border border-[#d6c4b2] flex items-center justify-center text-[#786550] my-auto">
                  <PhoneCall className="w-5 h-5 text-[#786550]" />
                </div>
                {/* Home bar */}
                <div className="w-8 h-1 bg-[#8e7b68]/50 rounded-full mt-auto mb-2" />
              </div>
            </div>

            {/* Middle: Persuasive Text and Button */}
            <div className="flex-1 text-center md:text-left space-y-4 max-w-xl">
              <p className="text-base sm:text-lg lg:text-xl font-serif text-[#3d3227] leading-relaxed">
                If you want to order online, simply take a screenshot of the collection you like from our Instagram and send it to us on WhatsApp.
              </p>

              <div>
                <button
                  onClick={handleSendScreenshot}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#786550] hover:bg-[#63513e] text-white rounded-full font-medium text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition-all group"
                >
                  <div className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                    <WhatsAppIcon size={13} color="#ffffff" />
                  </div>
                  <span>Send Screenshot on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Right: Botanical Branch Flourish Vector Art */}
            <div className="hidden lg:block shrink-0 opacity-80 pointer-events-none">
              <svg width="140" height="130" viewBox="0 0 140 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Graceful curved stem */}
                <path 
                  d="M130 110 C90 100, 40 70, 20 20" 
                  stroke="#c5b19b" 
                  strokeWidth="1.6" 
                  strokeLinecap="round" 
                />
                {/* Leaves */}
                <path d="M 35 32 C 30 20, 50 20, 52 35 C 45 38, 38 38, 35 32 Z" fill="#c5b19b" opacity="0.6" />
                <path d="M 50 48 C 65 38, 75 52, 60 58 C 54 56, 50 52, 50 48 Z" fill="#c5b19b" opacity="0.6" />
                <path d="M 68 64 C 60 50, 85 55, 82 70 C 76 70, 70 68, 68 64 Z" fill="#c5b19b" opacity="0.7" />
                <path d="M 85 80 C 100 70, 110 85, 96 90 C 90 88, 86 85, 85 80 Z" fill="#c5b19b" opacity="0.6" />
                <path d="M 104 94 C 100 85, 120 86, 118 100 C 112 100, 106 98, 104 94 Z" fill="#c5b19b" opacity="0.7" />
              </svg>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
