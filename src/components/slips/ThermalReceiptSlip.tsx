import React from 'react';
import { SlipData } from '../../types/slip';

export const ThermalReceiptSlip: React.FC<{ data: SlipData }> = ({ data }) => {
  return (
    <div className="w-full bg-[#FCFCF9] text-[#111111] font-mono text-xs p-6 select-none border border-neutral-300 shadow-sm relative leading-relaxed">
      {/* Jagged / Tear Edge visual styling at top */}
      <div className="text-center pb-3 border-b-2 border-dashed border-neutral-400 space-y-1">
        <div className="text-base font-bold tracking-widest">{data.recipientName || 'PAYMENT GATEWAY'}</div>
        <div className="text-[10px] text-neutral-600">TERMINAL ID: 1LINK-POS-0994</div>
        <div className="text-[10px] text-neutral-600">MERCHANT ADDR: MAIN BOULEVARD</div>
        <div className="text-[10px] text-neutral-600">{data.dateTime}</div>
      </div>

      <div className="py-3 text-center border-b border-dashed border-neutral-300">
        <div className="text-sm font-bold uppercase tracking-wider">{data.statusTitle}</div>
        <div className="text-[10px] text-neutral-500">{data.statusSubtitle}</div>
      </div>

      {/* Itemization */}
      <div className="py-3 space-y-2 border-b-2 border-dashed border-neutral-400">
        <div className="flex justify-between">
          <span>TXN REF (STAN):</span>
          <span className="font-bold">{data.tid}</span>
        </div>
        <div className="flex justify-between">
          <span>AUTH CODE:</span>
          <span>{Math.floor(100000 + Math.random() * 900000)}</span>
        </div>
        <div className="flex justify-between">
          <span>ACCOUNT/CARD:</span>
          <span>{data.recipientAccount}</span>
        </div>
        <div className="flex justify-between">
          <span>BASE AMOUNT:</span>
          <span>{data.currencyPrefix}{data.amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>SURCHARGE/FEE:</span>
          <span>{data.currencyPrefix}{data.fee.toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="py-3 flex justify-between items-center text-sm font-bold border-b-2 border-dashed border-neutral-400">
        <span>TOTAL SETTLED:</span>
        <span className="text-base">{data.currencyPrefix}{(data.amount + data.fee).toFixed(2)}</span>
      </div>

      {/* Simulated Barcode */}
      <div className="pt-4 flex flex-col items-center">
        <div className="w-48 h-10 flex items-center justify-between overflow-hidden opacity-80 mb-1">
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className={`h-full bg-black ${i % 3 === 0 ? 'w-1' : i % 5 === 0 ? 'w-1.5' : 'w-0.5'}`}
            />
          ))}
        </div>
        <div className="text-[9px] tracking-widest text-neutral-600">* {data.tid} *</div>
        <div className="text-[9px] text-neutral-500 mt-2 uppercase text-center">
          CUSTOMER COPY • KEEP FOR AUDIT RECORDS
        </div>
      </div>
    </div>
  );
};
