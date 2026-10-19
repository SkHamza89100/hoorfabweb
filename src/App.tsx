/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { FeaturedStyles } from './components/FeaturedStyles';
import { WhatsAppBanner } from './components/WhatsAppBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { CheckCircle } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeView, toastMessage } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#faf6f0] text-[#2c241c]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#342a20] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#524131] flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-3 duration-300">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* When in Admin View, show only the Admin Panel with its own custom header */}
      {activeView === 'admin' ? (
        <AdminPanel />
      ) : (
        <>
          <Header />

          <main className="flex-1">
            {activeView === 'storefront' && (
              <>
                <Hero />
                <CategoryGrid />
                <FeaturedStyles />
                <WhatsAppBanner />
              </>
            )}

            {activeView === 'catalog' && (
              <ProductCatalog />
            )}

            {activeView === 'tracking' && (
              <OrderTrackingModal />
            )}
          </main>

          <Footer />
        </>
      )}

      {/* Global Interactive Drawers & Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
