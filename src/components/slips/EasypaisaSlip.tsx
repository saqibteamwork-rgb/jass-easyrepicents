import React from 'react';
import { SlipData } from '../../types/slip';
import { EASYPAISA_COIN_SRC, EASYPAISA_FOOTER_SRC } from '../../assets/easypaisaAssetsBase64';

interface Props {
  data: SlipData;
}

export const EasypaisaSlip: React.FC<Props> = ({ data }) => {
  const formattedAmount = data.amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedFee = data.fee === 0
    ? 'Rs. 0.00'
    : `${data.currencyPrefix}${data.fee.toFixed(2)}`;

  const totalAmountVal = (data.amount + (data.fee || 0)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let displayAccount = data.recipientAccount || '';
  if (data.maskRecipientAccount) {
    if (!displayAccount.includes('*')) {
      const clean = displayAccount.trim();
      const last4 = clean.length > 4 ? clean.slice(-4) : clean;
      displayAccount = `*******${last4}`;
    }
  }

  // Ensure TID has # prefix matching real Easypaisa slip
  const displayTid = data.tid.startsWith('#') ? data.tid : `#${data.tid}`;

  return (
    <div
      style={{
        width: '390px',
        // Real Easypaisa background: Dark green at top, fading smoothly down into pure white
        background: 'linear-gradient(180deg, #173824 0%, #173824 10%, #284E37 20%, #5E806D 35%, #AEC2B5 50%, #E3EBE6 65%, #FFFFFF 78%, #FFFFFF 100%)',
      }}
      className="w-[390px] mx-auto flex flex-col items-center pt-5 pb-6 select-none font-sans overflow-hidden box-border rounded-none"
    >
      {/* Main White Slip Card - Subtle micro-radius (rounded-[6px]) matching real screenshot */}
      <div
        style={{
          width: '358px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        }}
        className="w-[358px] bg-[#FFFFFF] rounded-[6px] overflow-hidden flex flex-col box-border border-none"
      >
        {/* Top Header with Soft Sage/Olive Gradient */}
        <div
          style={{
            background: 'linear-gradient(180deg, #9AB0A2 0%, #B8C9BF 26%, #DDE6E1 54%, #FFFFFF 90%, #FFFFFF 100%)',
          }}
          className="w-full pt-8 pb-3 px-6 flex flex-col items-center text-center rounded-t-[6px]"
        >
          {/* 3D Gold Coin with Green Checkmark - Official Asset */}
          <div className="mb-3 flex justify-center">
            <img
              src={EASYPAISA_COIN_SRC}
              alt="Transaction Successful"
              className="w-[82px] h-[82px] object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.16)] select-none"
              loading="eager"
              decoding="sync"
            />
          </div>

          {/* Status Title */}
          <h1 className="text-[22px] font-semibold text-[#1C2520] tracking-tight leading-[28px] mb-0.5">
            {data.statusTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-[13.5px] text-[#55635B] font-normal leading-[18px]">
            {data.statusSubtitle}
          </p>
        </div>

        {/* Card Content Data Rows */}
        <div className="px-6 pt-3 pb-4 flex flex-col text-[13.5px] text-[#1C2520]">
          {/* Section 1: Transaction Metadata */}
          <div className="py-1 space-y-2">
            <div className="flex items-center justify-between leading-[19px]">
              <span className="text-[#5A6860] font-normal">Transaction ID</span>
              <span className="font-semibold text-[#1C2520] tracking-normal text-[13.5px]">
                {displayTid}
              </span>
            </div>

            <div className="flex items-center justify-between leading-[19px]">
              <span className="text-[#5A6860] font-normal">Date & Time</span>
              <span className="font-medium text-[#1C2520] text-[13.5px]">
                {data.dateTime}
              </span>
            </div>

            <div className="flex items-center justify-between leading-[19px]">
              <span className="text-[#5A6860] font-normal">Funding Source</span>
              <span className="font-medium text-[#1C2520] text-[13.5px]">
                {data.fundingSource}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-[#E5EDE7] my-3" />

          {/* Section 2: Sent to */}
          <div className="py-0.5 space-y-2">
            <div className="text-[13.5px] font-bold text-[#1C2520] mb-1.5 leading-[19px]">Sent to</div>

            <div className="flex items-center justify-between leading-[19px]">
              <span className="text-[#5A6860] font-normal">Name</span>
              <span className="font-medium text-[#1C2520] text-[13.5px]">{data.recipientName}</span>
            </div>

            {data.recipientIban && (
              <div className="flex items-center justify-between leading-[19px]">
                <span className="text-[#5A6860] font-normal">Raast IBAN</span>
                <span className="font-medium text-[#1C2520] text-[13px]">
                  {data.recipientIban}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between leading-[19px]">
              <span className="text-[#5A6860] font-normal">Account Number</span>
              <span className="font-medium text-[#1C2520] text-[13.5px]">
                {displayAccount}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-[#E5EDE7] my-3" />

          {/* Section 3: Sent by */}
          <div className="py-0.5 space-y-2">
            <div className="text-[13.5px] font-bold text-[#1C2520] mb-1.5 leading-[19px]">Sent by</div>

            <div className="flex items-center justify-between leading-[19px]">
              <span className="text-[#5A6860] font-normal">Name</span>
              <span className="font-medium text-[#1C2520] text-[13.5px]">{data.senderName || 'Nazia Akram'}</span>
            </div>

            <div className="flex items-center justify-between leading-[19px]">
              <span className="text-[#5A6860] font-normal">Account Number</span>
              <span className="font-medium text-[#1C2520] text-[13.5px]">
                {data.senderAccount || '03000000000'}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-[#E5EDE7] my-3" />

          {/* Section 4: Charges */}
          <div className="py-0.5 space-y-2">
            <div className="text-[13.5px] font-bold text-[#1C2520] mb-1.5 leading-[19px]">Charges</div>

            <div className="flex items-center justify-between leading-[19px]">
              <span className="text-[#5A6860] font-normal">Amount</span>
              <span className="font-medium text-[#1C2520] text-[13.5px]">
                {data.currencyPrefix}{formattedAmount}
              </span>
            </div>

            <div className="flex items-center justify-between leading-[19px]">
              <span className="text-[#5A6860] font-normal">Fee</span>
              <span className="font-medium text-[#1C2520] text-[13.5px]">
                {formattedFee}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-[#E5EDE7] my-3.5" />

          {/* Section 5: Total Amount */}
          <div className="py-2.5 flex items-center justify-between leading-[22px]">
            <span className="text-[16px] font-bold text-[#1C2520]">Total Amount</span>
            <span className="text-[20px] font-bold text-[#1C2520]">
              {data.currencyPrefix}{totalAmountVal}
            </span>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-[#E5EDE7] my-3.5" />

          {/* Watermark if active */}
          {data.showWatermark && (
            <div className="my-2 px-3 py-1 rounded bg-green-50 border border-green-200 text-[11px] text-green-800 font-mono text-center">
              {data.watermarkText || 'EASYPAISA DIGITAL BANK • INSTANT SWITCH SETTLED'}
            </div>
          )}

          {/* Bottom Brand Wordmark Footer - Official Asset (scaled 10% more) */}
          <div className="pt-3 pb-2 flex items-center justify-center">
            <img
              src={EASYPAISA_FOOTER_SRC}
              alt="Paid via easypaisa digital bank"
              className="h-[32px] w-auto max-w-[292px] object-contain mx-auto select-none"
              loading="eager"
              decoding="sync"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

