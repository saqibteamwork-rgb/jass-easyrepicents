import React from 'react';
import { SlipData } from '../../types/slip';
import { Check, Sparkles } from 'lucide-react';

export const SadaPaySlip: React.FC<{ data: SlipData }> = ({ data }) => {
  return (
    <div className="w-full bg-[#1A1A1A] text-white flex flex-col font-sans select-none overflow-hidden relative rounded-2xl">
      {/* Top Graphic */}
      <div className="p-6 pb-2 text-center relative">
        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#FF5A5F] to-[#FF8577] flex items-center justify-center shadow-lg shadow-[#FF5A5F]/20 mb-3">
          <Check className="w-8 h-8 text-white stroke-[3]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-gray-300 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5A5F]" />
          <span>SadaBiz Instant</span>
        </div>

        <h1 className="text-2xl font-bold">{data.statusTitle}</h1>
        <p className="text-sm text-gray-400">{data.statusSubtitle}</p>
      </div>

      {/* Hero Card */}
      <div className="mx-5 my-3 p-5 rounded-xl bg-white/5 border border-white/10 text-center">
        <div className="text-3xl font-extrabold tracking-tight text-white">
          {data.currencyPrefix}{data.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        <div className="text-xs text-gray-400 mt-1">to {data.recipientName}</div>
      </div>

      {/* Details */}
      <div className="p-6 pt-2 space-y-3 text-sm">
        <div className="flex justify-between py-1 border-b border-white/5">
          <span className="text-gray-400">Reference ID</span>
          <span className="font-mono text-gray-200">{data.tid}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-white/5">
          <span className="text-gray-400">Timestamp</span>
          <span className="text-gray-200">{data.dateTime}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-white/5">
          <span className="text-gray-400">Recipient Account</span>
          <span className="font-mono text-gray-200">{data.recipientAccount}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-white/5">
          <span className="text-gray-400">Fee</span>
          <span className="text-emerald-400 font-bold">Free</span>
        </div>
      </div>

      {/* Brand Footer */}
      <div className="p-4 bg-black/40 text-center border-t border-white/5">
        <span className="font-bold text-lg tracking-wider text-[#FF5A5F]">Sada</span>
        <span className="font-bold text-lg tracking-wider text-white">Pay</span>
      </div>
    </div>
  );
};
