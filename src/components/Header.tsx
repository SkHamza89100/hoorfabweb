import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { HoorFabLogo } from './HoorFabLogo';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { ProductCategory } from '../types';

export const Header: React.FC = () => {
  const { 
    cart, 
    setIsCartOpen, 
    activeView, 
    setActiveView, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery 
  } = useStore();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleNavClick = (view: 'storefront' | 'catalog' | 'tracking' | 'admin', category?: ProductCategory | 'All') => {
    setActiveView(view);
    if (category) {
      setSelectedCategory(category);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fcf9f5]/95 backdrop-blur-md border-b border-[#ece2d5] transition-all">
        {/* Main 3-Zone Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div 
            onClick={() => handleNavClick('storefront')}
            className="cursor-pointer shrink-0"
          >
            <HoorFabLogo size="md" variant="dark" />
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-medium tracking-wider uppercase text-[#473b2f]">
            <button
              onClick={() => handleNavClick('storefront')}
              className={`transition-colors whitespace-nowrap hover:text-[#8a7258] pb-1 ${
                activeView === 'storefront' ? 'text-[#8a7258] border-b-2 border-[#8a7258]' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'All')}
              className={`transition-colors whitespace-nowrap hover:text-[#8a7258] pb-1 ${
                activeView === 'catalog' ? 'text-[#8a7258] border-b-2 border-[#8a7258]' : ''
              }`}
            >
              Our Collection
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'Pakistani Suits')}
              className="transition-colors whitespace-nowrap hover:text-[#8a7258] pb-1"
            >
              Pakistani Suits
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'Kurtis')}
              className="transition-colors whitespace-nowrap hover:text-[#8a7258] pb-1"
            >
              Kurtis
            </button>
            <button
              onClick={() => handleNavClick('catalog', 'Daily Wear')}
              className="transition-colors whitespace-nowrap hover:text-[#8a7258] pb-1"
            >
              Daily Wear
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#4c3e31] hover:text-[#8a7258] hover:bg-[#f3ebdF] rounded-full transition-colors"
              aria-label="Search Collection"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-[#3b3025] bg-[#ebd8c2]/50 hover:bg-[#e4cfb6] rounded-full transition-colors"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#823329] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartTotalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#4c3e31] hover:text-[#8a7258]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Collapsible Search Input */}
        {isSearchOpen && (
          <div className="bg-[#f5ede2] border-t border-[#e2d5c5] px-4 py-3 animate-in fade-in slide-in-from-top-2">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-[#887462] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeView !== 'catalog') {
                    setActiveView('catalog');
                  }
                }}
                placeholder="Search Pakistani suits, raw silk kurtis, chiffon party wear, velvet..."
                className="w-full bg-transparent border-none text-[#332a21] placeholder-[#8f7e6f] focus:outline-none text-sm"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#887462] hover:text-[#332a21] uppercase tracking-wider"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-xs text-[#887462] hover:text-[#332a21] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#fbf6f0] border-t border-[#e6dac9] px-6 py-6 space-y-4 shadow-xl">
            <div className="space-y-3 text-sm font-medium tracking-wider uppercase text-[#473b2f]">
              <button
                onClick={() => handleNavClick('storefront')}
                className="block w-full text-left py-2 hover:text-[#8a7258]"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('catalog', 'All')}
                className="block w-full text-left py-2 hover:text-[#8a7258]"
              >
                All Collections
              </button>
              <button
                onClick={() => handleNavClick('catalog', 'Pakistani Suits')}
                className="block w-full text-left py-2 hover:text-[#8a7258]"
              >
                Pakistani Suits
              </button>
              <button
                onClick={() => handleNavClick('catalog', 'Kurtis')}
                className="block w-full text-left py-2 hover:text-[#8a7258]"
              >
                Designer Kurtis
              </button>
              <button
                onClick={() => handleNavClick('catalog', 'Daily Wear')}
                className="block w-full text-left py-2 hover:text-[#8a7258]"
              >
                Daily Wear
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
