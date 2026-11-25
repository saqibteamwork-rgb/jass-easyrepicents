import React from 'react';
import { SlipData, SlipProvider } from '../types/slip';
import { generateTID, formatCurrentDateTime } from '../utils/tidGenerator';
import { PRESETS } from '../data/presets';
import { 
  RefreshCw, 
  Clock, 
  Copy, 
  Printer, 
  FileDown, 
  Share2, 
  Sparkles, 
  BookmarkCheck,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRightLeft,
  DollarSign,
  ShieldCheck,
  Smartphone,
  Lock,
  KeyRound
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';

interface Props {
  data: SlipData;
  onChange: (data: SlipData) => void;
  onExportPng: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
  onCopyData: () => void;
  onShareWhatsApp: () => void;
  onSaveToHistory: () => void;
  isSaved?: boolean;
  isGuest?: boolean;
  userPlan?: string;
  freeTierDailyLimit?: number;
  onPromptAuth?: () => void;
  onOpenRedeem?: () => void;
}

export const ControlConsole: React.FC<Props> = ({
  data,
  onChange,
  onExportPng,
  onExportPdf,
  onPrint,
  onCopyData,
  onShareWhatsApp,
  onSaveToHistory,
  isSaved = false,
  isGuest = false,
  userPlan = 'free',
  freeTierDailyLimit = 3,
  onPromptAuth,
  onOpenRedeem,
}) => {
  const currentPreset = PRESETS[data.provider] || PRESETS.easypaisa;
  const quickAmounts = [5, 200, 500, 1000, 2500, 5000, 10000];

  const isFreeDemoOnly = isGuest || (userPlan === 'free' && (freeTierDailyLimit === 0));

  const updateField = <K extends keyof SlipData>(key: K, value: SlipData[K]) => {
    onChange({
      ...data,
      [key]: value,
    });
  };

  const handleRegenerateTID = () => {
    updateField('tid', generateTID(data.provider));
  };

  const handleSetCurrentTime = () => {
    updateField('dateTime', formatCurrentDateTime(data.provider));
  };

  const calculatedTotal = (data.amount + (data.fee || 0)).toFixed(2);

  return (
    <div className="flex flex-col gap-6">
      {/* Guest or Free Demo Mode Notice */}
      {isGuest ? (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 shadow-2xs">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-xs sm:text-sm text-amber-950 flex items-center gap-1.5">
                <span>Demo Mode Active (Read-Only)</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-200 text-amber-900 font-bold">
                  Guest
                </span>
              </div>
              <p className="text-[11.5px] text-amber-800 leading-snug mt-0.5">
                You can test and download demo slips (Max 4 prints). <strong>Sign In or Register</strong> to customize recipient name, account number, TID, and amount!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onPromptAuth}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#84142D] hover:bg-[#681023] active:scale-95 text-white text-xs font-extrabold rounded-xl shrink-0 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Sign In to Edit</span>
          </button>
        </div>
      ) : userPlan === 'free' && freeTierDailyLimit === 0 ? (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 shadow-2xs">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-extrabold text-xs sm:text-sm text-amber-950 flex items-center gap-1.5">
                <span>Free Plan: Demo Mode Only (0 Real Slips)</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-200 text-amber-900 font-bold">
                  Demo 4 Prints
                </span>
              </div>
              <p className="text-[11.5px] text-amber-800 leading-snug mt-0.5">
                Free tier is currently in Demo mode. You can test demo slips or <strong>Redeem a Coupon Code / Upgrade</strong> to Pro or Premium to edit real customized receipts!
              </p>
            </div>
          </div>
          {onOpenRedeem && (
            <button
              type="button"
              onClick={onOpenRedeem}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#84142D] hover:bg-[#681023] active:scale-95 text-white text-xs font-extrabold rounded-xl shrink-0 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Redeem Coupon</span>
            </button>
          )}
        </div>
      ) : userPlan === 'free' && freeTierDailyLimit > 0 ? (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 px-4 flex items-center justify-between gap-3 shadow-2xs text-xs">
          <div className="flex items-center gap-2 text-emerald-950 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Free Plan Active: You are allowed <strong>{freeTierDailyLimit} Real Editable Receipts</strong> per day!
            </span>
          </div>
          {onOpenRedeem && (
            <button
              type="button"
              onClick={onOpenRedeem}
              className="text-[11px] font-black text-emerald-800 hover:underline cursor-pointer shrink-0"
            >
              Upgrade with Coupon
            </button>
          )}
        </div>
      ) : null}

      {/* Header Banner Card */}
      <div className="bg-[#FFFFFF] border border-[#ECE6E7] rounded-2xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: currentPreset.color }}
            />
            <h2 className="text-xl font-extrabold text-[#1E1B1C] tracking-tight">
              {currentPreset.badgeName}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#EBF7EE] text-[#00A859] font-mono text-[11px] font-bold tracking-tight">
              ACTIVE PRESET
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#F5ECED] text-[#574143] font-mono text-[11px] font-bold">
              PKR ISO-4217
            </span>
          </div>
        </div>
        <p className="text-xs text-[#6B6163] mt-2 font-normal leading-relaxed">
          Configure authentic {currentPreset.name} transfer slips with 1:1 layout precision, Sent-To/Sent-By hierarchy, and digital bank verification.
        </p>
      </div>

      {/* Form Editing Sections Wrapper (Locked in Demo Mode) */}
      <div className="relative flex flex-col gap-6">
        {isFreeDemoOnly && (
          <div className="absolute inset-0 z-20 bg-white/75 backdrop-blur-[2px] rounded-3xl border-2 border-dashed border-amber-300 flex flex-col items-center justify-center p-6 text-center shadow-lg animate-in fade-in duration-150">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 mb-3 shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-base text-amber-950 mb-1">
              Receipt Editing is Locked (Demo Mode Active)
            </h3>
            <p className="text-xs text-amber-900/90 max-w-md mb-4 leading-relaxed font-medium">
              Free Demo mode mein aap default sample slip test aur download kar sakte hain (Max 4 prints). 
              Recipient name, Account number, TID aur Amount customize karne ke liye <strong>Coupon Code redeem karein ya Pro/Premium upgrade karein</strong>.
            </p>
            {onOpenRedeem && (
              <button
                type="button"
                onClick={onOpenRedeem}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#84142D] to-[#61001B] hover:from-[#9E1B38] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Unlock Full Editing with Coupon</span>
              </button>
            )}
          </div>
        )}

        {/* Section 1: Transaction Metadata */}
        <div className="bg-[#FFFFFF] border border-[#ECE6E7] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F5ECED] pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1E1B1C]">
            <CheckCircle2 className="w-4 h-4 text-[#84142D]" />
            <span>Transaction Metadata</span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-[#8B7172] tracking-wider uppercase">
            Header Section
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#574143] mb-1.5">
              Status Title
            </label>
            <input
              type="text"
              value={data.statusTitle}
              onChange={(e) => updateField('statusTitle', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#FAF7F7] border border-[#D9D3D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84142D]/20 focus:border-[#84142D] transition-colors"
              placeholder="e.g. Transaction Successful"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#574143]">
                Transfer Type (Subtitle)
              </label>
              <span className="text-[10px] text-gray-400 font-medium">1-Click Choose</span>
            </div>

            {/* Quick Switch Buttons for JazzCash & Wallets */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {[
                'Transferred via Other Wallet',
                'Transferred to JazzCash',
                'Transferred to Bank Account',
              ].map((opt) => {
                const isActive = data.statusSubtitle === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateField('statusSubtitle', opt)}
                    className={`px-2.5 py-1 text-[11.5px] rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#84142D] text-white font-bold shadow-2xs'
                        : 'bg-[#F4EEF0] hover:bg-[#EAE2E4] text-[#554345] font-medium border border-[#E5DBDD]'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              value={data.statusSubtitle}
              onChange={(e) => updateField('statusSubtitle', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#FAF7F7] border border-[#D9D3D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84142D]/20 focus:border-[#84142D] transition-colors"
              placeholder="e.g. Transferred via Other Wallet / Transferred to JazzCash"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#574143]">
                Transaction ID (TID)
              </label>
              <button
                type="button"
                onClick={handleRegenerateTID}
                className="text-[11px] font-bold text-[#84142D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Randomize
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={data.tid}
                onChange={(e) => updateField('tid', e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono bg-[#FAF7F7] border border-[#D9D3D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84142D]/20 focus:border-[#84142D] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#574143]">
                Date & Time
              </label>
              <button
                type="button"
                onClick={handleSetCurrentTime}
                className="text-[11px] font-bold text-[#84142D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Clock className="w-3 h-3" />
                Now
              </button>
            </div>
            <input
              type="text"
              value={data.dateTime}
              onChange={(e) => updateField('dateTime', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#FAF7F7] border border-[#D9D3D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84142D]/20 focus:border-[#84142D] transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#574143] mb-1.5">
              Funding Source
            </label>
            <input
              type="text"
              value={data.fundingSource}
              onChange={(e) => updateField('fundingSource', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#FAF7F7] border border-[#D9D3D4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#84142D]/20 focus:border-[#84142D] transition-colors"
              placeholder="e.g. easypaisa Account / JazzCash Mobile Account"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Transfer Parties */}
      <div className="bg-[#FFFFFF] border border-[#ECE6E7] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F5ECED] pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1E1B1C]">
            <ArrowRightLeft className="w-4 h-4 text-[#84142D]" />
            <span>Transfer Parties</span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-[#8B7172] tracking-wider uppercase">
            Sent to & By
          </span>
        </div>

        {/* Recipient Box */}
        <div className="p-3.5 bg-[#FAF7F7] rounded-xl border border-[#ECE6E7] space-y-3">
          <div className="text-xs font-bold text-[#84142D] uppercase tracking-wide">
            Sent to (Recipient)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#574143] mb-1">
                Name
              </label>
              <input
                type="text"
                value={data.recipientName}
                onChange={(e) => updateField('recipientName', e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-white border border-[#D9D3D4] rounded-md focus:outline-none focus:border-[#84142D]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#574143] mb-1">
                Raast IBAN / Bank
              </label>
              <input
                type="text"
                value={data.recipientIban || ''}
                onChange={(e) => updateField('recipientIban', e.target.value)}
                placeholder="PK********************0054"
                className="w-full px-3 py-1.5 text-sm font-mono bg-white border border-[#D9D3D4] rounded-md focus:outline-none focus:border-[#84142D]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#574143] mb-1">
                Account / Phone Number
              </label>
              <input
                type="text"
                value={data.recipientAccount}
                onChange={(e) => updateField('recipientAccount', e.target.value)}
                className="w-full px-3 py-1.5 text-sm font-mono bg-white border border-[#D9D3D4] rounded-md focus:outline-none focus:border-[#84142D]"
              />
            </div>

            {/* Privacy Masking Toggle (Stars *******6242) */}
            <div className="flex items-center justify-between p-2.5 bg-[#FAF7F7] border border-[#E8E1E2] rounded-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-amber-100/90 border border-amber-300/80 flex items-center justify-center text-amber-900 text-xs font-mono font-black shadow-2xs">
                  ***
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E1B1C] flex items-center gap-1.5">
                    <span>Mask Number with Stars</span>
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-white border border-gray-200 text-gray-700">
                      {data.maskRecipientAccount !== false
                        ? `*******${(data.recipientAccount || '6242').slice(-4)}`
                        : (data.recipientAccount || 'Full')}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[#7A7273]">
                    {data.maskRecipientAccount !== false
                      ? 'Private mode active: hides start digits with *******'
                      : 'Standard mode: displays all numbers completely'}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.maskRecipientAccount !== false}
                  onChange={(e) => updateField('maskRecipientAccount', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#84142D]" />
              </label>
            </div>
          </div>
        </div>

        {/* Sender Box */}
        <div className="p-3.5 bg-[#FAF7F7] rounded-xl border border-[#ECE6E7] space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-[#574143] uppercase tracking-wide">
              Sent by (Sender)
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#574143]">
              <input
                type="checkbox"
                checked={data.showSender}
                onChange={(e) => updateField('showSender', e.target.checked)}
                className="rounded text-[#84142D] focus:ring-[#84142D]"
              />
              Show Sender on Slip
            </label>
          </div>

          {data.showSender && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-[#574143] mb-1">
                  Sender Name
                </label>
                <input
                  type="text"
                  value={data.senderName}
                  onChange={(e) => updateField('senderName', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm bg-white border border-[#D9D3D4] rounded-md focus:outline-none focus:border-[#84142D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#574143] mb-1">
                  Sender Account Number
                </label>
                <input
                  type="text"
                  value={data.senderAccount}
                  onChange={(e) => updateField('senderAccount', e.target.value)}
                  className="w-full px-3 py-1.5 text-sm font-mono bg-white border border-[#D9D3D4] rounded-md focus:outline-none focus:border-[#84142D]"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Charges & Totals */}
      <div className="bg-[#FFFFFF] border border-[#ECE6E7] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F5ECED] pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1E1B1C]">
            <DollarSign className="w-4 h-4 text-[#84142D]" />
            <span>Charges & Totals</span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-[#8B7172] tracking-wider uppercase">
            Financials
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-[#574143] mb-1.5">
              Transfer Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm font-bold text-gray-500">
                {data.currencyPrefix}
              </span>
              <input
                type="number"
                step="any"
                value={data.amount}
                onChange={(e) => updateField('amount', parseFloat(e.target.value) || 0)}
                className="w-full pl-12 pr-3 py-2 text-base font-bold bg-[#FAF7F7] border border-[#D9D3D4] rounded-lg focus:outline-none focus:border-[#84142D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#574143] mb-1.5">
              Service Fee (0 for Free)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm font-bold text-gray-500">
                {data.currencyPrefix}
              </span>
              <input
                type="number"
                step="any"
                value={data.fee}
                onChange={(e) => updateField('fee', parseFloat(e.target.value) || 0)}
                className="w-full pl-12 pr-3 py-2 text-base font-bold bg-[#FAF7F7] border border-[#D9D3D4] rounded-lg focus:outline-none focus:border-[#84142D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#574143] mb-1.5">
              Total Settled
            </label>
            <div className="px-4 py-2 bg-[#EAF7EE] border border-[#CEEBD6] rounded-lg flex items-center justify-between">
              <span className="text-xs font-bold text-[#0D6334]">Total Amount:</span>
              <span className="text-base font-extrabold text-[#0D6334] font-mono">
                {data.currencyPrefix}{calculatedTotal}
              </span>
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-[#574143] mb-1.5">
              Purpose of Payment (JazzCash)
            </label>
            <input
              type="text"
              value={data.purposeOfPayment || 'Others'}
              onChange={(e) => updateField('purposeOfPayment', e.target.value)}
              placeholder="e.g. Others, Personal Transfer, Family Support"
              className="w-full px-3 py-2 text-sm bg-[#FAF7F7] border border-[#D9D3D4] rounded-lg focus:outline-none focus:border-[#84142D]"
            />
          </div>
        </div>

        {/* Quick Amount Pills */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-[#7A7273] mr-2">Quick Amounts:</span>
          <div className="inline-flex flex-wrap gap-1.5 mt-1">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => updateField('amount', amt)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  data.amount === amt
                    ? 'bg-[#84142D] text-white shadow-xs'
                    : 'bg-[#F5ECED] text-[#574143] hover:bg-[#EAE1E2]'
                }`}
              >
                {data.currencyPrefix}{amt.toLocaleString('en-US')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Customization Toggles */}
      <div className="bg-[#FFFFFF] border border-[#ECE6E7] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#F5ECED] pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1E1B1C]">
            <SlidersHorizontal className="w-4 h-4 text-[#84142D]" />
            <span>Slip Render Customization</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#574143] p-2 rounded-lg bg-[#FAF7F7] border border-[#ECE6E7] cursor-pointer">
            <Smartphone className="w-4 h-4 text-[#84142D]" />
            <input
              type="checkbox"
              checked={data.deviceFrame}
              onChange={(e) => updateField('deviceFrame', e.target.checked)}
              className="rounded text-[#84142D]"
            />
            Smartphone Bezel Frame
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-[#574143] p-2 rounded-lg bg-[#FAF7F7] border border-[#ECE6E7] cursor-pointer">
            <ShieldCheck className="w-4 h-4 text-[#84142D]" />
            <input
              type="checkbox"
              checked={data.showWatermark}
              onChange={(e) => updateField('showWatermark', e.target.checked)}
              className="rounded text-[#84142D]"
            />
            Security Verification Stamp
          </label>

          <div className="p-2 rounded-lg bg-[#FAF7F7] border border-[#ECE6E7] flex items-center justify-between text-xs">
            <span className="font-semibold text-[#574143]">Perforations:</span>
            <select
              value={data.notchStyle}
              onChange={(e) => updateField('notchStyle', e.target.value as any)}
              className="bg-white border border-[#D9D3D4] rounded px-2 py-0.5 font-semibold text-[#1E1B1C]"
            >
              <option value="round">Micro Notches</option>
              <option value="none">Flat Edge</option>
              <option value="square">POS Punch</option>
            </select>
          </div>
        </div>
      </div>

      {/* Guest Lock Overlay for Form Editing */}
      {isGuest && (
          <div 
            onClick={onPromptAuth}
            className="absolute inset-0 bg-white/45 backdrop-blur-[1px] z-30 rounded-3xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all hover:bg-white/55"
          >
            <div className="bg-[#1E1B1C] text-white p-6 sm:p-7 rounded-3xl shadow-2xl max-w-sm border border-white/10 space-y-3 pointer-events-auto">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-white">
                Receipt Fields Locked
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                You are in <strong>Demo Mode</strong>. You can inspect the slip and save/download PNG. Sign in or register to customize recipient, sender, TID, and amounts!
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPromptAuth?.();
                }}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#84142D] to-[#61001B] hover:from-[#9E1B38] text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Sign In / Register to Unlock</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onCopyData}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#D9D3D4] hover:bg-gray-50 text-[#1E1B1C] font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <Copy className="w-4 h-4 text-[#574143]" />
          Copy Data
        </button>

        <button
          type="button"
          onClick={onPrint}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#D9D3D4] hover:bg-gray-50 text-[#1E1B1C] font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#574143]" />
          Print Slip
        </button>

        <button
          type="button"
          onClick={onShareWhatsApp}
          className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-3 bg-[#E7F8EE] border border-[#25D366]/40 hover:bg-[#25D366] text-[#075E54] hover:text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer group"
        >
          <FaWhatsapp className="w-4 h-4 text-[#25D366] group-hover:text-white transition-colors" />
          Share WhatsApp
        </button>

        <button
          type="button"
          onClick={onExportPdf}
          className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-3 bg-[#FDECB4] hover:bg-[#FAD982] text-[#6B4B00] font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <FileDown className="w-4 h-4" />
          Save PDF
        </button>

        <button
          type="button"
          onClick={onExportPng}
          className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-3 bg-[#00A859] hover:bg-[#008F4C] text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Export High-Res PNG
        </button>

        <button
          type="button"
          onClick={onSaveToHistory}
          className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            isSaved
              ? 'bg-[#EBF7EE] text-[#00A859] border border-[#CEEBD6]'
              : 'bg-[#84142D] hover:bg-[#6B1024] text-white shadow-xs'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          {isSaved ? 'Saved to History' : 'Save Slip'}
        </button>
      </div>
    </div>
  );
};
