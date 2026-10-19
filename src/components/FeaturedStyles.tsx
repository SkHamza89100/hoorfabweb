import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, ShoppingBag, Eye } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { Product } from '../types';

export const FeaturedStyles: React.FC = () => {
  const { products, setSelectedProduct, addToCart, setActiveView } = useStore();

  // Match the popular 3 styles featured in screenshot
  const popularProducts = products.filter((p) => p.isFeatured).slice(0, 3);

  const handleWhatsAppEnquire = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `Hello HOOR FAB! I am interested in inquiring about the "${product.title}" (${product.category}, SKU: ${product.sku}) priced at ₹${product.price.toLocaleString('en-IN')}. Could you please share more details?`
    );
    window.open(`https://wa.me/918100032281?text=${message}`, '_blank');
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 'M';
    addToCart(product, defaultSize, true, 1);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#f7f1e7] border-t border-b border-[#ebdcca]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#886e53]">
                FEATURED COLLECTION
              </span>
              <div className="h-[1px] w-12 bg-[#c8b398]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#342a20] tracking-tight">
              Popular Styles
            </h2>
          </div>

          <button
            onClick={() => {
              setActiveView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#75614d] hover:text-[#382d22] transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 3-Column Product Cards Grid (matching screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {popularProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="group bg-[#fcf9f5] rounded-2xl overflow-hidden border border-[#e4d7c6] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Product Image Area */}
              <div className="relative aspect-[4/5] bg-[#ebd8c4] overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {/* 'New' Tag badge in top left (matching screenshot) */}
                {product.isNew && (
                  <div className="absolute top-3 left-3 bg-[#544537]/85 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm">
                    New
                  </div>
                )}

                {/* Stock Warning if low */}
                {product.stockCount <= 5 && product.stockCount > 0 && (
                  <div className="absolute top-3 right-3 bg-[#9b3a30]/90 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md shadow-sm">
                    Only {product.stockCount} Left
                  </div>
                )}

                {/* Quick View Hover Overlay */}
                <div className="absolute inset-0 bg-[#292017]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                    className="p-3 bg-white text-[#382d22] rounded-full shadow-lg hover:bg-[#f6eee3] transition-colors"
                    title="Quick View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="p-3 bg-[#786550] text-white rounded-full shadow-lg hover:bg-[#5f4e3c] transition-colors"
                    title="Quick Add to Bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Info (matching screenshot layout) */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#342a20] group-hover:text-[#786550] transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs font-medium text-[#7d6b57]">
                      {product.category}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm sm:text-base text-[#342a20] tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-[#9d8976] line-through tabular-nums">
                          ₹{product.compareAtPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button: Enquire on WhatsApp (exact button from screenshot) */}
                <button
                  onClick={(e) => handleWhatsAppEnquire(e, product)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#7a6753] hover:bg-[#65523f] text-white rounded-xl text-xs sm:text-sm font-medium tracking-wide shadow-sm hover:shadow transition-all"
                >
                  <WhatsAppIcon size={16} color="#ffffff" />
                  <span>Enquire on WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
