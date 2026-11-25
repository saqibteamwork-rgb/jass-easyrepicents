import React from 'react';
import { SlipData } from '../../types/slip';
import { JazzCashLogoMark } from '../icons/BrandIcons';
import { JAZZCASH_BADGE_SRC } from '../../assets/jazzcashBadgeBase64';

interface Props {
  data: SlipData;
}

export const JazzCashSlip: React.FC<Props> = ({ data }) => {
  const integerPart = Math.floor(data.amount).toLocaleString('en-US');
  const decimalPart = (data.amount % 1).toFixed(2).substring(2);
  const formattedFullAmount = data.amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Dynamic font sizing based on recipient name length
  const nameLength = data.recipientName?.length || 0;
  const nameFontSize = nameLength > 20 ? 'text-[15px]' : nameLength > 15 ? 'text-[16.5px]' : 'text-[17.5px]';

  // Privacy mask helper for account number (*******6242)
  let displayAccount = data.recipientAccount || '';
  if (data.maskRecipientAccount) {
    if (!displayAccount.includes('*')) {
      const clean = displayAccount.trim();
      const last4 = clean.length > 4 ? clean.slice(-4) : clean;
      displayAccount = `*******${last4}`;
    }
  }

  const badgeSrc = JAZZCASH_BADGE_SRC;

  return (
    <div
      style={{ width: '390px' }}
      className="w-[390px] bg-[#F7F5F6] flex flex-col items-center pt-8 pb-10 select-none font-sans text-[#1E1B1C] min-h-[730px] box-border"
    >
      {/* Top Circular Badge - 10% larger (96px) with authentic realistic diffuse shadow */}
      <div className="mb-4 flex justify-center">
        <img
          src={badgeSrc}
          alt="JazzCash Badge"
          className="w-[96px] h-[96px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] rounded-full select-none"
          loading="eager"
          decoding="sync"
          crossOrigin="anonymous"
        />
      </div>

      {/* Timestamp */}
      <div className="text-[13px] text-[#787173] font-normal mb-1 text-center" style={{ lineHeight: '18px' }}>
        {data.dateTime}
      </div>

      {/* Main Status Header - Semi-Bold (not heavy bold) matching real app screenshot */}
      <div className="text-[23px] font-semibold text-[#80132B] mb-1 text-center px-4 tracking-[-0.01em]" style={{ lineHeight: '30px' }}>
        {data.statusTitle}
      </div>

      {/* Subtitle */}
      <div className="text-[15px] font-normal text-[#787173] mb-6 text-center px-4" style={{ lineHeight: '22px' }}>
        {data.statusSubtitle}
      </div>

      {/* Main Floating Ticket Card - 342px wide with calibrated 16px corner radius and authentic dark ambient bottom drop-shadow */}
      <div
        style={{
          width: '342px',
          boxShadow: '0 20px 42px -6px rgba(0, 0, 0, 0.17), 0 6px 18px -2px rgba(0, 0, 0, 0.08)',
        }}
        className="w-[342px] bg-[#FFFFFF] rounded-[16px] border border-[#ECE6E7] overflow-hidden text-left box-border"
      >
        {/* Upper Card: Amount & Recipient */}
        <div className="pt-6 pb-5 px-5 text-center block">
          {/* Hero Amount Display with SUPERSCRIPT Decimal (semi-bold elegant weight) */}
          <div className="inline-flex items-start justify-center text-[#1E1B1C] mx-auto leading-none">
            <span className="text-[26px] font-semibold mr-1 self-center">
              {data.currencyPrefix}
            </span>
            <span className="text-[34px] font-bold tracking-tight">
              {integerPart}
            </span>
            <span className="text-[16px] font-semibold tracking-tight ml-0.5 mt-0.5">
              .{decimalPart}
            </span>
          </div>

          {/* Recipient Header */}
          <div className="text-[13px] text-[#7A7375] font-normal mt-2.5" style={{ lineHeight: '18px' }}>
            transferred to
          </div>

          {/* Recipient Name - Semi-Bold (clean native typography) */}
          <div
            className={`font-semibold text-[#1E1B1C] uppercase mt-1 tracking-normal truncate px-1 ${nameFontSize}`}
            style={{ lineHeight: '24px', display: 'block' }}
            title={data.recipientName}
          >
            {data.recipientName}
          </div>

          {/* Recipient Phone / Account */}
          <div
            className="text-[14px] font-normal text-[#595254] mt-0.5 tracking-wide"
            style={{ lineHeight: '20px', display: 'block' }}
          >
            {displayAccount}
          </div>
        </div>

        {/* Perforated Divider 1 with Semicircular Notches */}
        <div className="relative w-full my-0.5">
          {/* Left Notch - Clean cutout without fake border */}
          <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-[#F7F5F6] z-10" />
          {/* Right Notch - Clean cutout without fake border */}
          <div className="absolute -right-[9px] top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-[#F7F5F6] z-10" />
          {/* Dashed Line */}
          <div className="w-full border-t border-dashed border-[#DFD8DA] px-4" />
        </div>

        {/* Middle Card: Transaction Amount & Purpose of Payment Rows */}
        <div className="px-6 py-2.5 space-y-2">
          {/* Transaction Amount Row */}
          <div className="flex items-center justify-between text-[13.5px]" style={{ lineHeight: '20px' }}>
            <span className="text-[#524B4D] font-normal">Transaction Amount</span>
            <span className="font-semibold text-[#1E1B1C] text-[14px]">
              {data.currencyPrefix}{formattedFullAmount}
            </span>
          </div>

          {/* Purpose of Payment Row (standard in JazzCash) */}
          <div className="flex items-center justify-between text-[13.5px]" style={{ lineHeight: '20px' }}>
            <span className="text-[#524B4D] font-normal">Purpose of Payment</span>
            <span className="font-semibold text-[#1E1B1C] text-[14px]">
              {data.purposeOfPayment || 'Others'}
            </span>
          </div>
        </div>

        {/* Perforated Divider 2 with Semicircular Notches */}
        <div className="relative w-full my-0.5">
          {/* Left Notch */}
          <div className="absolute -left-[9px] top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-[#F7F5F6] z-10" />
          {/* Right Notch */}
          <div className="absolute -right-[9px] top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-[#F7F5F6] z-10" />
          {/* Dashed Line */}
          <div className="w-full border-t border-dashed border-[#DFD8DA] px-4" />
        </div>

        {/* Lower Card: Fee and TID */}
        <div className="px-6 pt-2.5 pb-5 space-y-2.5">
          {/* Transaction Fee */}
          <div className="flex items-center justify-between text-[13.5px]" style={{ lineHeight: '20px' }}>
            <span className="text-[#524B4D] font-normal">Transaction Fee</span>
            {data.fee === 0 ? (
              <span className="px-2.5 py-0.5 rounded-full bg-[#E8F7EE] text-[#28A745] font-medium text-[12px] leading-tight">
                Free
              </span>
            ) : (
              <span className="font-semibold text-[#1E1B1C] text-[14px]">
                {data.currencyPrefix}{data.fee.toFixed(2)}
              </span>
            )}
          </div>

          {/* TID (Clean Sans-Serif font matching real app) */}
          <div className="flex items-center justify-between text-[13.5px]" style={{ lineHeight: '20px' }}>
            <span className="text-[#524B4D] font-normal">TID</span>
            <span className="font-semibold text-[#1E1B1C] text-[14px]">
              {data.tid}
            </span>
          </div>

          {/* Optional Sender Row */}
          {data.showSender && (
            <div className="pt-2 border-t border-dashed border-[#DFD8DA] flex items-center justify-between text-[13px]" style={{ lineHeight: '18px' }}>
              <span className="text-[#524B4D] font-normal">Sender</span>
              <span className="font-semibold text-[#1E1B1C]">{data.senderName} ({data.senderAccount})</span>
            </div>
          )}
        </div>
      </div>

      {/* Watermark if active */}
      {data.showWatermark && (
        <div className="mt-4 px-3.5 py-1 rounded bg-red-50 border border-red-100 text-[11px] text-red-800 font-mono text-center">
          {data.watermarkText || 'DIGITAL VERIFIED • JAZZCASH SWITCH COMPLIANT'}
        </div>
      )}

      {/* Bottom Secure Footer */}
      <div className="mt-7 flex items-center justify-center gap-1.5 text-[12px] font-normal text-[#787173]">
        <span>Securely sent via</span>
        <JazzCashLogoMark size={18} className="inline-block" />
      </div>
    </div>
  );
};
