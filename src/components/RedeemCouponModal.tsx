import React, { useState } from 'react';
import { UserProfile } from '../types/auth';
import { redeemCoupon } from '../lib/couponService';
import { getCurrentUser, registerUser } from '../lib/authService';
import confetti from 'canvas-confetti';
import { 
  Ticket, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Zap, 
  Crown, 
  ShieldCheck, 
  Clock,
  KeyRound
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onRedeemSuccess: (updatedUser: UserProfile) => void;
  onOpenAuth: () => void;
}

export const RedeemCouponModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onRedeemSuccess,
  onOpenAuth,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanCode = couponCode.trim();
    if (!cleanCode) {
      setErrorMsg('Please enter a coupon code.');
      return;
    }

    setIsSubmitting(true);

    try {
      let activeUser = currentUser;

      // If user is not logged in, auto-create a user with guestEmail
      if (!activeUser) {
        if (!guestEmail.trim() || !guestEmail.includes('@')) {
          setErrorMsg('Please enter your email to attach this coupon to your account.');
          setIsSubmitting(false);
          return;
        }
        const regRes = await registerUser(
          guestEmail.trim(),
          guestEmail.split('@')[0],
          'coupon123'
        );
        if (regRes.user) {
          activeUser = regRes.user;
        } else {
          setErrorMsg(regRes.error || 'Could not initialize account. Please sign in first.');
          setIsSubmitting(false);
          return;
        }
      }

      const res = await redeemCoupon(cleanCode, activeUser);
      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setSuccessMsg(res.message);
        const refreshedUser = getCurrentUser();
        if (refreshedUser) {
          onRedeemSuccess(refreshedUser);
        }
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
          setCouponCode('');
        }, 3000);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while redeeming coupon.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md max-h-[90vh] overflow-y-auto w-full p-6 shadow-2xl border border-gray-200 relative space-y-5">
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#84142D] via-amber-400 to-[#00A859]" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1E1B1C]">Redeem Promo / Coupon Code</h2>
              <p className="text-[11px] text-gray-500">Upgrade to Pro, Premium, or Custom Quota instantly</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-black p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Coupon Form */}
        <form onSubmit={handleRedeem} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-[#1E1B1C] mb-1.5">
              Enter Coupon Code
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="e.g. 7862 (Pro) or 98241 (Premium)"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-[#84142D] focus:bg-white rounded-2xl text-sm font-mono uppercase font-black tracking-wider text-[#1E1B1C] focus:outline-none transition-all placeholder:text-gray-400"
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
              <span>💡 Pro: 4-digit code • Premium: 5-digit code • Custom: alphanumeric</span>
            </p>
          </div>

          {/* If user is Guest, ask for Email */}
          {!currentUser && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1.5">
              <label className="block text-xs font-bold text-amber-950">
                Your Email Address *
              </label>
              <input
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl focus:outline-none focus:border-amber-600"
              />
              <p className="text-[10px] text-amber-800">
                This account will be upgraded with the redeemed coupon benefits.
              </p>
            </div>
          )}

          {/* Current Account Status Notice */}
          {currentUser && (
            <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs">
              <span className="text-gray-600">Redeeming for:</span>
              <span className="font-extrabold text-[#1E1B1C]">
                {currentUser.email} ({currentUser.plan.toUpperCase()})
              </span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#00A859] shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-[#84142D] to-[#60001B] hover:from-[#9E1B38] text-white font-extrabold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Verifying &amp; Redeeming...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Claim &amp; Activate Coupon</span>
              </>
            )}
          </button>
        </form>

        {/* Coupon Perks Info */}
        <div className="pt-2 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
            <span className="font-black text-blue-700 block">Pro Plan</span>
            <span className="text-gray-500">15 Slips/Day</span>
          </div>
          <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
            <span className="font-black text-amber-600 block">Premium Plan</span>
            <span className="text-gray-500">Unlimited Slips</span>
          </div>
          <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
            <span className="font-black text-emerald-700 block">Custom Quota</span>
            <span className="text-gray-500">e.g. 3 Days Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};
