import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductSize } from '../types';
import { X, ShoppingBag, Ruler, Check, Star, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setIsCartOpen } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    selectedProduct?.sizes[0] || 'M'
  );
  const [isStitched, setIsStitched] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!selectedProduct) return null;

  const handleClose = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedSize, isStitched, quantity);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleWhatsAppOrder = () => {
    const stitchType = isStitched ? 'Ready-to-Wear (Stitched)' : 'Unstitched Fabric';
    const message = encodeURIComponent(
      `Hello HOOR FAB! I would like to order:\n\n*Product:* ${selectedProduct.title}\n*SKU:* ${selectedProduct.sku}\n*Category:* ${selectedProduct.category}\n*Size:* ${selectedSize}\n*Stitching:* ${stitchType}\n*Quantity:* ${quantity}\n*Price:* ₹${(selectedProduct.price * quantity).toLocaleString('en-IN')}\n\nPlease confirm order and delivery details!`
    );
    window.open(`https://wa.me/918100032281?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#fcf9f5] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#ded0bf] shadow-2xl flex flex-col"
      >
        {/* Sticky Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#45372a] shadow-sm transition-colors border border-[#ded0bf]"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Left Column: Gallery */}
          <div className="md:col-span-6 space-y-3">
            {/* Main Active Photo */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#ebd8c4] border border-[#ded0bf]">
              <img
                src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                alt={selectedProduct.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80';
                }}
              />

              {/* Tag Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {selectedProduct.isNew && (
                  <span className="bg-[#4a3c2e]/90 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md">
                    New Arrival
                  </span>
                )}
                {selectedProduct.stockCount <= 5 && (
                  <span className="bg-[#9b3a30]/90 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md">
                    Only {selectedProduct.stockCount} in Stock
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector */}
            {selectedProduct.images.length > 1 && (
              <div className="flex items-center gap-3">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#786550] shadow-sm'
                        : 'border-[#dfd1be] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust highlights */}
            <div className="pt-2 grid grid-cols-2 gap-2 text-xs text-[#6e5d4d]">
              <div className="flex items-center gap-2 p-2.5 bg-[#f6eee2] rounded-xl border border-[#e8ded0]">
                <Truck className="w-4 h-4 text-[#786550] shrink-0" />
                <span>Express Courier Shipping</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#f6eee2] rounded-xl border border-[#e8ded0]">
                <ShieldCheck className="w-4 h-4 text-[#786550] shrink-0" />
                <span>100% Authentic Fabric</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Specs & Purchase Module */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & SKU */}
              <div className="flex items-center justify-between text-xs text-[#806d59] mb-1">
                <span className="uppercase tracking-widest font-semibold">{selectedProduct.category}</span>
                <span className="font-mono">{selectedProduct.sku}</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#342a20] leading-tight">
                {selectedProduct.title}
              </h2>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-600">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#342a20]">{selectedProduct.rating}</span>
                <span className="text-xs text-[#8a7664]">({selectedProduct.reviewsCount} customer reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#342a20] tabular-nums">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                {selectedProduct.compareAtPrice && (
                  <span className="text-base text-[#9a8673] line-through tabular-nums">
                    ₹{selectedProduct.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {selectedProduct.compareAtPrice && (
                  <span className="text-xs font-semibold text-[#8b3529] bg-[#ebd8c5] px-2 py-0.5 rounded">
                    Save {Math.round((1 - selectedProduct.price / selectedProduct.compareAtPrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#5d4c3d] leading-relaxed mt-4">
                {selectedProduct.description}
              </p>

              {/* Stitching Option Toggle */}
              <div className="mt-5 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#635140] block">
                  Stitching Preference:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsStitched(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                      isStitched
                        ? 'bg-[#786550] text-white border-[#786550] shadow-sm'
                        : 'bg-[#f5ece1] text-[#4d3e30] border-[#d8c7b4] hover:bg-[#ede1d2]'
                    }`}
                  >
                    {isStitched && <Check className="w-3.5 h-3.5" />}
                    <span>Ready-to-Wear (Stitched)</span>
                  </button>
                  <button
                    onClick={() => setIsStitched(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                      !isStitched
                        ? 'bg-[#786550] text-white border-[#786550] shadow-sm'
                        : 'bg-[#f5ece1] text-[#4d3e30] border-[#d8c7b4] hover:bg-[#ede1d2]'
                    }`}
                  >
                    {!isStitched && <Check className="w-3.5 h-3.5" />}
                    <span>Unstitched Fabric Set</span>
                  </button>
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#635140]">
                    Select Size:
                  </label>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs text-[#786550] hover:text-[#382d22] font-medium flex items-center gap-1 underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-10 h-10 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center transition-all ${
                        selectedSize === sz
                          ? 'bg-[#403327] text-white border-[#403327] shadow-sm'
                          : 'bg-[#f7efe5] text-[#4d3f31] border-[#d9c9b7] hover:bg-[#ede2d4]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity selector */}
              <div className="mt-5 flex items-center gap-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#635140]">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#d8c8b5] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-sm text-[#483a2d] hover:bg-[#f6eee3]"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-bold text-[#342a20] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.stockCount, quantity + 1))}
                    className="px-3 py-1.5 text-sm text-[#483a2d] hover:bg-[#f6eee3]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Product Specifications Table */}
              <div className="mt-6 pt-4 border-t border-[#ebdcca] space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#f0e6da]">
                  <span className="text-[#887563]">Fabric Material</span>
                  <span className="font-semibold text-[#342a20]">{selectedProduct.fabric}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f0e6da]">
                  <span className="text-[#887563]">Included Pieces</span>
                  <span className="font-semibold text-[#342a20]">{selectedProduct.pieces}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f0e6da]">
                  <span className="text-[#887563]">Embroidery Work</span>
                  <span className="font-semibold text-[#342a20]">{selectedProduct.workType}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#887563]">Care Instructions</span>
                  <span className="text-[#342a20] text-right max-w-xs">{selectedProduct.careInstructions}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#ebdcca] space-y-2.5">
              <button
                onClick={handleAddToCart}
                disabled={!selectedProduct.inStock}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#786550] hover:bg-[#63513e] disabled:bg-gray-400 text-white rounded-xl text-sm font-semibold tracking-wide shadow-sm hover:shadow transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {selectedProduct.inStock ? `Add to Bag • ₹${(selectedProduct.price * quantity).toLocaleString('en-IN')}` : 'Currently Sold Out'}
                </span>
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-6 bg-[#f4ece1] hover:bg-[#ebdcca] text-[#3d3126] border border-[#cfbeac] rounded-xl text-xs sm:text-sm font-medium tracking-wide transition-all shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <WhatsAppIcon size={13} color="#ffffff" />
                </div>
                <span>Order Directly on WhatsApp</span>
              </button>
            </div>
          </div>

        </div>

        {/* Size Guide Overlay Popup */}
        {showSizeGuide && (
          <div className="p-6 bg-[#f5ede2] border-t border-[#ded0bf] animate-in fade-in">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif font-bold text-[#342a20] text-base">
                HOOR FAB Standard Sizing Guide (Inches)
              </h4>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-xs text-[#786550] hover:underline"
              >
                Close Guide
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#decbb8] bg-white rounded-lg">
                <thead className="bg-[#ebd8c4] text-[#403327]">
                  <tr>
                    <th className="p-2 font-semibold">Size</th>
                    <th className="p-2 font-semibold">Bust</th>
                    <th className="p-2 font-semibold">Waist</th>
                    <th className="p-2 font-semibold">Hips</th>
                    <th className="p-2 font-semibold">Shirt Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebdcca] text-[#554637]">
                  <tr><td className="p-2 font-bold">XS</td><td className="p-2">34"</td><td className="p-2">28"</td><td className="p-2">36"</td><td className="p-2">38"</td></tr>
                  <tr><td className="p-2 font-bold">S</td><td className="p-2">36"</td><td className="p-2">30"</td><td className="p-2">38"</td><td className="p-2">39"</td></tr>
                  <tr><td className="p-2 font-bold">M</td><td className="p-2">38"</td><td className="p-2">33"</td><td className="p-2">41"</td><td className="p-2">40"</td></tr>
                  <tr><td className="p-2 font-bold">L</td><td className="p-2">41"</td><td className="p-2">36"</td><td className="p-2">44"</td><td className="p-2">41"</td></tr>
                  <tr><td className="p-2 font-bold">XL</td><td className="p-2">44"</td><td className="p-2">40"</td><td className="p-2">47"</td><td className="p-2">42"</td></tr>
                  <tr><td className="p-2 font-bold">XXL</td><td className="p-2">47"</td><td className="p-2">43"</td><td className="p-2">50"</td><td className="p-2">42"</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
