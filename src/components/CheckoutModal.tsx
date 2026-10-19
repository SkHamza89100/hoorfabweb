import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderCustomer, PaymentMethod, Order } from '../types';
import { X, CheckCircle, ShieldCheck, Truck, CreditCard, Banknote, Building2 } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    appliedCoupon,
    placeOrder,
    lastConfirmedOrder,
    setLastConfirmedOrder,
    setActiveView
  } = useStore();

  const [customer, setCustomer] = useState<OrderCustomer>({
    fullName: '',
    whatsappPhone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('whatsapp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (!isCheckoutOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = appliedCoupon
    ? (subtotal * appliedCoupon.discountPercent) / 100
    : 0;
  const isFreeShipping = subtotal >= 1999 || appliedCoupon?.code === 'FREESHIP';
  const shipping = cart.length === 0 ? 0 : isFreeShipping ? 0 : 149;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!customer.fullName.trim()) errors.fullName = 'Full name is required';
    if (!customer.whatsappPhone.trim()) errors.whatsappPhone = 'WhatsApp phone is required';
    if (!customer.email.trim() || !customer.email.includes('@')) errors.email = 'Valid email is required';
    if (!customer.address.trim()) errors.address = 'Street address is required';
    if (!customer.city.trim()) errors.city = 'City is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        customer,
        items: [...cart],
        subtotal,
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
        shipping,
        total,
        paymentMethod,
        status: 'confirmed'
      });

      setCompletedOrder(order);
      setIsSubmitting(false);
    }, 600);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
  };

  const handleOpenWhatsAppReceipt = (order: Order) => {
    let msg = `*HOOR FAB - Order Confirmation #${order.orderNumber}*\n`;
    msg += `Thank you for shopping with HOOR FAB!\n\n`;
    msg += `*Customer:* ${order.customer.fullName}\n`;
    msg += `*Contact:* ${order.customer.whatsappPhone}\n`;
    msg += `*Shipping Address:* ${order.customer.address}, ${order.customer.city}\n\n`;
    msg += `*Order Items:*\n`;
    order.items.forEach((item, i) => {
      msg += `${i + 1}. ${item.product.title} (${item.selectedSize}, ${item.isStitched ? 'Stitched' : 'Unstitched'}) x${item.quantity} = ₹${(item.product.price * item.quantity).toLocaleString('en-IN')}\n`;
    });
    msg += `\n*Total Amount:* ₹${order.total.toLocaleString('en-IN')}`;
    msg += `\n*Payment Method:* ${order.paymentMethod.toUpperCase()}`;
    msg += `\n*Tracking ID:* ${order.trackingNumber}\n\nPlease dispatch my order as soon as possible!`;

    window.open(`https://wa.me/918100032281?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 lg:p-8 animate-in fade-in duration-200">
      
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#fcf9f5] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-[#ded0bf] shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#ebdcca] bg-[#f7f0e6] flex items-center justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#887057]">
              HOOR FAB CHECKOUT
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#342a20]">
              {completedOrder ? 'Order Confirmed!' : 'Complete Your Purchase'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-[#5a493a] hover:text-[#342a20] rounded-full hover:bg-[#ede2d4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Completed Order Confirmation View */}
        {completedOrder ? (
          <div className="p-6 sm:p-10 space-y-6 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#e8f3e8] text-[#2d682d] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#796450]">
                Success • Order Placed
              </span>
              <h4 className="font-serif text-3xl font-bold text-[#342a20]">
                Thank You, {completedOrder.customer.fullName}!
              </h4>
              <p className="text-sm text-[#635242]">
                Your bespoke ethnic wear order <span className="font-bold text-[#342a20]">#{completedOrder.orderNumber}</span> has been securely received and recorded in our live inventory system.
              </p>
            </div>

            {/* Order details box */}
            <div className="bg-[#f5ede2] rounded-2xl p-5 border border-[#dfd2c1] text-left space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between pb-2 border-b border-[#ebdcca]">
                <span className="text-[#7d6b59]">Tracking Reference:</span>
                <span className="font-mono font-bold text-[#342a20]">{completedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#ebdcca]">
                <span className="text-[#7d6b59]">Estimated Delivery:</span>
                <span className="font-semibold text-[#342a20]">{completedOrder.estimatedDelivery}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#ebdcca]">
                <span className="text-[#7d6b59]">Delivery Address:</span>
                <span className="text-[#342a20] text-right font-medium">
                  {completedOrder.customer.address}, {completedOrder.customer.city}
                </span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-[#342a20]">
                <span>Total Charged:</span>
                <span className="tabular-nums">${completedOrder.total.toFixed(2)} ({completedOrder.paymentMethod.toUpperCase()})</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
              <button
                onClick={() => handleOpenWhatsAppReceipt(completedOrder)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#786550] hover:bg-[#62513f] text-white rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <WhatsAppIcon size={13} color="#ffffff" />
                </div>
                <span>Send Invoice via WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  handleClose();
                  setActiveView('admin');
                }}
                className="px-5 py-3 bg-[#ede2d4] hover:bg-[#e4d5c4] text-[#47392b] border border-[#cfbdab] rounded-xl text-xs sm:text-sm font-medium transition-all"
              >
                View in Admin Panel
              </button>

              <button
                onClick={handleClose}
                className="px-5 py-3 bg-[#fcf9f5] hover:bg-[#f6efe6] text-[#47392b] border border-[#cfbdab] rounded-xl text-xs sm:text-sm font-medium transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
            
            {/* Left 7 Columns: Customer & Shipping Details */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Customer Contact */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-base text-[#342a20] flex items-center gap-2">
                  <span>1. Contact & WhatsApp Info</span>
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#685645] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      placeholder="e.g. Amina Tariq"
                      className={`w-full p-2.5 bg-white border rounded-xl text-xs sm:text-sm text-[#342a20] placeholder-[#a69585] focus:outline-none focus:ring-1 focus:ring-[#786550] ${
                        validationErrors.fullName ? 'border-red-500' : 'border-[#d8c7b4]'
                      }`}
                    />
                    {validationErrors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1">{validationErrors.fullName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#685645] mb-1">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        value={customer.whatsappPhone}
                        onChange={(e) => setCustomer({ ...customer, whatsappPhone: e.target.value })}
                        placeholder="+91 81000 32281"
                        className={`w-full p-2.5 bg-white border rounded-xl text-xs sm:text-sm text-[#342a20] placeholder-[#a69585] focus:outline-none focus:ring-1 focus:ring-[#786550] ${
                          validationErrors.whatsappPhone ? 'border-red-500' : 'border-[#d8c7b4]'
                        }`}
                      />
                      {validationErrors.whatsappPhone && (
                        <p className="text-[11px] text-red-600 mt-1">{validationErrors.whatsappPhone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#685645] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="amina@example.com"
                        className={`w-full p-2.5 bg-white border rounded-xl text-xs sm:text-sm text-[#342a20] placeholder-[#a69585] focus:outline-none focus:ring-1 focus:ring-[#786550] ${
                          validationErrors.email ? 'border-red-500' : 'border-[#d8c7b4]'
                        }`}
                      />
                      {validationErrors.email && (
                        <p className="text-[11px] text-red-600 mt-1">{validationErrors.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3 pt-3 border-t border-[#ede2d4]">
                <h4 className="font-serif font-bold text-base text-[#342a20]">
                  2. Shipping Destination
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#685645] mb-1">
                      Street Address / House / Villa *
                    </label>
                    <input
                      type="text"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      placeholder="House 44-B, Street 12, Sector F-7"
                      className={`w-full p-2.5 bg-white border rounded-xl text-xs sm:text-sm text-[#342a20] placeholder-[#a69585] focus:outline-none focus:ring-1 focus:ring-[#786550] ${
                        validationErrors.address ? 'border-red-500' : 'border-[#d8c7b4]'
                      }`}
                    />
                    {validationErrors.address && (
                      <p className="text-[11px] text-red-600 mt-1">{validationErrors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#685645] mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        placeholder="Islamabad"
                        className={`w-full p-2.5 bg-white border rounded-xl text-xs sm:text-sm text-[#342a20] placeholder-[#a69585] focus:outline-none focus:ring-1 focus:ring-[#786550] ${
                          validationErrors.city ? 'border-red-500' : 'border-[#d8c7b4]'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#685645] mb-1">
                        State / Region
                      </label>
                      <input
                        type="text"
                        value={customer.state}
                        onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                        placeholder="Federal"
                        className="w-full p-2.5 bg-white border border-[#d8c7b4] rounded-xl text-xs sm:text-sm text-[#342a20] placeholder-[#a69585] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#685645] mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={customer.postalCode}
                        onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                        placeholder="44000"
                        className="w-full p-2.5 bg-white border border-[#d8c7b4] rounded-xl text-xs sm:text-sm text-[#342a20] placeholder-[#a69585] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#685645] mb-1">
                      Delivery Instructions / Measurements Note (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      placeholder="e.g. Please leave package with reception, or custom sleeve length 22 inches."
                      className="w-full p-2.5 bg-white border border-[#d8c7b4] rounded-xl text-xs sm:text-sm text-[#342a20] placeholder-[#a69585] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-3 border-t border-[#ede2d4]">
                <h4 className="font-serif font-bold text-base text-[#342a20]">
                  3. Payment Method
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod('whatsapp')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'whatsapp'
                        ? 'border-[#786550] bg-[#f5ede2] shadow-sm'
                        : 'border-[#dfd1bf] bg-white hover:bg-[#faf5ee]'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <WhatsAppIcon size={14} color="#ffffff" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#342a20]">Instant WhatsApp</p>
                      <p className="text-[10px] text-[#786550]">Pay & confirm via stylist</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'cod'
                        ? 'border-[#786550] bg-[#f5ede2] shadow-sm'
                        : 'border-[#dfd1bf] bg-white hover:bg-[#faf5ee]'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-[#786550] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#342a20]">Cash on Delivery</p>
                      <p className="text-[10px] text-[#786550]">Pay upon courier arrival</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'upi'
                        ? 'border-[#786550] bg-[#f5ede2] shadow-sm'
                        : 'border-[#dfd1bf] bg-white hover:bg-[#faf5ee]'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#786550] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#342a20]">Bank Transfer / UPI</p>
                      <p className="text-[10px] text-[#786550]">Direct account settlement</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'card'
                        ? 'border-[#786550] bg-[#f5ede2] shadow-sm'
                        : 'border-[#dfd1bf] bg-white hover:bg-[#faf5ee]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#786550] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#342a20]">Credit / Debit Card</p>
                      <p className="text-[10px] text-[#786550]">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Order Summary Card */}
            <div className="lg:col-span-5 bg-[#f6eee2] rounded-2xl p-5 border border-[#dfd2bf] flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-serif font-bold text-base text-[#342a20] pb-2 border-b border-[#e5d8c6]">
                  Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} items)
                </h4>

                {/* Items preview */}
                <div className="max-h-56 overflow-y-auto space-y-3 py-3 border-b border-[#e5d8c6]">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-14 object-cover object-top rounded-lg bg-[#ebd8c5] shrink-0"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-[#342a20] line-clamp-1">{item.product.title}</p>
                        <p className="text-[11px] text-[#7a6857]">
                          Size: {item.selectedSize} • {item.isStitched ? 'Stitched' : 'Unstitched'} x{item.quantity}
                        </p>
                        <p className="font-bold text-[#342a20] tabular-nums mt-0.5">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price calculations */}
                <div className="space-y-2 text-xs text-[#635242] pt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#342a20] tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#8b3529]">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span className="font-semibold tabular-nums">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Courier Express Shipping</span>
                    <span className="font-semibold text-[#342a20] tabular-nums">
                      {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#342a20] border-t border-[#dfd2bf] pt-2">
                    <span className="font-serif">Total Amount</span>
                    <span className="tabular-nums">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-3.5 px-6 bg-[#786550] hover:bg-[#62513f] disabled:bg-gray-400 text-white rounded-xl text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all"
                >
                  {isSubmitting ? 'Securing Order...' : `Confirm Order • ₹${total.toLocaleString('en-IN')}`}
                </button>

                <p className="text-[11px] text-center text-[#7e6c5a] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Secure SSL Checkout & Real-time Live Tracking</span>
                </p>
              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
};
