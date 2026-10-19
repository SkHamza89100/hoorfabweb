import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Tag, ShieldCheck, ShoppingBag } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActiveView
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = appliedCoupon
    ? (subtotal * appliedCoupon.discountPercent) / 100
    : 0;

  const freeShippingThreshold = 1999;
  const isFreeShipping = subtotal >= freeShippingThreshold || appliedCoupon?.code === 'FREESHIP';
  const shipping = cart.length === 0 ? 0 : isFreeShipping ? 0 : 149;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const finalTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleWhatsAppQuickCheckout = () => {
    let orderSummary = `*HOOR FAB Bag Summary:*\n`;
    cart.forEach((item, idx) => {
      orderSummary += `${idx + 1}. ${item.product.title} (Size: ${item.selectedSize}, ${item.isStitched ? 'Stitched' : 'Unstitched'}) x ${item.quantity} = ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}\n`;
    });
    orderSummary += `\n*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}`;
    if (discountAmount > 0) orderSummary += `\n*Discount:* -₹${discountAmount.toLocaleString('en-IN')} (${appliedCoupon?.code})`;
    orderSummary += `\n*Shipping:* ${shipping === 0 ? 'FREE' : `₹${shipping}`}`;
    orderSummary += `\n*Estimated Total:* ₹${finalTotal.toLocaleString('en-IN')}\n\nPlease assist me with placing this order!`;

    window.open(`https://wa.me/918100032281?text=${encodeURIComponent(orderSummary)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          onClick={(e) => e.stopPropagation()}
          className="w-screen max-w-md bg-[#fcf9f5] border-l border-[#ded0bf] shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#ebdcca] bg-[#f7f0e6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#786550]" />
              <h3 className="font-serif font-bold text-lg text-[#342a20]">
                Your Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#5e4d3c] hover:text-[#342a20] rounded-full hover:bg-[#ede2d4]"
              aria-label="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="px-5 py-3 bg-[#f2e7da] border-b border-[#e2d5c5] text-xs">
            {isFreeShipping ? (
              <p className="text-[#3b663b] font-semibold text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>You have qualified for Free Express Shipping!</span>
              </p>
            ) : (
              <div>
                <p className="text-[#5f4e3c] text-center mb-1.5 font-medium">
                  Add <span className="font-bold text-[#342a20] tabular-nums">₹{remainingForFreeShipping.toLocaleString('en-IN')}</span> more for <span className="font-bold text-[#786550]">Free Express Delivery</span>
                </p>
                <div className="w-full bg-[#dfcebe] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#786550] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-white rounded-2xl border border-[#e8ded0] shadow-sm flex gap-3.5 relative"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover object-top rounded-xl bg-[#ede2d4] shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80';
                    }}
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif font-bold text-sm text-[#342a20] leading-snug line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#9e8b79] hover:text-[#9e382b] transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#786550] mt-0.5">
                        <span className="font-medium bg-[#f6eee4] px-1.5 py-0.5 rounded border border-[#dfd2c1]">
                          Size: {item.selectedSize}
                        </span>
                        <span>•</span>
                        <span>{item.isStitched ? 'Stitched' : 'Unstitched'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#d8c8b5] rounded-lg overflow-hidden bg-[#faf6f0]">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#483a2d] hover:bg-[#ede1d3]"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-[#342a20] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#483a2d] hover:bg-[#ede1d3]"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <span className="font-bold text-sm text-[#342a20] tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#f0e4d6] text-[#786550] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 opacity-70" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#382d22]">
                  Your Bag is Currently Empty
                </h4>
                <p className="text-xs text-[#786550] max-w-xs mx-auto">
                  Explore our luxury Pakistani suits and designer kurtis to find your perfect fit.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveView('catalog');
                  }}
                  className="px-5 py-2.5 bg-[#786550] text-white text-xs font-semibold rounded-full hover:bg-[#62513f] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#ebdcca] bg-[#f7f0e6] space-y-4">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#8f7d6a] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon Code (e.g. HOOR10)"
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#d6c5b2] rounded-xl text-xs uppercase text-[#342a20] placeholder-[#9f8e7e] focus:outline-none focus:ring-1 focus:ring-[#786550]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#786550] hover:bg-[#63513e] text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-600 pl-1">{couponError}</p>}
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs bg-[#e9f2e9] text-[#2c5f2d] p-1.5 rounded-lg border border-[#cbe1cb]">
                    <span>Coupon '{appliedCoupon.code}' applied (-{appliedCoupon.discountPercent}%)</span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-[#9b3a30] font-bold text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Cost Summary */}
              <div className="space-y-1.5 text-xs text-[#635242] border-t border-[#e8ded0] pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#342a20] tabular-nums">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#8b3529]">
                    <span>Coupon Discount</span>
                    <span className="font-semibold tabular-nums">
                      -₹{discountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Courier Shipping</span>
                  <span className="font-semibold text-[#342a20] tabular-nums">
                    {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#342a20] border-t border-[#ded0bf] pt-2">
                  <span className="font-serif">Total</span>
                  <span className="tabular-nums">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1">
                <button
                  onClick={handleWhatsAppQuickCheckout}
                  className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 bg-[#786550] hover:bg-[#62513f] text-white rounded-xl text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <WhatsAppIcon size={13} color="#ffffff" />
                  </div>
                  <span>Instant WhatsApp Checkout</span>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
