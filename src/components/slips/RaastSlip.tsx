import React from 'react';
import { SlipData } from '../../types/slip';
import { RaastLogo, OneLinkBadge } from '../icons/BrandIcons';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export const RaastSlip: React.FC<{ data: SlipData }> = ({ data }) => {
  return (
    <div className="w-full bg-[#FFFFFF] flex flex-col font-sans select-none overflow-hidden relative border border-orange-100">
      {/* Top Raast SBP Banner */}
      <div className="bg-gradient-to-r from-[#C25E10] to-[#E07A26] px-5 py-6 text-white text-center">
        <div className="flex justify-between items-center mb-3">
          <RaastLogo className="text-white" />
          <OneLinkBadge className="bg-white/20 text-white border-white/30" />
        </div>

        <div className="w-12 h-12 mx-auto rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mb-2">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-xl font-bold tracking-tight">{data.statusTitle}</h1>
        <p className="text-xs text-orange-100">{data.statusSubtitle}</p>
      </div>

      {/* Amount Hero */}
      <div className="bg-orange-50/50 py-5 text-center border-b border-orange-100">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Settled Amount</div>
        <div className="text-3xl font-extrabold text-gray-900 mt-1">
          {data.currencyPrefix}{data.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
      </div>

      {/* Metadata */}
      <div className="p-5 space-y-3 text-sm divide-y divide-gray-100">
        <div className="space-y-2 pt-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Transaction Ref (STAN)</span>
            <span className="font-mono font-bold text-gray-900">{data.tid}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date & Timestamp</span>
            <span className="font-medium text-gray-900">{data.dateTime}</span>
          </div>
        </div>

        <div className="space-y-2 pt-3">
          <div className="text-xs font-bold text-orange-800 uppercase tracking-wider">Recipient (Beneficiary)</div>
          <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span className="font-bold text-gray-900">{data.recipientName}</span>
          </div>
          {data.recipientBank && (
            <div className="flex justify-between">
              <span className="text-gray-500">Bank</span>
              <span className="font-medium text-gray-900">{data.recipientBank}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Raast ID / IBAN</span>
            <span className="font-mono text-xs font-medium text-gray-800">{data.recipientIban || data.recipientAccount}</span>
          </div>
        </div>

        {data.showSender && (
          <div className="space-y-2 pt-3">
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Sender (Originator)</div>
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-semibold text-gray-900">{data.senderName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account</span>
              <span className="font-mono text-xs text-gray-700">{data.senderAccount}</span>
            </div>
          </div>
        )}

        <div className="pt-3 flex justify-between items-center text-xs text-gray-500">
          <span>Fee & Government FED</span>
          <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">0.00 PKR (FREE)</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="w-4 h-4 text-orange-600" />
        <span>State Bank of Pakistan • Raast Instant Core Switch</span>
      </div>
    </div>
  );
};
