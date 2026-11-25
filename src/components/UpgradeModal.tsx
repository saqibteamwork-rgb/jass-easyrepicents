import React from 'react';
import { UserProfile } from '../types/auth';
import { X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { AdminSettings } from '../types/admin';

interface UpgradeModalProps {
  user: UserProfile | null;
  adminSettings: AdminSettings;
  onClose: () => void;
  onOpenCoupon?: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ user, adminSettings, onClose, onOpenCoupon }) => {
  const WHATSAPP_NUMBER = '923000000000';
  const userId = user?.customId || user?.id || 'guest';
  const prices = adminSettings.upgradePrices || { proMonthly: 50, proYearly: 500, premiumMonthly: 200, premiumYearly: 2000 };

  const handleBuy = (plan: string, duration: string, price: number) => {
    const message = `Hello, I want to upgrade to ${plan} (${duration}) for Rs. ${price}.\nMy User ID: ${userId}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative overflow-y-auto flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8 pt-4">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-tr from-[#84142D] to-rose-500 rounded-2xl mb-4 shadow-lg shadow-rose-200">
            <Zap className="w-8 h-8 text-white fill-white" />
          </div>
          <h2 className="text-2xl font-black text-[#1E1B1C] mb-2">Upgrade Your Account</h2>
          <p className="text-sm text-gray-500">
            Unlock premium features, remove limits, and get priority support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto p-2 no-scrollbar">
          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-blue-50 to-white border-2 border-blue-200 rounded-3xl p-6 relative flex flex-col">
            <div className="mb-6">
              <h3 className="text-xl font-black text-blue-900 mb-2">Pro Plan</h3>
              <p className="text-sm text-blue-700/80 mb-4">Perfect for regular merchants</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-black text-blue-900">Rs. {prices.proMonthly}</span>
                <span className="text-sm font-bold text-blue-600">/ month</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-blue-800">Rs. {prices.proYearly}</span>
                <span className="text-xs font-bold text-blue-600">/ year (Save 16%)</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {['15 Receipts per day', 'All 100% Ready Engines', 'Remove Watermark Option', 'Standard Support'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-medium text-blue-900">
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3 mt-auto">
              <button
                onClick={() => handleBuy('Pro', '1 Month', prices.proMonthly)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition-colors shadow-md shadow-blue-200 cursor-pointer"
              >
                Buy 1 Month (Rs. {prices.proMonthly})
              </button>
              <button
                onClick={() => handleBuy('Pro', '1 Year', prices.proYearly)}
                className="w-full py-3 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 font-black text-sm transition-colors cursor-pointer"
              >
                Buy 1 Year (Rs. {prices.proYearly})
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-b from-amber-50 to-white border-2 border-amber-300 rounded-3xl p-6 relative flex flex-col shadow-xl shadow-amber-100">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Best Value
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-black text-amber-900 mb-2">Premium Plan</h3>
              <p className="text-sm text-amber-700/80 mb-4">For high-volume businesses</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-black text-amber-900">Rs. {prices.premiumMonthly}</span>
                <span className="text-sm font-bold text-amber-600">/ month</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-amber-800">Rs. {prices.premiumYearly}</span>
                <span className="text-xs font-bold text-amber-600">/ year (Save 16%)</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {['Unlimited Receipts', 'All Engines + Early Access', 'Remove Watermark', 'Priority 24/7 WhatsApp Support', 'Custom ID & Badges'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-medium text-amber-900">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3 mt-auto">
              <button
                onClick={() => handleBuy('Premium', '1 Month', prices.premiumMonthly)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black text-sm transition-colors shadow-md shadow-amber-200 cursor-pointer"
              >
                Buy 1 Month (Rs. {prices.premiumMonthly})
              </button>
              <button
                onClick={() => handleBuy('Premium', '1 Year', prices.premiumYearly)}
                className="w-full py-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-sm transition-colors cursor-pointer"
              >
                Buy 1 Year (Rs. {prices.premiumYearly})
              </button>
            </div>
          </div>
        </div>
      
        {onOpenCoupon && (
          <div className="mt-6 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500 mb-2">Have a Promo / Coupon Code?</p>
            <button
              onClick={onOpenCoupon}
              className="px-6 py-2 bg-amber-50 text-amber-700 font-bold rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              Redeem Coupon Code
            </button>
          </div>
        )}
</div>
    </div>
  );
};

