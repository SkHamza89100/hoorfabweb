import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, CheckCircle2, Clock, Truck, Package } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const OrderTrackingModal: React.FC = () => {
  const { orders, setActiveView } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const matchedOrder = orders.find(
    (o) =>
      o.orderNumber.toLowerCase() === searchQuery.trim().toLowerCase() ||
      o.customer.whatsappPhone.includes(searchQuery.trim()) ||
      o.trackingNumber?.toLowerCase() === searchQuery.trim().toLowerCase()
  );

  const steps = [
    { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
    { key: 'processing', label: 'Quality Check & Packing', icon: Package },
    { key: 'shipped', label: 'In Transit with Courier', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#faf6f0] min-h-[600px]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#887057]">
            LIVE COURIER TRACKING
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#342a20] mt-1">
            Track Your HOOR FAB Order
          </h2>
          <p className="text-sm text-[#736150] mt-2">
            Enter your Order Number (e.g., <span className="font-mono font-bold text-[#342a20]">HF-8941</span>) or WhatsApp phone number.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-[#f6eee2] p-3 rounded-2xl border border-[#ded0bf] shadow-sm flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8a7563] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearched(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && setSearched(true)}
              placeholder="Enter Order ID like HF-8941 or phone number..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#d8c8b6] rounded-xl text-xs sm:text-sm text-[#342a20] placeholder-[#a29181] focus:outline-none focus:ring-1 focus:ring-[#786550]"
            />
          </div>
          <button
            onClick={() => setSearched(true)}
            className="px-6 py-2.5 bg-[#786550] hover:bg-[#62513f] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
          >
            Track
          </button>
        </div>

        {/* Result Area */}
        {searched && matchedOrder ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ded0bf] shadow-lg space-y-6 animate-in fade-in">
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ebdcca] gap-2">
              <div>
                <span className="text-[11px] font-mono text-[#8a7563]">ORDER REF</span>
                <h3 className="font-serif font-bold text-2xl text-[#342a20]">
                  #{matchedOrder.orderNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-[#f4ebe0] text-[#786550] rounded-full border border-[#d8c7b4]">
                  Status: {matchedOrder.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className="py-4">
              <div className="grid grid-cols-4 gap-2 relative">
                {steps.map((step, idx) => {
                  const currentIdx = getStepIndex(matchedOrder.status);
                  const isDone = idx < currentIdx;
                  const isCurrent = idx === currentIdx - 1;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-[#2d682d] text-white'
                            : isCurrent
                            ? 'bg-[#786550] text-white ring-4 ring-[#ecdcd0]'
                            : 'bg-[#ebdcca] text-[#7a6857]'
                        }`}
                      >
                        <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <p className="text-[11px] sm:text-xs font-medium text-[#48392b] mt-2 leading-tight">
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#faf6f0] p-4 rounded-2xl border border-[#e8ded0] text-xs">
              <div>
                <p className="text-[#887462]">Customer Name</p>
                <p className="font-semibold text-[#342a20] text-sm">{matchedOrder.customer.fullName}</p>
                <p className="text-[#6d5b4a] mt-1">{matchedOrder.customer.address}, {matchedOrder.customer.city}</p>
              </div>
              <div>
                <p className="text-[#887462]">Courier & Tracking Number</p>
                <p className="font-mono font-bold text-[#342a20] text-sm">{matchedOrder.trackingNumber}</p>
                <p className="text-[#6d5b4a] mt-1">Est. Delivery: {matchedOrder.estimatedDelivery || 'In 3-5 days'}</p>
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-sm text-[#342a20]">
                Package Contents:
              </h4>
              <div className="divide-y divide-[#ede2d4]">
                {matchedOrder.items.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-[#342a20]">{item.product.title}</p>
                      <p className="text-[#786550]">
                        Size: {item.selectedSize} • {item.isStitched ? 'Stitched' : 'Unstitched'} x{item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-[#342a20] tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Contact */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  const msg = encodeURIComponent(
                    `Hello HOOR FAB! I am following up on Order #${matchedOrder.orderNumber} for ${matchedOrder.customer.fullName}.`
                  );
                  window.open(`https://wa.me/918100032281?text=${msg}`, '_blank');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f4ece1] hover:bg-[#eadecc] text-[#423427] border border-[#cfbdab] rounded-xl text-xs font-semibold"
              >
                <WhatsAppIcon size={16} color="#25D366" />
                <span>Contact Stylist on WhatsApp</span>
              </button>
            </div>
          </div>
        ) : searched && !matchedOrder ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#ded0bf] p-6 text-[#5f4e3c]">
            <p className="font-serif font-bold text-lg text-[#342a20]">
              No Order Found for "{searchQuery}"
            </p>
            <p className="text-xs text-[#7e6d5b] mt-1">
              Please verify your order number format (e.g. HF-8941) or phone number with country code.
            </p>
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-[#826f5d]">
            <p>Recent active demo orders to try:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {orders.slice(0, 3).map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    setSearchQuery(o.orderNumber);
                    setSearched(true);
                  }}
                  className="px-2.5 py-1 bg-[#ede2d4] hover:bg-[#e2d5c4] rounded-lg font-mono font-medium text-[#403225]"
                >
                  {o.orderNumber} ({o.customer.fullName.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
